#!/bin/sh

ps ux | grep hexo | grep -v grep |awk '{print $2}' | xargs kill

