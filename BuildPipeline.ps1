git pull
hugo --minify
Set-Location -Path "./public"
git add -A
git commit -m "automated build update"
git push -u origin master
Set-Location -Path "../"
git add -A
git commit -m "update to the public folder"