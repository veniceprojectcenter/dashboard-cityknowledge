var articles;
var article_index = 0;

$(function(){
	setInterval(function() {
		switchNewsArticle();
	}, 10000);
});

function switchNewsArticle() {
	if (articles === undefined)
		return;
	var cur_article = articles[article_index];

	$('#article_title').text(cur_article.title);
	$('#article_title').attr("href", cur_article.link);
	$('#article_img').attr("src", cur_article.image);

	if (++article_index > articles.length - 1)
		article_index = 0;
}

// var dataRef = new Firebase('https://vpc.firebaseio.com').child('dashboard/news_articles');
var dataRef = ckconfig.dat_fb.child('news_articles');
dataRef.on('value', function(dataSnap) {
	var news_articles = JSON.parse(dataSnap.val());
	if (articles === undefined) {
		articles = news_articles;
		switchNewsArticle();
	} else {
		articles = news_articles;
	}
});