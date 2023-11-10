#!/usr/bin/env ruby
# encoding: UTF-8

require 'firebase'

# ENV['FB_KEY'] = ''
SRC="https://venicedata.firebaseio.com/"
firebase = Firebase::Client.new(SRC, 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm'); #, ENV['FB_KEY']); nil

# raise "calendario 2017 importato fino al 31/03/2017"
1.upto(26).each{|i|
  dati = File.open('CalendarioAccosti_2016_'+"00#{i}"[-2,2]+'.csv').read.split("\n")[2, 10000]; nil
  puts "\nLetto file "+"00#{i}"[-2,2]
  puts "           #{dati.size} righe"
  riga = 0
  dati.each{|d|
    print "Leggo riga #{riga += 1}"
    # "28/03/2015|--*|06:30|Fluviali|MICHELANGELO|CROISE EUROPE ALSACE CROISIERES"
    # 01/03/2016;--*;--*;Fluviali;MICHELANGELO;CROISE EUROPE ALSACE CROISIERES
    (quando, arrivo, partenza, tipo, nome, compagnia) = d.split(';')
    (giorno, mese, anno) = quando.split('/')
    w = {
      :date => "#{anno}-#{mese}-#{giorno}",
      :ship => nome.to_s.gsub("\r", ''),
      :company => compagnia.to_s.gsub("\r", '')
    }
    if arrivo =~ /^([0-9][0-9]):([0-9][0-9])$/
      print " arriva #{nome}\r"
      w[:hour] = "#{$1}:#{$2}"
      firebase.push("dashboard/venice_ships/arrivals/#{anno}#{mese}#{giorno}", w)
    elsif partenza =~ /^([0-9][0-9]):([0-9][0-9])$/
      print " parte #{nome}\r"
      w[:hour] = "#{$1}:#{$2}"
      firebase.push("dashboard/venice_ships/departures/#{anno}#{mese}#{giorno}", w)
    else
      print " resta #{nome}\r"
      firebase.push("dashboard/venice_ships/overnight/#{anno}#{mese}#{giorno}", w)
    end
  }
}
print "\nCompletato"
