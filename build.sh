#!/bin/bash
set -e

rm -rf dist
mkdir -p dist

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name '.claude' \
  ! -name '.gitignore' \
  ! -name '.assetsignore' \
  ! -name 'node_modules' \
  ! -name 'dist' \
  ! -name 'build.sh' \
  ! -name 'wrangler.toml' \
  ! -name 'package.json' \
  ! -name 'package-lock.json' \
  ! -name '*.bak' \
  ! -name '*.log' \
  -exec cp -r {} dist/ \;

echo "Build OK. Contents of dist:"
ls dist
