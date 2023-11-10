#!/usr/bin/env ruby
# encoding: UTF-8

# `wget -O tide_log.json "https://venicedata.firebaseio.com/dashboard/tideLog.json?print=pretty"`
# w = JSON.parse(File.open( 'tide_log.json' ).read); nil

require 'httpclient'
require 'firebase'
require 'json'
require 'active_support/all'

SRC="https://venicedata.firebaseio.com/"
DST="https://venicedata.firebaseio.com/"
firebase = Firebase::Client.new(SRC)

res = JSON.parse(firebase.get('dashboard/tideLog').response.content)

result = {}
res.values.each{|v|
  key = Time.parse(v['timestamp']).strftime('%Y%m%d%H')
  result[key] = v['puntaSalute']
}

firebase = Firebase::Client.new(DST)
firebase.set("dashboard/logs/venice_tide", result)