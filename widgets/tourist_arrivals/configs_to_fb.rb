#!/usr/bin/env ruby
# encoding: UTF-8

require 'firebase'

# ENV['FB_KEY'] = ''
SRC="https://vpc.firebaseio.com/"
firebase = Firebase::Client.new(SRC); #, ENV['FB_KEY']); nil

firebase.set("dashboard/venice_tourists_config", {
  :air_weight        => 0.389,
  
  :air_ove_weight    => (1262000.0 / 3450000.0),
  :train_ove_weight  => (1347000.0 / 5879000.0),
  :auto_ove_weight   => (268000.0  / 5879000.0),
  :coach_ove_weight  => (365000.0  / 5879000.0),
  :bus_ove_weight    => (120000.0  / 5879000.0),
  :cruise_ove_weight => ((514000+329000)/239000),
  
  :train_day_weight => ((450000.0  + 6670000.0) / 1347000.0),
  :auto_day_weight  => ( 751000.0               /  268000.0),           
  :coach_day_weight => ((547000.0  + 1787000.0) /  365000.0), 
  :bus_day_weight   => ((1110000.0 + 600000.0 ) /  120000.9),
  :boat_day_weight  => (
                         (466000.0 + 160000.0  + 2235000.0) /
                         (450000.0  + 6670000.0 + 751000.0 + 547000.0 +
                          1787000.0 + 1110000.0 + 600000.0 + 466000.0 +
                          160000.0  + 2235000.0)
                       ),
  
  :train_tot_weight => (509000.0 / 1347000.0),
  :auto_tot_weight  => ( 95000.0 /  268000.0),  
  :coach_tot_weight => (131000.0 /  365000.0), 
  :bus_tot_weight   => ( 44000.0 /  120000.0),  
  
  :hotel_max_occupancy => 23733,
  :month_weight => {
    '1 '.strip => 0.54,
  	'2 '.strip => 0.69,
  	'3 '.strip => 0.87,
  	'4 '.strip => 0.90,
  	'5 '.strip => 0.87,
  	'6 '.strip => 0.90,
  	'7 '.strip => 0.85,
  	'8 '.strip => 0.80,
  	'9 '.strip => 0.80,
  	'10'.strip => 0.69,
  	'11'.strip => 0.59,
  	'12'.strip => 0.44,
  },
  :day_weight => {
    '0' => 1.00,
    '1' => 0.46,
    '2' => 0.46,
    '3' => 0.46,
    '4' => 0.46,
    '5' => 1.00,
    '6' => 1.00,
  }
})