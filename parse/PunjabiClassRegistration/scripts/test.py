#!/usr/bin/python2

import json
import requests

app_id = "Ok0XAGbx2gAEkRKbgMCb4PJ1GDrmWco7bTzuvXZQ"
javascript_key = "9HSqR5bwZjcGGbLf8T6PGbX7ErD49UlxyHyFC7jp"
url = "https://%s:javascript-key=%s@api.parse.com/1/classes/Student" % (app_id, javascript_key)

def send_request(req):
    headers = {'Content-Type': 'application/json'}
    res = requests.post(url, data=req, headers=headers)

    print res.content

req1 = json.dumps({
    "address": "A, B, MI, 33333",
    "primaryEmail": "gsingh2011@gmail.com",
    "secondaryEmail": "",
    "phoneNumber": "222-222-2222",
    "name": "Gulshan Singh",
    "class": "Kindergarten",
    "birthday": "January 1, 1990",
    "gender": "male",
    "mother": "Jaspal Kaur",
    "father": "Kanwerdip Singh"
})

send_request(req1)

# req2 = json.dumps({
#     "address": "A, B, MI, 33333",
#     "primaryEmail": "gsingh2011@gmail.com",
#     "secondaryEmail": "gsingh_2011@yahoo.com",
#     "phoneNumber": "222-222-2222",
#     "name": "Gulshan Singh",
#     "class": "Kindergarten",
#     "birthday": "January 1, 1990",
#     "gender": "male",
#     "mother": "Jaspal Kaur",
#     "father": "Kanwerdip Singh"
# })
# send_request(req2)
