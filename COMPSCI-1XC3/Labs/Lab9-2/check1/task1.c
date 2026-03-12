#include <stdio.h>

int main(void) {
    int x = 25;
    int *ptr = &x;

    printf("x = %d\n", x);
    printf("address of x = %p\n", (void *)&x);
    printf("value via pointer = %d\n", *ptr);

    return 0;
}
