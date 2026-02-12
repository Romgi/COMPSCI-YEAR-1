#include <stdio.h>

int main()
{
    int x = 42;

    if (x < 10)
    {
        printf("SMALL\n");
    }
    else if (x < 100)
    {
        printf("MEDIUM\n");
    }
    else
    {
        printf("LARGE\n");
    }

    return 0;
}
