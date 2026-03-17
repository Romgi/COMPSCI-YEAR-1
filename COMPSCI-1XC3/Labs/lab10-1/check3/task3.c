#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *p1 = malloc(3 * sizeof(int));
    int *p2 = calloc(3, sizeof(int));

    printf("%d %d %d\n", p1[0], p1[1], p1[2]);
    printf("%d %d %d\n", p2[0], p2[1], p2[2]);

    free(p1);
    free(p2);
    return 0;
}
