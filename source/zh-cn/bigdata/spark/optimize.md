title: 优化
---

1. 资源调优
    1. 搭建集群
    2. 提交Application的时候
2. 提高并行度
    1. 减少hdfs block size
    2. textFile（numpartitions）
    3. shuffle类算子设置reduce task的个数
    4. spark.default.parallelism  not set
    5. spark.sql.shuffle.partitions 200
    6. 自定义分区器  代码
3. 代码调优
    1. 避免重复创建RDD
    2. 尽可能复用同一个RDD
    3. 在其他的job中多次使用的RDD进行持久化
        MEMORY_ONLY
        MEMORY_ONLY_SER
        MEMORY_AND_DISK_SER
    4. 尽量避免使用shuffle类算子
    5. 使用map-side预聚合的shuffle操作
    6. 使用高性能的算子
       - mapPartition
       - foreachPartition
       - reduceByKey
       - 使用filter之后进行coalesce操作  repartition=coalesce（true）
       - 使用repartitionAndSortWithinPartitions替代repartition与sort类操作  
    7. 广播变量
    8. 使用Kryo优化序列化性能
    9. 优化数据结构
       - 字符串代替对象
       - 数组代替集合
       - 基本类型代替字符串
    10. fastUtil
4. JVM调优
    1. 年轻带
       - eden
       - 幸存区1
       - 幸存区2
    2. 老年代
5. 数据本地化
    1. PROCESS_LOCAL
    2. NODE_LOCAL
    3. NO_PREF
    4. RACK_LOCAL
    5. ANY
    6. 如何提高数据本地化的级别
       - spark.locality.wait
       - spark.locality.wait.process
       - spark.locality.wait.node
       - spark.locality.wait.rack
6. shuffle调优
    - 每次拉取的数据量 48M
    - 重试次数
    - 重试间隔时间
    - shuffle聚合内存的比例
    - HashShuflle可以选用合并机制
    - SortShuffle 可以选用bypass机制
7. shuffle file not find
    1. Executor挂了
        1. 堆内内存不足
        2. 堆外内存不足
    2. Execuotr正常运行
        1. 建立通信的时候出现了问题
        2. 建立通信没问题，拉数据的时候出现了问题
8. 数据倾斜
    1. hive etl：spark频繁的对hive表数据分析
    2. 过滤少数导致倾斜的key，并且这些key对最终的结果没有影响
    3. 提高shuffle操作的并行度
    4. 双重聚合
    5. reduce join -> map join
    6. 分拆RDD进行join  随机前缀和扩容RDD
    7. 随机前缀和扩容RDD，粗暴