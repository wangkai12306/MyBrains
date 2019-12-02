#! /bin/sh

cd `dirname $0`

ps ux | grep hexo | grep -v grep |awk '{print $2}' | xargs kill
nohup hexo g -w > compile.log 2>&1 &
nohup hexo server > server.log 2>&1 &
