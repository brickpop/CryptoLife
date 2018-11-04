.DEFAULT_GOAL := info
.PHONY: info init

PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

###############################################################################
## INFO
###############################################################################

info:
	@echo "Available actions:"
	@echo
	@echo "  $$ make         Runs 'make info' by default"
	@echo "  $$ make info    Shows this help message"
	@echo
	@echo "  $$ make init    Install all dependencies"
	@echo "  $$ make all     Build all components"
	@echo "  $$ make clean   Clean all artifacts"
	@echo

###############################################################################
## RECIPES
###############################################################################

init:
	@cd blockchain ; make init
	@cd client ; make init
	@cd door-server ; make init
	@cd door-simulator ; make init

all: 
	@cd blockchain ; make build
	@cd client ; make build
	@cd door-simulator ; make build

clean:
	@cd blockchain ; make clean
	@cd client ; make clean
	@cd door-simulator ; make clean
