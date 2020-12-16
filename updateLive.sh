#!/bin/bash
cd /home/justin/docker/datafortress.cloud.hugo
hugo
cd public
git -C /home/justin/docker/datafortress.cloud.hugo/public add -A 
git -C /home/justin/docker/datafortress.cloud.hugo/public commit -m "update to the live website"
git -C /home/justin/docker/datafortress.cloud.hugo/public push origin master
cd ../
git -C /home/justin/docker/datafortress.cloud.hugo add -A
git -C /home/justin/docker/datafortress.cloud.hugo commit -m "auto update to codebase"
git -C /home/justin/docker/datafortress.cloud.hugo push origin master
echo "done"
