<?php
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  require_once 'firebaseLib.php'; 
   
  $dbs_url=  'https://dashboard-main.firebaseio.com/dashboards';
  $wdg_url=  'https://dashboard-main.firebaseio.com';
  $key_prod = '7XfSQShJ8tu1N7rY73HhJNJEUL116NtHDT2ujCLs';
  
  $dat_url=  'https://venicedata.firebaseio.com';
  $log_url=  'https://venicedata.firebaseio.com/dashboard/logs';
  
  $url_sb = 'https://dashboard-sandbox.firebaseio.com/';
  $key_sb = '8LPcZF0m6g9jzX0amh0no3HBSG5ZkFKwMG9AeSVB';
  
  $url = 'https://venicedata.firebaseio.com/';
  $key = '7XfSQShJ8tu1N7rY73HhJNJEUL116NtHDT2ujCLs';
  
  $case=2;
  
  if($case==1){
         $url=$dat_url;
         $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
         $fb = new fireBase($url, $key);
         echo "<br>Connected to Firebase:".$url;
       
         $get_path ="/dashboard/ships/marinetraffic_inport/530-VENEZIA/2015062603";
         $push_path="/dashboard/ships/marinetraffic_inport/530-VENEZIA/2015070218"; 
 
          
          echo "<br>GET PATH:".$get_path;
          echo "<br>PUSH PATH:".$push_path;
          echo "<br>";
          
          $get_data = $fb->get( $get_path); 
          
          $get_data_dec=  json_decode($get_data,true);
 
          echo "<br>Read data:<br>";
          print_r($get_data_dec);
            
          $response = $fb->set( $push_path,  $get_data_dec); 
                              
          echo "<br>FIREBASE RESPONSE:<br>".   $response ;
  }
  
  
  
  if($case==2){
        $url  =$wdg_url;
        $key = $key_prod;
          
        $fb = new fireBase($url, $key);
        echo "<br>Connected to Firebase:".$url;
       
       
        $push_path="/widgets/airbnbstats"; 
        $string_to_push='
{
  "id": "airbnbstats",
  "title": "Venice Airbnb Stats",
  "url": "http://www.airbnb.com",
  "urlTitle": "Venice Airbnb Stats",
  "helpDocUrl": "http://www.airbnb.com",
  "log": false,
  "width": 2, 
  "height": 2
}

';
          
          echo "<br>PUSH PATH:".$push_path;
          echo "<br>PUSH STRING:".$string_to_push;
          echo "<br>";
          
          print_r(json_decode ($string_to_push));
          
          $array_to_push = json_decode ($string_to_push);// array('url' => "http");
           
       
          //$response = $fb->push( $push_path,  $array_to_push);//aggiunge l'array sotto a path
          $response = $fb->set( $push_path,  $array_to_push);//genera un hash e aggiunge l'array sotto a path
                              
          echo "<br>FIREBASE RESPONSE:<br>".   $response ;
  }
  
  
  
  
  if($case==3){
         $url=$dat_url;
         $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
          
        $fb = new fireBase($url, $key);
        echo "<br>Connected to Firebase:".$url;
       
       
        $push_path="/dashboard/realestate/immobiliare/1"; 
        $string_to_push='{
  "id": "1",
  "sestriere": "cannaregio",
  "nome": "casaciccio 1",
  "last_found_date": "20150716"
 
}';
 

          echo "<br>PUSH PATH:".$push_path;
          echo "<br>PUSH STRING:".$string_to_push;
          echo "<br>";
          
          print_r(json_decode ($string_to_push));
          
          $array_to_push = json_decode ($string_to_push);// array('url' => "http");
           
       
         // $response = $fb->push( $push_path,  $array_to_push);//aggiunge l'array sotto a path
          
        $response = $fb->set( $push_path,  $array_to_push);//genera un hash e aggiunge l'array sotto a path
                              
          echo "<br>FIREBASE RESPONSE:<br>".   $response ;
          
$push_path="/dashboard/realestate/immobiliare/2"; 
        $string_to_push='{
  "id": "2",
  "sestriere": "cannaregio",
  "nome": "casaciccio 2",
  "last_found_date": "20150716"
 
}';
 

          echo "<br>PUSH PATH:".$push_path;
          echo "<br>PUSH STRING:".$string_to_push;
          echo "<br>";
          
          print_r(json_decode ($string_to_push));
          
          $array_to_push = json_decode ($string_to_push);// array('url' => "http");
           
       
         // $response = $fb->push( $push_path,  $array_to_push);//aggiunge l'array sotto a path
          
        $response = $fb->set( $push_path,  $array_to_push);//genera un hash e aggiunge l'array sotto a path
                              
          echo "<br>FIREBASE RESPONSE:<br>".   $response ;          
  }
  
 ?>