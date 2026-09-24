@echo off
title Subir Megapunto a GitHub
echo ======================================================
echo   Subiendo Megapunto a GitHub (FastAPI + React)
echo   Repositorio: https://github.com/arenasgomez209-alt/MegaPunto-Final.git
echo ======================================================
echo.

set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\Git\mingw64\bin;%PATH%"

echo Estado actual del repositorio:
git status

echo.
echo Enviando cambios a la rama principal (main)...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================
    echo   Repositorio subido con exito a GitHub!
    echo   Enlace: https://github.com/arenasgomez209-alt/MegaPunto-Final
    echo ======================================================
) else (
    echo.
    echo ======================================================
    echo   Hubo un detalle con la autenticacion.
    echo   Si se abrio una ventana en el navegador para autorizar,
    echo   inicia sesion con tu cuenta de GitHub y acepta.
    echo ======================================================
)

echo.
pause
