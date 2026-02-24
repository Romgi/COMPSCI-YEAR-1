#include <stdio.h>

int main()
{
    // For Loop
    for (int i = 1; i <= 10; i++)
    {
        if (i == 5)
        {
            continue;
        }
        printf("%d\n", i);
    }

    printf("\n");

    // While loop
    int i = 1;
    while (i <= 10)
    {
        if (i == 5)
        {
            i++;
            continue;
        }
        printf("%d\n", i);
        i++;
    }

    return 0;
}
