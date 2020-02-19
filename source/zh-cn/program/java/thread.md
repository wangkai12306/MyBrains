title: Java进阶
---

# 线程
## 创建
1. 继承Thread类
```java
public class ThreadClass extends Thread {
    @override
    public void run() {}
}
```
2. 实现Runnable接口
```java
public class ThreadClass implements Runnable {
    @override
    public void run() {}
}
```

## 状态
1. 新建(new)：新创建了一个线程对象
2. 就绪(runnable)：线程对象创建后，其他线程调用了该对象的start()方法。该状态的线程位于**可运行线程池**中，变得可运行，只等待获取CPU的使用权
3. 运行(running)：就绪状态的线程获取了CPU，执行程序代码
4. 阻塞(blocked)：阻塞状态是线程因为某种原因放弃CPU使用权，暂时停止运行。直到线程进入就绪状态，才有机会转到运行状态
  - 等待阻塞：运行的线程执行wait()方法，该线程会释放占用的所有资源，JVM会把该线程放入**等待池**中。进入这个状态后，不能自动唤醒，必须依靠其他线程调用notify()或notifyAll()方法才能被唤醒
  - 同步阻塞：运行的线程在获取对象的同步锁时，若该同步锁被别的线程占用，则JVM会把该线程放入**锁池**中
  - 其他阻塞：运行的线程执行sleep()或join()方法，或者发出了I/O请求时，JVM会把该线程置为阻塞状态。当sleep()状态超时、join()等待线程终止或者超时、或者I/O处理完毕时，线程重新转入就绪状态
5. 死亡(Dead)：线程执行完了或者因异常退出了run()方法，该线程结束生命周期

# 多线程
## AQS 虚拟同步队列
### 锁
1. synchronized：
2. ReentrantLock：
  - 公平锁：在锁可用时，将锁分配给等待时间最长的线程
  `ReentrantLock lock = new ReentrantLock(true)`
  - 非公平锁：在锁可用时，随机分配