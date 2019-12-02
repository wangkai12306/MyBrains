title: 集群搭建
---

## cluster完全分布式

#### 环境配置
1. 配置IP
  ```
  vi /etc/sysconfig/network-scripts/ifcfg-eth0
    ONBOOT=yes
    BOOTPROTO=static
    IPADDR=192.168.1.200
    NETMASK=255.255.255.0
    GATEWAY=192.168.1.2
    DNS1=114.114.114.114
  rm -rf /etc/udev/rules.d/70-persistent-net.rules
  ```
2. 关闭防火墙（临时：service iptables stop，永久：chkconfig iptables off）
3. 关闭selinux（/etc/sysconfig/selinux  SELINUX=disabled）
4. 修改hostname（/etc/sysconfig/network  HOSTNAME=xxxxxxx）
5. IP和hostname的映射关系（/etc/hosts  [ip hostname]）
6. 重启机器（shutdown -r now）
7. ssh免密码登陆（ssh-keygen -t rsa，ssh-copy-id ip）
8. 配置jdk
   ```
   vi /etc/profile  
     export JAVA_HOME = jdk的path
     export PATH = $PATH:$JAVA_HOME/bin
   source /etc/profile
   ```

#### cluster安装
  1. 根据官方文档配置core-site.xml, hdfs-site.xml, mapred-site.xml, yarn-site.xml, slaves(集群节点ip)
  2. bin/hdfs namenode -format

#### 常用命令
  1. bin/hadoop fs,jar,version
  2. bin/hadoop fs -cat,ls,mv,get,put,rm,find,chmod,chown,mkdir
  3. sbin/hdfs start-dfs.sh, start-yarn.sh, stop-dfs.sh, stop-yarn.sh
  4. sbin/mr-jobhistory-daemon.sh start historyserver

## HA

1. 安装zookeeper，配置文件
  ````
  vi conf/zoo.cfg
    dataDir=/var/sxt/zk
    server.1=hadoop2:2888:3888
    server.2=hadoop3:2888:3888
    server.3=hadoop4:2888:3888
  vi /var/sxt/zk
    echo 1，2，3 > myid
  ````
2. 启动zookeeper集群
  zkServer.sh start
3. zookeeper几点上启动journalnode
  hadoop-daemon.sh start journalnode
4. 第一台namenode上
  hdfs namenode -format
  hadoop-daemon.sh start namenode
5. 第二台namenode上
  hdfs namenode -bootstrapStandby
6. 启动集群
  start-dfs.sh
7. 格式化zkfc
  hdfs zkfc -formatZK
8. 启动zkfc
  stop-dfs.sh && start-dfs.sh || hadoop-daemon.sh start zkfc