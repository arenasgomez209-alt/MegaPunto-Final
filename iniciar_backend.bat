@echo off
title Backend FastAPI - Megapunto
cd /d "%~dp0backend"

echo ==============================================
echo   Iniciando Backend FastAPI (Megapunto)
echo   URL Backend: http://127.0.0.1:8000
echo   Swagger Docs: http://127.0.0.1:8000/docs
echo ==============================================

if not exist "venv\Scripts\activate.bat" (
    echo [INFO] Entorno virtual no encontrado. Creando venv...
    python -m venv venv
    call "venv\Scripts\activate.bat"
    echo [INFO] Instalando dependencias de Python...
    pip install -r requirements.txt
) else (
    call "venv\Scripts\activate.bat"
)

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
if errorlevel 1 (
    echo.
    echo [ERROR] El servidor backend se detuvo o fallo al iniciar.
)
pause

