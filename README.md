# hallmarking-center-portal-301460-301471

Frontend requires a backend base URL via environment variable:

- Copy `hallmarking_frontend/.env.example` to `hallmarking_frontend/.env`
- Set `REACT_APP_API_BASE_URL` to your backend API base (no trailing slash)
```bash
REACT_APP_API_BASE_URL=https://your-backend.example.com
```