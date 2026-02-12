#include <stdio.h>

int main() {

    int fahrenheit = 68;

    /* Convert to Celsius using float math */
    float celsius = (fahrenheit - 32) * (5.0 / 9.0);

    printf("Temperature in Fahrenheit: %d°F\n", fahrenheit);
    printf("Temperature in Celsius: %.2f°C\n", celsius);

    return 0;
}
