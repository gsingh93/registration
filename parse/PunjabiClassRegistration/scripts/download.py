#!/usr/bin/python2

import csv
import json
import requests
import secret

app_id = "Ok0XAGbx2gAEkRKbgMCb4PJ1GDrmWco7bTzuvXZQ"
rest_key = 'kl750bfRK2bF7fHKpmvEwhV9nePqXi81Ad4At8Xp'
login_url = 'https://api.parse.com/1/login'
student_url = 'https://api.parse.com/1/classes/Student'

headers = {
    'X-Parse-REST-API-Key': rest_key,
    'X-Parse-Application-Id': app_id,
}

login_data = {
    'username': secret.username,
    'password': secret.password,
}

print 'Logging in'
res = json.loads(requests.get(login_url, login_data, headers=headers, verify=False).content)
headers['X-Parse-Session-Token'] = res['sessionToken']

print 'Retrieving data'
results = json.loads(requests.get(student_url, headers=headers, verify=False).content)

print 'Creating CSV'
f = csv.writer(open("students.csv", "wb+"))

column_names = [
    'Student Name',
    'Birthday',
    'Gender',
    'Grade',
    'Father',
    'Mother',
    'Address',
    'Primary Email',
    'Secondary Email',
    'Phone Number',
]

f.writerow(column_names)

for res in results['results']:
    amount = res['amount'] if 'amount' in res else ''
    payment = res['paymentType'] if 'paymentType' in res else ''
    f.writerow([
        res['name'],
        res['birthday'],
        res['gender'],
        res['class'],
        res['father'],
        res['mother'],
        res['address'],
        res['primaryEmail'],
        res['secondaryEmail'],
        res['phoneNumber'],
        amount,
        payment,
    ])
