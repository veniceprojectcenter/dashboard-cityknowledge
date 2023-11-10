#!/usr/bin/env bash

# SRC="https://cityknowledge.firebaseio.com/dashboards.json"
SRC="https://dashboard-main.firebaseio.com/dashboards"
SRC_DEST="backup_source.json"
DST="https://dashboard-sandbox.firebaseio.com/dashboards"
# DST="https://dashboard-main.firebaseio.com/dashboards"

wget "$SRC" -O $SRC_DEST
# curl -X DELETE $DST
# curl -X POST -d '{"user_id" : "jack", "text" : "Ahoy!"}' "$DST"
# USARE firebase-import
# curl -i --data-binary $SRC_DEST -H "Content-Type: text/xml" -X POST "$DST"
# npm install -g firebase-import
# npm install -g firebase
# npm install -g optimist
# npm install -g progress
# npm install -g assert
# npm install -g path
# npm install -g util
firebase-import --firebase_url="$DST" --json=$SRC_DEST --merge
