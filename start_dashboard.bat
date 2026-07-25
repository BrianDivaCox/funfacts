@echo off
title FactVault AI - Web Dashboard Launcher
echo ===================================================
echo   Starting FactVault AI Web Dashboard...
echo ===================================================
echo.

:: Open default web browser directly to index.html
start "" "%~dp0index.html"

:: Optional: Launch local web server if npx is available
where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Launching local dev server on http://localhost:3000...
    npx -y serve "%~dp0"
) else (
    echo Dashboard opened directly in browser.
    pause
)
