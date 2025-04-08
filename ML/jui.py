import yfinance as yf

# Get data for an Indian stock (e.g., Reliance Industries)
# NSE symbols need `.NS` suffix (BSE symbols use `.BO`)
stock = yf.Ticker("RELIANCE.NS")

# Company Info
# info = stock.info
# print("Company Info:")
# print(info)
print(stock.news)

# # Recent stock price history
# hist = stock.history(period="1mo")
# print("\nPrice History:")
# print(hist)

# # Financials
# print("\nIncome Statement:")
# print(stock.financials)

# print("\nBalance Sheet:")
# print(stock.balance_sheet)

# print("\nCash Flow:")
# print(stock.cashflow)

# # Actions like Dividends and Splits
# print("\nCorporate Actions:")
# print(stock.actions)
