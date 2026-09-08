@echo off
title Megapunto - Iniciar Todo
echo ==============================================
echo   Iniciando Backend FastAPI y Frontend React
echo ==============================================
start "Backend FastAPI" "%~dp0iniciar_backend.bat"
start "Frontend React" "%~dp0iniciar_frontend.bat"
echo Abriendo navegador en http://localhost:5173 ...
timeout /t 3 >nul
start http://localhost:5173
