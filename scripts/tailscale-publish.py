#!/usr/bin/env python3
"""Configure only the portfolio's dedicated Tailscale node. Never print its auth key."""
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = Path(os.environ.get('XDG_RUNTIME_DIR', f'/run/user/{os.getuid()}')) / 'portfolio-tailscale'
CLI = ['/usr/sbin/tailscale', '--socket=' + str(RUNTIME / 'tailscaled.sock')]

def run(args, timeout=60):
    return subprocess.run(CLI + args, capture_output=True, text=True, timeout=timeout)

def main():
    settings = {}
    for line in (ROOT / '.env.tailscale').read_text().splitlines():
        if '=' in line and not line.lstrip().startswith('#'):
            name, value = line.split('=', 1)
            settings[name.strip()] = value.strip().strip('\"\'')
    hostname = settings.get('TS_HOSTNAME', '')
    if not re.fullmatch(r'[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?', hostname):
        raise RuntimeError('TS_HOSTNAME precisa ser um nome DNS válido.')
    for attempt in range(20):
        status = run(['status', '--json'], timeout=5)
        if status.returncode == 0:
            break
        time.sleep(1)
    else:
        raise RuntimeError('A instância dedicada não respondeu no socket privado.')
    state = json.loads(status.stdout)
    if state.get('BackendState') != 'Running':
        key = settings.get('TS_AUTHKEY', '')
        if not key.startswith('tskey-auth-'):
            raise RuntimeError('TS_AUTHKEY precisa conter uma chave de autenticação Tailscale.')
        filename = None
        try:
            with tempfile.NamedTemporaryFile(mode='w', prefix='auth-', dir=RUNTIME, delete=False) as file:
                filename = file.name
                os.chmod(filename, 0o600)
                file.write(key)
            result = run(['up', '--auth-key=file:' + filename, '--hostname=' + hostname,
                          '--accept-dns=false', '--accept-routes=false', '--timeout=45s'])
            if result.returncode:
                detail = (result.stderr or result.stdout).replace(key, '[REDACTED]')
                raise RuntimeError('Falha ao autenticar a instância dedicada: ' + detail[:1200])
        finally:
            if filename:
                Path(filename).unlink(missing_ok=True)
    else:
        result = run(['set', '--hostname=' + hostname, '--accept-dns=false', '--accept-routes=false'])
        if result.returncode:
            raise RuntimeError('Não foi possível aplicar o nome da instância dedicada.')
    result = run(['funnel', '--bg', '--https=443', '--yes', 'http://127.0.0.1:4321'], timeout=45)
    if result.returncode:
        key = settings.get('TS_AUTHKEY', '')
        detail = result.stderr or result.stdout
        if key:
            detail = detail.replace(key, '[REDACTED]')
        raise RuntimeError('Falha ao publicar pelo Funnel: ' + detail[:1500])
    state = json.loads(run(['status', '--json']).stdout)
    print('Portfólio publicado: https://' + state['Self']['DNSName'].rstrip('.') + '/', flush=True)

if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, subprocess.TimeoutExpired) as exc:
        print(str(exc), flush=True)
        raise SystemExit(1)
