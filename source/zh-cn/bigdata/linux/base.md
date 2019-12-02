title: Linux基础
---

## 各目录详解
1. /bin  二进制可执行命令
2. /dev  设备特殊文件  
3. /etc  系统管理和配置文件 
4. /etc/rc.d   启动的配置文件和脚本
5. /home 用户主目录的基点，比如用户user的主目录就是/home/user，可以用~user表示
6. /lib          标准程序设计库，又叫动态链接共享库，作用类似windows里的.dll文件
7. /sbin 超级管理命令，这里存放的是系统管理员使用的管理程序
8. /tmp  公共的临时文件存储点
9. /root 系统管理员的主目录
10. /mnt  系统提供这个目录是让用户临时挂载其他的文件系统
11. /lost+found 这个目录平时是空的，系统非正常关机而留下“无家可归”的文件（windows下叫什么.chk）就在这里
12. /proc 虚拟的目录，是系统内存的映射。可直接访问这个目录来获取系统信息。
13. /var  某些大文件的溢出区，比方说各种服务的日志文件
14. /usr  最庞大的目录，要用到的应用程序和文件几乎都在这个目录，其中包含：
  - ./x11R6  存放x window  的目录
  - ./bin  众多的应用程序 
  - ./sbin 超级用户的一些管理程序
  - ./doc  linux文档 
  - ./include linux下开发和编译应用程序所需要的头文件
  - ./lib    常用的动态链接库和软件包的配置文件
  - ./man  帮助文档  
  - ./src  源代码，linux内核的源代码就放在/usr/src/linux里
  - ./local/bin  本地增加的命令
  - ./local/lib  本地增加的库根文件系统