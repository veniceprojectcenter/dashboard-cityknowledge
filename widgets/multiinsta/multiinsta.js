 
 
 //Unique widget id
if (!(typeof window["multiinsta_widget_count"] !== 'undefined' )) {
     // console.log('Create multiinsta widget instance variables' );
     window["multiinsta_widget_count"]=0; 
     
     setInterval(function() {
    	updateMultiInstaWidget();
     }, 10000);
    
}else{
     
     window["multiinsta_widget_count"]++;    
    
}
// console.log('Created multiinsta widget number:'+window["multiinsta_widget_count"] );

//Unique widget functions
if (!(typeof updateMultiInstaWidget !== 'undefined' && $.isFunction('updateMultiInstaWidget'))) {
    
        
    function updateMultiInstaWidget() {
        // console.log('updateMultiInstaWidget');
    }

}
 
//Wulticam array
window["multiinsta_urls"][window["multiinsta_widget_count"]].push({ "name": "I-25@La_Bajada_Upper" , "url": "http://servicev3.nmroads.com/RealMapWAR/GetCameraImage?cameraName=I-25@La_Bajada_Upper&t=1429535503156" });
 
//Confgi vars
var conf_multicam_image_rows    =3;
var conf_multicam_images_per_row=3;

//Widget HTML
var htmlstr='<table border=0 style="margin-top:10px;">';
var img_num=0;
for(var ro=0;ro<conf_multicam_image_rows;ro++){
    htmlstr+='<tr>';
    for(var li=0;li<conf_multicam_images_per_row;li++){
        
        htmlstr+='<td><a style="margin: 3px;" id="img_url_'+window["multicam_widget_count"]+'_'+img_num+'" rel="facebox" href="http://">';
        htmlstr+='<img style="border: 1px solid;" id="img_'+window["multicam_widget_count"]+'_'+img_num+'" height="115" width="122" src="" alt="" title=""/></a></td>';
        
        img_num++;
    }    
    htmlstr+='</tr>';
}
htmlstr+='</table>'; 

$( "#multiinsta_content").replaceWith(htmlstr);
 
updateMultiInstaWidget();