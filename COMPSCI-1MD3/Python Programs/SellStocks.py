from typing import List

def sell_stocks(stock_values: List[int], target_value: int) -> List[int]:
    
    if stock_values == []:
        return []
    
    first = stock_values[0]
    rest = stock_values[1:]

    if target_value <= 0:
        return stock_values
    
    if first > 0:
        return sell_stocks(rest, target_value - first)
    return [first] + sell_stocks(rest, target_value)
