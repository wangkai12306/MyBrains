title: 实操经验
---

## 集合
1. Arrays.asList()返回的是Arrays的内部类ArrayList，而不是java.util.ArrayList
   二者都继承自AbstractList类，但该类没有实现add、remove方法，而是直接抛出UnsupportedOperationException
   java.util.ArrayList实现了add、remove方法
   asList的官方解释：返回一个跟数组一样固定大小的list，跟Collection.toArray组成集合和数组之间的桥梁
   另外基本类型不能作为asList的参数，因为内部类ArrayList的构造方法的参数是范型数组，
   而范型参数不能是基本类型，只能是引用类型和基本类型的包装类

# OOM
### Azkaban
Azkaban excutor task被系统kill了，但没有任何错误日志。
使用jvm监控工具排查：jstat -gcutil PID 1s， 发现FGC次数太多。
查看oom_score：cat /proc/$PID/oom_score，值为20，偏高，可能会被系统杀死。

解决方法：
  - 增加Azkaban excutor的内存
  - echo -17 > /proc/$PID/oom_adj
> oom_adj是用户可以设置的参数，范围是-16到15，值越小被系统杀死的概率越小，-17表示不会被杀死。