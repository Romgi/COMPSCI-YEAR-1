#include <stdio.h>

#define MAX(A, B) ((A) > (B) ? (A) : (B))
#define SQ(x) x *x

int main(void)
{
    int i = 0, j = 1;

    printf("%d\n", MAX(i, j));
    // Prediction: 1
    // Result: 1

    int maxinc = MAX(++i, ++j);
    printf("%d\n", maxinc);
    // Prediction: 2
    // Result: 3

    printf("%d\n", SQ(3));
    // Prediction: 9
    // Result: 9

    printf("%d\n", SQ(2 + 1));
    // Prediction: 9
    // Result: 5

    return 0;
}
