#!/usr/bin/env ruby
# encoding: UTF-8

require 'firebase'

ENV['FB_KEY'] = '7XfSQShJ8tu1N7rY73HhJNJEUL116NtHDT2ujCLs'
SRC="https://dashboard-main.firebaseio.com/"
# ENV['FB_KEY'] = '8LPcZF0m6g9jzX0amh0no3HBSG5ZkFKwMG9AeSVB'
# SRC="https://dashboard-sandbox.firebaseio.com/"
firebase = Firebase::Client.new(SRC, ENV['FB_KEY']); nil

Dir["../widgets/*/widget.json"].each{|d|
  # "../widgets/actv_updates/widget.json"
  w = JSON.parse(File.open(d).read)
  puts "Aggiungo info su #{w['id']}"
  firebase.set("widgets/#{w['id']}", w)
}; nil