#!/usr/bin/python2

import csv
import json
import requests
import secret

# Note: public write permission must be enabled in the Users table before using this script

app_id = "Ok0XAGbx2gAEkRKbgMCb4PJ1GDrmWco7bTzuvXZQ"
javascript_key = "9HSqR5bwZjcGGbLf8T6PGbX7ErD49UlxyHyFC7jp"
url = "https://%s:javascript-key=%s@api.parse.com/1/users" % (app_id, javascript_key)
data = json.dumps({
    'username': secret.username,
    'password': secret.password,
})

print 'Creating user'
print requests.post(url, data, verify=False).content
