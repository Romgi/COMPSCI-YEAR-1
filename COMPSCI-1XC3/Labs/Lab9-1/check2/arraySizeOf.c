#include <stdio.h>

int main()
{
    int data[] = {4, 8, 15, 16, 23, 42};
    for (int i = 0; i < sizeof(data) / sizeof(data[0]); i++)
    {
        printf("%d ", data[i]);
    }
    return 0;
}