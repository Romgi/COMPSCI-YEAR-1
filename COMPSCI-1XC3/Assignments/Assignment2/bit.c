#include "a2.h"

/* Given n, flip the ith bit from the right and return the result. */
unsigned flipBit(unsigned n, unsigned i)
{
    unsigned width = (unsigned)(sizeof(unsigned) * 8u);
    if (i >= width)
    {
        return n;
    }

    return n ^ (1u << i);
}

/* Given n, swap the ith bit and jth bit from the right and return the result. */
unsigned swapBits(unsigned n, unsigned i, unsigned j)
{
    unsigned width = (unsigned)(sizeof(unsigned) * 8u);
    if (i >= width || j >= width || i == j)
    {
        return n;
    }

    unsigned ith_bit = (n >> i) & 1u;
    unsigned jth_bit = (n >> j) & 1u;

    /* If bits are different, flipping both positions swaps them. */
    if (ith_bit != jth_bit)
    {
        n ^= (1u << i) | (1u << j);
    }

    return n;
}

/* Given n, reverse all bits and return the result. */
unsigned reverseBits(unsigned n)
{
    unsigned width = (unsigned)(sizeof(unsigned) * 8u);
    unsigned reversed = 0;

    /* Build reversed by taking the rightmost bit of n each iteration. */
    for (unsigned k = 0; k < width; k++)
    {
        reversed <<= 1;
        reversed |= (n & 1u);
        n >>= 1;
    }

    return reversed;
}

/* Given n, count how many bits are 1 and return that count. */
unsigned countOnes(unsigned n)
{
    unsigned count = 0;

    /* Check each bit from right to left using a while loop. */
    while (n != 0)
    {
        count += (n & 1u);
        n >>= 1;
    }

    return count;
}
