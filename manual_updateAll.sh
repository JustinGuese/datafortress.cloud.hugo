#!/bin/bash
hugo
cd public
git add -A
git commit -m "auto update pipeline"
git push origin master
cd ../
git add -A
git commit -m "pipeline update"
git push origin master
