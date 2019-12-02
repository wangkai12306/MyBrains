title: Spark基础
---

1. Spark基于内存计算比MR快100倍
2. Spark基于磁盘比MR快10倍左右
3. Spark运行模式
   - Local
   - Standalone
   - YARN
   - Mesos

总结端口
   - 50070：HDFS WEB UI端口
   - 8020：高可用HDFS的RPC端口
   - 9000:非高可用HDFS的RPC端口
   - 8088：YARN的WEB UI端口
   - 60010：Hbase的WEB UI端口
   - 18080：Spark History Server的WEB UI端口
   - 8080：Standalone的WEB UI端口
   - 2181：ZOOKEEPER的rpc端口
   - 7077：Standalone集群提交Application的端口
   - 4040：Driver进程的WEB UI 端口，任务调度的WEB UI 端口
   - 8081：Worker的WEB UI端口