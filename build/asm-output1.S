	.text
	.intel_syntax noprefix
	.file	"test.cc"
	.globl	subtract
	.p2align	4, 0x90
	.type	subtract,@function
subtract:
	mov	eax, edi
	sub	eax, esi
	ret
.Lfunc_end0:
	.size	subtract, .Lfunc_end0-subtract


	.ident	"clang version 8.0.1 "
	.section	".note.GNU-stack","",@progbits
