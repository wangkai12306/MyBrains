# 安装和运行

## 前置条件

1. 本地运行站点需要安装Node.js
2. 安装Hexo Client

   ```bash
   npm install -g hexo-cli
   ```

## 安装依赖

```bash
npm install
```

## 编译Markdown(自动watch)

```bash
hexo g -w
```

## 运行Hexo本地server

```bash
hexo server
```

##浏览器查看站点

```bash
http://localhost:4000/
```

## 发布到github

```bash
git add .
git commit -m "xxx"
git remote add origin https://github.com/wangkai12306/MyBrains.git
git push -u origin master
```


# 添加新文档

## 主要目录结构和功能

```
.    
├── source                   # 文档源码
|   ├── zh-cn                # 文档中文源码
|   |   ├── bigdata          # 导航菜单1
|   |   ├── hearts           # 导航菜单2
|   |   ├── program          # 导航菜单3
└── themes                   # 主题
    └── navy                 # navy主题
        ├── languages        # 主题语言
        |   ├── zh-cn.yml    # 中文语言配置
        └── _config.yml      # 主题配置
```

## 添加新文档

在`source` > `zh-cn` > `bigdata | hearts | program`目录下按照文档路径添加新文档（Markdown），文件名要求为英文。

> 使用`hexo generate`命令将markdown解析成同名HTML文件到`public`下对应目录。
  建议使用`hexo g -w`实时watch和解析markdown
  
## 添加新文档导航

编辑`themes` > `navy` > `_config.yml`，在`sidebar`下对应位置添加新文档文件名。

## 配置新文档语言

编辑`themes` > `navy` > `languages` > `zh-cn.yml`，在`sidebar`下对应位置添加新文档文件名和中文翻译名。




