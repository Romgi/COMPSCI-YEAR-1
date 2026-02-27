#include <stdio.h>
#include "LetterGrade.h"

int main(void)
{
    LetterGrade grade = toLetterGrade(95.0f);
    printf("%d\n", grade);
    return 0;
}
