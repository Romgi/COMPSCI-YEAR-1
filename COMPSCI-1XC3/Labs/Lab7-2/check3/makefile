all: myExe

myExe: main.o LetterGrade.o
	gcc main.o LetterGrade.o -o myExe

main.o: main.c LetterGrade.h
	gcc -c main.c

LetterGrade.o: LetterGrade.c LetterGrade.h
	gcc -c LetterGrade.c

clean:
	rm -f *.o myExe myExe.exe
