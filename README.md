# Statistical Analysis of 4D Magnum

## What is 4-D Betting
[4-Digits](https://en.wikipedia.org/wiki/4-Digits) is a very popular type of lottery played in Singapore, and Malaysia, which allows punters to choose any number from 0000 to 9999. 

Then, a draw is conducted to pick 23 winning numbers split into 4 categories - 1st, 2nd, 3rd, Consolation & Special prize. The payout happens based on the category of prizes.

## What is in this repo
This has a statistical Analysis of distribution of results of a 1 specific Malaysian online 4D bettting site [4D Magnum](https://magnum4d.my/en/).


### Extracting Historical Data of 4D Winning Numbers 
This includes a script [ExtractMagum4DHistoryWithRetry.py](ExtractMagum4DHistoryWithRetry.py) to extract historical data extracted from [its website](https://magnum4d.my/en/winning-history) .

> [!WARNING]
> Do not use the script to scrape. The APIs have limits on how many calls it can take.
> The script will sleep & try again if the timeouts happen, thus instead of loading the system, please use the included raw data taken on 14-Apr-2024

### Basic Statistical Analysis
The analysis is restricted to checking if there are any outliners numbers which get picked often or if there is any preference for any subset of numbers.

### Analysis of Magnum-Life
The probability of winning in [Magnum life game](https://magnum4d.my/en/magnum-life) is not very intuitive. Thus a python program can help.

