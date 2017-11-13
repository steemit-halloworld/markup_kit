#!/usr/bin/env bash
array_lookup()
{
  local arrayname=${1:?} string=${2:?} val var=${3:-index}
  eval "array=( \"\${$arrayname[@]}\" )"
  case ${array[*]} in
    *"$string"*)
          for val in "${!array[@]}"
          do
            case ${array[val]} in
              *"$string"*)
                     eval "$var=\$val"
                     ;;
            esac
          done
          ;;
  esac
}

array_remove()
{
  local arrayname=${1:?Arrayname required} num=${2:-1}
  local array
  [ $num -lt 0 ] && num=0 #? Or should this return an error???
  unset $arrayname[num]
  eval "$arrayname=( \"\${$arrayname[@]}\" )"
}

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
mkdir -p "$parent_path"/../doc/md
mkdir -p "$parent_path"/../doc/html

CSS_FILES=("$parent_path"/../modules/markup_kit/css/*.css)

for e in "${EXCLUDES[@]}"; do
  i=
  array_lookup CSS_FILES ${e} i
  array_remove CSS_FILES ${i}
done

css-markdown "$parent_path"/../modules/markup_kit/css/amalgamation.css > "$parent_path"/../doc/md/documentation.md
pandoc --template "$parent_path"/../modules/markup_kit/html/pandoc_template.html  --toc --toc-depth 1 --css ./../../modules/markup_kit/css/minification.css -f markdown-markdown_in_html_blocks+raw_html-native_divs -t html --standalone -o "$parent_path"/../doc/html/documentation.html "$parent_path"/../doc/md/documentation.md
