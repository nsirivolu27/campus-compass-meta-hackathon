# Private Android demo over HTTPS

The app can use a private HTTPS guide while the phone is on Wi-Fi or mobile data. This path is implemented but **not deployed or field-tested**. USB remains the default debug build.

## Server

Use a Node 22+ host or the included Dockerfile, behind a TLS-terminating reverse proxy. Configure:

- `MODEL_API_KEY`: the Meta key in the hosting service's secret store.
- `TMF_PUBLIC_ORIGIN`: the exact public HTTPS origin, with no trailing slash, path or credentials.
- `META_MODEL`: optional; defaults to `muse-spark-1.3`.
- `PORT`: the internal HTTP port; defaults to `4317`.

Start with `node scripts/serve.mjs`. Container build: `docker build -t campus-compass-guide .`. The build context excludes credentials, Git history and Android files. Set secrets at runtime, never as image build arguments.

The proxy must preserve the public `Host` header, provide a valid public TLS certificate, allow at least 60 seconds for an answer, and keep the internal HTTP port inaccessible from the internet. The process binds to all container interfaces only when `TMF_PUBLIC_ORIGIN` is configured. It does not terminate TLS itself or trust forwarded headers. `GET /api/status` is the health check; configure the public Host header if checking internally. `/` deliberately returns 404 in hosted mode.

The private server console prints a random 32-character pairing code at startup. Share it only with the demo operator, never in the repo, a public screenshot or submission video. Every restart changes the code and revokes existing tokens. Tokens last one hour, remain in app memory and disappear when the app process closes. Pair again in Glasses → Campus AI connection when needed.

## Android

Build the same public origin into the app; this is an address, not a credential:

```powershell
npm run build
cd android
.\gradlew.bat :app:assembleDebug -PguideOrigin=https://YOUR-DEPLOYED-HOST --console=plain
```

Replace the placeholder with the deployed origin. Install the resulting debug APK and enter the private 32-character code. Then select a college, start a visit and test a typed question before testing the glasses microphone. HTTPS uses Android's normal certificate validation and does not follow redirects. Release builds also accept this HTTPS configuration; without it, they cannot use the guide. Signing/distribution and Meta's wearable release requirements remain separate work.

Omit `-PguideOrigin` to rebuild the ordinary USB debug app. A USB code has eight digits. Neither build contains the Meta API key.

## Scope and limits

This is private hackathon pairing, not student accounts or a public national service. Hosted requests always need a token; the local browser shortcut cannot authorize them. The hosted server does not serve a web chat or enable CORS.

Limits remain 100 model attempts per server process, 12/minute, two concurrent, ten pairing attempts, 45 seconds per provider request and 2,400 output tokens. Restarting resets counters. Run one instance: replicas do not share tokens or quotas. These are demo safeguards, not persistent quotas or a dollar cap. Add durable per-user authentication, shared quotas and operational controls before public student use.

Validation covers HTTP requests at the proxy boundary, invalid origins, forged browser headers, pairing limits and token expiry. It does not establish a working TLS deployment, real Meta access or an untethered glasses session.
