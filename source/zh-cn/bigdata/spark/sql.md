title: Spark SQL
---

## Shark
   1. Hive：解析器，优化器
   2. Spark：执行引擎

## 预言下推

## Spark on hive
   1. hive：只是作为数据仓库
   2. Spark:负责计算

## Hive on Spark
   1. Hive：数据仓库和部分计算
   2. Spark：执行引擎

## 创建DataFrame的方式
   1. 通过读取json文件创建一个DF，不能是嵌套的json
   2. 通过读取json格式的RDD转换成DF，RDD中的数据类型是String，但是数据格式是json格式
   3. 非json格式的RDD转换成DF
      - 反射
         - 自定义的类必须是pulic修饰符
         - 自定义的类必须时间序列化接口
         - 生成的DF的列的顺序与自定义类中字段的顺序不一致，按照字典排序了
      - 推荐：动态创建Schema
         - 列的信息可以存储到外部存储
   4. 读取MySQL中的数据创建一个DF
   5. Spark on Hive读取Hive中的数据创建一个DF
      - 开启hive的metastore服务 hive --service metastore &
      - 在Spark的客户端的安装包的conf下创建一个hive-site.xml文件
      - spark-shell测试
   6. 读取Hive中的数据
      - SELECT * FROM table
      - val DF = hiveContext.table("tableName")

## DataFrame存储
   1. DF.write.saveAsTable("tableName") 存储到Hive中，若tableName不存在，自动创建
   2. DF.rdd().forechPartition()可以将数据写入到MySQL中
   3. 存储到HDFS中usersDF.write.format("json").mode(SaveMode.Ignore).save("hdfs://hadoop1:9000/output/users.json")
      - format（）以什么格式存储
      - mode() 以什么方式存储
         - Ignore
         - overWrite
         - apend
         - errorIfExits
      - save(path):存储路径

## parquet数据源可以自动推测分区
代码在java工程ParquetPartitionDiscovery.java

## SparkSQL自定义函数
UDF
UDAF
开窗函数