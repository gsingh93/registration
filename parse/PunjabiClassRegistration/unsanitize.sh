#!/bin/bash

# Creates global.json config with master key inserted from masterkey.txt
cd config
key=$(cat masterkey.txt)
sed "s/MASTER_KEY_HERE/$key/" global-sanitized.json > global.json

# Creates main.js with sendgrid password inserted from sendgrid_password.txt
cd ../cloud
# Escape any special characters in the password
pass=$(cat sendgrid_password.txt | sed -e 's/[\/&]/\\&/g')
sed "s/SENDGRID_PASSWORD_HERE/$pass/g" main-sanitized.js > main.js
