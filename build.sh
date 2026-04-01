#!/bin/bash
mkdir -p dist
find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name '.claude' \
  ! -name 'node_modules' \
  ! -name 'dist' \
  -exec cp -r {} dist/ \;
