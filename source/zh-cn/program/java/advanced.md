title: Java进阶
---

## 多线程
#### AQS 虚拟同步队列

#### 锁
1. synchronized：
2. ReentrantLock：
  - 公平锁：在锁可用时，将锁分配给等待时间最长的线程
  `ReentrantLock lock = new ReentrantLock(true)`
  - 非公平锁：在锁可用时，随机分配