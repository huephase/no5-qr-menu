# no5-qr-menu

Static NUMBERFIVE QR menu site, packaged for Docker and Traefik.

## Production deploy

This repo ships a small Nginx image and a Traefik-ready Compose file for:

- `numberfive.ae`
- `www.numberfive.ae`

Before deploying, make sure both DNS records point to the VPS where Traefik is running.

```sh
docker compose up -d --build
```

The container only exposes port `80` internally to the shared `traefik-public`
network. Traefik handles HTTPS and public routing through the labels in
`compose.yml`.

## Useful commands

```sh
docker compose config
docker compose ps
docker compose logs -f numberfive-menu
docker compose down
```

## Notes

- Do not add `ports:` for production behind Traefik.
- The `traefik-public` Docker network must already exist on the VPS.
- Static assets are cached for 30 days. `index.html` and CSV menu data are served
  with `no-cache` so menu updates are picked up quickly.
