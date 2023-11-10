#!/usr/bin/env ruby
# encoding: UTF-8

require 'firebase'
require 'active_support/all'

SRC = "https://dashboard-main.firebaseio.com/"
KEY = "7XfSQShJ8tu1N7rY73HhJNJEUL116NtHDT2ujCLs"
FB = Firebase::Client.new(SRC, KEY); nil

# var ref = new Firebase("https://dashboard-main.firebaseio.com");
# ref.changePassword({
#   email: "minni@osti.co",
#   oldPassword: "krJLWQHTtGHjGcfS",
#   newPassword: "tomaso123"
# }, function(error) {
#   if (error) console.log("ERR", error.code, error);
#   else console.log("OK");
# });

islands = JSON.parse( FB.get("cartography/features").response.content ); nil
result = {}
islands.each{|k,v|
  # puts "MAP: #{v['properties']['maps'].to_a[0]}--\nTYPE: #{v['properties']['type']}--"
  if v['properties']['maps'].to_a[0] == 'debarbari' && v['properties']['type'] == 'island'
    result[k.to_s] = v
  end
}; nil

File.open("islands_20151116.json", "w"){|f| f.puts result.to_json }
