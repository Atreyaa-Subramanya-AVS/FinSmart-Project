import yfinance as yf
from datetime import datetime

ticker = yf.Ticker("SBIN.NS")

news_items = ticker.news
print(news_items)

# Check if news exists and has expected keys

# Assuming your data is stored in a variable called `data`
# For example: data = [...]  # your big JSON array

for item in news_items:
    content = item.get('content', {})
    title = content.get('title', 'N/A')
    summary = content.get('summary', 'N/A')
    pub_date = content.get('pubDate', 'N/A')
    link = content.get('clickThroughUrl', {}).get('url', 'N/A')

    print("Title:", title)
    print("\nSummary:", summary)
    print("\nPublished:", pub_date)
    print("\nLink:", link)
    print("───────────────────────────────")
