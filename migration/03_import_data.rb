%w{
  BardolinoPatches
  BostonParking
  BostonPatches
  apps
  data
  events
  fabio
  food
  forms
  groups
  iris
  layers
  maps
  messages
  patches
  patches2
  publicArt
  publicQueries
  surfaces
  testdata
  testgroups
  users
  wikis
}.each do |i|
  puts "import #{i} into placeknowledge..."
  `firebase-import --firebase_url="https://placeknowledge.firebaseio.com/#{i}" --json=backup_#{i}.json --merge`
end

puts "import dashboards into dashboard-main..."
`firebase-import --firebase_url="https://dashboard-main.firebaseio.com/dashboards" --json=backup_dashboards.json --merge`
puts "import dashboards into dashboard-sandbox..."
`firebase-import --firebase_url="https://dashboard-sandbox.firebaseio.com/dashboards" --json=backup_dashboards.json --merge`

puts "import vpc in venice-data"
`firebase-import --firebase_url="https://venicedata.firebaseio.com/" --json=backup_vpc.json --merge`
