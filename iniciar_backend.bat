@echo off
title Backend FastAPI - Megapunto
cd /d "%~dp0backend"
echo ==============================================
echo   Iniciando Backend FastAPI en http://127.0.0.1:8000
echo   Documentacion Swagger: http://127.0.0.1:8000/docs
echo ==============================================
call "%~dp0backend\venv\Scripts\activate.bat"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
