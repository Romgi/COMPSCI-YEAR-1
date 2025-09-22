def is_valid_number(num: str) -> bool:
    """
    Returns True if and only if num is represents a valid number.
    See the corresponding .pdf for a definition of what a valid number
    would be.

    >>> is_valid_number("10")
    True
    >>> is_valid_number("-124")
    True
    >>> is_valid_number("12.9")
    True
    >>> is_valid_number("12.9.0")
    False
    >>> is_valid_number("abc")
    False
    """
    #TODO
    return


def is_valid_term(term: str) -> bool:
    """
    Returns True if and only if num is represents a valid term.
    See the corresponding .pdf for a definition of a valid term.

    >>> is_valid_term("44.4x^6")
    True
    >>> is_valid_term("-7x")
    True
    >>> is_valid_term("9.9")
    True
    >>> is_valid_term("7y**8")
    False
    >>> is_valid_term("7x^8.8")
    False
    >>> is_valid_term("7*x^8.8")
    False
    >>> is_valid_term("7x^ 8.8")
    False
    """
    #TODO
    return

    
def approx_equal(x: float, y: float, tol: float) -> bool:
    """
    Returns True if and only if x and y are within tol of each other.

    >>> approx_equal(5, 4, 1)
    True
    >>> approx_equal(5, 3, 1)
    False
    >>> approx_equal(0.999, 1, 0.0011)
    True
    >>> approx_equal(0.999, 1, 0.0001)
    False
    """
    #TODO
    return


def degree_of(term: str) -> int:
    """
    Returns the degree of term, it is assumed that term is a valid term.
    See the corresponding .pdf for a definition of a valid term.

    >>> degree_of("55x^6")
    6
    >>> degree_of("-1.5x")
    1
    >>> degree_of("252.192")
    0
    """
    #TODO
    return


def get_coefficient(term: str) -> float:
    """
    Returns the coefficient of term, it is assumed that term is a valid term.
    See the corresponding .pdf for a definition of a valid term.

    >>> get_coefficient("55x^6")
    55
    >>> get_coefficient("-1.5x")
    -1.5
    >>> get_coefficient("252.192")
    252.192
    """
    #TODO
    return



#Do not worry about the code past this point. 
#********************************************

def derive(poly):
    derivative = []
    degree = 1
    for coefficient in poly[1:]:
        derivative.append(coefficient*degree)
        degree += 1
    return derivative

def get_coefficients(terms):
    poly = []
    degree = 0
    for term in terms:
        while degree != degree_of(term):
            poly.append(0)
            degree += 1
        poly.append(get_coefficient(term))
        degree +=1
    return poly

def evaluate(poly, x):
    value = 0
    degree = 0
    for coefficient in poly:
        degree += 1
        value += coefficient * x**degree
    return value
        

if __name__ == "__main__":
    poly_string = input("Please enter a polynomial: ")
    terms = poly_string.strip().split("+")

    valid_poly = True
    for term in terms:
        if not is_valid_term(term):
            valid_poly = False

    while not valid_poly:
        poly_string = input("Incorrect format. Please enter a polynomial: ")
        terms = poly_string.strip().split("+")

        valid_poly = True
        for term in terms:
            if not is_valid_term(term):
                valid_poly = False
            
    poly = get_coefficients(terms)
    derivative = derive(poly)
    current_value = float(input("Please enter a starting point: "))
    tol = float(input("Please enter a tolerance: "))
    
    next_value = current_value - (evaluate(poly, current_value)/evaluate(derivative, current_value))
    while not(approx_equal(current_value, next_value, tol)):
        current_value = next_value
        next_value = current_value - (evaluate(poly, current_value)/evaluate(derivative, current_value))
    print("The polynoimal has a 'zero' approximately at: " + str(next_value))
    
