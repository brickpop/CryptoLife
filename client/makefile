.DEFAULT_GOAL := info
.PHONY: info build

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
	@echo "  $$ make dev     Debug locally"
	@echo "  $$ make build   Compile assets"
	@echo "  $$ make run     Run a production version of the project"
	@echo "  $$ make clean   Clean all artifacts"
	@echo

###############################################################################
## RECIPES
###############################################################################

init:
	@if [ -x $(which sudo) ] ;\
	then sudo npm i -g parcel-bundler ;\
	else npm i -g parcel-bundler ;\
	fi
	@make clean
	@yarn || npm install

dev:
	echo "Running on the ropsten blockchain"
	@make clean
	@cp src/lib/quiet* build
	NODE_ENV=development parcel -p 5000 -d ./build src/index.html

build:
	@echo "Cleaning the build folder"
	@make clean
	@echo "Bundling the web site"
	@mkdir -p build
	@cp src/lib/quiet* build
	NODE_ENV=production parcel build -d ./build --log-level 2 --no-source-maps --public-url ./ src/index.html

run: build
	@mkdir -p build
	@cp src/lib/quiet* build
	serve build -p 5000

clean:
	@rm -Rf ./build
	@mkdir -p build
	