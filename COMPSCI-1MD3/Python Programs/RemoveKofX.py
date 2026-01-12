from typing import List


    # Removes the first k occurrences of x from L by mutating L.

    # >>> L = [1, 2, 1, 2, 3, 1]
    # >>> remove_first_k(L, 1, 2)
    # [2, 2, 3, 1]
    # >>> L
    # [2, 2, 3, 1]


#----------My solution----------#
def remove_first_k(L: List[int], num: int, k: int)-> List[int]:

    if L == [] or k == 0:
        return L
    
    if L[0] == num:
        return remove_first_k(L[1:], num, k-1)
    return [L[0]] + remove_first_k(L[1:], num, k)



#----------Diddyblud's solution----------#
def remove_first_k2(L: List[int], x: int, k: int) -> List[int]:
    if x in L:
        if k > 0:
            L.pop(L.index(x))
            return remove_first_k(L, x, k - 1)
    return L
