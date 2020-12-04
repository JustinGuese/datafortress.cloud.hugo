#!/bin/bash
hugo
git add -A
git commit -m "auto update to codebase"
git push origin master
echo "done"
cd public
git add -A 
git commit -m "update to the live website"
git push origin master

