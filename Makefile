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

OUT_FILES := index.html style.css loading.gif

all: $(OUT_DIR) $(OUT_FILES:%=$(OUT_DIR)/%)

$(OUT_DIR):
	mkdir -p $(OUT_DIR)

$(OUT_DIR)/loading.gif: images/loading.gif
	cp $< $(OUT_DIR)

$(OUT_DIR)/%.html: jade/%.jade jade/mixins.jade
	jade $(JADE_FLAGS) $< -o $(OUT_DIR)

$(OUT_DIR)/style.css: css/*
	lessc css/style.less $@
	csslint $(LINT_FLAGS) <(sed -e '1,/CSS START/d' $@)
ifeq ($(RELEASE), 1)
	cleancss --s0 $@ -o $@
endif

clean:
	rm -rf public
