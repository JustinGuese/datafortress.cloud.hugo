#!/bin/bash
(cd /home/ubuntu/datafortress.cloud.hugo ; hugo -d "/home/ubuntu/datafortress.cloud.hugo/public")
git -C /home/ubuntu/datafortress.cloud.hugo/public add -A 
git -C /home/ubuntu/datafortress.cloud.hugo/public commit -m "update to the live website"
git -C /home/ubuntu/datafortress.cloud.hugo/public push origin master
git -C /home/ubuntu/datafortress.cloud.hugo add -A
git -C /home/ubuntu/datafortress.cloud.hugo commit -m "auto update to codebase"
git -C /home/ubuntu/datafortress.cloud.hugo push origin master
echo "done"
