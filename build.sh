#!/usr/bin/env bash
set -o errexit  
cd backend/clubBackend
pip install -r ../requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
# python -c "import django; django.setup(); from core.db.init_db import init_db; init_db()"
