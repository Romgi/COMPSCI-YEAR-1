/*
Jonathan Graydon
COMPSCI 1XC3
Assignment 3
March 29, 2026
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "course.h"
#include "student.h"

/* keep track of how many students and courses we have added */
int numStudents = 0;
int numCourses = 0;

void readInputFrom(char *fileName)
{
  /* open input file for reading */
  FILE *inFile = fopen(fileName, "r");

  /* temporary buffers to store words from file */
  char word1[100];
  char word2[100];
  char word3[100];

  /* keeps track of which student we are currently reading courses for */
  int currentStudent = -1;

  int i, j;

  /* read file word by word */
  while (fscanf(inFile, "%s", word1) == 1)
  {

    /* if line starts with "Student", we are reading a new student */
    if (strcmp(word1, "Student") == 0)
    {

      /* read student id and name */
      fscanf(inFile, "%d %s", &studentIDs[numStudents], word2);

      /* allocate memory and store student name */
      studentNames[numStudents] = malloc(strlen(word2) + 1);
      strcpy(studentNames[numStudents], word2);

      /* allocate space for up to 5 course IDs (initialized to NULL) */
      studentTakesCourses[numStudents] = calloc(6, sizeof(char *));

      /* update current student index */
      currentStudent = numStudents;
      numStudents++;
    }
    else
    {
      /* otherwise, this line is a course */

      /* word1 = course name, next word = course ID */
      strcpy(word2, word1);
      fscanf(inFile, "%s", word3);

      /* add this course to the current student's list */
      for (i = 0; i < 5; i++)
      {
        if (studentTakesCourses[currentStudent][i] == NULL)
        {
          studentTakesCourses[currentStudent][i] = malloc(strlen(word3) + 1);
          strcpy(studentTakesCourses[currentStudent][i], word3);
          break;
        }
      }

      /* check if this course already exists in course arrays */
      j = -1;
      for (i = 0; i < numCourses; i++)
      {
        if (strcmp(courseIDs[i], word3) == 0)
        {
          j = i;
          break;
        }
      }

      /* if course does not exist yet, create a new one */
      if (j == -1)
      {
        courseIDs[numCourses] = malloc(strlen(word3) + 1);
        strcpy(courseIDs[numCourses], word3);

        courseNames[numCourses] = malloc(strlen(word2) + 1);
        strcpy(courseNames[numCourses], word2);

        courseEnrollment[numCourses] = 0;

        /* allocate space for student IDs taking this course */
        courseTakenByStudents[numCourses] = malloc(MAX_STUDENT_NUM * sizeof(int));

        j = numCourses;
        numCourses++;
      }

      /* add current student to this course's student list */
      courseTakenByStudents[j][courseEnrollment[j]] = studentIDs[currentStudent];
      courseEnrollment[j]++;
    }
  }

  fclose(inFile);
}

void writeOutputTo(char *fileName)
{
  /* open output file for writing */
  FILE *outFile = fopen(fileName, "w");

  int i, j, k;

  /* go through each course (in order they appeared) */
  for (i = 0; i < numCourses; i++)
  {

    /* print course info line */
    fprintf(outFile, "Course %s %s %d\n", courseIDs[i], courseNames[i], courseEnrollment[i]);

    /* for each student in this course */
    for (j = 0; j < courseEnrollment[i]; j++)
    {

      /* find that student's name using their ID */
      for (k = 0; k < numStudents; k++)
      {
        if (studentIDs[k] == courseTakenByStudents[i][j])
        {

          /* print student info */
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

  /* free all student-related memory */
  for (i = 0; i < numStudents; i++)
  {
    free(studentNames[i]);

    /* free each course ID string for this student */
    for (j = 0; j < 5; j++)
    {
      if (studentTakesCourses[i][j] != NULL)
      {
        free(studentTakesCourses[i][j]);
      }
    }

    free(studentTakesCourses[i]);
  }

  /* free all course-related memory */
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

  /* allow custom input/output files via command line */
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