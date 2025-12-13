from typing import Dict, List

"""
All functions in this file are intended to be implemented recursively
"""


def my_sum(L: List[int])->int:
    """
    Returns the sum of all the numbers in L.
    """
    if L == []:
        return 0
    return L[0] + my_sum(L[1:])
    


def count(L: List[int], num:int)->int:
    """
    Returns the number of times num appears in L
    """
    if L == []:
        return 0
    if L[0] == num:
        return 1 + count(L[1:], num)
    return count(L[1:], num)


def index_of(L: List[int], num:int)->int:
    """
    Returns the index of the first occurence of num. Assume
    num appears at least once in L.

    >>> index_of([1,2,3], 1)
    0
    >>> index_of([1,2,3], 2)
    1
    >>> index_of([1,2,3,3,1], 3)
    2
    """
    if L[0] == num:
        return 0
    return 1 + index_of(L[1:], num)
    


def remove_first(L: List[int], num:int)-> List[int]:
    """
    Returns a version of L with the first occurence of num removed.
    """
    if L[0] == num:
        return L[1:]
    return [L[0]] + remove_first(L[1:], num)
    


def remove_all(L: List[int], num: int)-> List[int]:
    """
    Returns a version of L with all occurences of num removed.
    """
    if L == []:
        return []
    if L[0] == num:
        return remove_all(L[1:], num)
    return [L[0]] + remove_all(L[1:], num)



def remove_first_k(L: List[int], num: int, k: int)-> List[int]:
    """
    Returns a version of L with the first k occurences of
    num removed.

    >>> L = [1,2,1,2,3,1]
    >>> remove_first_k(L, 1, 2)

    remove_first_k([2,1,2,3,1], 1, 1)
    """
    if L == [] or k == 0:
        return L
    if L[0] == num:
        return remove_first_k(L[1:], num, k-1)
    return [L[0]] + remove_first_k(L[1:], num, k)
    



def sort(L: List[int]) -> List[int]:
    """
    Returns a sorted version of L
    """
    if L == []:
        return []

    m = min(L)
    return [m] + sort(L[1:] if L[0] == m else [L[0]] + L[1:])

    



def hanoi(n, source, spare, target):
    if n == 0:
        return

    # Move n-1 disks to spare
    hanoi(n - 1, source, target, spare)

    # Move the largest disk to target
    print(f"Move disk from {source} to {target}")

    # Move n-1 disks from spare to target
    hanoi(n - 1, spare, source, target)

        

    


    
    
