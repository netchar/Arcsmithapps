#!/usr/bin/env bash
# Regenerate app/favicon.ico from app/icon.svg.
# Requires one of: rsvg-convert (librsvg), magick (ImageMagick 7),
# convert (ImageMagick 6), or npx svgexport.
# Also requires: png2ico OR ImageMagick to bundle the .ico.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

set -euo pipefail

SRC="app/icon.svg"
OUT="app/favicon.ico"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

rasterize() {
  local size="$1"
  local dest="$2"
  if command -v rsvg-convert >/dev/null 2>&1; then
    rsvg-convert -w "$size" -h "$size" "$SRC" -o "$dest"
  elif command -v magick >/dev/null 2>&1; then
    magick -background none -density 384 "$SRC" -resize "${size}x${size}" "$dest"
  elif command -v convert >/dev/null 2>&1; then
    convert -background none -density 384 "$SRC" -resize "${size}x${size}" "$dest"
  elif command -v npx >/dev/null 2>&1; then
    npx --yes svgexport "$SRC" "$dest" "${size}:${size}"
  else
    echo "Need rsvg-convert, ImageMagick, or npx svgexport to rasterize SVG" >&2
    exit 1
  fi
}

for size in 16 32 48; do
  rasterize "$size" "$TMP/icon-${size}.png"
done

if command -v magick >/dev/null 2>&1; then
  magick "$TMP"/icon-16.png "$TMP"/icon-32.png "$TMP"/icon-48.png "$OUT"
elif command -v convert >/dev/null 2>&1; then
  convert "$TMP"/icon-16.png "$TMP"/icon-32.png "$TMP"/icon-48.png "$OUT"
elif command -v png2ico >/dev/null 2>&1; then
  png2ico "$OUT" "$TMP"/icon-16.png "$TMP"/icon-32.png "$TMP"/icon-48.png
else
  echo "Need ImageMagick or png2ico to bundle .ico" >&2
  exit 1
fi

echo "Wrote $OUT"
