@echo off
title File & Organize Folder Contents
echo ===================================================
echo   File & Organize Folder Contents into Subfolders
echo ===================================================
echo.

set TARGET_DIR=%~1
if "%TARGET_DIR%"=="" set TARGET_DIR=%cd%

echo Organizing directory: %TARGET_DIR%
echo.

cd /d "%TARGET_DIR%"

:: Create categories
if not exist "Images" mkdir "Images"
if not exist "Documents" mkdir "Documents"
if not exist "Archives" mkdir "Archives"
if not exist "Scripts" mkdir "Scripts"

:: Move files by extension
echo Moving image files...
move *.png "Images\" 2>nul
move *.jpg "Images\" 2>nul
move *.jpeg "Images\" 2>nul
move *.gif "Images\" 2>nul

echo Moving document files...
move *.pdf "Documents\" 2>nul
move *.docx "Documents\" 2>nul
move *.txt "Documents\" 2>nul

echo Moving archive files...
move *.zip "Archives\" 2>nul
move *.tar "Archives\" 2>nul
move *.gz "Archives\" 2>nul

echo Moving script files...
move *.ps1 "Scripts\" 2>nul
move *.sh "Scripts\" 2>nul

echo.
echo [SUCCESS] Folder contents organized!
pause
