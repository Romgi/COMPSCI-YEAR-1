def f1(x):
    if x == 1:
        print("x is 1")
        print("I'm still in the if statement")
    else:
        print("x is not 1")
    print("Hello")


def f2(x):
    if x == 1:
        return "x is 1"
    return "x is not 1"


def f3(x):
    if x < 1:
        print("x is < 1")
    elif x < 0:
        print("x is negative")
    elif x == 2:
        print("x is 2")
    else:
        print("x is postive but not 1 or 2")
    print("Hello")


def f4(x):
    if x > 0:
        return True
    else:
        return False


def f5(x, y):
    if x > 0:
        if y < 0:
            return x
        else:
            return y
    else:
        return 0


#If puzzle 1
def puzzle1(n: int, m: int)-> int:
    if n > 5 and m > 0:
        return 1
    return 3




#If puzzle 2
def puzzle2(n: int, m: int)-> str:
    if n > 100:
        if m < 50:
            if n < 50:
                if m == 0:
                    if m == 1:
                        return "A"
                    else:
                        if m < 0:
                            return "B"
                else:
                    if n < 0 or n == 10:
                        return "B"
            else:
                return "C"
    return "D"








#If puzzle 3
def puzzle3(x: int, y: int)->str:
    if x > 100 and y > 0:
        if y > 100 and x > 0:
            return "A"
        elif y < 100 or x > 0:
            return "A"
        else:
            return "B"
    elif y <= 0 or x <= 0:
        if x == y:
            return "A"
        if x <= y and x >= y:
            return "B"
        if y < x and x < y:
            return "C"
        else:
            return "A"
    else:
        if 100 >= x or y < 0:
            return "A"
        if x <= 100 and y > 0:
            return "B"
        else:
            return "D"


        
