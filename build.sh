#!/usr/bin/env bash

set -o errexit  # exit on error

cd backend

pip install -r requirements.txt

python clubBackend/manage.py collectstatic --no-input
python clubBackend/manage.py migrate
```

**What each line does:**
- `set -o errexit` → stops the script if any command fails
- `cd backend` → moves into your backend folder
- `pip install -r requirements.txt` → installs all packages
- `collectstatic` → gathers static files (for Django admin)
- `migrate` → runs database migrations on the production DB

---

Also make sure `build.sh` is executable. Run this once:
```

 
git update-index --chmod=+x build.sh