#include <stdio.h>
#include <stdlib.h> 
#include <string.h>

#include "course.h"
#include "student.h"


void readInputFrom(char* fileName)
{
}

void writeOutputTo(char* fileName)
{
}
 
void cleanup()
{
}

int main(int argc, char** argv)
{
  char* inputFile = "studentInfo.txt";
  char* outputFile = "courseInfo.txt";
  if(argc == 3) {
    inputFile = argv[1];
    outputFile = argv[2];
  }
  readInputFrom(inputFile);
  writeOutputTo(outputFile);
  cleanup();
  return 0;
}  

