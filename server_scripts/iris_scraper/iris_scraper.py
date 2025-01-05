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
    url = "http://iris.comune.venezia.it/frmSommario.aspx"
    headers = {
        "Host": "iris.comune.venezia.it",
        "Origin": "http://iris.comune.venezia.it",
        "Referer": "http://iris.comune.venezia.it/frmSommario.aspx",
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
    url = 'http://iris.comune.venezia.it/frmVediSegnalazioneNew.aspx?id=%s' % complaint_id
    response = urllib2.urlopen(urllib2.Request(url, '', {}))
    cookies = response.info().getheader('Set-Cookie')
    asp_cookie = re.match(r'(ASP\.NET_SessionId=.*?; )', cookies).group(1)

