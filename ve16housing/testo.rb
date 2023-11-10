require 'active_support/all'
require 'firebase'
require 'open-uri'
require 'active_support/all'
require 'active_record'

FB_URI = 'https://testfox-9b363.firebaseio.com/'
FB_KEY = '8xVIFxch1GYEhHlB8pZiQiF6qu23QGQUqDu8PFHY'
fb = Firebase::Client.new(FB_URI, FB_KEY)

all_hosts = JSON.parse( fb.get("Airbnb/#{URI.encode('Venezia, VE')}/Hosts").response.content ) rescue {}

total = 0
# sestiere = all_hosts.keys[2]
# hosts = all_hosts[sestiere]
features = []
all_hosts.each{|sestiere,hosts|
  
  puts "Parsing #{sestiere}\n"
  i = 0; tot = hosts.keys.size
  hosts.each{|k,v|
    total += 1
    puts "#{'% 5i' % (i+=1)}/#{tot} Item #{k}"
    feature = {
      'type'       => "Feature",
      'properties' => {
        'id'   => k,
        'name' => v['Name'],
        'type' => v['Type'],
        'marker-size' => "small",
        'marker-color' => (v['LastAvailable']== Time.now.strftime('%Y%m%d')) ? "#00ff00" : "#ff0000"
      },
      'geometry' => {
        'type'        => "Point",
        'coordinates' => [ v['Longitude'], v['Latitude'] ]
      }
    }
    features << feature
  }
}
result = {
  'type' => "FeatureCollection",
  'crs'  => {
    'type'       => "name",
    'properties' => { 'name' => "urn:ogc:def:crs:OGC:1.3:CRS84" }
  },
  'features' => features
}
File.open("airbnb.json", 'w'){|f| f.puts result.to_json}
fb.update('airbnb_geojson', result)

fb.update(
          "Airbnb/Totals", 
          {:Total => total})