#!/usr/bin/env ruby
# encoding: UTF-8

# sudo gem install firebase-ruby
# sudo gem install httpclient
# sudo chmod -R a+X /Library/Ruby/Gems/2.0.0/gems/
# sudo chmod -R a+r /Library/Ruby/Gems/2.0.0/gems/

require 'httpclient'
require 'firebase'
require 'json'
require 'active_support/all'

SRC="https://cityknowledge.firebaseio.com/"
firebase = Firebase::Client.new(SRC)

res = JSON.parse(firebase.get('dashboards/widgets').response.content)

res.each{|k,v|
  if Dir["../widgets/#{v['id']}"].empty?
    Dir.mkdir("../widgets/#{v['id']}")
  end
  original_id = "#{v['id']}"
  v['id'] = v['id'].to_s.underscore
  if original_id != v['id']
    File.rename "../widgets/#{original_id}", "../widgets/#{v['id']}"
  end
  File.open("../widgets/#{v['id']}/widget.html", 'w'){|f| f.puts v['contentHTML'] }
  File.open("../widgets/#{v['id']}/widget.json", 'w'){|f|
    keys = %w{id title url urlTitle helpDocUrl log width heigh}
    keys = (keys + (v.keys - ['contentHTML'])).uniq
    f.puts JSON.pretty_generate(keys.inject({}){|res, i| res[i] = v[i]; res})
  }
}


