#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *arr = calloc(4, sizeof(int));

    for (int i = 0; i < 4; i++)
    {
        printf("arr[%d]=%d\n", i, arr[i]);
    }

    arr[0] = 5;
    arr[1] = 15;
    arr[2] = 25;
    arr[3] = 35;

    for (int i = 0; i < 4; i++)
    {
        printf("arr[%d]=%d\n", i, arr[i]);
    }

    free(arr);
    return 0;
}
