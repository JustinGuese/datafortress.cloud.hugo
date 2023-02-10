#!/bin/bash
#
find . -name '*.png' -type f -exec bash -c 'cwebp -q 80 "$0" -o "${0%.png}.webp"' {} \;
#
find . -name '*.jpg' -type f -exec bash -c 'cwebp -q 80 "$0" -o "${0%.jpg}.webp"' {} \;