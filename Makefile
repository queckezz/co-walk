
BIN = ./node_modules/.bin/
NODE ?= node

test:
	@$(NODE) $(BIN)mocha \
		--reporter spec \
		--timeout 10s

.PHONY: test