#include "a2.h"
#include <stdio.h> 

int main()
{
    unsigned n = 0b11010101;
    unsigned fb = flipBit(n, 3);
    unsigned sb = swapBits(n, 3, 6);
    unsigned r = reverseBits(n); 
    unsigned ones = countOnes(n); 

    for(int y = 1; y < 10; y ++)
        printf("year %d has %d cows\n", y, countCows(y));   
    return 0;
}