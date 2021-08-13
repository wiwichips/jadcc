	.text
	.intel_syntax noprefix
	.file	"test.cc"
	.globl	sum
	.p2align	4, 0x90
	.type	sum,@function
sum:
	lea	eax, [rdi + rsi]
	ret
.Lfunc_end0:
	.size	sum, .Lfunc_end0-sum


	.ident	"clang version 8.0.1 "
	.section	".note.GNU-stack","",@progbits
