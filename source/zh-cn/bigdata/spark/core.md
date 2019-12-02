title: Spark Core
---
## RDD
弹性分布式数据集，五大特性
   1. RDD是由一些列的partition组成的
   2. RDD是由一系列的依赖关系的
   3. 每一个算子实际上是作用在每一个Partition上
   4. 可选项：分区器作用在KV格式的RDD上；如果RDD中的数据是二元组对象，KV格式的RDD；如果存储的是非二元组对象，非KV格式的RDD
   5. 可选项：RDD会提供最佳的计算位置（能够获取每一个Partition的位置，以利于计算的数据本地化）

## 资源调度
   1. 理论
       - val workers = new HashSet[WorkInfo]
       - waitingDrivers = new ArrayBuffer[DriverInfo]
       - waitingApps
           - 默认情况（没有设置--executor-cores），每一个Worker为当前的Application只启动一个Executor
           - 默认情况，每台worker节点上的Executor会使用这个Worker所有的cores和1G内存
           - 如果想在Worker上启动多个Executor，提交Application的时候要加--executor-cores这个选项
           - spreadOutApps（default：true）：让Executor在集群中轮询启动
           - 默认情况(没有设置--total-executor-cores),一个Application会使用Spark集群中所有的cores
           - Executor在worker上启动的条件是什么？
               - Worker分配给Executor的cores大于Executor所需要的最小cores。
               - Worker空闲 cores大于Executor所需最小cores。
               - Worker的空闲内存大于Executor所需要的内存。
   2. 调度流程
       - 待集群Spark集群启动成功后，Woker与Master通信，此时Worker的各种信息(IP、port等)会存在Master中的wokers集合中，其数据类型是HashSet。此时Master会为各个Worker分配资源。
       - 当sparksubmit向Master为Driver申请资源时，申请信息会封装在Master中的waitingDrivers集合中，此时有个Schedule()方法会监控waitingDrivers集合是否为空，若不为空，说明有客户端向Master申请资源，然后查看当前集群的资源情况，从而找到符合要求的节点启动Driver，待Driver启动成功，就把这个申请信息从waitingDrivers集合中删除。
       - Driver启动成功后，Driver会向Master为Application申请资源，申请信息会封装在Master中的waitingApps集合中，同样Schedule()方法会监控waitingApps集合是否为空，若不为空，说明有Driver为当前Application申请资源，然后查看当前集群的资源情况，从而找到符合要求的节点去启动Executor进程，待Executor启动成功后，就把这个申请信息从waitingApps集合中删除。

## 任务调度
   1. 宽窄依赖
        - 宽依赖：父RDD与子RDD,partition之间的关系是一对多
        - 窄依赖：父RDD与子RDD,partition之间的关系是一对一或多对一
   2. 切割job 划分stage
        - stage是由一组并行计算的task组成的
        - task的计算模式是pipeline的计算1+1+1=3,数据一直在pipeline里,当对RDD持久化和shuffle write的时候落地
        - stage的并行度由finalRDD决定
        - 如何改变RDD的分区数？
            - reduceByKey(,numPartitions)
            - groupByKey(numPartitions)
   3. 调度流程
        - Driver进程启动,同时创建DAGScheduler和TaskScheduler
        - TaskScheduler创建好后向master发送请求,为当前Application申请资源
        - master接受TaskScheduler的请求后,寻找满足资源的worker,并在该worker所在的节点启动一个executor
        - worker接收master消息后启动一个executor(计算进程)
        - executor成功启动后会向TaskScheduler反向注册
        - DAGScheduler根据RDD的宽窄依赖切割job划分stage,然后以TaskSet的形式发送给TaskScheduler
        - TaskScheduler接受到TaskSet之后会遍历这个集合,然后发送给executor执行,若executor执行失败,TaskSchedule会重复执行三次(推测执行)
        - worker中的executor会向Driver反馈执行情况
   4. 粗细粒度的资源申请
        - 粗粒度资源申请
            - 描述：在Application执行之前,将所有的资源申请完毕,当资源申请成功后才会进行任务调度,当多有的task执行完毕后才会释放这部分资源
            - 优点：task启动快，application执行变快。
            - 缺点：知道最后一个task执行完毕才会释放资源，集群资源无法充分利用。
        - 细粒度资源申请
            - 描述：在Application执行之前,不需要先申请资源,直接执行,让每个task自己去申请,申请到了就执行,执行完毕就是放资源
            - 优点：充分利用集群资源
            - 缺点：task启动慢，application执行变慢

## 内存管理
   1. 静态内存管理
        - 60%
            - 90%(spark.storage.memoryFraction)
                - 80%:存储的是RDD的缓存数据和广播变量
                - 20%:解压序列化数据
            - 10%(spark.storage.unrollFraction)预留
        - 20%(spark.shuffle.memoryFraction)
            - 80%用于shuffle聚合
            - 20%预留,防止OOM
        - 20%Task计算
   2. 统一内存管理
        - 75%(spark.memory.storageFraction)
            - 50%:存储的是RDD的缓存数据和广播变量
            - 50%:shuffle聚合
        - 25%Task计算
        - 300M用于JVM自身运行

## 广播变量和累计器
   1. 广播变量允许程序员将一个只读的变量缓存在每台机器上，而不用在任务之间传递变量。广播变量可被用于有效地给每个节点一个大输入数据集的副本
   2. 累加器只能定义在Driver端,Driver端读取,executor端变更
   3. 集群级的变量,定义在Driver端,只能在Driver端变更

## 推测执行
   1. 如果集群中，某一台机器的几个task特别慢，推测机制会将任务分配到其他机器执行，最后Spark会选取最快的作为最终结果(在spark-default.conf 中添加：spark.speculation true)
       - spark.speculation.interval 100：检测周期，单位毫秒
       - spark.speculation.quantile 0.75：完成task的百分比时启动推测
       - spark.speculation.multiplier 1.5：比其他的慢多少倍时启动推测

## SparkUI
   1. 配置HistoryServer
       - 开启记录事件日志的功能 在Spark-default.conf里添加配置信息spark.eventLog.enabled
       - 设置事件日志的存储目录 在Spark-default.conf里添加配置信息 spark.eventLog.dir
       - 设置HistoryServer加载事件日志的位置（spark.history.fs.logDirectory）必须和spark.eventLog.dir的值一致
       - 优化:将事件日志压缩存储 在Spark-default.conf里添加配置信息spark.eventLog.compress
       - 在客户端启动HistoryServer  命令在sbin下

## Spark Shuffle
   1. shuffle理论
        - HashShuffle: map输出的小文件过多,会造成shuffle阶段的write和read的对象增多,导致堆内存的GC,造成reduce在拉取对象时频繁通信
        - SortShuffle:Mapper中每个ShuffleMapTask的所有输出数据Data只写到一个文件中。因为每个ShuffleMapTask中的数据会被分类，所以Sort-based Shuffle使用了index文件存储具体ShuffleMapTask输出数据在同一个Data文件中是如何分类的信息.Mapper中的每一个ShuffleMapTask中产生两个文件：Data文件和Index文件，其中Data文件是存储当前Task的Shuffle输出的。而index文件中则存储了Data文件中的数据通过Partitioner的分类信息，此时下一个阶段的Stage中的Task就是根据这个Index文件获取自己所要抓取的上一个Stage中的ShuffleMapTask产生的数据的，Reducer就是根据index文件来获取属于自己的数据
        - 缺点：如果Mapper的Task数量过大，依然会产生大量小文件。reduce读取shuffle数据时需要反序列化大量index文件，导致大量的内存消耗和GC的巨大负担
   2. Spark Shuffle的调优

## MapOutputTracker

## BlockManager

## 案例
   - 分组取Topn
   - 二次排序