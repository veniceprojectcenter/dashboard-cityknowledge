import feedparser
import ssl
# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')



# Ignora gli errori di certificato SSL
ssl._create_default_https_context = ssl._create_unverified_context

# URL del feed RSS
#url = "https://actv.avmspa.it/it/rss-news.xml"
url = "https://www.gazzettino.it/rss/home.xml"

# Parsing del feed RSS
feed = feedparser.parse(url)

# Stampa del titolo del feed
print("Titolo del feed: {}\n".format(feed))

