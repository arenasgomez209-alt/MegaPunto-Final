@echo off
title Megapunto - Iniciar Todo
echo ==============================================
echo   Iniciando Backend FastAPI y Frontend React
echo ==============================================

start "Backend FastAPI" cmd /k "call "%~dp0iniciar_backend.bat""
start "Frontend React" cmd /k "call "%~dp0iniciar_frontend.bat""

echo.
echo Esperando a que los servidores se inicien...
ping -n 5 127.0.0.1 >nul

echo Abriendo navegador en http://localhost:5173 ...
start http://localhost:5173

