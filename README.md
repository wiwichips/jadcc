# Just Another Distributed C/C++ Compiler

## How to pronounce jadcc
"jadch"

## What is jadcc
* A rushed proof of concept
* WASM binary of the Clang compiler
* WASM binary of an in memory file system
* Deployed using the Distributed Compute Protocol

## Credit
* This work is a continuation (and fork) of https://github.com/binji/wasm-clang

## Current Issues
* This depends on a unique DCP setup that has to be mandated across all workers compiling code
  * Therefore, this code does not work on production DCP as it expects each worker to have a copy of the CLANG compiler as a WASM binary
* There are no optimizations here
* This only compiles libraries that do not source other c code
  * This will be the focus of future work on this project

