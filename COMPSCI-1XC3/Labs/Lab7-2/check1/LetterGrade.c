#include "LetterGrade.h"

LetterGrade toLetterGrade(float score)
{
    if (score >= 80.0f) return A;
    if (score >= 70.0f) return B;
    if (score >= 60.0f) return C;
    if (score >= 50.0f) return D;
    if (score >= 0.0f) return F;
    return Unknown;
}
