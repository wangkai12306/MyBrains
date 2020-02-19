title: Kafka基础
---

Kafka是分布式发布-订阅消息系统

## 作用：
缓冲和削峰，解耦，冗余，健壮性

## 特性：
1. FIFO：topic的partition内部是FIFO，partition之间不保证有序，可以通过设置partition=1来实现
2. 高性能：MB/s吞吐量(零拷贝)
3. 持久性：消息顺序持久化到磁盘上，不会丢失，顺序读写效率高
4. 分布式：数据副本冗余、流量负载均衡、可扩展

## zk
kafka的元信息存在zookeeper中(zk还用来选举controller和检测broker存活)
1. get /brokers/topics/[topic]/partitions/[partitionId]/state
  - controller_epoch: 表示kafka集群中的中央控制器选举次数
  - leader: 表示该partition选举leader的brokerId
  - version: 版本编号默认为1
  - leader_epoch: 该partition leader选举次数
  - isr: [同步副本组brokerId列表]
2. get /consumers/[groupId]/offsets/[topic]/[partitionId]
  存储每个消费者在某个指定的topic的某个分区的消费偏移量

## broker
broker 是消息的代理，Producers往Brokers里面的指定Topic中写消息，Consumers从Brokers里面拉取指定Topic的消息，然后进行业务处理，broker在中间起到一个代理保存消息的中转站。

## 副本
1. sr，isr，osr(所有副本，副本同步队列，未同步的副本队列)
2. isr由每个partition的leader负责维护，follower定时从leader同步消息的副本(如果超时同步或者超过延时条数，leader都会将该folloer从isr中移除)

## kafka为什么那么快
一般影响消息系统性能的原因主要有：磁盘性能，大量小型的IO，以及过多的字节拷贝。而kafka可以一一解决
1. read-ahead and write-behind：Linux的读写缓存，以大的data block为单位预读数据，将多个小的逻辑写合并为一次大型物理磁盘写入
2. 顺序写：由于现代的操作系统提供了预读和写技术，磁盘的顺序写(磁头寻址时间短)大多数情况下比随机写内存还要快。
3. Zero-copy：传统的socket IO是`硬盘->内核缓冲区->用户缓冲区->socket缓冲区->NIC缓冲区`，而sendfile是`硬盘->内核缓冲区->NIC缓冲区`
4. 网络批处理：网络请求将多个消息打包成一组，使整组消息分担网络中往返的开销。
5. Pull：使用拉模式进行消息的获取消费，与消费端处理能力相符。

## producer的ack

1. 1(default): 只要leader确认接收消息成功，producer就认为消息发送成功
2. 0: producer把消息发出去就不管了，不需要等待回应。传输效率高，但可靠性低
3. -1:需要isr中所有的follower确认消息接受成功才算成功

## 消息丢失或重复消费
1. acks=0：不和Kafka集群进行消息接收确认，则当网络异常、缓冲区满了等情况时，消息可能丢失；
2. acks=1：同步模式下，只有Leader确认接收成功后但挂掉了，副本没有同步，数据可能丢失；
3. 重复消费问题：将消息的唯一标识存储到外部介质以供判断

## 为什么Kafka不支持读写分离
主写从读由两个缺点：
  - 数据一致性：follower从leader备份数据由延迟性，从读的话可能会导致数据不一致
  - 读取延时性：

## leader均衡机制
kafka有个优先副本机制，挂掉的优先副本重启后会重新担当leader角色，不会导致leader集中在某一个broker上，由下列参数控制：**auto.leader.rebalance.enable=true**，partition分区的分配机制，默认为hash取模，还有轮询或自定义

## leader选举
0.8.2版本后采用controller机制：kafka通过zookeeper选举某个broker为controller，再由controller指定每个partition的leader和follower

## log retention
1. 基于时间：默认超过7天即删除(关于日志分段文件的时间，首先判断对应的时间戳文件，然后判断分段文件的最后修改时间)
2. 基于大小：文件大小和retentionSize比较，超过即删除
3. 基于时间戳：

## 如何保证数据不丢失
1. consumer：acks=-1，同时增加follower同步数据的线程数
2. broker：retries=合理值
  - min.insync.replicas=2 消息至少要被写入到这么多副本才算成功
  - unclean.leader.election.enable=false 不允许非isr参选leader
3. consumer：enable.auto.commit=false 关闭自动提交offsets