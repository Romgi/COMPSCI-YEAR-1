#include <stdio.h>

int main()
{
    int i;
    int runs = 0;

    for (i = 0; i <= 5; i++)
    {
        printf("%d\n", i);
        runs++;
    }

    printf("Loop runs: %d times\n", runs);
    printf("Final i after loop: %d\n", i);

    return 0;
}
