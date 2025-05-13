#!/bin/bash
# Start FastAPI server
source venv/bin/activate
python -m uvicorn server.main:app --reload