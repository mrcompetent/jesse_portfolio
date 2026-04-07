#!/bin/bash
# Install dependencies
python3 -m pip install -r requirements.txt --break-system-packages

# Make migrations and apply them (optional, if you have a DB on vercel)
python3 manage.py makemigrations
python3 manage.py migrate

# Collect static files
echo "Collecting static files..."
python3 manage.py collectstatic --noinput --clear
