#include "a2.h"

int countCows(int year)
{
    if (year <= 0) {
        return 0;
    }

    if (year <= 3) {
        return 1;
    }

    int cows_three_years_ago = 1;
    int cows_two_years_ago = 1;
    int cows_last_year = 1;

    for (int current_year = 4; current_year <= year; current_year++) {
        int current_cows = cows_last_year + cows_three_years_ago;
        cows_three_years_ago = cows_two_years_ago;
        cows_two_years_ago = cows_last_year;
        cows_last_year = current_cows;
    }

    return cows_last_year;
}
