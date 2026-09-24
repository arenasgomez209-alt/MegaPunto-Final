@echo off
title Frontend React - Megapunto
cd /d "%~dp0frontend"

echo ==============================================
echo   Iniciando Frontend React (Megapunto)
echo ==============================================

if not exist "node_modules\" (
    echo [INFO] No se encontro la carpeta node_modules.
    echo [INFO] Instalando dependencias de Node.js, por favor espera...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Hubo un error al instalar las dependencias con npm install.
        pause
        exit /b 1
    )
    echo [OK] Dependencias instaladas con exito.
)

echo Servidor disponible en: http://localhost:5173
echo ==============================================
call npm run dev
if errorlevel 1 (
    echo.
    echo [ERROR] El servidor frontend se cerro con error.
)
pause

