.DEFAULT_GOAL := info
.PHONY: info build clean

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
	@echo
	@echo "  $$ make init    Install dependencies"
	@echo "  $$ make dev     Debug locally"
	@echo "  $$ make build   Compile assets"
	@echo "  $$ make run     Serve a production build"
	@echo

###############################################################################
## RECIPES
###############################################################################

init:
	@if [ -x $(which sudo) ] ;\
	then sudo npm i -g parcel-bundler ;\
	else npm i -g parcel-bundler ;\
	fi
	@mkdir -p build
	@yarn || npm i

build:
	@echo "Cleaning the build folder"
	@make clean
	@echo "Bundling the web site"
	@cp src/lib/quiet* build
	NODE_ENV=production parcel build -d ./build --log-level 2 --no-source-maps --public-url ./ src/index.html

run: build
	serve ./build -p 6000

dev:
	@echo "Running..."
	@mkdir -p build
	@cp src/lib/quiet* build
	NODE_ENV=development parcel -d ./build -p 6000 src/index.html

clean:
	@rm -Rf ./build
	@mkdir -p ./build