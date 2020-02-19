title: Git
---
## 本地仓库建设

1. 选择一个目录作为本地仓库(如/path/git/)
2. 进入目录：cd /path/git/，初始化：git init
3. 克隆远程git仓库到本地
`git clone http://gitlab.xxxxxxxx.cn/xxxxx/data-service-xxxxx.git`
4. 进入项目目录：cd data-service-audience
5. 切换分支：git checkout -b develop，关联本地分支到对应的远程分支：git branch --set-upstream-to=origin/develop develop
6. 拉取最新代码：git pull