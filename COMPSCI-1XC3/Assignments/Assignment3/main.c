#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "course.h"
#include "student.h"

int numStudents = 0;
int numCourses = 0;

void readInputFrom(char *fileName)
{
  FILE *inFile = fopen(fileName, "r");
  char word1[100];
  char word2[100];
  char word3[100];
  int currentStudent = -1;
  int i, j;

  while (fscanf(inFile, "%s", word1) == 1)
  {

    if (strcmp(word1, "Student") == 0)
    {
      fscanf(inFile, "%d %s", &studentIDs[numStudents], word2);

      studentNames[numStudents] = malloc(strlen(word2) + 1);
      strcpy(studentNames[numStudents], word2);

      studentTakesCourses[numStudents] = calloc(6, sizeof(char *));

      currentStudent = numStudents;
      numStudents++;
    }
    else
    {
      strcpy(word2, word1);
      fscanf(inFile, "%s", word3);

      for (i = 0; i < 5; i++)
      {
        if (studentTakesCourses[currentStudent][i] == NULL)
        {
          studentTakesCourses[currentStudent][i] = malloc(strlen(word3) + 1);
          strcpy(studentTakesCourses[currentStudent][i], word3);
          break;
        }
      }

      j = -1;
      for (i = 0; i < numCourses; i++)
      {
        if (strcmp(courseIDs[i], word3) == 0)
        {
          j = i;
          break;
        }
      }

      if (j == -1)
      {
        courseIDs[numCourses] = malloc(strlen(word3) + 1);
        strcpy(courseIDs[numCourses], word3);

        courseNames[numCourses] = malloc(strlen(word2) + 1);
        strcpy(courseNames[numCourses], word2);

        courseEnrollment[numCourses] = 0;
        courseTakenByStudents[numCourses] = malloc(MAX_STUDENT_NUM * sizeof(int));

        j = numCourses;
        numCourses++;
      }

      courseTakenByStudents[j][courseEnrollment[j]] = studentIDs[currentStudent];
      courseEnrollment[j]++;
    }
  }

  fclose(inFile);
}

void writeOutputTo(char *fileName)
{
  FILE *outFile = fopen(fileName, "w");
  int i, j, k;

  for (i = 0; i < numCourses; i++)
  {
    fprintf(outFile, "Course %s %s %d\n", courseIDs[i], courseNames[i], courseEnrollment[i]);

    for (j = 0; j < courseEnrollment[i]; j++)
    {
      for (k = 0; k < numStudents; k++)
      {
        if (studentIDs[k] == courseTakenByStudents[i][j])
        {
          fprintf(outFile, "%d %s\n", studentIDs[k], studentNames[k]);
          break;
        }
      }
    }
  }

  fclose(outFile);
}

void cleanup()
{
  int i, j;

  for (i = 0; i < numStudents; i++)
  {
    free(studentNames[i]);

    for (j = 0; j < 5; j++)
    {
      if (studentTakesCourses[i][j] != NULL)
      {
        free(studentTakesCourses[i][j]);
      }
    }

    free(studentTakesCourses[i]);
  }

  for (i = 0; i < numCourses; i++)
  {
    free(courseIDs[i]);
    free(courseNames[i]);
    free(courseTakenByStudents[i]);
  }
}

int main(int argc, char **argv)
{
  char *inputFile = "studentInfo.txt";
  char *outputFile = "courseInfo.txt";
  if (argc == 3)
  {
    inputFile = argv[1];
    outputFile = argv[2];
  }
  readInputFrom(inputFile);
  writeOutputTo(outputFile);
  cleanup();
  return 0;
}