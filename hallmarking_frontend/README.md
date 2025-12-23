# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

1) Copy `.env.example` to `.env` and set your backend base URL:
```
REACT_APP_API_BASE_URL=https://your-backend.example.com
```
Do not include a trailing slash. This app never hardcodes localhost and always uses this variable.

2) Install dependencies and run the app:
```
npm install
npm start
```

Open http://localhost:3000 to view it in your browser (during local development).

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## API Client and Auth

- The API client reads the base URL from `REACT_APP_API_BASE_URL`.
- Auth token is stored in memory and persisted to `localStorage` under `hm_auth_token`.
- Requests include `Authorization: Bearer <token>` when available.

Endpoints used:
- `POST /auth/register`
- `POST /auth/login` (expects `{ accessToken }` or `{ token }` in response)
- `GET /center-info`
- `GET /portfolio`

## Error Handling

- Global ErrorBoundary prevents the whole app from crashing due to render errors.
- A simple Toast system shows API errors without blocking the UI.
- When backend is unavailable, Center Info and Portfolio pages show graceful fallback sample content.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/index.css`.

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/index.css`.

Common components include:
- Buttons (`.btn`, `.btn-primary`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`)
- Cards (`.card`)
- Status banners (`.status`, `.status.error`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
