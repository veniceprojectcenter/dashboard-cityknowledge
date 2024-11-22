import json
import feedparser
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from datetime import datetime

def read_config(config_file_path):
    """Reads configuration from a JSON file.

    Args:
        config_file_path (str): Path to the configuration file.

    Returns:
        dict: A dictionary containing configuration values.
    """
    try:
        with open(config_file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print('Configuration file not found.')
        return {}

def initialize_firebase(config):
    """Initializes the Firebase app using the provided configuration.

    Args:
        config (dict): The configuration dictionary containing Firebase details.

    Returns:
        db.Reference: A reference to the Firebase database root.
    """
    try:
        cred = credentials.Certificate(config['apikey_path'])
        firebase_admin.initialize_app(cred, {
            'databaseURL': config['db_url']
        })
        return db.reference('/')
    except Exception as e:
        print("Error initializing Firebase: {}".format(e))
        return None

def extract_rss(config):
    """Extracts news articles from an RSS feed.

    Args:
        config (dict): The configuration dictionary containing RSS feed link.

    Returns:
        dict: A dictionary containing articles and today's date.
    """
    try:
        # Parse the RSS feed
        feed = feedparser.parse(config['actvnews_link'])

        # Print the feed title
        print("Feed Title: {}\n".format(feed))

        # Extract articles
        articles = []
        for entry in feed.entries:
            articles.append({
                'title': entry.title,
                'link': entry.link,
                'published': entry.published,
                'summary': entry.summary
            })

        return {
            'date': str(datetime.now().date()),
            'articles': articles
        }
    except Exception as e:
        print("An error occurred: {}".format(e))
        return {}

# Read configuration from file
config_file_path = "../app/configs/links.json"
config = read_config(config_file_path)

# Initialize Firebase
db_ref = initialize_firebase(config)

# Extract news and save to Firebase
extracted_news = extract_rss(config)
if extracted_news:
    db_ref.child('actvnews_data').push(extracted_news)
    print("News successfully saved to Firebase.")
else:
    print("No news found in the provided RSS feed.")
