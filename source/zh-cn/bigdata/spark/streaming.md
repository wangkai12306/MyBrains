title: Spark Streaming
---

## SparkStreaming和Storm区别
   1. storm纯实时，ss准实时（微批处理）
   2. 事务支持方面
   3. SS可以进行复杂的数据处理  可以写SQL语句处理数据
   4. Strom只是进行简单汇总型计算
   5. 动态资源分配问题

## SparkStreaming初始
   1. batch interval：任务处理的间隔时间
   2. 假如batchDur_为Second（10)表示Spark Streaming会把每10秒钟的数据作为一个Batch，这个Batch是改时间窗口内所有RDD组合成的DStream
   3. WordcountOnline socket数据
        socket server服务启动命令  nc -lk 9999

## Transformation类算子
   1. Transform
   2. reduce

## OutputOperator类算子
   1. print
   2. foreachRDD
   3. saveAsTextFiles():默认将数据存储到HDFS上
   4. saveAsHadoopFiles 如果要将数据写入到非HDFS上，需要自定义outputFormat

## 有状态的算子
   1. updateStateByKey
        必须要设置checkpoint目录
   2. reduceByKeyAndWindow
        普通机制
        优化机制：必须要设置checkpoint目录

## Driver HA
   1. 提交任务层面
   2. 代码层面

## kafka的搭建
   1. config下的server.properties
        1. broker.id
        2. log.dirs 真实数据的存储路径
        3. zookeeper.connect = zookeeper url
        4. auto.leader.rebalance.enable true    leader的均衡机制
   2. key(当key为null时,会伪随机生成key)
        1. 如果sendPartitionPerTopicCache能获取到partitionId,则为key
        2. 否则
           - val availablePartitions = topicPartitionList.filter(_.leaderBrokerIdOpt.isDefined)
           - val index = Utils.abs(Random.nextInt) % availablePartitions.size
           - val partitionId = availablePartitions(index).partitionId
           - sendPartitionPerTopicCache.put(topic, partitionId) (sendPartitionPerTopicCache是每隔topic.metadata.refresh.interval.ms才会被清空)
           - partitionId 

## 从kafka获取数据
   1. receiver：receiver通过zookeeper连接kafka队列,将数据存储在Spark Executor的内存中的,然后Spark Streaming启动的job会去处理那些数据为保证可靠性,防止数据丢失,采用与写日志机制(write ahead log),可以写入HDFS.当节点挂掉后可以使用该日志进行恢复(在KafkaUtils.createStream()中，设置的持久化级是StorageLevel.MEMORY_AND_DISK_SER)可以创建多个Kafka输入DStream，使用不同的consumer group和topic，来通过多个receiver并行接收数据
   2. direct：直接连接到kafka的节点上获取数据，这种方式会周期性地查询Kafka，来获得每个topic+partition的最新的offset，从而定义每个batch的offset的范围
      **优点:**
         - 简化并行读取:Spark会创建跟Kafka partition一样多的RDD partition，并且会并行从Kafka中读取数据。所以在Kafka partition和RDD partition之间，有一个一对一的映射关系。
         - 高性能:不需要WAL，使用kafka自身的副本进行恢复
         - exactly one:receiver无法保证数据被处理一次且仅一次，可能会处理两次。因为Spark和ZooKeeper之间可能是不同步的。在direct方式中，streaming自己追踪消费的offset并保存在checkpoint中。spark内部一定是同步的，所以可以实现exactl one

## 测试
   1. 创建了一个topic  create-topic.sh
   2. 启动一个生产者  producer-topic.sh
   3. 在其他的节点上启动一个消费者  consumer-topic.sh 