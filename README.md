# BW Juice & Bar frontend

The React application uses the Express API in `../backend`.

## Run locally

Start the backend first:

```powershell
cd ..\backend
npm install
npm run dev
```

In another terminal, start the frontend:

```powershell
cd ..\frontend
npm install
npm run dev
```

The API defaults to `http://localhost:5000/api`. Set `VITE_API_URL` in a local
`.env` file when the API is hosted elsewhere; see `.env.example`. The backend
allows the Vite origin at `http://localhost:5173` by default and reads
`FRONTEND_URL` when a different origin is used.

The backend can serve its sample menu and orders without MongoDB configured.
For persistent data, configure `MONGODB_URI` and the admin credentials in the
backend environment before starting it.
