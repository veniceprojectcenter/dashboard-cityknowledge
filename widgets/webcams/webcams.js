var webcams = [{ "name": "San Marco Cam 1" , "url": "https://93.62.201.235/maree/WEBCAM/smarcoweb1.jpg" },
			   { "name": "San Marco Cam 2" , "url": "https://93.62.201.235/maree/WEBCAM/smarcoweb2.jpg" },
			   { "name": "San Marco Cam 3" , "url": "https://93.62.201.235/maree/WEBCAM/smarcoweb3.jpg" },
			   { "name": "Rialto Cam 1"    , "url": "https://93.62.201.235/maree/WEBCAM/rialtoweb1.jpg" },
			   { "name": "Rialto Cam 2"    , "url": "https://93.62.201.235/maree/WEBCAM/rialtoweb2.jpg" },
			   { "name": "Murano Cam 1"    , "url": "https://93.62.201.235/maree/WEBCAM/muranoweb1.jpg" },
			   { "name": "Murano Cam 2"    , "url": "https://93.62.201.235/maree/WEBCAM/muranoweb2.jpg" },
			   { "name": "Murano Cam 3"    , "url": "https://93.62.201.235/maree/WEBCAM/muranoweb3.jpg" },
			   { "name": "Salute Cam 1"    , "url": "https://93.62.201.235/maree/WEBCAM/saluteweb1.jpg" },
			   { "name": "Salute Cam 2"    , "url": "https://93.62.201.235/maree/WEBCAM/saluteweb2.jpg" }];

var cam_count = webcams.length;
var start_index = Math.floor(Math.random() * cam_count) + 1;
var cachedCams = new Array();

$('a[rel*=facebox]').facebox({
	loadingImage: 'bower_components/facebox/src/loading.gif',
  closeImage: 'bower_components/facebox/src/closelabel.png'
});

for (var i = 0; i < cam_count; i++) {
	cachedCams[i] = new Image();
	cachedCams[i].src = webcams[i].url;
}
updateFeeds();

setInterval(function() {
	updateFeeds();
}, 10000);

function updateFeeds() {
	start_index = (start_index + 3) % cam_count;

	var webcam_1 = webcams[start_index - 1];
	var webcam_2 = webcams[start_index % cam_count];
	var webcam_3 = webcams[(start_index + 1) % cam_count];
	
	if(webcam_1 && webcam_1.url){
	    $("#webcam1").attr("src", webcam_1.url);
		$("#cam_url1").attr("href", webcam_1.url);
		$("#cam_name1").text(webcam_1.name);
	
	}
	if(webcam_2 && webcam_2.url){
	    $("#webcam2").attr("src", webcam_2.url);
		$("#cam_url2").attr("href", webcam_2.url);
		$("#cam_name2").text(webcam_2.name);
	}
	if(webcam_3 && webcam_3.url){
	    $("#webcam3").attr("src", webcam_3.url);
		$("#cam_url3").attr("href", webcam_3.url);
		$("#cam_name3").text(webcam_3.name);
	}

}
