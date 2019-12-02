title: 窗口函数
---
## 聚合函数
1. **sum:** 累加
2. **count:** 统计
3. **avg:** 均值
4. **max:** 最大值
5. **min:** 最小值

## 排序函数
1. **row_number:** 行号，依次排序
2. **rank:** 行号，重复跳跃排序
3. **dense_rank:** 行号，重复依次排序

## 分析函数
1. **lead(xxx,n,[default]):** 分组排序后取xxx所在行的**`后`**n行值，如果是NULL则置为default
2. **lag(xxx,n,[default]):** 分组排序后取xxx所在行的**`前`**n行值，如果是NULL则置为default
3. **ntile(n):** 排序后n等分，不能均分时保证第一个分片最多，每个分片之间的差值最大是1
4. **first_value(xxx):** 分组排序后取**`第一个`**值
5. **last_value(xxx):** 分组排序后取**`最后一个`**值

## OVER
1. **partition by x:** 根据指定字段分区
2. **order by x [asc|desc]:** 根据指定字段排序，asc生序(默认)，desc降序
3. **rows between x preceding[current row] and n following[current row]:** 指定窗口大小
  - **n preceding:** 当前行向前n行
  - **unbounded preceding:** 第一行开始
  - **current row:** 当前行
  - **n following:** 当前行向后n行
  - **unbounded following:** 最后一行结束

## GROUP BY a,b,c
1. **with cube:** 所有的维度组合，等价于
```sql
   grouping sets(
    (a,b,c)
   ,(a,b)
   ,(a,c)
   ,(b,c)
   ,(a)
   ,(b)
   ,(c)
   ,()
   )
```
2. **grouping sets:** 指定部分维度组合，如
```sql
   grouping sets(
    (a,b,c)
   ,(a,b)
   ,(a)
   ,(b)
   ,()
   )
```
3. **with rollup:** 以最左侧字段为主，从右向左依次递减，适用于嵌套维度/等价于
```sql
   grouping sets(
    (a,b,c)
   ,(a,b)
   ,(a)
   ,()
   )
```
4. **grouping__id:** 用于标记维度组合，值为各维度的二进制值的组合。NULL为0，非NULL为1，**`从左向右低位到高位`**

|a|b|c|grouping__id|
|:-|:-|:-|:-|
|xx|yy|zz|7(111)|
|NULL|yy|zz|6(110)|
|xx|NULL|zz|5(101)|
|NULL|NULL|zz|4(100)|
|xx|yy|NULL|3(011)|
|NULL|yy|NULL|2(010)|
|xx|NULL|NULL|1(001)|
|NULL|NULL|NULL|0(000)|

## 举例
```sql
select
     city_name
    ,block_name
    ,gdp
    ,row_number() over (partition by city_name order by gdp) as 1 -- 行号，依次排序
    ,rank() over (partition by city_name order by gdp) as 2 -- 行号，重复跳跃排序
    ,dense_rank() over (partition by city_name order by gdp) as 3 -- 行号，重复依次排序
    ,round(percent_rank() over (partition by city_name order by gdp),2) as 4 -- 当前行rank-1/总行数-1
    ,max(gdp) over (partition by city_name) as 5 -- 分区所有行
    ,min(gdp) over (partition by city_name order by gdp) as 6  -- 首行到当前行
    ,round(avg(gdp) over (partition by city_name),2) as 7
    ,round(avg(gdp) over (partition by city_name order by gdp),2) as 8
    ,count(gdp) over (partition by city_name) as 9 -- 分区所有行
    ,sum(gdp) over (partition by city_name) as 10
    ,sum(gdp) over (partition by city_name order by gdp) as 11 -- 首行到当前行
    ,sum(gdp) over (partition by city_name order by gdp rows between unbounded preceding and unbounded following) as 12  -- 分区所有行
    ,sum(gdp) over (partition by city_name order by gdp rows between unbounded preceding and current row) as 13  -- 首行到当前行
    ,sum(gdp) over (partition by city_name order by gdp rows between 1 preceding and current row) as 14 -- 前一行到当前行
    ,sum(gdp) over (partition by city_name order by gdp rows between current row and 1 following) as 15 -- 当前行到下一行
    ,sum(gdp) over (partition by city_name order by gdp rows between current row and unbounded following) as 16 -- 当前行到最后一行
    ,lag(gdp,1,0) over (partition by city_name order by gdp) as 17 -- 当前行的前1行gdp，如果为null则置为0
    ,lead(gdp,2,0) over (partition by city_name order by gdp) as 18 -- 当前行的后2行gdp
    ,first_value(gdp) over (partition by city_name) as 19 -- 分组排序后第一个值，所有行(由于没有排序貌似是随机)
    ,first_value(gdp) over (partition by city_name order by gdp) as 20 -- 分组排序后第一个值，首行到当前行
    ,last_value(gdp) over (partition by city_name) as 21 -- 分组排序后最后一个值，所有行(由于没有排序貌似是随机)
    ,last_value(gdp) over (partition by city_name order by gdp) as 22 -- 分组排序后最后一个值，首行到当前行
    ,ntile(4) over (order by gdp) as 23 -- 所有值排序后分成4份
    ,ntile(3) over (partition by city_name order by gdp) as 24 -- 分组排序后分成3份
    ,round(cume_dist() over (partition by city_name order by gdp),2) as 25 -- 分组内小于等于当前值的行数/总行数
from table;
```

|city|bk|gdp|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|
|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|
|上海|静安|1|1|1|1|0|9|1|4.43|1|7|31|1|31|1|1|3|31|0|3|3|1|8|1|1|1|0.14|
|上海|人广|2|2|2|2|0.17|9|1|4.43|1.5|7|31|3|31|3|3|5|30|1|3|3|1|8|2|1|1|0.29|
|上海|南西|3|3|3|3|0.33|9|1|4.43|2.25|7|31|9|31|6|5|6|28|2|5|3|1|8|3|2|1|0.57|
|上海|彭浦|3|4|3|3|0.33|9|1|4.43|2.25|7|31|9|31|9|6|8|25|3|8|3|1|8|3|2|2|0.57|
|上海|共康|5|5|5|4|0.67|9|1|4.43|2.8|7|31|14|31|14|8|13|22|3|9|3|1|8|5|3|2|0.71|
|上海|大桥|8|6|6|5|0.83|9|1|4.43|3.67|7|31|22|31|22|13|17|17|5|0|3|1|8|8|4|3|0.86|
|上海|大宁|9|7|7|6|1|9|1|4.43|4.43|7|31|31|31|31|17|9|9|8|0|3|1|8|9|4|3|1|
|北京|电视|1|1|1|1|0|9|1|5.29|1|7|37|1|37|1|1|3|37|0|5|5|1|1|1|1|1|0.14|
|北京|东单|2|2|2|2|0.17|9|1|5.29|1.5|7|37|3|37|3|3|7|36|1|5|5|1|1|2|1|1|0.29|
|北京|公园|5|3|3|3|0.33|9|1|5.29|3.25|7|37|13|37|8|7|10|34|2|7|5|1|1|5|3|1|0.57|
|北京|庆丰|5|4|3|3|0.33|9|1|5.29|3.25|7|37|13|37|13|10|12|29|5|8|5|1|1|5|2|2|0.57|
|北京|京广|7|5|5|4|0.67|9|1|5.29|4|7|37|20|37|20|12|15|24|5|9|5|1|1|7|3|2|0.71|
|北京|国贸|8|6|6|5|0.83|9|1|5.29|4.67|7|37|28|37|28|15|17|17|7|0|5|1|1|8|4|3|0.86|
|北京|东门|9|7|7|6|1|9|1|5.29|5.29|7|37|37|37|37|17|9|9|8|0|5|1|1|9|4|3|1|
|苏州|西山|2|1|1|1|0|7|2|4.4|2|5|22|2|22|2|2|5|22|0|4|2|2|7|2|1|1|0.2|
|苏州|皮球|3|2|2|2|0.25|7|2|4.4|2.5|5|22|5|22|5|5|7|20|2|6|2|2|7|3|2|1|0.4|
|苏州|木渎|4|3|3|3|0.5|7|2|4.4|3|5|22|9|22|9|7|10|17|3|7|2|2|7|4|2|2|0.6|
|苏州|金鸡|6|4|4|4|0.75|7|2|4.4|3.75|5|22|15|22|15|10|13|13|4|0|2|2|7|6|3|2|0.8|
|苏州|独墅|7|5|5|5|1|7|2|4.4|4.4|5|22|22|22|22|13|7|7|6|0|2|2|7|7|3|3|1|


> 提示：在使用窗口函数的过程中，要特别注意ORDER BY子句的使用。跟聚合函数和分析函数配合使用时表示第一行到当前行，否则表示所有行