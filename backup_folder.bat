@echo off
title Zip & Backup Project Folder
echo ===================================================
echo   Backing up FactVault AI Project Folder...
echo ===================================================
echo.

:: Get current timestamp for filename
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%

set TARGET_ZIP=%~dp0..\funfact_tracker_backup_%TIMESTAMP%.zip

echo Creating backup archive at:
echo %TARGET_ZIP%
echo.

powershell -Command "Compress-Archive -Path '%~dp0*' -DestinationPath '%TARGET_ZIP%' -Force"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Folder backup complete!
) else (
    echo.
    echo [ERROR] Backup failed.
)

pause
