#include <stdio.h>

void counter(void)
{
    static int increment = 0;
    int reset = 0;

    increment++;
    reset++;

    printf("static=%d, local=%d\n", increment, reset);
}

int main(void)
{
    for (int i = 0; i < 4; i++)
    {
        counter();
    }
    return 0;
}
