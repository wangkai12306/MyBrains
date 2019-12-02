title: Hive基础
---

## 特征
   - 支持索引，加快数据查询
   - 不同的存储类型，例如，纯文本文件、HBase 中的文件
   - 将元数据保存在关系数据库中，大大减少了在查询过程中执行语义检查的时间。
   - 可以直接使用存储在Hadoop 文件系统中的数据。
   - 内置大量用户函数UDF 来操作时间、字符串和其他的数据挖掘工具，支持用户扩展UDF 函数来完成内置函数无法实现的操作。
   - 类SQL 的查询方式，将SQL 查询转换为MapReduce 的job 在Hadoop集群上执行。

## Hive 体系结构
   1. 用户接口
       - 用户接口主要有三个：CLI，Client和WUI。其中最常用的是CLI，Cli启动的时候，会同时启动一个Hive副本。
       - Client是Hive 的客户端，用户连接至Hive Server。在启动Client模式的时候，需要指出Hive Server所在节点，并且在该节点启动Hive Server。WUI是通过浏览器访问Hive。
   2. 元数据存储
      - Hive 将元数据存储在数据库中，如mysql。Hive 中的元数据包括表的名字，表的列和分区及其属性，表的属性（是否为外部表等），表的数据所在目录等。
   3. 解释器、编译器、优化器、执行器
      - 解释器、编译器、优化器完成HQL查询语句从词法分析、语法分析、编译、优化以及查询计划的生成。查询计划存储在HDFS中，并在随后由MR调用执行。
   4. Hadoop
      - Hive的数据存储在HDFS中，大部分的查询由MapReduce完成（包含*的查询，比如select * from tbl不会生成MapReduce任务）。

## 数据类型
   1. 基本数据类型
      - hive支持多种不同长度的整型和浮点型数据，支持布尔型，也支持无长度限制的字符串类型。
      - 例如：TINYINT、SMALINT、INT、BIGINT、BOOLEAN、FLOAT、DOUBLE、STRING等基本数据类型。这些基本数据类型和其他sql方言一样，都是保留字。
   2. 集合数据类型
      - hive中的列支持使用struct、map(例：MAP<STRING,FLOAT>,)和array(例：ARRAY<STRING>,)集合数据类型。

## 参数设置方式
   1. 修改配置文件 ${HIVE_HOME}/conf/hive-site.xml
   2. 启动hive cli时，通过--hiveconf key=value的方式进行设置
      - 例：hive --hiveconf hive.cli.print.header=true
   3. 进入cli之后，通过使用set命令设置
      - 在hive CLI控制台可以通过set对hive中的参数进行查询、设置
      - set设置：set hive.cli.print.header=true;
      - set查看：set hive.cli.print.header
      - hive参数初始化配置
      - 当前用户家目录下的.hiverc文件如: ~/.hiverc
      - 如果没有，可直接创建该文件，将需要设置的参数写到该文件中，hive启动运行时，会加载改文件中的配置。
      - hive历史操作命令集 ~/.hivehistory

## 动态分区
   1. 开启动态分区
      ```
         set hive.exec.dynamic.partition=true; 默认：false
         set hive.exec.dynamic.partition.mode=nostrict; 默认：strict（至少有一个分区列是静态分区）
      ```
   2. 相关参数
      ```
         set hive.exec.max.dynamic.partitions.pernode; 每一个执行mr节点上，允许创建的动态分区的最大数量(100)
         set hive.exec.max.dynamic.partitions; 所有执行mr节点上，允许创建的所有动态分区的最大数量(1000)
         set hive.exec.max.created.files; 所有的mr job允许创建的文件的最大数量(100000)
      ```

## Lateral View
   1. Lateral View用于和UDTF函数（explode、split）结合来使用。
      - 首先通过UDTF函数拆分成多行，再将多行结果组合成一个支持别名的虚拟表。
      - 主要解决在select使用UTF做查询过程中，查询只能包含单个UDTF，不能包含其他字段、以及多个UDTF的问题 
   2. 语法：
      -  LATERAL VIEW udtf(expression) tableAlias AS columnAlias (',' columnAlias)
      - LATERAL VIEW explode(address) myTable2 AS myCol2, myCol3;

## 权限管理

三种授权模型：
   1. Storage Based Authorization in the Metastore Server
      - 基于存储的授权 - 可以对Metastore中的元数据进行保护，但是没有提供更加细粒度的访问控制（例如：列级别、行级别）。
   2. SQL Standards Based Authorization in HiveServer2
      - 基于SQL标准的Hive授权 - 完全兼容SQL的授权模型，推荐使用该模式。
      - 完全兼容SQL的授权模型
      - 除支持对于用户的授权认证，还支持角色role的授权认证
          - role可理解为是一组权限的集合，通过role为用户授权
          - 一个用户可以具有一个或多个角色
          - 默认包含另种角色：public、admin
      - 限制：
           1. 启用当前认证方式之后，dfs, add, delete, compile, and reset等命令被禁用。
           2. 通过set命令设置hive configuration的方式被限制某些用户使用。
           （可通过修改配置文件hive-site.xml中hive.security.authorization.sqlstd.confwhitelist进行配置）
           3. 添加、删除函数以及宏的操作，仅为具有admin的用户开放。
           4. 用户自定义函数（开放支持永久的自定义函数），可通过具有admin角色的用户创建，其他用户都可以使用。
           5. Transform功能被禁用
   3. Default Hive Authorization (Legacy Mode)
       hive默认授权 - 设计目的仅仅只是为了防止用户产生误操作，而不是防止恶意用户访问未经授权的数据
   4. 权限
      - 授予
        ```
           GRANT role_name [, role_name] ...
           TO principal_specification [, principal_specification] ...
           [ WITH ADMIN OPTION ];
           principal_specification
           : USER user
           | ROLE role
        ```
      - 移除
        ```
           REVOKE [ADMIN OPTION FOR] role_name [, role_name] ...
           FROM principal_specification [, principal_specification] ... ;
           principal_specification
           : USER user
           | ROLE role
        ```
      - 查看授予某个用户、角色的角色列表
         - SHOW ROLE GRANT (USER|ROLE) principal_name;
      - 查看属于某种角色的用户、角色列表
         - SHOW PRINCIPALS role_name;

## 排序
   1. Order By
       - 对于查询结果做全排序，只允许有一个reduce处理（当数据量较大时，应慎用。严格模式下，必须结合limit来使用）
   2. Sort By
       - 对于单个reduce的数据进行排序
   3. Distribute By
       - 分区排序，经常和Sort By结合使用
   4. Cluster By
       - 相当于 Sort By + Distribute By
       - Cluster By不能通过asc、desc的方式指定排序规则;可通过 distribute by column sort by column asc|desc 的方式

## Map Join
在Map端完成Join，两种实现方式：
   1. SQL方式，在SQL语句中添加MapJoin标记（mapjoin hint）
      ```
       SELECT  /*+ MAPJOIN(smallTable) */  smallTable.key,  bigTable.value 
       FROM  smallTable  JOIN  bigTable  ON  smallTable.key  =  bigTable.key;
      ```
   2. 开启自动的MapJoin
      - 通过修改以下配置启用自动的mapjoin：
       ```
        set hive.auto.convert.join = true;（该参数为true时，Hive自动对左边的表统计量，如果是小表就加入内存，即对小表使用Map join）`
       ```
      - 相关配置参数：
      ```
       hive.mapjoin.smalltable.filesize;（大表小表判断的阈值，如果表的大小小于该值则会被加载到内存中运行）
       hive.ignore.mapjoin.hint；（默认值：true；是否忽略mapjoin hint 即mapjoin标记）
       hive.auto.convert.join.noconditionaltask;（默认值：true；将普通的join转化为普通的mapjoin时，是否将多个mapjoin转化为一个mapjoin）
       hive.auto.convert.join.noconditionaltask.size;（将多个mapjoin转化为一个mapjoin时，其表的最大值）
      ```

## Map-Side聚合
   1. 通过设置以下参数开启在Map端的聚合：
      ```
       set hive.map.aggr=true;
      ```
   2. 相关配置参数：
      ```
       hive.groupby.mapaggr.checkinterval：map端group by执行聚合时处理的多少行数据（默认：100000）
       hive.map.aggr.hash.min.reduction：进行聚合的最小比例（预先对100000条数据做聚合，若聚合之后的数据量/100000的值大于该配置0.5，则不会聚合）
       hive.map.aggr.hash.percentmemory：map端聚合使用的内存的最大值
       hive.map.aggr.hash.force.flush.memory.threshold：map端做聚合操作是hash表的最大可用内容，大于该值则会触发flush
       hive.groupby.skewindata：是否对GroupBy产生的数据倾斜做优化，默认为false
      ```