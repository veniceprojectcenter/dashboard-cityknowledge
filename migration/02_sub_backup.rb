#!/usr/bin/env ruby
# encoding: UTF-8

require 'json'
require 'active_support/all'

puts "Reading data (whait almost 30 secs...)"
dati = JSON.parse(File.open('backup_ck.json').read); nil

dati.keys.each do |k|
  puts "Exporting #{k}..."
  File.open("backup_#{k}.json", 'w'){|f| f.puts JSON.pretty_generate(dati[k]) }
end

puts "Completed!"

# BardolinoPatches
# BostonParking
# BostonPatches
# apps
# dashboards
# data
# events
# fabio
# food
# forms
# groups
# iris
# layers
# maps
# messages
# patches
# patches2
# publicArt
# publicQueries
# surfaces
# testdata
# testgroups
# users
# wikis


