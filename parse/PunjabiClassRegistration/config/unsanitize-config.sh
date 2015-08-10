#!/bin/bash

# Creates global.json config with master key inserted from masterkey.txt

key=$(cat masterkey.txt)
sed "s/MASTER_KEY_HERE/$key/" global-sanitized.json > global.json
