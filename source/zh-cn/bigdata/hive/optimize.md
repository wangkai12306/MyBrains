title: Hive优化
---

## 写法优化
1. join连接时的优化：当三个或多个以上的表进行join操作时，如果每个on使用相同的字段连接时只会产生一个MR。
2. 在where字句中增加分区过滤器。
3. 当可以使用left semi join 语法时不要使用inner join，前者效率更高。原因：对于左表中指定的一条记录，一旦在右表中找到立即停止扫描。
4. 避免count(distinct)，先去重再聚合
5. 避免使用with cube造成维度灾难
6. 同一种数据的多种处理：从一个数据源产生的多个数据聚合，无需每次聚合都需要重新扫描一次。
  - 例如：insert overwrite table student select *　from employee; insert overwrite table person select * from employee;
  - 可以优化成：from employee insert overwrite table student select * insert overwrite table person select *
7. limit调优：limit语句通常是执行整个语句后返回部分结果。set hive.limit.optimize.enable=true;
8. 将多于2个的union all替换为insert into
9. 避免过大的sql，使用临时中建表

## 调参优化
#### job
1. 如果所有表中有一张表足够小，则可置于内存中，这样在和其他表进行连接的时候就能完成匹配，省略掉reduce过程。
  ```
    set hive.auto.covert.join=true;(开启map join)
    set hive.mapjoin.smalltable.size=2500000;(小表的大小)
  ```
2. 开启并发执行：set hive.exec.parallel=true; 某个job任务中可能包含众多的阶段，其中某些阶段没有依赖关系可以并发执行，开启并发执行后job任务可以更快的完成
3. jvm重用，可在hadoop的mapred-site.xml中设置jvm被重用的次数。
  - 适用场景：
     - 小文件个数过多
     - task个数过多
  - 通过 set mapred.job.reuse.jvm.num.tasks=n; 来设置（n为task插槽个数）
  - 缺点：设置开启之后，task插槽会一直占用资源，不论是否有task运行，直到所有的task即整个job全部执行完成时，才会释放所有的task插槽资源！
4. job合并输入小文件
  ```
    set mapred.max.split.size=256000000; 每个Map最大输入大小
    set mapred.min.split.size.per.node=100000000; 一个节点上split的至少的大小 
    set mapred.min.split.size.per.rack=100000000; 一个交换机下split的至少的大小
    set hive.input.format=org.apache.hadoop.hive.ql.io.CombineHiveInputFormat;  执行Map前进行小文件合并
    set hive.input.format=org.apache.hadoop.hive.ql.io.CombineHiveInputFormat； 多个split合成一个,合并split数由mapred.max.split.size限制的大小决定
  ```

5. job合并输出小文件（为后续job优化做准备）
  ```
    hive.merge.mapfiles：在只有map的作业结束时合并小文件，默认开启true；
    hive.merge.mapredfiles：在一个map/reduce作业结束后合并小文件，默认不开启false；
    hive.merge.size.per.task： 合并后每个文件的大小，默认256000000
    set hive.merge.smallfiles.avgsize=256000000;当输出文件平均大小小于该值，启动新job合并文件
    set hive.merge.size.per.task=64000000;合并之后的每个文件大小
  ```
6. hive提供的严格模式，禁止3种情况下的查询模式。
  - 当表为分区表时，where字句后没有分区字段和限制时，不允许执行。
  - 当使用order by语句时，必须使用limit字段，因为order by 只会产生一个reduce任务。
  - 限制笛卡尔积的查询。
7. 小任务时开启local job：
  ``` 
    set hive.exec.mode.local.auto=true;
    set hive.exec.mode.local.auto.inputbytes.max=50000000;
    set hive.exec.mode.local.auto.tasks.max=10;
  ```
8. 数据倾斜
  ```  
    set hive.groupby.skewindata=True; 原理是产生两个job，第一个将map的结果随机分配到reduce然后进行部分聚合，这样相同的mapkey可能分配到不同的reduce中从而达到负载均衡。第二个job则是正常的mr操作，相同的key会分配到同一reduce
    set hive.groupby.mapaggr.checkinterval=100000; 这个是group的键对应的记录条数超过这个值则会进行优化
  ```

#### join
1. Map Join
在Map端完成Join，两种实现方式：
  - 手动，在SQL语句中添加MapJoin标记（mapjoin hint）
    ```
     SELECT  /*+ MAPJOIN(smallTable) */  smallTable.key,  bigTable.value 
     FROM  smallTable  JOIN  bigTable  ON  smallTable.key  =  bigTable.key;
    ```
  - 开启自动的MapJoin
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

#### shuffle
1. Map端
  ```
    io.sort.mb=100 缓冲区大小
    io.sort.record.percent=0.05 io.sort.mb中用来保存map output记录边界的百分比，其他缓存用来保存数据
    io.sort.spill.percent=0.8 缓冲区溢写比例
    min.num.spill.for.combine=3 combiner函数运行的最小spill数
    io.sort.factor=10 做merge操作时同时操作的stream数上限
  ```
2. reduce端
  ```
    mapred.reduce.parallel.copies=5 每个reduce并行下载map结果的最大线程数
    mapred.reduce.copy.backoff=300s reduce下载线程最大等待时间（in sec）
    io.sort.factor=10 做merge操作时同时操作的stream数上限
    mapred.job.shuffle.input.buffer.percent=0.7 用来缓存shuffle数据的reduce task heap百分比
  ```

#### MR
1. Map-Side聚合
  - 通过设置以下参数开启在Map端的聚合：
    ```
     set hive.map.aggr=true;
    ```
  - 相关配置参数：
    ```
     hive.groupby.mapaggr.checkinterval：map端group by执行聚合时处理的多少行数据（默认：100000）
     hive.map.aggr.hash.min.reduction：进行聚合的最小比例（预先对100000条数据做聚合，若聚合之后的数据量/100000的值大于该配置0.5，则不会聚合）
     hive.map.aggr.hash.percentmemory：map端聚合使用的内存的最大值
     hive.map.aggr.hash.force.flush.memory.threshold：map端做聚合操作是hash表的最大可用内容，大于该值则会触发flush
     hive.groupby.skewindata：是否对GroupBy产生的数据倾斜做优化，默认为false
    ```
2. 合理的设置map和reduce数量。
    Map数量相关的参数
    ```
      mapred.max.split.size 一个split的最大值，即每个map处理文件的最大值
      mapred.min.split.size.per.node 一个节点上split的最小值
      mapred.min.split.size.per.rack 一个机架上split的最小值
    ```
    Reduce数量相关的参数
    ```
      mapred.reduce.tasks 强制指定reduce任务的数量
      hive.exec.reducers.bytes.per.reducer 每个reduce任务处理的数据量
      hive.exec.reducers.max 每个任务最大的reduce数
    ```

#### 队列
1. 设置hive的执行引擎为MR：
set hive.execution.engine=mr;(默认引擎,不需要设置)
2. 设置mr的队列：
set mapreduce.queue.name=xxx;