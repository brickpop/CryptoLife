.DEFAULT_GOAL := info
.PHONY: info build test

PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

###############################################################################
## INFO
###############################################################################

info:
	@echo "Available actions:"
	@echo
	@echo "  $$ make         Runs 'make info' by default"
	@echo "  $$ make info    Shows this text"
	@echo "  $$ make init    Install dependencies"
	@echo
	@echo "  $$ make test    Run the test suite on Truffle"
	@echo "  $$ make build   Compile the contracts"
	@echo "  $$ make deploy  Deploy locally"
	@echo "  $$ make clean   Clean all artifacts"
	@echo

###############################################################################
## RECIPES
###############################################################################

init:
	@echo "Installing the Smart Contract dependencies..."
	@if [ -x $(which sudo) ] ;\
	then sudo npm install -g truffle solc ganache-cli ;\
	else npm install -g truffle solc ganache-cli ;\
	fi
	@mkdir -p build
	@cd scripts ; (yarn || npm install)

test:
	truffle test

build: 
	solcjs --bin --abi --optimize -o ./build ./contracts/*.sol

deploy: build
	node scripts/deploy

clean:
	@rm -Rf ./build/*
