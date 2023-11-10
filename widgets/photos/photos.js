
var photos = [];
var start = 0;

setInterval(function() {
	updateImages();
}, 10000);

$('a[rel*=facebox]').facebox({
  loadingImage: 'bower_components/facebox/src/loading.gif',
  closeImage: 'bower_components/facebox/src/closelabel.png'
});

function updateImages() {
	start = (start + 3) % photos.length;
	if (photos[start - 1]) {
	  var new_img1 = photos[start - 1].url;
	  $("#img1").attr("src", new_img1);
  	$("#img_url1").attr("href", new_img1);
	}
	if (photos[start % photos.length]) {
	  var new_img2 = photos[start % photos.length].url;
	  $("#img2").attr("src", new_img2);
  	$("#img_url2").attr("href", new_img2);
  }
  if (photos[(start + 1) % photos.length]) {
	  var new_img3 = photos[(start + 1) % photos.length].url;
    $("#img3").attr("src", new_img3);
	  $("#img_url3").attr("href", new_img3);
	}
}

// var dataRef = new Firebase('https://vpc.firebaseio.com').child('dashboard/venice_photos');
var dataRef = ckconfig.dat_fb.child('venice_photos');
dataRef.on('value', function(dataSnap) {
	Object.keys(dataSnap.val()).forEach(function (key) {
	  var url = dataSnap.val()[key]['url'];
	  if (url) {
	  	photos.push({ url: url });
	  } else {
	  	updateImages();
	  }
	});
	start = Math.floor(Math.random() * photos.length) + 1
});
