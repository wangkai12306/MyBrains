title: 数据仓库
---

## 基础
### 数据获取和数据分析
1. 数据获取基于事物，不必维护历史数据，只需反映最新状态
2. 数据分析基于历史数据，支持用户对数据的各种使用

### 数仓要解决的问题
1. 海量数据无法访问
2. 以各种方式对数据进行切片
3. 业务人员方便的获取数据
4. 最重要的事情展现出来
5. 基于数据决策

### 数仓管理者的责任
1. 理解业务用户
* 理解他们的工作责任、目标和任务
* 确定用户的哪些决策需要数仓支持
* 发现新用户，并让他们意识到数仓能给他们带来什么能力的
2. 对业务用户发布高质量、相关的、可访问对信息和分析
* 尽可能容纳各种数据源的数据
* 简化用户接口和应用，与用户认知匹配
* 确保数据的准确性，一致性
* 不间断的监控数据
* 使用用户不断变化的思维方式，需求和业务优先级

## 维度建模
### 设计过程
1. 选择业务过程(确认或划分主题域)
2. 声明粒度(确定事实表中的一行数据表示什么)
3. 确认纬度(描述事实)
4. 确认事实(指标?)

### 事实表
1. 事务事实表
2. 周期快照事实表(每行汇总了某个周期内的度量事件)
3. 累积快照事实表(每行汇总了一个过程开始到结束的度量事件)
4. 无事实的事实表

### 维度表
1. 代理键(纬度组合的主键，用于跟踪纬度变化，一般用无实际意义的整型数值且自增)，join效率高于业务键
2. 退化维度(只有主键，没有对应的维度表)

### 缓慢变化维
1. 覆盖(保留最新状态，但会破坏历史状态，尤其是聚合数据)
2. 增加行(使用代理键区分)
3. 增加列(将新值放在新增的列里)