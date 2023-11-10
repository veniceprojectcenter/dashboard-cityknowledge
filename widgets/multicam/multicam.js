
$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

//Single instance controller
if (!(typeof $root_scope.MulticamController == 'function') ){  

        $root_scope.MulticamController = function($scope){ 
             
             //Local scope functions
              $scope.initController = function($widget)
              {
                 $scope.widget = $widget;
              };
              
              $scope.containerStyle = function(widget) {
                var result = "overflow-y: scroll;";
                // console.log("Container", result);
                result += "height: "+ (170*widget.height) + "px;";
                result += "width:  "+ (185*widget.width ) + "px;";
                // console.log("Container", result);
                return result;
              };
              
              $scope.openMulticamImage = function($name,$src){
               
                //console.log('multicam widget openMulticamImage(');
          
                $('#imagemodal_title').text($name);
                $('#imagepreview').attr('src',$src);  
                $('#imagemodal').modal('show'); 
         
             }
             
             // console.log("Scope e W", $scope, $scope.widget);
             // $scope.image_width         = '48%';
             // $scope.tot_images_per_page = 4;
             // $scope.refresh_time        = 8000;
             $scope.image_width         = $scope.widget.settings.imageWidth.value;
             $scope.tot_images_per_page = $scope.widget.settings.imagePerPage.value;
             $scope.refresh_time        = $scope.widget.settings.refreshTime.value;
             // console.log("Impostazioni", $scope.image_width, $scope.tot_images_per_page, $scope.refresh_time);
             // $scope.mycontainerStyle = $scope.containerStyle($scope.widget);
             // document.querySelector('[id=container_'+$scope.widget.fb_id+']').css("height: 340px; width:");
             $('#container_'+$scope.widget.fb_id).height((170*$scope.widget.height));
             $('#container_'+$scope.widget.fb_id).width( (185*$scope.widget.width ));
             // console.log("Altezza",
              "$('[id=container_"+$scope.widget.fb_id+"]')", 
              (170*$scope.widget.height) + "px",
              $('[id=container_'+$scope.widget.fb_id+']').height());
             
             $scope.multicam_photos_db =   [];
             $scope.multicam_photos_db.push({ "name": "I-25@La_Bajada_Upper" , "url": "http://servicev3.nmroads.com/RealMapWAR/GetCameraImage?cameraName=I-25@La_Bajada_Upper&t=1429535503156" });
             $scope.multicam_photos_db.push({ "name": "ClinesCornersOnI-40" , "url": "http://servicev3.nmroads.com/RealMapWAR/GetCameraImage?cameraName=ClinesCornersOnI-40&t=1429535503156" });
             $scope.multicam_photos_db.push({ "name": "I-40@Pennsylvania" , "url": "http://servicev3.nmroads.com/RealMapWAR/GetCameraImage?cameraName=I-40@Pennsylvania&t=1429551520982" });
             $scope.multicam_photos_db.push({ "name": "Coors@Atrisco" ,"url":  "http://servicev3.nmroads.com/RealMapWAR/GetCameraImage?cameraName=Coors@Atrisco&t=1429551520982" });
             $scope.multicam_photos_db.push({ "name": "US550@ContinentalDivide" ,"url":  "http://servicev3.nmroads.com/RealMapWAR/GetCameraImage?cameraName=US550@ContinentalDivide&t=1429551520982" });
             $scope.multicam_photos_db.push({ "name": "ClinesCornersOnI-40" ,"url":  "http://servicev3.nmroads.com/RealMapWAR/GetCameraImage?cameraName=ClinesCornersOnI-40&t=1429535503156" });
             $scope.multicam_photos_db.push({ "name": "Coors@Atrisco" ,"url":  "http://servicev3.nmroads.com/RealMapWAR/GetCameraImage?cameraName=Coors@Atrisco&t=1429551722523" });
             $scope.multicam_photos_db.push({ "name": "I-40@University" ,"url": "http://servicev3.nmroads.com/RealMapWAR/GetCameraImage?cameraName=I-40@University&t=1429551722523" });
             $scope.multicam_photos_db.push({ "name": "I-40@University" ,"url": "http://servicev3.nmroads.com/RealMapWAR/GetCameraImage?cameraName=I-40@University&t=1429551722523" });
            
              
              
             $scope.indice = 0; 
              
             //Refresh
             
             setInterval(function() {
                
                 $scope.indice+=$scope.tot_images_per_page;
                 if ($scope.indice >= $scope.multicam_photos_db.length) $scope.indice = 0;
                 // console.log('multicam widget refresh ',$scope.indice,new Date(),$scope.widget);
                
              },  ( $scope.refresh_time ));
        }
      
}
