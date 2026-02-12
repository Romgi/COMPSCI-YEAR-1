#include <stdio.h>
#include <limits.h>

/* Constant using #define */
#define STUDENT_ID 400638260

int main() {

    /* Constant using const */
    const int CURRENT_YEAR = 2026;

    printf("===== Task 3 Output =====\n\n");

    /* Print constants */
    printf("Student ID: %d\n", STUDENT_ID);
    printf("Current Year: %d\n\n", CURRENT_YEAR);

    /* Print type sizes */
    printf("Sizes in bytes:\n");
    printf("char:   %lu bytes\n", sizeof(char));
    printf("int:    %lu bytes\n", sizeof(int));
    printf("float:  %lu bytes\n", sizeof(float));
    printf("double: %lu bytes\n\n", sizeof(double));

    /* Print type ranges */
    printf("Type ranges:\n");
    printf("int:   [%d, %d]\n", INT_MIN, INT_MAX);
    printf("char:  [%d, %d]\n", CHAR_MIN, CHAR_MAX);
    printf("short: [%d, %d]\n\n", SHRT_MIN, SHRT_MAX);

    /* Check if student ID fits in a short */
    printf("Short max value: %d\n", SHRT_MAX);

    if (STUDENT_ID <= SHRT_MAX) {
        printf("Your student ID fits in a short.\n");
    } else {
        printf("Your student ID does NOT fit in a short.\n");
    }

    return 0;
}
