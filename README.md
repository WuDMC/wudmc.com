# wudmc.ru
my personal site on django
# how to run locally
# ############### step 1 ##############
# install python 3.8.10
# install requirements
##########  step 2 ###################
# need to install and start postgres version 12.9 locally
# sudo apt-get upgrade;
# sudo apt -y install postgresql-12 postgresql-client-12
# sudo -u postgres psql
# CREATE DATABASE wudmc;
# CREATE USER wudmc WITH PASSWORD '***REMOVED***';
# ALTER ROLE wudmc SET client_encoding TO 'utf8';
# ALTER ROLE wudmc SET default_transaction_isolation TO 'read committed';
# ALTER ROLE wudmc SET timezone TO 'UTC';
# GRANT ALL PRIVILEGES ON DATABASE wudmc TO wudmc;
# \q
####### HINTS TO MANAGE POSGRES ####
# sudo -u postgres psql
# stop service:
# systemctl stop postgresql
# start service:
# systemctl start postgresql
# show status of service:
# systemctl status postgresql
# disable service(not auto-start any more)
# systemctl disable postgresql
# enable service postgresql(auto-start)# systemctl enable postgresql
########### step 3 #########
# sudo service postgresql start
########### step 4 #########
# python3 manage.py makemigrations
# python3 manage.py migrate
########### step 5 #########
#  python3 manage.py runserver

