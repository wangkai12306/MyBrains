title: Hive优化
---

## 写法优化
   - 避免使用count(distinct)，应尽量先distinct去重，然后再count
   - 右表只用来过滤数据是使用left semi join而不是left join，因为semi只要join一次就会停止，且只提供join的key不会有结果字段
   - join前尽可能过滤无用数据

## 调参优化
   1. join连接时的优化：当三个或多个以上的表进行join操作时，如果每个on使用相同的字段连接时只会产生一个mapreduce。
   2. join连接时的优化：当多个表进行查询时，从左到右表的大小顺序应该是从小到大。原因：hive在对每行记录操作时会把其他表先缓存起来，直到扫描最后的表进行计算
   3. 在where字句中增加分区过滤器。
   4. 当可以使用left semi join 语法时不要使用inner join，前者效率更高。原因：对于左表中指定的一条记录，一旦在右表中找到立即停止扫描。
   5. 如果所有表中有一张表足够小，则可置于内存中，这样在和其他表进行连接的时候就能完成匹配，省略掉reduce过程。
      ```
       set hive.auto.covert.join=true;(开启map join)
       set hive.mapjoin.smalltable.size=2500000;(小表的大小)
      ```
   6. 同一种数据的多种处理：从一个数据源产生的多个数据聚合，无需每次聚合都需要重新扫描一次。
      - 例如：insert overwrite table student select *　from employee; insert overwrite table person select * from employee;
      - 可以优化成：from employee insert overwrite table student select * insert overwrite table person select *
   7. limit调优：limit语句通常是执行整个语句后返回部分结果。set hive.limit.optimize.enable=true;
   8. 开启并发执行。某个job任务中可能包含众多的阶段，其中某些阶段没有依赖关系可以并发执行，开启并发执行后job任务可以更快的完成。设置属性：set hive.exec.parallel=true;
   9. hive提供的严格模式，禁止3种情况下的查询模式。
       a：当表为分区表时，where字句后没有分区字段和限制时，不允许执行。
       b：当使用order by语句时，必须使用limit字段，因为order by 只会产生一个reduce任务。
       c：限制笛卡尔积的查询。
   10. 合理的设置map和reduce数量。
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
   11. jvm重用，可在hadoop的mapred-site.xml中设置jvm被重用的次数。
       适用场景：
          - 小文件个数过多
          - task个数过多
       通过 set mapred.job.reuse.jvm.num.tasks=n; 来设置（n为task插槽个数）
       缺点：设置开启之后，task插槽会一直占用资源，不论是否有task运行，直到所有的task即整个job全部执行完成时，才会释放所有的task插槽资源！
   12. 大表join小表时开启mapjoin：hive.auto.convert.join=True
   13. 开启并行执行：set hive.exec.parallel=true;
   14. 小任务时开启local mr：
      ``` 
       set hive.exec.mode.local.auto=true;
       set hive.exec.mode.local.auto.inputbytes.max=50000000;
       set hive.exec.mode.local.auto.tasks.max=10;
      ```
   15. map执行前合并小文件：set mapred.max.split.size=100000000;
   16. 开启map端聚合：set hive.map.aggr=True;
   17. 设置reduce数量：set hive.exec.reducers.bytes.per.reducer=500000000;或者set mapred.reduce.tasks = 15;
   18. 数据倾斜：set hive.groupby.skewindata=True;原理是产生两个job，第一个将map的结果随机分配到reduce然后进行部分聚合，这样相同的mapkey可能分配到不同的reduce中从而达到负载均衡。第二个job则是正常的mr操作，相同的key会分配到同一reduce