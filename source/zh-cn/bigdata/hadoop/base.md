title: 基础概念
---
**开源，高可靠，可扩展的分布式计算框架**
**四个模块：**
  - common(基础设施)
  - HDFS(海量数据存储，默认备份3份)
  - MapReduce(海量数据分析)
  - Yarn(分布式资源调度)

## HDFS
#### namenode
  - 元数据信息
  - 内存存储，不会有磁盘IO
  - 持久化(fsimage,edits log)，不会持久化位置信息
  - block：偏移量，因为block大小不可调整，所以hdfs不支持修改

#### datanode
  - block：磁盘存储

#### Client([源码分析](http://www.cnblogs.com/popsuper1982/p/5585411.html))
  - **写**
    1. 根namenode通信请求上传文件，namenode检查目标文件是否已存在，父目录是否存在 
    2. namenode返回是否可以上传 
    3. client会先对文件进行切分，比如一个blok块128m，文件有300m就会被切分成3个块，一个128M、一个128M、一个44M请求第一个 block该传输到哪些datanode服务器上 
    4. namenode返回datanode的服务器 
    5. client请求一台datanode上传数据（本质上是一个RPC调用，建立pipeline），第一个datanode收到请求会继续调用第二个datanode，然后第二个调用第三个datanode，将整个pipeline建立完成，逐级返回客户端 
    6. client开始往A上传第一个block（先从磁盘读取数据放到一个本地内存缓存），以packet为单位（一个packet为64kb），当然在写入的时候datanode会进行数据校验，它并不是通过一个packet进行一次校验而是以chunk为单位进行校验（512byte），第一台datanode收到一个packet就会传给第二台，第二台传给第三台；第一台每传一个packet会放入一个应答队列等待应答 
    7. 当一个block传输完成之后，client再次请求namenode上传第二个block的服务器。

  - **读**
    1. 跟namenode通信查询元数据（block所在的datanode节点），找到文件块所在的datanode服务器 
    2. 挑选一台datanode（就近原则，然后随机）服务器，请求建立socket流 
    3. datanode开始发送数据（从磁盘里面读取数据放入流，以packet为单位来做校验） 
    4. 客户端以packet为单位接收，先在本地缓存，然后写入目标文件，后面的block块就相当于是append到前面的block块最后合成最终需要的文件。

## Yarn
#### ResourceManager
  1. 整个集群只有一个，负责集群资源的统一管理和调度
  2. 详细功能
    - 处理客户端请求
    - 启动/监控ApplicationMaster
    - 监控NodeManager
    - 资源分配与调度

#### NodeManager
  1. 整个集群有多个，负责单节点资源管理和使用
  2. 详细功能
    - 单个节点上的资源管理和任务管理
    - 处理来自ResourceManager的命令
    - 处理来自ApplicationMaster的命令

#### ApplicationMaster
  1. 每个应用有一个，负责应用程序的管理
  2. 详细功能
    - 数据切分
    - 为应用程序申请资源，并进一步分配给内部任务
    - 任务监控与容错

#### Container
  1. 对任务运行环境的抽象
  2. 描述一系列信息
    - 任务运行资源（节点、内存、CPU）
    - 任务启动命令
    - 任务运行环境

#### 处理流程
  1. 用户向YARN中提交应用程序，其中包括ApplicationMaster程序、启动ApplicationMaster的命令、用户程序等。
  2. ResourceManager为该应用程序分配第一个Container，并与对应的Node-Manager通信，要求它在这个Container中启动应用程序的ApplicationMaster。
  3. ApplicationMaster首先向ResourceManager注册，这样用户可以直接通过ResourceManager查看应用程序的运行状态，然后它将为各个任务申请资源，并监控它的运行状态，直到运行结束，即重复步骤4~7。
  4. ApplicationMaster采用轮询的方式通过RPC协议向ResourceManager申请和领取资源。
  5. 一旦ApplicationMaster申请到资源后，便与对应的NodeManager通信，要求它启动任务。
  6. NodeManager为任务设置好运行环境（包括环境变量、JAR包、二进制程序等）后，将任务启动命令写到一个脚本中，并通过运行该脚本启动任务。
  7. 各个任务通过某个RPC协议向ApplicationMaster汇报自己的状态和进度，以让ApplicationMaster随时掌握各个任务的运行状态，从而可以在任务失败时重新启动任务。在应用程序运行过程中，用户可随时通过RPC向ApplicationMaster查询应用程序的当前运行状态。
  8. 应用程序运行完成后，ApplicationMaster向ResourceManager注销并关闭自己。
  9. 资源队列
    - FIFO先进先出
    - Capacity层级队列(默认)，将集群资源分成各个队列，每个队列可继续拆分子队列，可以从队列、用户、应用等层面进行资源限制。空闲的资源可以分配给任何队列。队列内部的调度遵循FIFO。有弹性队列机制
      常用配置：队列占比，队列最大占比，用户使用占比，最大应用运行数量，调度尝试次数，acl控制
    - Fair Scheduler

## MapReduce
#### job提交过程
1. 通过job.waitForCompletion方法提交，该方法内部会调用job.submit()方法。在submit中会调用setUseNewAPI()，setUseNewAPI()这个方法主要是判断是使用新的api还是旧的api，之后会调用connect()方法，该方法主要是实例化jobClient，然后会调用jobClient.submitJobInternal这个方法提交job
2. jobClient.submitJobInternal()：
  1. Checking the input and output specifications of the job.
  2. Computing the InputSplit values for the job.
  3. Setting up the requisite accounting information for the DistributedCache of the job, if necessary.
  4. Copying the job's jar and configuration to the MapReduce system directory on the FileSystem.
  5. Submitting the job to the ResourceManager and optionally monitoring it's status.
    - checkspecs：检查job的输出路径，为了避免数据的丢失，如果输出路径存在，会抛出异常。
    - JobSubmissionFiles.getStagingDir：获取job提交的根目录并赋权限(700)
    - copyAndConfigureFiles：将job运行所需的全部文件上传到提交目录（getStagingDir/jobId），同时进行备份（备份数默认是10，通过mapred.submit.replication变量可以设置）
    - writeNewSplits：获取切片。
  6. 根据我们设置的inputFormat.class通过反射获得inputFormat对象，然后调用inputFormat对象的getSplits方法，当获得切片信息之后调用JobSplitWriter.createSplitFiles方法将切片的信息写入到submitJobDir/job.split文件中
   ```
      input->TextInputFormat.class
      input.getSplits(job);
      minSize = Math.max(getFormatMinSplitSize(), getMinSplitSize(job));
      maxSize = getMaxSplitSize(job);（特别大）
      blkLocations = fs.getFileBlockLocations(file, 0, length);
      blockSize = file.getBlockSize();
      splitSize = computeSplitSize(blockSize, minSize, maxSize);
      Math.max(minSize, Math.min(maxSize, blockSize));
      splits.add(makeSplit(path, length-bytesRemaining, splitSize, blkLocations[blkIndex].getHosts(), blkLocations[blkIndex].getCachedHosts()));
   ```
  7. getSplits->computeSplitSize(blockSize, minSize, maxSize)：计算切片大小，默认=blocksize(若minSize>blocksize，将取若minSize值)，->makeSplit(file, start, length, hosts, inMemoryHosts)：生成切片
  8. Arrays.sort(array, new SplitComparator())：根据分片大小按大到小排序
  9. createSplitFiles：将分片信息写入到submitJobDir/job.split和job.splitmetainfo文件中，方法内部调用JobSplitWriter.writeNewSplits进行写操作
  10. 将job的配置文件信息(jobConf对象)写入到job.xml文件中。
  11. 提交job，若失败将删除job提交的根目录

#### Map task启动
负责资源管理的ResourceManager在nodemanager上启动一个Container进程，调用MapTask中的run方法，继续调用runNewMapper方法。

#### Map task
概述，首先，通过用户提供的InputFormat将对应的InputSplit解析成一系列key/value，并依次交给用户编写的map()函数处理；接着按照指定的Partitioner对数据分片，以确定每个key/value将交给哪个Reduce Task处理；之后将数据交给用户定义的Combiner进行一次本地规约（用户没有定义则直接跳过）；最后将处理结果保存到本地磁盘上
1. Read阶段
  通过用户提供的InputFormat创建一个行记录读取器(LineRecordReader)，初始化split信息，取得split的文件，偏移量，长度等信息，将行信息交给Mapper执行(若不是第一个split，将抛弃读取的第一行)。Map Task通过用户编写的RecordReader，从输入InputSplit中解析出一个个key/value
  
  LineRecordReader类
    **input**
     ```
        real = inputFormat.createRecordReader(split, taskContext);
        new LineRecordReader(recordDelimiterBytes);
     ```
    **input.initialize**
     ```
        start = split.getStart();
        end = start + split.getLength();
        file = split.getPath();
        fileIn.seek(start);
        in = new UncompressedSplitLineReader(fileIn, job, this.recordDelimiterBytes, split.getLength());
        if (start != 0) {
            start += in.readLine(new Text(), 0, maxBytesToConsume(start));
        }
        pos = start;
     ```
    **nextKeyValue**
     ```
        key.set(pos);
        in.readLine(value, maxLineLength, maxBytesToConsume(pos));
     ```
    **getCurrentKey()**
    **getCurrentValue()**
    **InputFormat**
    在map任务之前对分片力道数据进行预处理(针对分片数据决定以什么方式(格式)输入给map任务)
      - FileInputFormat(TextInputFormat)：把分片数据一行一行读取，每行的下标位为key，每行记录为value，传给map任务(默认)
      - NLineInputFormat: splits按照行数N来划分，(N可以自定义，默认为1)
      - CombineFileInputFormat:将多个文件合成一个split作为输入
      - KeyValueTextInputFormat:按行读取，制表符(\t)为分隔符，第一个字符串为key，后续为value
      - SequenceFileInputFormat：处理二进制类型的文件
      - FixedLengthRecordReader：处理行不等长的文件

2. Map阶段：
  该阶段主要是将解析出的key/value交给用户编写的map()函数处理，并产生一系列新的key/value 。
  > 自定义数据类型注意事项
    1. 继承接口Writable,实现其方法write()和readFields(), 以便该数据能被序列化后完成网络传输或文件输入/输出；
    2. 如果该数据需要作为主键key使用，或需要比较数值大小时，则需要实现WritalbeComparable接口,实现其方法write(),readFields(),CompareTo() 
    3. 数据类型，必须要有一个无参的构造方法，为了方便反射，进行创建对象。    
    4. 在自定义数据类型中，建议使用Java的原生数据类型，不要使用Hadoop的封装类型。比如 int x ;//IntWritable 和String s; //Text等等

3. Combiner阶段
  当Map Task处理完所有数据后，内部类NewOutputCollect的close方法调用内部类MapOutputBuffer的flush方法，最终调用mergeParts方法对所有临时文件进行一次合并。在进行文件合并过程中，MapTask以分区为单位进行合并。对于某个分区，它将采用多轮递归合并的
  方式：每轮合并io.sort.factor(默认为100)个文件，将产生的文件重新加入待合并列表，对文件排序后，重复以上过程，直到最终得到一个大文件
4. sort阶段
  默认比较类：WritableComparetor，调用key本身自带的compare方法。
5. Spill阶段
  - 即溢写，当环形缓冲区满后，MapReduce会将数据写到本地磁盘上，生成一个临时文件。需要注意的是，将数据写入本地磁盘之前，先要对数据进行一次本地排序，并在必要时对数据进行合并、压缩等操作。环形缓冲区默认大小100M，缓冲区溢写默认阈值0.8
  - OutputFormat：在reduce任务之后，决定reduce把数据通过什么形式或者格式输出到哪里(可通过继承来自定义)
  - 默认：FileOutputFormat：reduce输出的每条记录写到HDFS，而且每条记录写一行
6. Patition阶段
  在用户编写的map()函数中，当数据处理完成后调用OutputCollector.collect()输出结果。在该函数内部，它会将生成的key/value分片（通过调用Partitioner），并写入一个环形内存缓冲区中。若reduce数不为0，用NewOutputCollector类实例化RecordWriter。该类中的write方法调用partitioner.getPartition函数获取记录的分区号partition，然后将三元组（key，value，partition）传递给MapOutputCollector.collect()函数做进一步处理。MapOutputBuffer采用环形内存缓冲区保存数据，当缓冲区使用率达到一定阈值后，由线程SpillThread将数据写到一个临时文件中，当所有数据处理完毕后，对所有临时文件进行一次合并以生成一个最终文件。环形缓冲区使得MapTask的Collect阶段和Spill阶段可并行执行。

#### Reduce task
  概述，首先需要通过HTTP请求从各个已经运行完成的Map Task上拷贝对应的数据分片，待所有数据拷贝完成后，再以key为关键字对所有数据进行排序，通过排序，key 相同的记录聚集到一起形成若干分组，然后将每组数据交给用户编写的reduce()函数处理，并将数据结果直接写到HDFS上作为最终输出结果。

#### copy阶段
  reduce默认开启5个线程进行复制操作

#### group阶段
  根据key是否相同分组

#### 二次排序阶段
  把一个partition中的所有分片进行排序。调用Mapper中的sort方法。

#### InputSplit
  1. InputSplit是指分片，在MapReduce当中作业中，作为map task最小输入单位。分片是基于文件基础上出来的而来的概念，通俗的理解一个文件可以切分为多少个片段，每个片段包括了<文件名，开始位置，长度，位于哪些主机>等信息。在MapTask拿到这些分片后，会知道从哪开始读取数据。

  2. 我们指定一个目录作为job的输入源时，用户指定的MapTask的个数，以及文件总长度，块大小，以及用户指定的最小分片长度会影响到最后可以产生多少个分片，也就是这个Job最后需要执行多少次MapTask。

  3. 同时，还可以得知，一个分片是不会跨越两个文件的；一个空的文件也会占用到一个分片；不是每个分片都是等长的；以及一个分片可以跨一个大文件中连续的多个block。

  4. 主机列表是指做task的时候，JobTracker会把Task发送到主机列表所在的节点上，由该节点来执行task。如果一个分片只包含一个block，那么就没有上述这么复杂的情况，只要将这个块对应的信息（BlockLocation）中的主机列表信息返回即可。

  5. 当一个分片包含的多个block的时候，总会从其他节点读取数据，也就是做不到所有的计算都是本地化。为了发挥计算本地化性能，应该尽量使InputSplit大小与块大小相当。

## namenode元数据
#### 镜像文件(Fsimage)
1. 修改时间
2. 访问时间
3. block size
4. block位置

#### 目录
1. 修改时间
2. 访问权限
3. 日志文件（EditLog）所有操作