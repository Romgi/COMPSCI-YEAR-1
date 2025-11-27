from typing import List
import matplotlib.pyplot as plot
import random


def create_random_list(length, max_value):
    L = []
    for _ in range(length):
        L.append(random.randint(0, max_value))
    return L


def selection_sort1(L):
    for i in range(len(L)):
        min_index = find_min_index1(L, i)
        L[i], L[min_index] = L[min_index], L[i]
        


def selection_sort2(L):
    for i in range(len(L)):
        min_index = find_min_index2(L, i)
        L[i], L[min_index] = L[min_index], L[i]


def find_min_index1(L, i):
    """
    Returns the index of the smallest number, starting from index i

    >>> find_min_index([8,2,4,11], 0)
    1
    >>> find_min_index([8,2,4,11], 2)
    2
    """
    min_index = i
    for j in range(i, len(L)):
        if L[j] < L[min_index]:
            min_index = j
    return min_index
    

def find_min_index2(L, i):
    """
    Returns the index of the smallest number, starting from index i

    >>> find_min_index([8,2,4,11], 0)
    1
    >>> find_min_index([8,2,4,11], 2)
    2
    """
    min_value = min(L[i:])
    return i + L[i:].index(min_value) -1


def insert_into(L, i):
    """
    >>> L = [2,3,4,1,5]
    >>> insert_into(L, 3)
    >>> L
    [1,2,3,4,5]
    >>> insert_into([2,4,3,1,5], 2)
    >>> L
    [2,3,4,1,5]
    """
    while i > 0:
        if L[i] < L[i-1]:
            L[i], L[i-1] = L[i-1], L[i]
        else:
            return
        i = i - 1


def insert_into2(L, i):
    value = L[i]
    while value < L[i-1] and i > 0:
        L[i] = L[i-1]
        i = i - 1
    L[i] = value
    

def insertion_sort1(L):
    for i in range(len(L)):
        insert_into(L, i)
        

def insertion_sort2(L):
    for i in range(len(L)):
        insert_into2(L, i)


def bubble_sort1(L):
    for j in range(len(L)):
        for i in range(len(L)-1):
            if L[i] > L[i+1]:
                L[i], L[i+1] = L[i+1], L[i]

def bubble_sort2(L):
    for j in range(len(L)):
        for i in range(len(L)-1-j):
            if L[i] > L[i+1]:
                L[i], L[i+1] = L[i+1], L[i]

def quicksort(L):
    if len(L) <= 1:
        return L
    x = L[0]
    a,b = [],[]
    for num in L[1:]:
        if num < x:
            a.append(num)
        else:
            b.append(num)
    return quicksort(a) + [x] + quicksort(b)




# ========================================================
    
        
def system_sort(L: List[int]) -> None:
    '''Sort the items in L in non-descending order.
    '''
    L.sort()


if __name__ == "__main__":
    from timing import time_listfunc
    bubble1, bubble2 = [], []
    insertion1, insertion2 = [], []
    selection1, selection2 = [], []
    quick, system = [], []
    x = []

    for n in range(100, 4000, 500):
        x.append(n)
        #bubble1.append(time_listfunc(bubble_sort1, n, 1))
        #bubble2.append(time_listfunc(bubble_sort2, n, 1))
        insertion1.append(time_listfunc(insertion_sort1, n, 1))
        insertion2.append(time_listfunc(insertion_sort2, n, 1))
        #selection1.append(time_listfunc(selection_sort1, n, 1))
        #selection2.append(time_listfunc(selection_sort2, n, 1))
        #quick.append(time_listfunc(quicksort, n, 1))
        #system.append(time_listfunc(system_sort, n, 1))
        
    #plot.plot(x, bubble1, label = "bubble1")
    #plot.plot(x, bubble2, label = "bubble2")
    plot.plot(x, insertion1, label = "insertion1")
    plot.plot(x, insertion2, label = "insertion2")
    #plot.plot(x, selection1, label = "selection1")
    #plot.plot(x, selection2, label = "selection2")
    #plot.plot(x, quick, label = "quick")
    #plot.plot(x, system, label = "system")
    plot.legend()
    plot.show()









"""
def bubble_sort(L: List[int]) -> None:
    '''Sort the items in L in non-descending order.
    '''
    
    for iteration in range(len(L)):
        for index in range(len(L) - 1 - iteration):
            if L[index] > L[index + 1]:
                L[index], L[index + 1] = L[index + 1], L[index]
   
def insert(L: List[int], index: int) -> None:
    '''Insert the item at position index in list L into the range [0..index] so
    that [0..index] is in sorted order. [0..index-1] is already sorted.
    '''
    
    while index > 0 and L[index - 1] > L[index]:
        L[index], L[index - 1] = L[index - 1], L[index]
        index -= 1

def insertion_sort(L: List[int]) -> None:
    '''Sort the items in L in non-descending order.
    '''
    for index in range(len(L)):
        insert(L, index)
        
def find_min(L: List[int], index: int) -> int:
    '''Return the index of the smallest number in list L that is at or after
    position index.
    '''
    smallest_index = index
    for i in range(index, len(L)):
        if L[smallest_index] > L[i]:
            smallest_index = i
    return smallest_index
                
def selection_sort(L: List[int]) -> None:
    '''Sort the items in L in non-descending order.
    '''
    for index in range(len(L)):
        swap_index = find_min(L, index)
        L[index], L[swap_index] = L[swap_index], L[index]
"""










