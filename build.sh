#!/bin/bash
mkdir -p dist
rsync -a --exclude='.git' --exclude='.claude' --exclude='node_modules' --exclude='dist' --exclude='build.sh' . dist/
