#! /bin/sh
cd $(dirname $0)
git add .
commitMsg=$1
if [[ -z "$commitMsg" ]];then
   commitMsg="updated"
fi
echo $commitMsg
git commit -m "$commitMsg"
git pull
git push origin master
npm run deploy

