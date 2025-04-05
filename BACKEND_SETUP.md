
# Backend Setup Instructions

This frontend application requires a Python backend server from the pipecat-ai repository to handle chat functionality.

## Prerequisites

- Python 3.10, 3.11, or 3.12
- Gemini API key from Google AI Studio (https://aistudio.google.com/app/apikey)
- (Optional) Daily API key for WebRTC voice mode (https://dashboard.daily.co/u/signup)

## Setup Steps

1. Clone the pipecat-ai repository:
   ```bash
   git clone https://github.com/pipecat-ai/gemini-multimodal-live-demo.git
   cd gemini-multimodal-live-demo
   ```

2. Set up the Python environment for the server:
   ```bash
   cd server
   python3.12 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Initialize the project:
   ```bash
   python sesame.py init
   ```

4. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   Then edit the `.env` file to add your Gemini API key and (optional) Daily API key.

5. Run the server:
   ```bash
   python sesame.py run
   ```
   The server should start on port 7860.

## Frontend Configuration

Make sure your frontend application has a `.env` or `.env.local` file with:

```
VITE_SERVER_URL=http://127.0.0.1:7860/api
```

This URL should match the port on which your backend server is running.

## Troubleshooting

- If you encounter CORS issues, make sure both frontend and backend are running on the expected ports.
- If chat functionality doesn't work, check the console for any API errors.
- Ensure your Gemini API key is valid and has sufficient quota.
