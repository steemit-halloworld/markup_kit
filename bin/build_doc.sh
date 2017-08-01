#!/usr/bin/env bash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
mkdir -p "$parent_path"/../doc/md
mkdir -p "$parent_path"/../doc/html

CSS_FILES=("$parent_path"/../modules/markup_kit/css/*.css)

css_markdown_args=()
for f in ${CSS_FILES}; do
  css_markdown_args+=("${f}")
done

css-markdown "${CSS_FILES[@]}" > "$parent_path"/../doc/md/documentation.md
pandoc --template "$parent_path"/../modules/markup_kit/html/pandoc_template.html  --toc --toc-depth 2 --css ../../build/css/style.stage1.css -f markdown_strict -t html --standalone -o "$parent_path"/../doc/html/documentation.html "$parent_path"/../doc/md/documentation.md
