#!/bin/bash
rm -rf docs/*
rm -rf docs/.*
hugo -d docs --gc --minify