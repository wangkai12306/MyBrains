title: 算子
---
## Transformation类算子

- map：输入函数作用于RDD的每个元素
- filter(function)：过滤操作
- flatMap：先map，再将所有对象合并为一个对象
- mapPartitions：输入函数作用于RDD的每个分区，有OOM的风险，可以使用repartition增加分区
- mapPartitionWithIndex
- sample：随机取样，withReplacement表示是否放回
- union：对于源数据集和其他数据集求并集，不去重
- intersection：对于源数据集和其他数据集求交集，去重且无序
- distinct：去重，无序
- groupByKey：在一个PairRDD或（k,v）RDD上调用，返回一个（k,Iterable<v>），无序
- reduceByKey：在groupByKey的基础上reduce
- aggregateByKey
- sortByKey：对pairRDD的key进行排序
- join：加入一个RDD，在一个（k，v）和（k，w）类型的dataSet上调用，返回一个（k，（v，w））的pair
- cogroup
- cartesian：求笛卡尔积
- pipe：通过一个shell命令来对RDD各分区进行“管道化”并生成新的RDD
- coalesce：重新分为N个分区
- repartition：= coalesce(numPartitions, shuffle=true)
- repartitionAndSortWithinPartitions：根据partitioner对RDD进行分区，并且在每个结果分区中按key进行排序

## Action类算子
- reduce：循环出入两个元素并产生一个新的元素
- collect：将RDD类型的数据转化为数组(该操作会将各节点的数据聚集到driver端，需要repartition，所以会导致shuffle，因此属于比较耗时到操作，而且Array数组；需要占用堆内存，很容易OOM，所以应当慎用。另外collectpartitions与collect类似，但前者先在各节点转化为数组再聚集到driver，所以前者是二维数组)
- count：元素计数
- first：返回RDD第一个元素，类似take(1)
- take：返回RDD的前N个元素，不排序
- takeSample：返回RDD的N个随机取样，withReplacement表示是否放回
- takeOrdered：返回默认排序或自定义排序，返回RDD的前N个元素
- saveAsTextFile
- saveAsSquenceFile
- saveAsObjectFile
- countByKey：统计KV格式的RDD中每个key的个数，返回hashMap
- foreach：对RDD每个元素执行函数
- 算子优化：[参照](https://blog.csdn.net/wyqwilliam/article/details/81626447)

## 控制算子
- cache(= persist(StorageLevel.Memory_Only))
    - 懒执行,将一个RDD进行缓存的，这样在之后使用的过程中就不需要重新计算
    - 返回值需要赋值给一个变量
    - 不能立即紧跟action类算子
- persist
    - MEMORY_ONLY
    - MEMORY_AND_DISK
    - OFF_HEAP:rdd的数据持久化到堆外内存
    - _2：有副本数
- checkpoint
    - 持久化
    - 切断RDD的依赖关系
    - 执行原理
        1、当RDD的job执行完毕后，会从finalRDD从后往前回溯
        2、当回溯到某一个RDD调用了checkoint方法，会对当前RDD做一个标记
        3、Spark框架会自动启动一个新的job，重新计算这个RDD的数据，然后将数据持久化到HDFS上
        优化：对RDD执行checkpoint之前最好先对这个RDD调用cache，这样的话，新启动的job只需要将内存中的数据拷贝到HDFS上就可以，省去了重新计算这一步