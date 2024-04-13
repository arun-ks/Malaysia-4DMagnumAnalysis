# Extract historical data from https://magnum4d.my/en/winning-history
# The script will get historical results for all numbers. 
# Error Handling
#    Script has inbuilt mechanism to re-run if there is exception, after a 10 second break
#    In case the application aborts anyway, you can call this script with command line parameter of the last successful function call.
#            you can do this with `tail -1 winning_history_4D_Magnum.csv | cut -d, -f1`


import csv
import random
import requests
import sys
import time

# Function to call the API for a given 4-digit number
def call_api_and_write_to_csv(num, writer):
    url = f"https://app-apdapi-prod-southeastasia-01.azurewebsites.net/Winning-History/4D/{num}"
    try:
        response = requests.get(url, timeout=10)  # Set a timeout of 10 seconds
        if response.status_code == 200:
            data = response.json()
            if 'WinningHistory4D' in data:
                for entry in data['WinningHistory4D']['Drawn']:
                    writer.writerow(entry)
                    csvfile.flush()  # Ensure data is written to the file immediately
        else:
            print(f"Failed to fetch data for {num}")
    except Exception as e:
        print(f"An error occurred for {num}: {str(e)}")
        print(f"Retrying after 10 seconds...")
        time.sleep(10)  
        call_api_and_write_to_csv(num, writer)  


# Get last logged 'num' from command-line argument. This can be used if to resume scraping after failure
if len(sys.argv) > 1:
    last_num = int(sys.argv[1])
else:
    last_num = 0

# Write data as CSV Files
fieldnames = ['Number', 'Meaning', 'DrawDate', 'DrawID', 'PrizeType', 'PrizeDesc', 'PrizeDescZh']
with open('winning_history_4D_Magnum.csv', 'a', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
    for num in range(last_num + 1, 10000):
        num_str = str(num).zfill(4)         
        call_api_and_write_to_csv(num_str, writer)        
        # Add random delay (0-3 seconds) if needed
        delay = 0 # random.randint(0, 3)
        print(f"Processed {num_str}. Waiting for {delay} seconds...")
        time.sleep(delay)