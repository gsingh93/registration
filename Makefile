SHELL := /bin/bash

OUT_DIR := public

RELEASE ?= 0
ifeq ($(RELEASE), 1)
	JADE_FLAGS := --no-debug
	LINT_FLAGS := --quiet
else
	JADE_FLAGS := --pretty
	LINT_FLAGS := --quiet --ignore=compatible-vendor-prefixes,box-model,gradients
endif

OUT_FILES := index.html style.css loading.gif main.js assert.js sprintf.js

all: $(OUT_DIR) $(OUT_FILES:%=$(OUT_DIR)/%)

$(OUT_DIR):
	mkdir -p $(OUT_DIR)

$(OUT_DIR)/loading.gif: images/loading.gif
	cp $< $(OUT_DIR)

$(OUT_DIR)/%.html: jade/%.jade jade/mixins.jade jade/date.jade jade/state.jade
	jade $(JADE_FLAGS) $< -o $(OUT_DIR)

$(OUT_DIR)/assert.js: bower_components/assert/assert.js
	cp $< $@

$(OUT_DIR)/sprintf.js: bower_components/sprintf/dist/sprintf.min.js
	cp $< $@

$(OUT_DIR)/%.js: script/%.ts
	tsc $< --out $@

$(OUT_DIR)/style.css: css/*
	lessc css/style.less $@
	csslint $(LINT_FLAGS) <(sed -e '1,/CSS START/d' $@)
ifeq ($(RELEASE), 1)
	cleancss --s0 $@ -o $@
endif

clean:
	rm -rf public
