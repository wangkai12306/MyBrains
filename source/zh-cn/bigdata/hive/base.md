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
   
## 表类型
1. 内部表：统一管理数据和元数据
2. 外部表：只管元数据。建表时需要指定外部数据的地址，如HBase、mongo
3. 分区表：带有分区字段的表，每个分区是一个目录
4. 桶表：
  - 在分区的基础上根据指定的列进行hash取值，然后放到不同的文件中
  - 旨在提高查询时的join效率
  - 需要开启桶操作：`set hive.enforce.bucketing=true;`
  - 不可以使用load data，只能insert

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
1. Order By key
    - 对于查询结果做全排序，只允许有一个reduce处理（当数据量较大时，应慎用。严格模式下，必须结合limit来使用）
2. Sort By key
    - 对于单个reduce的数据进行排序，保证每个reduce有序，不保证全局有序
3. Distribute By key
    - 将相同key的数据发送到同一个reduce，经常和Sort By结合使用
4. Cluster By key
    - 相当于 Distribute By + Sort By
    - Cluster By不能通过asc、desc的方式指定排序规则;可通过 distribute by key sort by key asc|desc 的方式

## 导入导出
#### 导入
1. 本地：`load data local inpath '/xxx/yyy' (overwrite) into table xxx;`
2. HDFS：`load data inpath '/xxx/yyy' (overwrite) into table xxx;`
3. 查询：`insert overwrite|into table xxx select * from yyy;`
4. 建表：`create table db.table as select * from yyy;`
5. sqoop import

#### 导出
1. hive客户端：`hive -e "select * from table;" >> /xxx/tmp`
2. 本地：`insert overwrite local directory '/xxx/tmp' row format delimited fields terminated by '\t' select * from table;`
3. HDFS：`insert overwrite directory '/xxx/tmp' row format delimited fields terminated by '\t' select * from table;`
4. sqoop export

## 工作原理：
1. 用户提交查询等任务给Driver
2. 编译器获得该用户的任务Plan
3. 编译器Compiler根据用户任务去MetaStore中获取需要的Hive的元数据信息
4. 编译器Compiler得到元数据信息，对任务进行编译，先将HiveQL转换为抽象语法树，然后将抽象语法树转换成查询块，将查询块转化为逻辑的查询计划，重写逻辑查询计划，将逻辑计划转化为物理的计划（MapReduce）, 最后选择最佳的策略
5. 将最终的计划提交给Driver
6. Driver将计划Plan转交给ExecutionEngine去执行，获取元数据信息，提交给JobTracker或者SourceManager执行该任务，任务会直接读取HDFS中文件进行相应的操作
7. 获取执行的结果
8. 取得并返回执行结果
