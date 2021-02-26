#!/bin/bash
(cd /home/dflucy/docker/datafortress.cloud.hugo ; hugo -d "/home/dflucy/docker/datafortress.cloud.hugo/public")
git -C /home/dflucy/docker/datafortress.cloud.hugo/public add -A 
git -C /home/dflucy/docker/datafortress.cloud.hugo/public commit -m "update to the live website"
git -C /home/dflucy/docker/datafortress.cloud.hugo/public push origin master
git -C /home/dflucy/docker/datafortress.cloud.hugo add -A
git -C /home/dflucy/docker/datafortress.cloud.hugo commit -m "auto update to codebase"
git -C /home/dflucy/docker/datafortress.cloud.hugo push origin master
echo "done"
