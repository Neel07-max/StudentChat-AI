# StudentChat-AI — Local Setup

This project contains a simple Flask backend (`main.py`) and a static frontend (`index.html`, `css/`, `js/`). The backend now serves the frontend so you can run only the Flask app and open the UI at the same origin.

## Requirements

- Python 3.8+

Install dependencies:

```powershell
pip install -r requirements.txt
```

## Run (single-step)

From the project root:

```powershell
python main.py
```

Open in browser:

```
http://127.0.0.1:5000/
```

The UI will load and the frontend fetch calls are configured to use `http://127.0.0.1:5000` by default.

## Alternative: serve frontend separately

If you prefer to run the frontend using `http.server`, start the backend as above and in another terminal run:

```powershell
python -m http.server 8000
```

Then open:

```
http://127.0.0.1:8000
```

If you use the separate static server, CORS is already enabled in the Flask app. If you change backend host/port, update the `BACKEND_URL` in `js/script.js`.

## Notes

- The backend exposes:
  - `POST /chat` — expects `{ "message": "..." }`, returns `{"reply": "..."}`
  - `POST /api/say_hello` — expects `{ "name": "..." }`, returns `{ "message": "Hello <name>!" }`

- If you don't need PDF endpoints, you can remove the `pypdf` import to avoid installing it.
