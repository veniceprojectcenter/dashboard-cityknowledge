require 'json'
require 'active_support/all'
require 'firebase'

puts "Reading data (whait almost 30 secs...)"
dati = JSON.parse(File.open('backup_data.json').read); nil
firebase = Firebase::Client.new("https://placeknowledge.firebaseio.com/data/"); nil

# i = 0
# tot = dati.keys.size # 237549
# dati.keys.sort[36490..-1].each do |k|
#   puts "#{i+=1}/#{tot} Exporting #{k}..."
#   # File.open("backup_tmp.json", 'w'){|f| f.puts JSON.pretty_generate(dati[k]) }
#   firebase.set("#{k}", dati[k])
#   #{ }`firebase-import --firebase_url="https://placeknowledge.firebaseio.com/data/#{k}" --json=backup_tmp.json --merge`
# end

chiavi_ok = File.open('completi.log').read.split("\n"); nil
chiavi_todo = dati.keys.sort - chiavi_ok
threads = []
z = 0
i = 0
tot = chiavi_todo.size
f = File.open('completi.log', 'a')
chiavi_todo.each_slice((tot / 40).to_i) do |my_slice|
  threads << Thread.new{
    my_slice.each do |k|
      i += 1
      puts "#{i}/#{tot} Exporting #{k}..." if i % 10 == 0
      firebase.set("#{k}", dati[k])
      f.puts k
      f.flush
    end
  }
end
threads.each{|t|
  t.join
}
f.close

puts "Completed!"