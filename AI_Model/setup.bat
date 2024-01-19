@echo off

REM Create virtual environment
python -m venv azureml-env

REM Activate virtual environment
azureml-env\Scripts\activate

REM Install requirements
pip install -r requirements.txt

echo Virtual environment created and dependencies installed.
pause
