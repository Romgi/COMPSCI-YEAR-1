#Cases for variable and method names:
#camelCase - writtenLikeThis
#snake_case - written_like_this
#PascalCase - WrittenLikeThis
#kebab-case - written-like-this (not used in Python)

tax_rate = 0.2

def calc_tax(income):
    return income*tax_rate

calc_tax(10000)

def get_income(tax):
    return tax/tax_rate


def get_amount_owed(tax_paid, income):
    return calc_tax(income) - tax_paid


def f1(x):
    print(x)
    print(x)


def f2(x):
    print(x)
    print(x)
    return x+5


def f3(x):
    return x
    print(x)
    print(x)


def f4(x):
    print(x)
    return x
    print(x)
    return x



def is_even(n):
    return n%2 == 0


def is_odd(n):
    return not is_even(n)

#Returns true if and only if n a multiple of m
def is_multiple_of(n, m):
    #TODO
    return


#Adults eat 3 slices each, children eat 1 slice each, a pizza has 8 slices
#Returns the number of pizzas that must be ordered to feed the group
def pizzas_to_order(adults, children):
    total_slices = adults*3 + children 
    return -(-total_slices//8)


"""
x = 5
def my_fun(y):
    return y + x
#What is >>> my_fun(6)?
#What is >>> my_fun(x)?
#What is >>> y?



"""
"""
y = 5
def my_fun(y):
    y = y + 1
    return y 
#What is >>> my_fun(6)?
#What is >>> y?
"""

"""
y = 5
def my_fun(y):
    x = y
    return x + 2*y 
#What is >>> my_fun(6)?
#What is >>> x?
"""


y = 5
def my_fun(x):
    x = 2*z
    z = x + 1
    return x + z
#What is >>> my_fun(y)?
#What is >>> y


"""
x = 2
def f(x, y):
    z = x + y
    return g(z, x)



def g(y, z):
    return x + y - z
#What is >>> f(1, 2)?
"""


def f(x, y):
    z = x + y
    return g(z, y)

def g(y, z):
    x = 2*z - y
    return h(x - 3, z, y) + h(z, y, y)

def h(x, y, z):
    return x + 3*y - z

#What is >>> f(1, 2)?




# A student is eligible for COOP if their CGPA is at least 6.0,
# they are in year 2 or year 3, and they are in a CS program.
def coop_eligible(cgpa:float, year:int, in_cs:bool) -> bool:
    """
    Given a student's cgpa, year, and whether they are in_cs,
    return True iff the student is eligible for PEY.

    >>> coop_eligible(9,3,True)
    True
    """
    return

