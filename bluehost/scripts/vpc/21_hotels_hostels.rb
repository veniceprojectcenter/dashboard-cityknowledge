#!/usr/bin/env ruby

require 'mechanize'
require 'active_support/all'
require 'firebase'

FB_URL = 'https://venicedata.firebaseio.com/hotels';
FB_KEY = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';

@mechanize = Mechanize.new { |agent|
  agent.user_agent_alias = 'Mac Safari'
}

page = @mechanize.get('https://www.hostels.com/')
# form = page.form_with(:id => 'homeSearchForm')
data_checkin  = Time.now.tomorrow
# USO DUE GIORNI PERCHE' MOLTI OSTELLI VOGLIONO LA PRENOTAZIONE DI ALMENO DUE GIORNI
data_checkout = data_checkin.tomorrow.tomorrow
# form.country = '/italy'
# form.city    = '/venice/italy'
# form.dateFrom = data_checkin .to_date.to_s # strftime('%e %b %Y').strip
# form.dateTo   = data_checkout.to_date.to_s # strftime('%e %b %Y').strip
# page = form.submit

# IN http://shccd.hwstatic.com/static/js/1.18.1.0/fab_section_deployed.js SI VEDE CHE
# VIENE RICHIESTO IL CONTENUTO di "fabAjaxContainer" VIA DATATYPE = JSON
# http://docs.seattlerb.org/mechanize/Mechanize.html#method-i-get
# http://stackoverflow.com/questions/1327495/ruby-mechanize-post-with-header
ajax_headers = {
  'X-Requested-With' => 'XMLHttpRequest',
  # 'Content-Type' => 'application/json; charset=utf-8',
  # 'Accept' => 'application/json, text/javascript, */*',
  'Accept' => 'application/json, text/javascript, */*; q=0.01', # COPIATO DA firebug
  'Accept-Encoding' => 'gzip, deflate, sdch',
  'Accept-Language' => 'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4,de;q=0.2',
  'Connection' => 'keep-alive',
  'Host' => 'www.hostels.com',
  'Referer' => page.uri.to_s,
  'User-Agent' => @mechanize.user_agent,
  # 'Cookie' => @mechanize.cookies
}
# my_uri = page.uri.to_s
my_uri = "https://www.hostels.com/venice/italy?"+{
  :dateFrom           => data_checkin.to_date.to_s ,
  :dateTo             => data_checkout.to_date.to_s,
  :guestCount         => 2                         ,
  :homepageSearchType => :dropdown                 ,
  :includeOmniture    => 1                         ,
}.map{|k,v| "#{k}=#{v}" }.join('&')
  
page = @mechanize.get(my_uri, {
  :dateTo             => data_checkin.to_date.to_s ,
  :dateFrom           => data_checkout.to_date.to_s,
  :guestCount         => 2                         ,
  :homepageSearchType => 'dropdown'                ,
  :includeOmniture    => 1                         ,
  :page               => 0                         ,
}, nil, ajax_headers)

contenuti = JSON.parse(page.content)

links_hotels = contenuti['listHtml'].
  gsub("\n", ' ').
  scan(/<div class="fablisting rounded">.*?<ul>.*?<li class="description">.*?<h2><a href="([^"]+)">([^<]*)<\/a><\/h2>/).
  map{|i|
  {
    :nome => i[1],
    :url  => i[0]
  }
}

puts "Raccolti #{links_hotels.size} osteli\n\n"

hotels = []
persone_totali = 0
links_hotels.each_with_index{|l, i|
  print "Analizzo #{i+1}/#{links_hotels.size}: #{l[:nome].to_s.strip}"
  my_url = "#{l[:url].split('?')[0]}?" + {
    :dateFrom   => data_checkin.to_date.to_s ,
    :dateTo     => data_checkout.to_date.to_s,
    :guestCount => ''                        ,
    :groupType  => '#anchor=availability'
  }.map{|k,v| "#{k}=#{v}" }.join('&')
  print "\n   #{my_url}  "
  page = @mechanize.get(my_url)
  
  if page.form_with(:id => 'bookNowForm')
    persone = 0
    
    page.content.gsub("\n", ' ').scan(/<select name="select" class="numberOfGuests"[^>]*>(.*?)<\/select>/).each{|nog|
      if nog[0].split('<option>').last =~ /^(.*)<\/option>/
        persone += $1.to_i
      end
    }
    
    tot_prezzi = 0
    prezzo = page.
      content.
      scan(/<[^>]*class="[^"]*pricePerGuest[^"]*"[^>]*value="([^"]*)"/).
      map{|p|
      tot_prezzi += 1
      p[0].to_s.gsub(',', '.').to_f
    }.sum
    prezzo = (prezzo / tot_prezzi) if tot_prezzi > 0
    
    hotels << {
      :nome         => l[:nome].to_s.strip,
      :posti_liberi => persone,
      :prezzo       => prezzo
    }
    persone_totali += persone
    print "; #{persone} posti liberi (totale #{persone_totali})\n"
  else
    hotels << {
      :nome         => l[:nome].to_s.strip,
      :posti_liberi => 0,
      :prezzo       => 0,
    }
    print "; ESAURITO!\n"
  end
}; nil

firebase = Firebase::Client.new(FB_URL, FB_KEY)
data_path = data_checkin.strftime('%Y/%m/%d')
tot = 0
prezzo = 0
libere = hotels.map{|h|
  if h[:prezzo].to_f > 5 && h[:prezzo].to_f < 250
    tot    += 1
    prezzo += h[:prezzo].to_f
  end
  h[:posti_liberi].to_i
}.sum
p_medio = 0
p_medio = (prezzo / tot).to_i if tot > 0
firebase.set("#{data_path}/hostels/posti_liberi", libere)
firebase.set("#{data_path}/hostels/prezzo", p_medio)

File.open("ostelli_#{data_checkin.to_date.to_s}.yml", 'w'){|f| f.puts hotels.to_yaml}

puts "\n\Posti Liberi: #{persone_totali}"

