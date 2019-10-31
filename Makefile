SHELL = /bin/bash
PLUGIN_FOLDER = ${HOME}/.kube/plugins/ag

.PHONY: clean
clean:
	@rm -rf lib/*

.PHONY: install-deps
install-deps:
	@npm install

.PHONY: build
build: install-deps
	@npm run build

.PHONY: test
test: build
	@npm run test

.PHONY: install
install: build test
	npm install -g
	@mkdir -p ${PLUGIN_FOLDER}
	@cp extras/plugin.yaml ${PLUGIN_FOLDER}/plugin.yaml

.PHONY: uninstall
uninstall:
	@npm uninstall -g
	@rm -rf ${PLUGIN_FOLDER}