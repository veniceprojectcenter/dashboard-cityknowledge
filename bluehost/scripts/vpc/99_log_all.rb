require 'active_support/all'
require 'firebase'

FB_URL = 'https://venicedata.firebaseio.com';
FB_KEY = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';

fb = Firebase::Client.new(FB_URL, FB_KEY)

def log_from_to(source, dest, my_key)
  dest = dest.
    gsub(/<KEY>/i, URI::encode(my_key)).
    gsub(/<.*?>/){|l|
      Time.now.strftime(l.gsub(/[<>]/, ''))
    }
  unless fb.get(dest, shallow: true).response.content == 'null'
    puts "LOG #{dest} already exists"
    return false
  end
  actual_data = JSON.parse( fb.get(source).response.content )
  fb.set(dest, actual_data)
end

{
  "/dashboard/airbnb" => {"stats/last_update" => "/logs/airbnb/stats/<KEY>/<%Y%m%d>"}
}.each do |k,v|
  if v.is_a?(String)
    log_from_to(k, v)
  else
    JSON.parse( fb.get(k, shallow: true).response.content ).keys.each do |k_det|
      v.each do |k2, v2|
        log_from_to("#{k}/#{URI::encode k_det}/#{k2}", v2, k_det)
      end
    end
  end
end

