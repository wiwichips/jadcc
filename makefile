CC=clang

main.o: ./test/main.c
	${CC} ./test/main.c -o ./build/main.o -c

assemble:
	${CC} -c ./build/*.S
	mv *.o ./build/.

link: main.o assemble
	${CC} -o exe ./build/*.o

all: link

clean:
	rm ./build/*.o
	rm exe

