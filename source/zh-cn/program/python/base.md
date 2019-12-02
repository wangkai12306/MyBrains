title: Python基础
---

## 基础

1. 列出5个常用Python标准库？
os, sys, re, math, datetime, time, logging, functools
2. Python内建数据类型有哪些？
  - 可变：列表，字典，集合
  - 不可变：数字，字符串，元组，bytes
3. 简述with方法打开处理文件帮我我们做了什么？
  with语句实质是上下文管理。 
  - 上下文管理协议。包含方法__enter__() 和 __exit__()，支持该协议对象要实现这两个方法。 
  - 上下文管理器，定义执行with语句时要建立的运行时上下文，负责执行with语句块上下文中的进入与退出操作。 
  - 进入上下文的时候执行__enter__方法，如果设置as var语句，var变量接受__enter__()方法返回值。 
  - 如果运行时发生了异常，就退出上下文管理器。调用管理器__exit__方法。
4. 列出Python中可变数据类型和不可变数据类型，为什么？
5. Python获取当前日期？
```
  from datetime import datetime
  print(datetime.now())
```
6. 统计字符串每个单词出现的次数
```
  message='The quick brown fox jumps over the lazy dog'
  count={}
  for word in message.split():
      word = word.lower()
      count.setdefault(word,0)
      count[word]=count[word]+1
  print(count)
```
7. 用python删除文件和用linux命令删除文件方法
os.remove(file)    rm -rf file
8. 举例说明异常模块中try except else finally的相关意义
  - try：包裹可能出现异常和错误的语句
  - except：捕获异常
  - else：没有异常发生时执行的语句
  - finally：不管有没有异常最终都会执行的语句，一般用于connection关闭

## 语言特性
1. 谈谈对 Python 和其他语言的区别
  - 主要是解释型和编译型语言的区别
  - 解释型是代码执行时逐句翻译成CPU可以理解的机器码，由于没有预编译的步骤，执行起来会很慢，常用语应用级别的编程
  - 编译型有预编译(只一次)的环节，所以CPU直接执行编译好的机器码，很快
3. Python 的解释器种类以及相关特点？
  - CPython：官方默认类型，该解释器最大的特点是GIL
  - JPython：可以直接把Python代码编译成Java字节码执行
  - IPython：交互升级的CPython
  - PyPy：动态编译，执行速度快
4. 说说你知道的Python3 和 Python2 之间的区别？
  - print：3必须有括号；2可有可无
  - input：3得到str；2得到int，raw_input得到str
  - 计算：3 3/2=1.5；2 3/2=1
  - range：3返回可迭代对象，可用list()转换；2 返回list，xrange返回生成器
  - 编码：3是utf-8，内存里是unicode，2是ascii
5. Python3 和 Python2 中 int 和 long 区别？
3没有long

## 编码规范
7. 什么是 PEP8
代码规范，比如缩进，空格和tab不能混用，一行不要import多个包，一行最大79字符，命名等
8. 了解 Python 之禅么？
就是对python特点，用法和规范的简介
9. 了解 docstring 么？
  - 文档字符串是一个重要工具，用于解释文档程序，帮助你的程序文档更加简单易懂。
  - 可以在函数体的第一行用三个单引号或双引号定义文档字符串
  - 可以调用 __doc__ 查看
10. 了解类型注解么？
给变量和参数加上类型注解可以提高代码可读性，但不影响程序执行，解释器不会根据注解来确定类型
11. 例举你知道 Python 对象的命名规范，例如方法或者类等
首先要避免跟内建库不要重名，类名首字母大写，方法名首字母小写，变量参数全是小写，私有变量是__xxx，常量全部大写
12. Python 中的注释有几种？
单行#，多行””””””或者’’’’’’
13. 如何优雅的给一个函数加注释？
docstring
14. 如何给变量加注释？
上一行或者本行末尾
15. Python 代码缩进中是否支持 Tab 键和空格混用。
不支持
16. 是否可以在一句 import 中导入多个库?
可以但不建议，且最好不要用from xxx import *
17. 在给 Py 文件命名的时候需要注意什么?
要避免跟内建库不要重名
18. 例举几个规范 Python 代码风格的工具
yapf，black

## 数据类型
#### 字符串

19. 列举 Python 中的基本数据类型？
int，float，dict，tuple，list，set，str
20. 如何区别可变数据类型和不可变数据类型
21. 将"hello world"转换为首字母大写"Hello World"
str.title()
22. 如何检测字符串中只含有数字?
```
  str.isdigit()
  re.match(r'\d+$', str) is not None
```
23. 将字符串"ilovechina"进行反转
```
  str[::-1]
  reduce(lambda x, y: y+x, str)
```
24. Python 中的字符串格式化方式你知道哪些？
```
  "I love %s" % xxx
  "I love {1}".format(xxx)
```
25. 有一个字符串开头和末尾都有空格，比如“ adabdw ”,要求写一个函数把这个字符串的前后空格都去掉。
re.sub(r"^(\s+)|(\s+)$", "", s)，或者递归
26. 获取字符串”123456“最后的两个字符。
str[-2::]
27. 一个编码为 GBK 的字符串 S，要将其转成 UTF-8 编码的字符串，应如何操作？
str.decode(‘gbk’).encode(‘utf-8’)
28. 字符串切割替换
  - s="info：xiaoZhang 33 shandong"，用正则切分字符串输出['info', 'xiaoZhang', '33', 'shandong']
  ```
    result = re.match(r'([a-z]+): ([a-zA-Z]+) (\d+) ([a-z]+)', s)
    result_list = []
    for x in range(1, 5):
        result_list.append(result.group(x))
    re.compile(r'\W').split(s)
  ```
  - a = "你好 中国 "，去除多余空格只留一个空格。
    a.strip()
29. 
  - 怎样将字符串转换为小写：str.lower()
  - 单引号、双引号、三引号的区别？
    单引号和双引号没啥区别，且可混用，三引号主要用于多行字符串

#### 列表
30. 已知 AList = [1,2,3,1,2],对 AList 列表元素去重，写出具体过程。
  - tmp = list(set(AList))
  - tmp.sort(key=AList.index)
  - for循环
  - list(dict.fromkeys(AList))
31. 如何实现 "1,2,3" 变成 ["1","2","3"]
s.split(‘,’)
32. 给定两个 list，A 和 B，找出相同元素和不同元素
```
  差集
  ret = []
  for i in a:
      if i not in b:
          ret.append(i)
  ret = [i for i in a if i not in b]
  ret = list(set(a) ^ set(b))
  list(set(b).difference(set(a)))
  交集
  list(set(a).intersection(set(b)))
  并集
  list(set(a).union(set(b)))
```
33. [[1,2],[3,4],[5,6]]一行代码展开该列表，得出[1,2,3,4,5,6]
```
  [xx for x in list for xx in x]
  reduce(lambda x, y: x + y, list)
```
34. 合并列表[1,5,7,9]和[2,2,6,8]
a1 + a2
35. 如何打乱一个列表的元素？
random.shuffle(list)

#### 字典
36. 字典操作中 del 和 pop 有什么区别
pop有返回值
37. 按照字典的内的年龄排序
```
  sorted(dict.items(), key=lambda x: x[1], reverse=True|False)
  dict.sort(key=lambda x: x['age'])
```
38. 请合并下面两个字典 a = {"A":1,"B":2},b = {"C":3,"D":4}
```
  dict(a, **b)
  dict(a.items() + b.items())  #python3不支持
```
39. 如何使用生成式的方式生成一个字典，写一段功能代码。
```
  import random
  stuInfo = {'student' + str(i): random.randint(60, 100) for i in range(20)}
  print({name: score for name, score in stuInfo.items() if score > 90})
```
40. 如何把元组("a","b")和元组(1,2)，变为字典{"a":1,"b":2}
dict(zip(a, b))

#### 综合
41. Python常用的数据结构的类型及其特性？
  - dict占空间资源，但查询效率高
  - list是有序集合，可重复，插入查询效率低
  - tuple是不可变的列表，但元组中的元素可以是可变类型
  - set有序不可重复
42. 如何交换字典 {"A"：1,"B"：2}的键和值？
```
  dict(zip(mydict.values(),mydict.keys()))
  dict(v:k for k,v in mydict.items()
```
43. Python 里面如何实现 tuple 和 list 的转换？
  - list(tuple)
  - tuple(list)
44. 我们知道对于列表可以使用切片操作进行部分元素的选择，那么如何对生成器类型的对象实现相同的功能呢？
itertools.islice
45. 请将[i for i in range(3)]改成生成器
(i for i in range(3))
46. a="hello"和 b="你好"编码成 bytes 类型
str1.encode('utf-8')

生成器可以看成是带有yield关键字的函数，生成器只存储计算逻辑，不存储真实数据。生成器可用next迭代，每次迭代遇到yield则返回，下次接着yield后面的语句执行。
For循环的本质是通过将可迭代对象转成迭代器，并不断调用next()实现的
enumerate(iterable, start)内置函数可以返回list的(索引,元素)对
zip()函数可以组合两个列表，长度以短的为准
map() 会根据提供的函数对指定序列做映射。
`__slot__`可以限制类实例能添加的属性
@property装饰器可以将类方法变成属性进行调用(典型如get，set方法)
`__iter__`和`__next__`搭档使用可以让类变的可迭代
`__call__`可以实现链式调用
一个ThreadLocal变量虽然是全局变量，但每个线程都只能读写自己线程的独立副本，互不干扰。ThreadLocal解决了参数在一个线程中各个函数之间互相传递的问题。
CPython由于GIL(全局互斥锁)的存在，无法实现多线程在多核CPU上运行
Base64是一种用64个字符来表示任意二进制数据的方法。
Python的高阶函数、装饰器，反射、元编程、各种魔术方法，Python的解释器运行机制是什么，垃圾回收原理又是什么，为什么Python多线程鸡肋？GIL无解了吗？

## 操作类题目

49. Python 交换两个变量的值
a, b = b, a
50. 在读文件操作的时候会使用 read、readline 或者 readlines，简述它们各自的作用
  - read：从文件读入指定的字节数，如果不指定则读入全部
  - readline：读取整行，包括换行符 \n。也可以指定字节数但一般不用
  - readlines：读取所有行并返回list
51. json 序列化时，可以处理的数据类型有哪些？如何定制支持 datetime 类型？
  - 序列化(dumps(data, sort_keys=True, indent=4, ensure_ascii=False))：将python dict编码为JSON
  ```
    import json
    from datetime import datetime
    from json import JSONEncoder
    class CustomeJson(JSONEncoder):
        def default(self, obj):
            if isinstance(obj, datetime):
                return obj.strftime('%Y-%m-%d %H:%M:%S')
            else:
                return super(ComplexEncoder,self).default(obj)
  ```
  - 反序列化(loads)：将JSON解码为python dict
52. json 序列化时，默认遇到中文会转换成 unicode，如果想要保留中文怎么办？
json.dumps(data, ensure_ascii=False)
53. 有两个磁盘文件 A 和 B，各存放一行字母，要求把这两个文件中的信息合并(按字母顺序排列)，输出到一个新文件C中
```
  with open('a1', 'r') as f1:
      a1 = f1.read()
  with open('a2', 'r') as f2:
      a2 = f2.read()
  a3 = ''.join((lambda x: (x.sort(), x)[1])(list(a1 + a2)))
  with open('a3', 'w') as f3:
      f3.write(a3)
```
54. 如果当前的日期为 20190530，要求写一个函数输出 N 天后的日期，(比如 N 为 2，则输出 20190601)。
(datetime.strptime('20190530', '%Y%m%d') + timedelta(2)).strftime('%Y%m%d')
55. 写一个函数，接收整数参数 n，返回一个函数，函数的功能是把函数的参数和 n 相乘并把结果返回
```
  def test(num):
      def func(n1):
          return n1 * num
      return func
  a1 = test(6)
  print(a1(2))
```
57. 一行代码输出 1-100 之间的所有偶数。
  - list(filter(lambda x: x % 2 == 0, [i for i in range(100)]))
  - [i for i in range(100) if i % 2 == 0]
58. with 语句的作用，写一段代码？
59. python 字典和 json 字符串相互转化方法
dumps和loadss
60. 请写一个 Python 逻辑，计算一个文件中的大写字母数量
```
  with open('123.txt','r') as file:
      count=0
      content=file.read()
      for i in content:
          if i.isupper():
              count+=1
  print(count)
  print(len(re.compile(r'[A-Z]').findall(content)))
```
61. 请写一段 Python连接 Mongo 数据库，然后的查询代码。
```
  import pymongo
  mongo_cli = pymongo.MongoClient("mongodb://localhost:27017/")
  mydb = mongo_cli["runoobdb"]
  mycol = mydb[‘xxx’]
  x = mycol.find_one()
  print(x)
```
62. 说一说 Redis 的基本类型。
  - String 类型是 Redis 最基本的数据类型，string 类型的值最大能存储 512MB
  - Hash 是一个 string 类型的 field 和 value 的映射表，hash 特别适合用于存储对象
  - List 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）
  - Set是string类型的无序集合，通过哈希表实现，所以添加，删除，查找的复杂度都是O(1)
  - zSet像是set和list的结合体，不允许重复且有序
63. 请写一段 Python连接 Redis 数据库的代码
```
  import redis
  r = redis.Redis(host='192.168.0.110', port=6379,db=0)
  r.set('name', 'zhangsan')   #添加
  print (r.get('name'))   #获取
```
64. 请写一段 Python 连接 MySQL 数据库的代码。
```
  import pymysql as mysql
  conn = mysql.connect(host=self.host,
                       port=self.port,
                       user=self.user,
                       passwd=self.passwd,
                       db=self.db)
  cur = conn.cursor()
  cur.execute(sql)
```
65. 了解 Redis 的事务么？
Redis 事务可以一次执行多个命令， 并且带有以下三个重要的保证：
  - 批量操作在发送 EXEC 命令前被放入队列缓存。
  - 收到 EXEC 命令后进入事务执行，事务中任意命令执行失败，其余的命令依然被执行。
  - 在事务执行过程，其他客户端提交的命令请求不会插入到事务执行命令序列中。
66. 了解数据库的三范式么？
  - 1NF：属性必须具备原子性，不可分割
  - 2NF：非主属性都必须完全依赖于主属性
  - 3NF：非主属性不能依赖于其他非主属性
67. 了解分布式锁么？
68. 用 Python 实现一个 Reids 的分布式锁的功能。
69. 写一段 Python 使用 Mongo 数据库创建索引的代码。

## 高级特性
70. 函数装饰器有什么作用？请列举说明？
将通用的代码块封装起来给其他函数提供额外的功能，比如数据库连接，logging等等
71. Python 垃圾回收机制？
  - [-5, 257) 这些整数对象是提前建立好的，不会被垃圾回收
  - 引用计数：当计数为0时回收内存空间(无法解决循环引用问题)
  - 标记清除：标记可达的活动对象，未被标记的将被清除(主要处理容器对象)
  - 分代回收：根据对象存活时间氛围年轻代，中年代，老年代
72. 魔法函数`__call__`怎么使用?
创建类时定义了`__call__`方法那么这个类型就是可调用的，此时就是可以直接对实例进行调用callable()方法可以判断某个对象是否能被调用
73. 如何判断一个对象是函数还是方法？
```
  from types import MethodType, FunctionType
  isinstance(object, FunctionType)
  isinstance(object, MethodType)
```
74. @classmethod 和@staticmethod 用法和区别
  - 实例方法：该实例属于对象，该方法的第一个参数是当前实例，拥有当前类以及实例的所有特性。
  - 类方法：该实例属于类，该方法的第一个参数是当前类，可以对类做一些处理。如果一个静态方法和类有关但是和实例无关，那么使用该方法。
  - 静态方法：该实例属于类，但该方法没有参数，也就是说该方法不能对类做处理，相当于全局方法。
75. Python 中的接口如何实现？
76. Python 中的反射了解么?
  - hasattr(module，str)：判断module里是否存在str对应的方法
  - getatttr(module, str)：在module里找str对应的方法
  - `__import__`可以实现基于字符串反射的动态导入
77. metaclass 作用？以及应用场景？
type(类名, (父类), dict(functionname=function))函数可以动态创建class类
78. hasattr() getattr() setattr()的用法
79. 请列举你知道的 Python 的魔法方法及用途。
  - `__new__`：创建类并初始化实例(最先被调用的方法)
  - `__init__`：当一个实例被创建时调用的初始化方法
  - `__str__`：被str()调用或打印对象时的行为
  - `__len__`：被len()调用时的行为
  - `__call__`：允许实例像函数一样调用
  - `__getattr__`：当获取一个不存在的属性时执行的方法
  - `__iter__`：返回一个容器迭代器
  - `__next__`：返回迭代器下一个元素
80. 如何知道一个 Python 对象的类型？
type()
81. Python 的传参是传值还是传址？
python传参是根据参数类型决定的，如果是可变类型则是传址，原始对象可改变；如果是不可变类型则是传值，原始对象不可改变
82. Python 中的元类(metaclass)使用举例
83. 简述 any()和 all()方法
  - any() 给定的可迭代参数全部为 False，则返回 False，如果有一个为 True，则返回 True
  - all() 给定的可迭代参数全部为 True，则返回 True，如果有一个为 False，则返回 False
84. filter 方法求出列表所有奇数并构造新列表，a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
list(filter(lambda x: x % 2 == 1, a))
85. 什么是猴子补丁？
属性在运行时的动态替换，便利的同时也搞乱啦代码，降低可读性
86. 在Python中是如何管理内存的？
  - 主要是区别对待小对象和大对象。
  - python有个内存池机制，当申请内存小于256bits时在内存池里申请内存空间
  - 当大于256bits时直接申请内存空间
87. 当退出 Python 时是否释放所有内存分配？
答案是否定的。那些具有对象循环引用或者全局命名空间引用的变量，在Python退出是往往不会被释放。另外不会释放 C 库保留的部分内容

## 正则表达式

88. 
  - 使用正则表达式匹配出`<html><h1>百度一下，你就知道</html>`中的地址
  ```
    re.search(r'<html><h1>(.*?)</html>', a).group(1)
  ```
  - a="张明 98 分"，用 re.sub，将 98 替换为 100
  ```
    re.sub(r'\d+', '99', a)
  ```
89. 正则表达式匹配中(.*)和(.*?)匹配区别？
带?是非贪婪模式
90. 写一段匹配邮箱的正则表达式
re.match(r'^\w{0,19}@[0-9a-zA-Z]{1,13}\.[com,cn,net]{1,3}$', mail_str)

## 其他内容
91. 解释一下 python 中 pass 语句的作用？
占位符
92. 简述你对 input()函数的理解
获取客户端输入的函数，python3里获取的值类型是str
93. python 中的 is 和==
==比较对象的值，is比较对象的身份(id)。不可变类型a is b为True，可变类型a is b为false
94. Python 中的作用域
95. 三元运算写法和应用场景？
a = xx if xx > xxx else xxx
96. 了解enumerate么？
列出可迭代对象的索引和值对
97. 列举5个Python中的标准模块
os, sys, re, math, functools, logging
98. 如何在函数中设置一个全局变量
global
99. pathlib 的用法举例
100. Python 中的异常处理，写一个简单的应用场景
```
  try:
      print(1/0)
  except ZeroDivisionError as e:
      print(e)
      print(0)
```
101. Python 中递归的最大次数，那如何突破呢？
默认最大998，sys.setrecursionlimit(n)? 修改最大递归次数
102. 什么是面向对象的 mro
method resolution order：方法解析顺序也就是多继承解析顺序，python3采用深度优先的C3排序算法
103. isinstance 作用以及应用场景？
判断对象类型
104. 么是断言？应用场景？
assert断言语句用来声明某个条件是真的，其作用是测试一个条件(condition)是否成立，如果不成立，则抛出异常
105. lambda 表达式格式以及应用场景？
lambda匿名函数，经常和可迭代对象配合使用
106. 新式类和旧式类的区别
```
  class D(object)
  class C1(D)
  class C2(D)
  class B(C1,C2)
  class A(B,C1,C2)
```
  - 新式类：隐式继承object，slot属性可以限制类的属性和方法。继承查找方法是C3A-B-C1-C2-D-object
  - 旧式类：除非显式继承object。继承查找方法是从左向右深度优先A-B-C1-D-object-C2
107. dir()是干什么用的？
dir()函数不带参数时，返回当前范围内的变量、方法和定义的类型列表；带参数时，返回参数的属性、方法列表。如果参数包含方法`__dir__()`，该方法将被调用。如果参数不包含`__dir__()`，该方法将最大限度地收集参数信息。
108. 一个包里有三个模块，demo1.py, demo2.py, demo3.py，但使用 from tools import *导入模块时，如何保证只有 demo1、demo3 被导入了。
109. 列举 5 个 Python 中的异常类型以及其含义
TypeError, ZeroDivisionError, IOError, SyntaxError, ValueError, KeyboardInterrupt
110. copy 和 deepcopy 的区别是什么？
deepcopy会将对象的每一层信息复制过来成，copy只服之最外层
111. 代码中经常遇到的*args, **kwargs 含义及用法。
  - *args(可变参数)：接收数量不定的参数
  - **kwargs(关键字参数)：接受带有参数名的参数(还有命名关键字参数)
112. Python 中会有函数或成员变量包含单下划线前缀和结尾，和双下划线前缀结尾，区别是什么?
  - 单下划线表示变量是受保护的，虽然可以访问但不建议
  - 双下划线表是变量是私有的，不允许访问(其实__xx可以通过_classname__xx来访问)
113. w、a+、wb 文件写入模式的区别
  - w只允许写
  - a只允许追加
  - wb以二进制格式打开文件只允许写
114. 举例 sort 和 sorted 的区别
  - sort是list的成员方法，没有返回值
  - sorted可以对可迭代对象进行排序
115. 什么是负索引？
从最后一个元素开始计数是负索引
116. pprint 模块是干什么的？
将结果格式化打印到控制台
117. 解释一下 Python 中的赋值运算符
118. 解释一下 Python 中的逻辑运算符
119. 讲讲 Python 中的位运算符
与(&)，或(|)，异或(^), 取反(~), 位移(>> <<)
120. 在 Python 中如何使用多进制数字？
  - 0b或0B表示二进制(0b1010表示十进制的10，bin(10)结果是0b1010)
  - 0o或0O表示八进制(0o12表示十进制的10，oct(10)结果是0o12)
  - 0x或0X表示十六进制(0x10表示十进制的16，bin(16)结果是0x10)
121. 怎样声明多个变量并赋值？
a, b = 1

## 算法和数据结构
122. 已知：
```
  AList=[1, 2, 3]
  BSet{1, 2, 3}
```
从 AList 和 BSet 中 查找 4，最坏时间复杂度那个大？
list是线性表，必须按照顺序一个个找，set是hash值，直接查找
123. 用 Python 实现一个二分查找的函数
```
  def test(aList, data):
      if len(aList) < 1:
          return False
      mid = len(aList) // 2
      if aList[mid] > data:
          return test(aList[0:mid], data)
      elif aList[mid] < data:
          return test(aList[mid+1:], data)
      else:
          return mid
```
124. python 单例模式的实现方法
  - 将类模块化，提前实例化
  - 装饰器
  - 使用类方法(Class.instance，保证线程安全要加锁 _instance_lock = threading.Lock())
  - 显示定义`__new__`
125. 使用 Python 实现一个斐波那契数列
```
  def fab(n):
      a, b = 1, 1
      for i in range(n):
          a, b = b, a+b
      return a
  print([fab(i) for i in range(7)])
```
126. 找出列表中的重复数字
set([x for x in a if a.count(x) > 1])
127. 找出列表中的单个数字
set([x for x in a if a.count(x) == 1])
128. 写一个冒泡排序
```
  def test_sort(alist):
      length = len(alist)
      for i in range(length - 1):
          for j in range(length - i - 1):
              if alist[j] > alist[j + 1]:
                  alist[j], alist[j + 1] = alist[j + 1], alist[j]
      return alist
```
129. 写一个快速排序
``` 
  def test_sort(alist):
      if len(alist) >= 2:
          mid = alist[len(alist) // 2]
          left, right = [], []
          alist.remove(mid)
          for x in alist:
              if x < mid:
                  left.append(x)
              else:
                  right.append(x)
          return test_sort(left) + [mid] + test_sort(right)
      else:
          return alist
```
130. 写一个拓扑排序
131. python 实现一个二进制计算
```
  def bin_to(data):
      log = int(math.log(data, 2)) + 1
      result = []
      for i in range(log):
          a = data % 2
          b = int(data / 2)
          result.append(str(a))
          data = b
      return ''.join(result)[::-1]
```
132. 有一组“+”和“-”符号，要求将“+”排到左边，“-”排到右边，写出具体的实现方法。
[i for i in list if i == '+'] + [i for i in list if i == '-']
133. 单链表反转
```
  class Node:
      def __init__(self, val, next_n=None):
          self.val = val
          self.next_n = next_n
  def reverseList(list_name):
      if list_name is None or list_name.next_n is None:
          return None
      result = None
      while list_name is not None:
          next_n = list_name.next_n
          list_name.next_n = result
          result = list_name
          print(result.val)
          list_name = next_n
          print(list_name.val)
      return result
  if __name__ == '__main__':
      l1 = Node(1)
      l1.next_n = Node(2)
      l1.next_n.next_n = Node(3)
      l1.next_n.next_n.next_n = Node(4)
      l1.next_n.next_n.next_n.next_n = Node(5)
      l2 = reverseList(l1)
      print(l2.val, l2.next_n.val, l2.next_n.next_n.val, l2.next_n.next_n.next_n.val, l2.next_n.next_n.next_n.next_n.val)
```
134. 交叉链表求交点
135. 用队列实现栈
136. 找出数据流的中位数
137. 二叉搜索树中第 K 小的元素

## 爬虫相关
138. 在 requests 模块中，requests.content 和 requests.text 什么区别
  - content返回byte型也就是二进制的数据(Content of the response, in bytes)
  - text返回unicode类型数据(Content of the response, in unicode)
139. 简要写一下 lxml 模块的使用方法框架
140. 说一说 scrapy 的工作流程
141. scrapy 的去重原理
142. scrapy 中间件有几种类，你用过哪些中间件
143. 你写爬虫的时候都遇到过什么？反爬虫措施，你是怎么解决的？
144. 为什么会用到代理？
145. 代理失效了怎么处理？
146. 列出你知道 header 的内容以及信息
147. 说一说打开浏览器访问 百度一下，你就知道 获取到结果，整个流程。
148. 爬取速度过快出现了验证码怎么处理
149. scrapy 和 scrapy-redis 有什么区别？为什么选择 redis 数据库？
150. 分布式爬虫主要解决什么问题
151. 写爬虫是用多进程好？还是多线程好？ 为什么？
152. 解析网页的解析器使用最多的是哪几个
153. 需要登录的网页，如何解决同时限制 ip，cookie,session（其中有一些是动态生成的）在不使用动态爬取的情况下？
154. 验证码的解决（简单的：对图像做处理后可以得到的，困难的：验证码是点击，拖动等动态进行的？）
155. 使用最多的数据库（mysql，mongodb，redis 等），对他的理解？

## 网络编程
156. TCP 和 UDP 的区别？
157. 简要介绍三次握手和四次挥手
158. 什么是粘包？ socket 中造成粘包的原因是什么？ 哪些情况会发生粘包现象？
  - 发送方第一次发hello，第二次发world，结果接收方第一次就接收了helloworld，第二次空
  - 数据提取界限不清楚，不知道一次该取多少字节数据
  - 发送方需要等缓存区满才发送导致数据堆积；接收方不及时读取数据

## 并发
159. 举例说明 conccurent.future 的中线程池的用法
160. 说一说多线程，多进程和协程的区别。
  - 线程是指进程内的一个执行单元，
  - 进程拥有自己独立的堆和栈，进程由操作系统调度。
  - 线程拥有自己独立的栈和共享的堆，线程亦由操作系统调度
  - 协程避免了无意义的调度，由此可以提高性能；但同时协程也失去了线程使用多CPU的能力
161.简述GIL
  - GIL全局解释器锁
  - 1.Python中同一时刻有且只有一个线程会执行；
  - 2.Python中的多个线程由于GIL锁的存在无法利用多核CPU；
  - 3.Python中的多线程不适合计算机密集型的程序；
  - 4.如果程序需要大量的计算，利用多核CPU资源，可以使用多进程来解决。
162. 进程之间如何通信
  - multiprocessing中的pipe和queue用于通信
  - queue的get和put方法
  - pipe是双向管道，用于两个进程间通信，常用于父子进程
163. IO多路复用的作用？
    减少系统创建进程线程以及维护的成本，减少系统开销
164. select、poll、epoll 模型的区别？
165. 什么是并发和并行？
  - 并发：在一个时间段，处理多个任务，单核也可以并发（CPU分时间片）
  - 并行：在同一个时刻，处理多个任务，必须多核才能并行；
166. 一个线程 1 让线程 2 去调用一个函数怎么实现？
167. 解释什么是异步非阻塞？
168. threading.local 的作用？
  - 线程操作全局变量需要加锁。
  - 实例化threading.local得到全局变量，每个线程使用该变量存储数据时对其他线程不可见，其本质是以每个线程自身为key的字典变量