title: 实操经验
---

## 集合
1. Arrays.asList()返回的是Arrays的内部类ArrayList，而不是java.util.ArrayList
   二者都继承自AbstractList类，但该类没有实现add、remove方法，而是直接抛出UnsupportedOperationException
   java.util.ArrayList实现了add、remove方法
   asList的官方解释：返回一个跟数组一样固定大小的list，跟Collection.toArray组成集合和数组之间的桥梁
   另外基本类型不能作为asList的参数，因为内部类ArrayList的构造方法的参数是范型数组，
   而范型参数不能是基本类型，只能是引用类型和基本类型的包装类