# WUDMC.COM
## My personal site on Django + PostgreSQL, hosted on GCP VM with Nginx and Gunicorn


## How to install on VM
### Step 0 - Create VM instance in GCP
and don`t forget to allow http/https and 8000 port

add ssh key form local machine to VM  
add ssh key from VM to github


### step 1 - clone repo and set eviromennts
open terminal and run
```
sudo apt update
sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx curl
sudo -H pip3 install --upgrade pip
sudo -H pip3 install virtualenv
cd /home
mkdir wudmc.com
cd wudmc.com
git init
git remote add origin git@github.com:WuDMC/wudmc.com.git
git fetch
git checkout -t origin/master
git submodule update --init --recursive
virtualenv venv

```
must be 12 version of postgres, to check use
```
pg_config --version
```
enter in db console 
```commandline
 sudo -u postgres psql
 ```
config db
```
 CREATE DATABASE wudmc;
 CREATE USER wudmc WITH PASSWORD '***';
 ALTER ROLE wudmc SET client_encoding TO 'utf8';
 ALTER ROLE wudmc SET default_transaction_isolation TO 'read committed';
 ALTER ROLE wudmc SET timezone TO 'UTC';
 GRANT ALL PRIVILEGES ON DATABASE wudmc TO wudmc;
 \q
```

enter venv from wudmc.com folder
```
source venv/bin/activate
pip install -r requirements.txt
pip install requests
sudo ufw allow 8000
nano config.txt 
```
example of config 
```
[DATABASE]
PASSWORD = pass
NAME = name of db
USER = login
[HOSTS]
localhost=1
127.0.0.1=1
domain.com=1
```
run and check django in venv. 

project must become available on ip_adress:8000  

```commandline
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver 0.0.0.0:8000
```

Second test project become available at http://wudmc.com:8000/ (but without static)
```commandline
gunicorn --bind 0.0.0.0:8000 wudmc_site.wsgi
```

### Step 2 - Set gunicorn service
configure socket
```commandline
sudo nano /etc/systemd/system/gunicorn.socket
```
with content
```commandline
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target

```
then configure service
```
sudo nano /etc/systemd/system/gunicorn.service
```
with content
```
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=den  
Group=www-data
WorkingDirectory=/home/den/wudmc.com
ExecStart=/home/den/wudmc.com/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          wudmc_site.wsgi:application

[Install]
WantedBy=multi-user.target
```

and check 
```commandline
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket
sudo systemctl status gunicorn.socket
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
```
if all is ok this command will return html content
```commandline
curl --unix-socket /run/gunicorn.sock localhost
```
### Step 3 - NGINX
Create Nginx config
```
sudo nano /etc/nginx/sites-available/wudmc_site
```
wirh context
```
server {
    listen 80;
    server_name wudmc.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/den/wudmc.com;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }
}
```

and do link
```commandline
sudo ln -s /etc/nginx/sites-available/wudmc_site /etc/nginx/sites-enabled
```
### step 4 - SSL

```commandline
sudo apt-get install certbot
sudo apt install python3-certbot-nginx
sudo certbot --nginx -d wudmc.com
sudo systemctl status certbot.timer
sudo systemctl restart nginx
sudo ufw delete allow 8000
sudo ufw allow 'Nginx Full'

```

### step 5 - Final test

```commandline
sudo systemctl status gunicorn.socket
sudo nginx -t
sudo journalctl -u gunicorn.socket
sudo tail -F /var/log/nginx/error.log

```
for restart services use
```commandline
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

## Install project on local machine 
All steps are same as on VM, just do
1. clone repo
2. install 12 postgrese and configure
```commandline
 sudo apt-get upgrade;
 sudo apt -y install postgresql-12 postgresql-client-12
 sudo -u postgres psql
```
HINTS TO MANAGE POSGRES SQL
```commandline
 sudo -u postgres psql
 systemctl stop postgresql
 systemctl start postgresql
 systemctl status postgresql
 # disable service(not auto-start any more)
 systemctl disable postgresql
 systemctl enable postgresql
```

3. python3 manage.py  : do migrations and create superuser

4. create config.txt in project folder

5. Develop
