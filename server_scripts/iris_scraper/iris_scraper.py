#!/usr/bin/env python
# -*- coding: utf-8 -*-

import urllib2
import csv
import StringIO
import re
import sys
import datetime
import math
import exceptions
import traceback
from firebase import firebase
from pyquery import PyQuery as pq


# example rows:
# id_segnalazione|data|subject|descrizione|indirizzo_sistema|latitudine|longitudine|municipalita|stato|
# 22191|12/11/2014|sfalcio erba urgente in via Virgilio|Verde pubblico, arredo e parchi|VIA VIRGILIO, 1 _|45,4956386946|12,2632634640|Mestre - Carpenedo|Ricevuta|
# 22190|12/11/2014|caditoia intasata|Strade (tombini, ristagni)|LUNGOMARE GABRIELE D'ANNUNZIO, 12 _|45,41641638|12,3776637018|Lido - Pellestrina|Ricevuta|

ID = 0  # id_segnalazione, just an id number associated with the complaint. probably a primary key
DATE = 1  # data, the date the complaint was initially received
TITLE = 2  # subject, the title of the complaint
CATEGORY = 3  # descrizione, the category in which the complaint is. one of:
#   Affissioni selvagge = "wild postings"; so like grafiti/posters?
#   Altro = other
#   Animali molesti (zanzare, topi, etc.) = animal annoyances (mosquitos, rats, etc.)
#   Barriere architettoniche = architectural barriers ???
#   Canali, rii = canals, rivers
#   Ciclabilit&#224; = ciclabilità = cycling
#   Deiezioni animali = animal shit
#   Fossati (ostruzioni, cedimenti) = ditches (obstructions, caving in)
#   Graffiti (su edifici pubblici) = graffiti (on public buildings)
#   Illuminazione pubblica = public lighting
#   Nomi vie, nizioleti, n.civici = street names, venice street signs, numbers
#   Ormeggi selvaggi = wild moorings
#   Paline, ormeggi, pontili
#   Rifiuti, cassonetti e pulizia
#   Segnaletica di navigazione
#   Segnaletica stradale
#   Servizi igienici
#   Strade (tombini, ristagni)
#   Strade, ponti (buche, dissesti)
#   Tram (cantieri)
#   Veicoli/natanti abbandonati
#   Verde pubblico, arredo e parchi
ADDRESS = 4  # indirizzo_sistema, the address of the problem
LATITUDE = LAT = 5  # latitudine, the latitude
LONGITUDE = LONG = 6  # longitudine
REGION = 7  # municipalita, the region of the complaint
STATE = 8  # stato, the state of the complaint. one of:
#   Sospesa, = suspended; 107 of them at the time of writing
#   Ricevuta = received; 1180
#   In carico = assigned, doing probably; 3345
#   Conclusa = closed; 16925


def get_vpc_data(group_name):
    root_ref = firebase.FirebaseApplication("https://cityknowledge.firebaseio.com", None)

    ids = root_ref.get("groups/%s/members" % group_name, None).keys()
    return map(lambda id: root_ref.get("data/" + id, None), ids)


def get_csv():
    print "downloading csv..."
    url = "https://iris.comune.venezia.it/frmSommario.aspx"
    headers = {
        "Host": "iris.comune.venezia.it",
        "Origin": "https://iris.comune.venezia.it",
        "Referer": "https://iris.comune.venezia.it/frmSommario.aspx",
    }
    values = "__VIEWSTATE=%2FwEPDwULLTE3MjEzNzE1ODUPZBYCAgMPFgIeBWNsYXNzBShub3QtZnJvbnQgcGFnZS1zdGF0aXN0aWNoZSBub3QtbG9nZ2VkLWluFgICAQ9kFggCCQ88KwANAQAPFgQeC18hRGF0YUJvdW5kZx4LXyFJdGVtQ291bnQCBGQWAmYPZBYKAgEPD2QWAh8ABRh6ZWJyYS1vZGQgc3RhdG8tcmljZXZ1dGEWBGYPZBYCAgEPDxYCHgRUZXh0BRxUb3RhbGUgc2VnbmFsYXppb25pIHJpY2V2dXRlZGQCAQ8PFgQeCENzc0NsYXNzBQVzdGF0bx4EXyFTQgICZBYCAgEPDxYCHwMFBjIxLjU0NGRkAgIPD2QWAh8ABRl6ZWJyYS1ldmVuIHN0YXRvLWNvbmNsdXNhFgRmD2QWAgIBDw8WAh8DBRxUb3RhbGUgc2VnbmFsYXppb25pIGNvbmNsdXNlZGQCAQ8PFgQfBAUFc3RhdG8fBQICZBYCAgEPDxYCHwMFBjE2LjkwN2RkAgMPD2QWAh8ABRl6ZWJyYS1vZGQgc3RhdG8taW4tY2FyaWNvFgRmD2QWAgIBDw8WAh8DBTJUb3RhbGUgc2VnbmFsYXppb25pIHJpY2V2dXRlIG5lbGwndWx0aW1hIHNldHRpbWFuYWRkAgEPDxYEHwQFBXN0YXRvHwUCAmQWAgIBDw8WAh8DBQMxMDNkZAIEDw9kFgIfAAUaemVicmEtZXZlbiBzdGF0by1pbi1jYXJpY28WBGYPZBYCAgEPDxYCHwMFLVRvdGFsZSBzZWduYWxhemlvbmkgcmljZXZ1dGUgbmVsbCd1bHRpbW8gYW5ub2RkAgEPDxYEHwQFBXN0YXRvHwUCAmQWAgIBDw8WAh8DBQU0LjI2MmRkAgUPDxYCHgdWaXNpYmxlaGRkAgsPPCsADQIADxYEHwFnHwICFmQMFCsAAxYIHgROYW1lBQtERVNDUklaSU9ORR4KSXNSZWFkT25seWgeBFR5cGUZKwIeCURhdGFGaWVsZAULREVTQ1JJWklPTkUWCB8HBQZRVUFOVEkfCGgfCRkpW1N5c3RlbS5EZWNpbWFsLCBtc2NvcmxpYiwgVmVyc2lvbj0yLjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsIFB1YmxpY0tleVRva2VuPWI3N2E1YzU2MTkzNGUwODkfCgU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\
&__EVENTVALIDATION=%2FwEWBQKy4t2OAwLM9PumDwK%2B3oPPCQLHnZOUDAKM2dqBBwc24VyEA%2BU6R8v2wQJqsQ3Xia4R&buttOpenData=Data+for+download"

    request = urllib2.Request(url, values, headers)
    response = urllib2.urlopen(request)
    page = response.read()

    data = csv.reader(StringIO.StringIO(page), delimiter='|')
    data.next()  # skip the header line
    print "csv downloaded"
    return data


def get_close_date(complaint_id):
    url = 'https://iris.comune.venezia.it/frmVediSegnalazioneNew.aspx?id=%s' % complaint_id
    response = urllib2.urlopen(urllib2.Request(url, '', {}))
    cookies = response.info().getheader('Set-Cookie')
    asp_cookie = re.match(r'(ASP\.NET_SessionId=.*?; )', cookies).group(1)

    url = 'https://iris.comune.venezia.it/frmIter.aspx'
    headers = {
        'Referer': 'https://iris.comune.venezia.it/frmVediSegnalazioneNew.aspx?id=%s' % complaint_id,
        'Cookie': asp_cookie,
    }
    d = pq(urllib2.urlopen(urllib2.Request(url, '', headers)).read())
    dates_and_states = d('span').filter(lambda i, this: re.match(r'Repeater\d_ctl\d+_labD', str(pq(this).attr('id'))))

    closed_state_id = dates_and_states.filter(lambda i, this: str(pq(this).text()).startswith("Conclusa:")).attr('id')
    if not closed_state_id:
        return None
    id_number = re.findall(r'Repeater\d_ctl(\d+)_lab', closed_state_id)[0]
    return dates_and_states.filter(lambda i, this: re.match(
        r'Repeater\d_ctl' + id_number + r'_labData',
        str(pq(this).attr('id')))
    ).text()


def lat_long_distance(lat1, long1, lat2, long2):
    lat1 = float(lat1)
    long1 = float(long1)
    lat2 = float(lat2)
    long2 = float(long2)
    # https://www.johndcook.com/blog/python_longitude_latitude/
    degrees_to_radians = math.pi / 180.0
    phi1 = (90.0 - lat1) * degrees_to_radians
    phi2 = (90.0 - lat2) * degrees_to_radians
    theta1 = long1 * degrees_to_radians
    theta2 = long2 * degrees_to_radians
    cos = (math.sin(phi1) * math.sin(phi2) * math.cos(theta1 - theta2) +
           math.cos(phi1) * math.cos(phi2))
    arc = math.acos(cos)
    return arc * 6737000


def in_last_week(date):
    if date is None or date == "":
        return False

    d = datetime.datetime.strptime(date, "%d/%m/%Y").date()
    return (datetime.date.today() - d).days <= 7


def in_last_year(date):
    if date is None or date == "":
        return False
    d = datetime.datetime.strptime(date, "%d/%m/%Y").date()
    return (datetime.date.today() - d).days <= 365

fb = firebase.FirebaseApplication("https://cityknowledge.firebaseio.com/", None)

print "downloading stored complaints..."
complaints = fb.get("iris/complaints", None)
print "done downloading stored complaints. (there were less than %s of them)" % len(complaints)


print "downloading PV MERGE May 2013 KM Fountains..."
fountains = get_vpc_data("PV MERGE May 2013 KM Fountains")
print "done downloading PV MERGE May 2013 KM Fountains."
latlongs = map(lambda f: (float(f['data']['latitude']), float(f['data']['longitude'])), fountains)


def close_by_fountain(lon, lat):
    a = [(l, lat_long_distance(l[0], l[1], lat, lon)) for l in latlongs if lat_long_distance(l[0], l[1], lat, lon) < 10]
    if len(a) > 0:
        return a[0]
    return None


def is_a_vpc_fountain(complaint):
    if 'fontana' in complaint['title'].lower():
        return close_by_fountain(float(complaint['long'].replace(',', '.')), float(complaint['lat'].replace(',', '.')))


def upload_complaint(id_num, complaint):
    result = None
    while result is None:
        try:
            result = fb.put("iris/complaints", id_num, complaint)
        except exceptions.KeyboardInterrupt:
            sys.exit(0)
        except:
            traceback.print_exc()
            print "retrying upload of #%s" % id_num


def close_analysis(id_num, open_date):
    close_date = get_close_date(id_num)
    print "uploading date_closed(%s) for complaint #%s" % (close_date, id_num)
    dr = datetime.datetime.strptime(close_date, "%d/%m/%Y").date()
    dc = datetime.datetime.strptime(line[DATE], "%d/%m/%Y").date()
    return {
        'date_closed': close_date,
        'days_to_close': (dc - dr).days,
    }


def update_complaint_if_needed(complaints, id_num):
    modified = False
    if line[STATE] == 'Conclusa' and (id_num >= len(complaints) or complaints[id_num] is None or 'date_closed' not in complaints[id_num]):
        complaints[id_num].update(close_analysis(line[ID], line[DATE]))
        modified = True
    elif id_num >= len(complaints) or complaints[id_num] is None:
        print "uploading only date_received+category for complaint #%s" % id_num
        modified = True
    elif id_num >= len(complaints) or complaints[id_num] is None:
        modified = True
    if 'fountain' not in complaints[id_num] and is_a_vpc_fountain(complaints[id_num]):
        print "uploading that this is a fountain #%s" % id_num
        complaints[id_num]['fountain'] = True
        modified = True

    if modified:
        upload_complaint(line[ID], complaints[id_num])


ttc_by_region = {}  # time to close by region
freq_closed_by_region = {}  # time to close by region


def update_stats(complaint):
    if complaint.get('days_to_close'):
        if ttc_by_region.get(complaint['region']):
            ttc_by_region[complaint['region']] += int(complaint['days_to_close'])
            freq_closed_by_region[complaint['region']] += 1
        else:
            ttc_by_region[complaint['region']] = int(complaint['days_to_close'])
            freq_closed_by_region[complaint['region']] = 1


total_received = total_pending = total_resolved = 0
week_received = week_pending = week_resolved = 0
year_received = year_pending = year_resolved = 0

week_complaints = {}

for line in get_csv():
    id_num = int(line[ID])
    while len(complaints) - 1 <= id_num:
        complaints.append(None)
    complaints[id_num] = complaints[id_num] or {}
    complaints[id_num].update({
        'date_received': line[DATE],
        'category': line[CATEGORY],
        'region': line[REGION],
        'long': line[LONGITUDE].replace(',', '.'),
        'lat': line[LATITUDE].replace(',', '.'),
        'title': line[TITLE],
        'state': line[STATE]
    })

    update_complaint_if_needed(complaints, id_num)
    update_stats(complaints[id_num])

    if in_last_week(line[DATE]):
        week_complaints[id_num] = complaints[id_num]
        week_received += 1
        if line[STATE] == 'In carico':
            week_pending += 1
    if in_last_week(complaints[id_num].get('date_closed')):
        week_complaints[id_num] = complaints[id_num]
        week_resolved += 1

    if in_last_year(line[DATE]):
        year_received += 1
        if line[STATE] == 'In carico':
            year_pending += 1
    if in_last_year(complaints[id_num].get('date_closed')):
        year_resolved += 1

    total_received += 1
    if line[STATE] == 'Conclusa':
        total_resolved += 1
    else:
        total_pending += 1

for region in ttc_by_region:
    ttc_by_region[region] = 1.0 * ttc_by_region[region] / freq_closed_by_region[region]

fb.put("iris/computed", "ttc_by_region", ttc_by_region)
fb.put("iris", "weekly", week_complaints)
fb.put("iris/computed", "total_received", total_received)
fb.put("iris/computed", "total_pending", total_pending)
fb.put("iris/computed", "total_resolved", total_resolved)
fb.put("iris/computed", "week_received", week_received)
fb.put("iris/computed", "week_pending", week_pending)
fb.put("iris/computed", "week_resolved", week_resolved)
fb.put("iris/computed", "year_received", year_received)
fb.put("iris/computed", "year_pending", year_pending)
fb.put("iris/computed", "year_resolved", year_resolved)
