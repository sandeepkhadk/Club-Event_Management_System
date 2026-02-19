#!/usr/bin/env bash

set -o errexit  

cd backend

pip install -r requirements.txt

python clubBackend/manage.py collectstatic --no-input
python clubBackend/manage.py migrate


 
