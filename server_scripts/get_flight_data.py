import requests
import json
import re
from bs4 import BeautifulSoup
import random
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch_flight_info(flight_url, delay=1):
    """Fetch flight information from a given URL."""
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
        "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36",
    ]

    headers = {
        'User -Agent': random.choice(user_agents)
    }

    time.sleep(delay)  # Introduce a delay before making the request

    flight_response = requests.get(flight_url, headers=headers)
    flight_info = None
    if flight_response.status_code == 200:
        flight_soup = BeautifulSoup(flight_response.content, 'html.parser')
        description_element = flight_soup.find('h4', string=re.compile("description", re.IGNORECASE))
        if description_element:
            h5_element = description_element.find_next('h5', class_='labeled-columns__Value-sc-j3eq63-1 bKkaUj')
            if h5_element:
                flight_info = f"{h5_element.get_text()}"
            else:
                print("No <h5> element found after the 'description' <h4> tag.")
        else:
            print("No 'description' <h4> tag found.")
    elif flight_response.status_code == 429:
        print("Too many requests. Waiting before retrying...")
        time.sleep(random.uniform(30, 60))  # Wait before retrying
        flight_info = fetch_flight_info(flight_url, delay)  # Retry the request
    else:
        print(f"Error: Unable to access {flight_url} (status code: {flight_response.status_code})")

    return flight_info

def create_wikipedia_url(flight_info):
    """Create a Wikipedia URL based on flight information."""
    formatted_info = flight_info.replace(" ", "_")
    return f"https://it.wikipedia.org/wiki/{formatted_info}"

def process_url(url):
    """Process the URL to keep only the part before the second underscore."""
    parts = url.split('_')
    if len(parts) > 2:
        return f"{parts[0]}_{parts[1]}"
    return url  # Return original if not enough parts

def fetch_passenger_capacity(wikipedia_url):
    """Fetch the passenger capacity from the Wikipedia page."""
    response = requests.get(wikipedia_url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        for paragraph in soup.find_all(['p', 'h2', 'h3']):
            text = paragraph.get_text().lower()
            # Look for patterns that indicate passenger capacity
            if 'posti a sedere' in text or 'capacità' in text:
                # Extract all numbers from the text
                numbers = re.findall(r'\d+', text)
                # Convert extracted numbers to integers
                numbers = [int(num) for num in numbers]
                # Filter numbers within the desired range
                filtered_numbers = [num for num in numbers if 50 <= num <= 350]

                if filtered_numbers:
                    # Return the nearest number in the specified range
                    nearest_capacity = min(filtered_numbers, key=lambda x: abs(x - 220))  # Example: looking for the nearest to 220
                    print(f"{wikipedia_url} - Pass: {nearest_capacity}")
                    return nearest_capacity

    return 0  # Return 0 if not found

# Load the JSON file to get the flights_link
json_file_path = r'../app/configs/links.json'  # Adjust the path as needed
with open(json_file_path, 'r') as file:
    config_data = json.load(file)

depflights_link = config_data['depflights_link']

# Send a GET request to the depflights_link
response = requests.get(depflights_link)

# Check if the request was successful
if response.status_code != 200:
    print(f"Error: Unable to access {depflights_link} (status code: {response.status_code})")
else:
    soup = BeautifulSoup(response.content, 'html.parser')
    target_div = soup.find('div', {'id': 'modal'})  # Adjust the selector as needed

    if target_div:
        next_script = target_div.find_next_sibling('script')
        if next_script and '__NEXT_DATA__' in next_script.string:
            json_text = re.search(r'__NEXT_DATA__ = (.*?);', next_script.string, re.DOTALL)
            if json_text:
                extracted_json = json_text.group(1)
                try:
                    flight_data = json.loads(extracted_json)
                    flights = flight_data['props']['initialState']['flightTracker']['route']['flights']
                    full_urls = []

                    for flight in flights:
                        relative_url = flight['url']
                        full_url = f"https://www.flightstats.com/v2{relative_url}"
                        full_urls.append(full_url)

                    flight_info_list = []
                    link_count = {}  # Dictionary to count links
                    with ThreadPoolExecutor(max_workers=10) as executor:
                        future_to_url = {executor.submit(fetch_flight_info, flight_url, delay=2): flight_url for flight_url in full_urls}
                        for future in as_completed(future_to_url):
                            flight_info = future.result()
                            if flight_info:
                                flight_info_list.append(flight_info)
                                # Create and print the Wikipedia URL based on the flight information
                                wikipedia_url = create_wikipedia_url(flight_info)
                                processed_url = process_url(wikipedia_url)  # Process the URL

                                # Count occurrences of each processed Wikipedia link
                                if processed_url in link_count:
                                    link_count[processed_url] += 1
                                else:
                                    link_count[processed_url] = 1

                    # Calculate total passenger capacity
                    total_passengers = 0
                    for link, count in link_count.items():
                        passenger_capacity = fetch_passenger_capacity(link)
                        total_passengers += (passenger_capacity * count)
                    total_passengers *= 0.7
                    total_count = sum(link_count.values())

                    print(f"Total passengers across all flights: {total_passengers}")

                except json.JSONDecodeError as e:
                    print(f"JSON decoding error: {e}")
            else:
                print("No JSON data found in the script tag.")
        else:
            print("No valid <script> tag found after the target <div>.")
    else:
        print("Target <div> not found on the page.")
