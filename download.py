#!/usr/bin/env python2

import csv
import json
import requests
import yaml

def main():
    with open('config.yaml') as f:
        config = yaml.safe_load(f)

    url = 'https://punjabi-class-registration.firebaseio.com/students.json?auth=' + config['FIREBASE_SECRET']
    r = requests.get(url)
    results = json.loads(r.content)

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
        'Amount',
        'Payment Type',
    ]

    f.writerow(column_names)

    for res in results.itervalues():
        amount = ''
        payment = ''
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

if __name__ == '__main__':
    main()
