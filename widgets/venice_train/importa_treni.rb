#!/usr/bin/env ruby
# encoding: UTF-8

# ="""" & B2 &""": {""tipo"": """&A2&""",""numero"": """&B2&""", ""ora"": "&D2&", ""min"": "&E2&", ""provenienza"": """&F2&""", ""capienza"": "&I2&", ""dow_0"": "&M2&", ""dow_1"": "&N2&", ""dow_2"": "&O2&", ""dow_3"": "&P2&", ""dow_4"": "&Q2&", ""dow_5"": "&R2&", ""dow_6"": "&S2&"},"

require 'firebase'

SRC="https://venicedata.firebaseio.com/dashboard"
ENV['FB_KEY'] = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm'

firebase = Firebase::Client.new(SRC, ENV['FB_KEY']); nil

w = JSON.parse(File.open('venice_train_data.json').read)
puts "Aggiungo info su #{SRC}/treni"
firebase.set("treni", w)