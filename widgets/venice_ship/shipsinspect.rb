#!/usr/bin/env ruby
# encoding: UTF-8

# BACKUP:
# wget "https://vpc.firebaseio.com/dashboard/venice_ships/ship_capacities.json?print=pretty" -O ship_capacities.json

require 'firebase'

# ENV['FB_KEY'] = ''
SRC="https://vpc.firebaseio.com/"
firebase = Firebase::Client.new(SRC); #, ENV['FB_KEY']); nil

# puts "Analizzo arrivi"
# arrivi = JSON.parse(firebase.get("dashboard/venice_ships/arrivals").response.content)
# 
# puts "analisi arrivi"
# arrivi.each{|k, v|
#   print "Analizzo arrivi #{k}\r"
#   v.values.each{|nave|
#     begin
#       dati = JSON.parse(
#         firebase.get(
#           "dashboard/venice_ships/ship_capacities/#{nave['ship'].downcase.strip.gsub(' ', '_')}"
#         ).response.content
#       )
#     rescue
#       puts "\n  Dati mancanti per #{nave['ship']}\n"
#       firebase.set("dashboard/venice_ships/ship_capacities/#{nave['ship'].downcase.strip.gsub(' ', '_')}", {
#         name:       nave['ship'],
#         passengers: 0,
#         crew:       0,
#       })
#     end
#   }
# }
# puts "\n\nAnalisi arrivi completata"

puts "\n\nAnalisi navi"
navi = JSON.parse(firebase.get("dashboard/venice_ships/ship_capacities").response.content)
navi.each{|k,v|
  if v['passengers'].to_i < 1
    puts "Nave #{v['name']} senza PASSEGGERI"
  elsif v['crew'].to_i < 1
    puts "Nave #{v['name']} senza EQUIPAGGIO, lo simulo ad un terzo"
    firebase.set("dashboard/venice_ships/ship_capacities/#{k}/simulated_crew", true)
    firebase.set("dashboard/venice_ships/ship_capacities/#{k}/crew", (v['passengers'].to_i / 3).to_i)
  elsif v['simulated_crew']
    puts "Nave #{v['name']} con equipaggio SIMULATO"
  end
}

=begin
Nave ADRIATIC JET senza PASSEGGERI
Nave AIDA VITA senza PASSEGGERI
Nave AZORES senza PASSEGGERI
Nave BERLIN senza PASSEGGERI
Nave BLACK WATCH senza PASSEGGERI
Nave CELEBRITY CONSTELLATION senza PASSEGGERI
Nave COSTA DELIZIOSA senza PASSEGGERI
Nave COSTA MEDITERRANEA senza PASSEGGERI
Nave COSTA NEOCLASSICA senza PASSEGGERI
Nave EUROPA senza PASSEGGERI
Nave ISLAND PRINCESS senza PASSEGGERI
Nave LE LYRIAL senza PASSEGGERI
Nave MICHELANGELO senza PASSEGGERI
Nave MSC LIRICA senza PASSEGGERI
Nave MSC MAGNIFICA senza PASSEGGERI
Nave MSC OPERA senza PASSEGGERI
Nave MSC POESIA senza PASSEGGERI
Nave O'MEGA senza PASSEGGERI
Nave OCEAN DREAM senza PASSEGGERI
Nave OCEANA senza PASSEGGERI
Nave PRINCE OF VENICE senza PASSEGGERI
Nave RIVER COUNTESS senza PASSEGGERI
Nave SAN FRANGISK senza PASSEGGERI
Nave SAN PAWL senza PASSEGGERI
Nave SEA DREAM II senza PASSEGGERI
Nave SEA PRINCESS senza PASSEGGERI
Nave SERENISSIMA senza PASSEGGERI
Nave SILVER CLOUD senza PASSEGGERI
Nave STAR BREEZE senza PASSEGGERI
Nave STAR PRIDE senza PASSEGGERI
Nave THOMSON CELEBRATION senza PASSEGGERI
Nave VOYAGER senza PASSEGGERI
Nave WIND SURF senza PASSEGGERI
Nave ZUIDERDAM senza PASSEGGERI


ADESSO
Nave ADONIA con equipaggio SIMULATO
Nave ADRIATIC JET con equipaggio SIMULATO
Nave AZORES con equipaggio SIMULATO
Nave BERLIN con equipaggio SIMULATO
Nave BLACK WATCH con equipaggio SIMULATO
Nave COSTA FASCINOSA con equipaggio SIMULATO
Nave DELPHIN con equipaggio SIMULATO
Nave DEUTSCHLAND con equipaggio SIMULATO
Nave LE LYRIAL senza PASSEGGERI
Nave PRINCE OF VENICE senza PASSEGGERI
Nave QUEEN ELIZABETH con equipaggio SIMULATO
Nave RIVER COUNTESS senza PASSEGGERI
Nave ROYAL PRINCESS con equipaggio SIMULATO
Nave SAN FRANGISK senza PASSEGGERI
Nave SAN PAWL senza PASSEGGERI
Nave SEA DREAM I con equipaggio SIMULATO
Nave SERENISSIMA senza PASSEGGERI
Nave STAR CLIPPER con equipaggio SIMULATO
Nave VIKING STAR con equipaggio SIMULATO
=end