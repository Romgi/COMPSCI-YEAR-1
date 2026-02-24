#include <stdio.h>

int x = 10;

void mystery(int x) {
    x += 5;
    printf("inside: %d\n", x);
}

int main(void) {
    mystery(x);
    printf("outside: %d\n", x);
    return 0;
}
