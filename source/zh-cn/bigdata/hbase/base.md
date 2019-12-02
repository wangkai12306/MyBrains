title: HBase基础
---

## 简介
   - 高可靠性，高性能，面向列，可伸缩，实时读写的分布式数据库
   - 基于HDFS存储，利用MR处理，zookeeper分布式协同服务
   - 存储结构化和半结构化的松散数据(列存NoSQL数据库)

## 数据模型
   1. ROW KEY：决定一行数据，按照字典排序，只能存储64K的字节数据
   2. 时间戳(版本)：64位整型，按照时间倒排序。数据写入时自动赋值，为精确到毫秒的当前系统时间。
   3. 列族：必须作为表模式定义的一部分预先给出。一个列族的数据存储在同一目录下。
   4. 列：列名须以列族为前缀，如：course:math,course:english，可动态加入
   5. 单元格：[row key,column(family:qualifier),version]唯一确定单元格，没有数据类型，以字节码形式存储。
   6. Region
      - HBase自动把表水平划分成多个区域(region)，每个region会保存一个表里面某段连续的数据；每个表一开始只有一个region，
      - 随着数据不断插入表，region不断增大，当增大到一个阀值的时候，region就会等分会两个新的region（裂变）；
      - 当table中的行不断增多，就会有越来越多的region。这样一张完整的表被保存在多个Regionserver 上。

## 体系架构
   1. Client
      - 包含访问HBase的接口并维护cache来加快对HBase的访问
   2. Zookeeper
   	  - 保证任何时候，集群中只有一个master
   	  - 存贮所有Region的寻址入口。
   	  - 实时监控Region server的上线和下线信息。并实时通知Master
   	  - 存储HBase的schema和table元数据
   3. Master
   	  - 为Region server分配region
   	  - 负责Region server的负载均衡
   	  - 发现失效的Region server并重新分配其上的region
   	  - 管理用户对table的增删改操作
   4. RegionServer
   	  - Region server维护region，处理对这些region的IO请求
   	  - Region server负责切分在运行过程中变得过大的region

## RowKey设计
   1. 业务场景
   2. 64K，不要太大
   3. 日期降序排序
   4. 散列性
      - protobuf

## 优化
   1. 预分区
   2. rowkey
   3. 列族个数
   4. 合并major
   5. 批量读写
   6. 缓存读写(InMemory)
   7. HTable

## 备份
   1. 冷备份（distcp）
   2. 热备份（export,import）