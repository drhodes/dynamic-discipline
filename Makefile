bundle: ## webpack bundle
	webpack.js --mode=development

watch:
	npm run watch

test: FORCE ## test
	npm test 

clean: ## clean all the things
	echo implement clean makefile rule

work: ## open all files in editor
	emacs src/* index.html package.json Makefile

# http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk \
	'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

FORCE:
