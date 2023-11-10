require 'mechanize'
require 'active_support/all'
require 'firebase'

FB_URL = 'https://venicedata.firebaseio.com';
FB_KEY = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';

#    FB_URL = 'https://venice-data-sandbox.firebaseio.com';
#    FB_KEY = 'FMdzjSbbqlUoPWNFdqeJDhuAu6tPrfhpsdXEJNhy';

$i = 0
$num = 5



@mechanize = Mechanize.new { |agent|
  agent.user_agent_alias = 'Mac Safari'
  # if options[:proxy]
  #   unless options[:proxy_port]
  #     (options[:proxy], options[:proxy_port]) = options[:proxy].to_s.split(":")
  #   end
  #   agent.set_proxy options[:proxy], (options[:proxy_port] || 8080)
  # end
}

current_cycle=0;
cycles=2;
while current_cycle < cycles  do
  page = @mechanize.get('https://www.booking.com/')
  form = page.form_with(:id => 'frm')
  data_checkin  = Time.now.tomorrow
  data_checkout = data_checkin.tomorrow
  if current_cycle==1
    data_checkin  = data_checkout
    data_checkout = data_checkout.tomorrow    
  end
  form.checkin_monthday    = data_checkin.day
  # form.checkin_year_month  = "#{data_checkin.year}-#{data_checkin.month}"
  form.checkin_month       = data_checkin.month
  form.checkin_year        = data_checkin.year
  form.checkout_monthday   = data_checkout.day
  # form.checkout_year_month = "#{data_checkout.year}-#{data_checkout.month}"
  form.checkout_month      = data_checkout.month
  form.checkout_year       = data_checkout.year
  form.ss = 'Venezia, Veneto, Italia'
  page = form.submit
  
  # CHIEDE DI AFFINARE LA RICERCA
  # puts page.links.map{|l| l.dom_class.to_s}.sort.uniq.join("\n")
  if page.links_with(:class => /item_name_link/).size > 0 #changed from /destination_name/
    page = page.links_with(:class => /item_name_link/)[0].click
    puts 'destination name exists!'
  end
  
  File.write('test.html', page.body)
  
  
  links_hotels = []
  pagina = 1
  while (pagina > 0) do
    puts "Pagina #{pagina}"
    links_hotels += page.links_with(:class => /hotel_name_link url/)
    if page.links_with(:class => /paging-next/).size > 0
      page = page.links_with(:class => /paging-next/)[0].click
      pagina += 1
    else
      pagina = -1
    end
  end
  
  puts "Raccolti #{links_hotels.size} hotels\n\n"
  
  hotels = []
  camere_totali = 0
  links_hotels.each_with_index{|l, i|
    print "Analizzo #{i+1}/#{links_hotels.size}: #{l.text.strip}"
    # print "\n   #{l.href}  "
    page = l.click
    stelle = 0
    if page.content =~ /[ "]ratings_stars_([0-9])[ "]/
      stelle = $1.to_i
    end
    lat = 0
    if page.content =~ /booking.env.b_map_center_latitude = (.................)/
      lat = $1
    end  
    print "; #{lat} lat."
    long = 0
    if page.content =~ /booking.env.b_map_center_longitude = (..................)/
      long = $1
    end  
    print "; #{long} long."
    id = 0
    if page.content =~ /booking.env.b_hotel_id = '(.....)/
      id = $1.to_i;
    end  
    print "; #{id} id."
    
    if page.form_with(:id => 'roomsForm')
      camere = 0
      page.
        form_with(:id => 'roomsForm').
        fields_with(:class => /b_room_selectbox/).
        each{|f|
        camere += f.options.size - 1
      }
      prezzi = page.
        content.
        scan(/<[^>]*class="[^"]*rooms-table-room-price[^>]+>.+ ([^<]+)</).
        map{|p|
        p[0].to_s.gsub(',', '.').to_f
      }
      hotels << {
        :nome          => l.text.strip,
        :camere_libere => camere,
        :avgPrice  => (prezzi.size > 0 ? (((prezzi.sum / prezzi.size) * 100).to_i.to_f / 100.0) : 0),
        :stelle        => stelle,
        :lat           => lat,
        :long          => long,
        :id            => id,
        :host_id            => id
  
      }
      camere_totali += camere
      print "; #{camere} camere libere [EUR #{hotels[-1][:prezzo_medio]}] (totale #{camere_totali})\n"
    else
      hotels << {
        :nome          => l.text.strip,
        :camere_libere => 0,
        :stelle        => stelle,
        :lat           => lat,
        :long          => long,
        :id            => id,
        :host_id            => id
  
  
      }
      print "; ESAURITO!\n"
    end
  }; nil
  
  firebase = Firebase::Client.new(FB_URL, FB_KEY)
  
  # iterate through the hotels
  hotels.each_with_index {|val, index|
  
  #  puts "#{val} => #{index}" 
    puts val[:id]
    firebase.set("/dashboard/booking/hotels/#{val[:id]}", val)
  
  }
  
  
  data_path = data_checkin.strftime('%Y/%m/%d')
  
  0.upto(5){|i|
    tot = 0
    prezzo = 0
    libere = hotels.map{|h|
      if h[:stelle].to_i == i
        tot    += 1
        prezzo += h[:prezzo_medio].to_f
        h[:camere_libere].to_i
      else
        0
      end
    }.sum
    p_medio = 0
    p_medio = (prezzo / tot).to_i if tot > 0
    firebase.set("/hotels/#{data_path}/#{i}/booking/libere", libere)
    firebase.set("/hotels/#{data_path}/#{i}/booking/prezzo", p_medio)
  }
  tot = 0
  prezzo = 0
  libere = hotels.map{|h|
    tot    += 1
    prezzo += h[:prezzo_medio].to_f
    h[:camere_libere].to_i
  }.sum
  p_medio = 0
  p_medio = (prezzo / tot).to_i if tot > 0
  firebase.set("#{data_path}/tot/booking/libere", libere)
  firebase.set("#{data_path}/tot/booking/prezzo", p_medio)
  
  File.open("hotels_#{data_checkin.to_date.to_s}.yml", 'w'){|f| f.puts hotels.to_yaml}
  
  puts "\n\nCamere Libere: #{camere_totali}"
  
  # FATTO GIRARE sul 16/2/2015, da 6676, mentre booking segnala che sono prenotate al 57%...
  # Di conseguenza 6676 è il 43% delle camere a Venezia
  # ovvero le camere totali sembra che siano 6676/43*100 = 15500 camere
  # pensando a spanne camere doppie, 31.000 posti letto gestiti da booking
  # h = YAML.load(File.read('hotels_2015-02-16.yml'))
  # h.map{|i| i[:prezzo_medio]}.compact.sum / h.size
  # prezzo medio: 152.92 euro


end
