# wudmc.ru
my personal site on django
how to run locally
# ############### step 1 ##############
install python 3.8.10
install requirements
##########  step 2 ###################
need to install and start postgres version 12.9 locally
sudo apt-get upgrade;
 sudo apt -y install postgresql-12 postgresql-client-12
 sudo -u postgres psql
 CREATE DATABASE wudmc;
 CREATE USER wudmc WITH PASSWORD '******';
 ALTER ROLE wudmc SET client_encoding TO 'utf8';
 ALTER ROLE wudmc SET default_transaction_isolation TO 'read committed';
 ALTER ROLE wudmc SET timezone TO 'UTC';
 GRANT ALL PRIVILEGES ON DATABASE wudmc TO wudmc;
 \q
####### HINTS TO MANAGE POSGRES ####
 sudo -u postgres psql
 stop service:
 systemctl stop postgresql
 start service:
 systemctl start postgresql
 show status of service:
 systemctl status postgresql
 disable service(not auto-start any more)
 systemctl disable postgresql
 enable service postgresql(auto-start)# systemctl enable postgresql
########### step 3 #########
 sudo service postgresql start
########### step 4 #########
 python3 manage.py makemigrations
 python3 manage.py migrate
########### step 5 #########
  python3 manage.py runserver


how to install on remote machine
cd /home/wudmc
gh repo clone WuDMC/wudmc.com
cd wudmc.com
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
pip install requests
sudo ufw allow 8000
deactivate

sudo nano /etc/systemd/system/gunicorn.service

[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=wudmc
Group=www-data
WorkingDirectory=/home/wudmc/wudmc.com
ExecStart=/home/wudmc/wudmc.com/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/home/wud>

[Install]
WantedBy=multi-user.target

sudo nano /etc/nginx/sites-available/wudmc_site

server {
  listen 80;
  listen [::]:80;
  server_name www.wudmc.ru wudmc.ru wudmc.com www.wudmc.com;
  return 301 https://wudmc.com$request_uri;
}

server {
    listen              443 ssl;
    server_name www.wudmc.ru;
    ssl_certificate /etc/letsencrypt/live/wudmc.ru/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/wudmc.ru/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    return 301 https://wudmc.com$request_uri;
}


server {
    listen              443 ssl;
    server_name wudmc.ru;
    ssl_certificate /etc/letsencrypt/live/wudmc.ru/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/wudmc.ru/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    return 301 https://wudmc.com$request_uri;

}

server {
    listen              443 ssl;
    server_name www.wudmc.com;

    return 301 https://wudmc.com$request_uri;
}


server {
    listen              443 ssl;
    server_name wudmc.com;


    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/wudmc/wudmc.com;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/wudmc/wudmc.com/wudmc_site.sock;
    }


}

#############################
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
sudo systemctl restart nginx


### возможно acme больше не нужен и достоаточно только certbot

alias acme.sh=/home/wudmc/.acme.sh/acme.sh
acme.sh --register-account -m den@wudmc.com
acme.sh --issue -d wudmc.com -d '*.wudmc.com' --dns --yes-I-know-dns-manual-mode-enough-go-ahead-please
add dns records

acme.sh --renew -d wudmc.com -d '*.wudmc.com' --dns --yes-I-know-dns-manual-mode-enough-go-ahead-please
sudo certbot --nginx -d wudmc.com -d www.wudmc.com
sudo systemctl status certbot.timer
sudo systemctl restart nginx



############## example of config ############
[DATABASE]
PASSWORD = pass
NAME = nameof db
USER = login
[HOSTS]
localhost=1
127.0.0.1=1
domain.com=1
