git pull
hugo
Set-Location -Path "./public"
git add -A
git commit -m "automated build update"
git push -u origin master
Set-Location -Path "../"