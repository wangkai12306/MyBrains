title: 基础概念
---

**Key Vault是一个用于安全的存储和访问机密的工具，里面可以存储密钥，机密，证书等**

## Overview
显示该key vault的基本信息和访问监控信息
## Activity log
## Access control
基于RBAC的访问控制，管理对key vault的访问权限。也可以添加拒绝访问的列表
- 查看权限
- 分配角色
- 拒绝分配
- 经典管理员
- 内置角色

## Tags
用于将key vault分类管理

## Diagnose and solve problems
监控key vault的健康状况，以及列出常见的问题和解决方案

## Keys
创建密钥，支持新建、导入、恢复备份。类型包括RSA和EC(椭圆曲线密码)，支持设置生效和过期时间
生成的密钥会产生唯一id(key identifier)，可用于外部访问。
可以设置**允许的操作**，包括(加密、解密、签名、验证、wrap key、unwrap key)
支持版本升级

## Secrets
创建机密，需要输入机密的名称和机密的值。支持新建、导入、恢复备份。支持设置生效和过期时间
生成的密钥会产生唯一id(secret identifier)，可用于外部访问。
支持版本控制

## Certificates
## Access policies
设置该key vault的访问规则，包括Azure提供的各种服务和发布到Azure的应用，以及用户
访问权限类型分为密钥、机密和证书，每种类型对应的细分权限不同，支持按模版选择和具体选择

## Firewall and virtual networks
通过设置防火墙和虚拟网络来限制对key vault的访问，以提高安全性
1. 防火墙：支持单个IPv4地址或者采用CIDR(无类域间路由)表示法键入IPv4地址范围
2. 虚拟网络：新建或选择已有的虚拟网络

> 防火墙和虚拟网络只适用于数据层面的访问，对控制层面如增删改等无效

## Properties
显示该key vault的属性

## Locks
## Export template