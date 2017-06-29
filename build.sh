#!/usr/bin/env bash
# postcss translation in two stages is required because the following bug:
# multiple @apply rules are not compatible with postcss-import plugin
mkdir -p build/css
postcss -c postcss/stage1 modules/css/include.css | postcss -c postcss/stage2 -o build/css/include.min.css
