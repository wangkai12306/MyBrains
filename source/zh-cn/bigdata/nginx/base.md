title: Nginx基础
---

## 请求处理过程
#### 配置文件
根据nginx配置文件(nginx.conf)选定由哪个虚拟主机处理请求
  1. nginx仅仅检查请求的“Host”头以决定该请求应由哪个虚拟主机来处理。如果Host头没有匹配任意一个虚拟主机，或者请求中根本没有包含Host头，那nginx会将请求分发到定义在此端口上的默认虚拟主机。在以上配置中，第一个被列出的虚拟主机即nginx的默认虚拟主机——这是nginx的默认行为。而且，可以显式地设置某个主机为默认虚拟主机，即在"listen"指令中设置"default_server"参数：
  ``` 
      server {
          listen      80 default_server;
          server_name example.net www.example.net;
          ...
      }
  ```
  2. 如果不允许请求中缺少“Host”头，可以定义如下主机，丢弃这些请求：
  ``` 
      server {
          listen       80;
          server_name  "";
          return       444;
      }
  ```
  3. nginx以名字查找虚拟主机时，如果名字可以匹配多于一个主机名定义，比如同时匹配了通配符的名字和正则表达式的名字，那么nginx按照下面的优先级别进行查找，并选中第一个匹配的虚拟主机：
      1. 确切的名字； 
      2. 最长的以星号起始的通配符名字：*.example.org； 
      3. 最长的以星号结束的通配符名字：mail.*； 
      4. 第一个匹配的正则表达式名字(按在配置文件中出现的顺序)

#### 为某个请求URI（路径）建立配置（location）
  1. 可以使用前缀字符串或者正则表达式定义路径。使用正则表达式需要在路径开始添加“~*”前缀 (不区分大小写)，或者“~”前缀(区分大小写)。为了根据请求URI查找路径，nginx先检查前缀字符串定义的路径 (前缀路径)，在这些路径中找到能最精确匹配请求URI的路径。然后nginx按在配置文件中的出现顺序检查正则表达式路径，匹配上某个路径后即停止匹配并使用该路径的配置，否则使用最大前缀匹配的路径的配置。 
    - 路径可以嵌套，但有例外，后面将提到。 
    - 在不区分大小写的操作系统（诸如Mac OS X和Cygwin）上，前缀匹配忽略大小写(0.7.7)。但是，比较仅限于单字节的编码区域(one-byte locale)。 
    - 正则表达式中可以包含匹配组(0.7.40)，结果可以被后面的其他指令使用。 
    - 如果最大前缀匹配的路径以“^~”开始，那么nginx不再检查正则表达式。而且，使用“=”前缀可以定义URI和路径的精确匹配。如果发现匹配，则终止路径查找。 比如，如果请求“/”出现频繁，定义“location = /”可以提高这些请求的处理速度， 因为查找过程在第一次比较以后即结束。这样的路径明显不可能包含嵌套路径。
    - 例子
  ```
    location = / {
        [ configuration A ]
    }
    location / {
        [ configuration B ]
    }
    location /documents/ {
        [ configuration C ]
    }
    location ^~ /images/ {
        [ configuration D ]
    }
    location ~* \.(gif|jpg|jpeg)$ { 
        [ configuration E ] 
    }
  ```

  2. 请求“/”匹配配置A，请求“/index.html”匹配配置B，请求“/documents/document.html”匹配配置C，请求“/images/1.gif”匹配配置D，请求“/documents/1.jpg”匹配配置E。

#### 设置反向代理（proxy）
ngx_http_proxy_module 模块允许传送请求到其它服务器。
```
location / {
    proxy_pass       http://localhost:8000;
    proxy_set_header Host      $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

#### 定义后端服务器组
ngx_http_upstream_module模块 允许定义一组服务器。它们可以在指令proxy_pass、 fastcgi_pass和 memcached_pass中被引用到。
```
upstream backend {
    server backend1.example.com       weight=5;
    server backend2.example.com:8080;
    server unix:/tmp/backend3;
    server backup1.example.com:8080   backup;
    server backup2.example.com:8080   backup;
}
server {
    location / {
        proxy_pass http://backend;
    }
}
```

#### 一个简单PHP站点配置
现在我们来看在一个典型的，简单的PHP站点中，nginx怎样为一个请求选择location来处理
```
  server {
      listen      80;
      server_name example.org www.example.org;
      root        /data/www;
      location / {
          index   index.html index.php;
      }
      location ~* \.(gif|jpg|png)$ {
          expires 30d;
      }
      location ~ \.php$ {
          fastcgi_pass  localhost:9000;
          fastcgi_param SCRIPT_FILENAME
                      $document_root$fastcgi_script_name;
          include       fastcgi_params;
      }
  }
```

nginx使用前缀匹配找出最准确的location，这一步nginx会忽略location在配置文件出现的顺序。上面的配置中，唯一的前缀匹配location是"/"，而且因为它可以匹配任意的请求，所以被作为最后一个选择。接着，nginx继续按照配置中的顺序依次匹配正则表达式的location，匹配到第一个正则表达式后停止搜索。匹配到的location将被使用。如果没有匹配到正则表达式的location，则使用刚刚找到的最准确的前缀匹配的location。 

> 请注意所有location匹配测试只使用请求的URI部分，而不使用参数部分。这是因为写参数的方法很多，比如`/index.php?user=john&page=1` `/index.php?page=1&user=john`
> 除此以外，任何人在请求串中都可以随意添加字符串：`/index.php?page=1&something+else&user=john`

现在让我们来看使用上面的配置，请求是怎样被处理的： 
- 请求"/logo.gif"首先匹配上location "/"，然后匹配到正则表达式"\.(gif|jpg|png)$"。因此，它将被后者处理。根据"root /data/www"指令，nginx将请求映射到文件/data/www/logo.gif"，并发送这个文件到客户端。 
- 请求"/index.php"首先也匹配上location "/"，然后匹配上正则表达式"\.(php)$"，因此，它将被后者处理。进而被发送到监听在localhost:9000的FastCGI服务器。fastcgi_param指令将FastCGI的参数SCRIPT_FILENAME的值设置为"/data/www/index.php"，接着FastCGI服务器执行这个文件。变量$document_root等于root指令设置的值，变量$fastcgi_script_name的值是请求的uri，"/index.php”。
- 请求"/about.html"仅能匹配上location "/"，因此，它将使用此location进行处理。根据"root /data/www"指令，nginx将请求映射到文件"/data/www/about.html"，并发送这个文件到客户端。请求"/"的处理更为复杂。它仅能匹配上location "/"，因此，它将使用此location进行处理。然后，index指令使用它的参数和"root /data/www"指令所组成的文件路径来检测对应的文件是否存在。如果文件/data/www/index.html不存在，而/data/www/index.php存在，此指令将执行一次内部重定向到"/index.php"，接着nginx将重新寻找匹配"/index.php"的location，就好像这次请求是从客户端发过来一样。正如我们之前看到的那样，这个重定向的请求最终交给FastCGI服务器来处理。


#### 其他常见配置

1. core
  - alias：定义指定路径的替换路径。
  - client_body_timeout：定义读取客户端请求正文的超时。超时是指相邻两次读操作之间的最大时间间隔，而不是整个请求正文完成传输的最大时间。
  - client_max_body_size：设置允许客户端请求正文的最大长度。
  - error_page：为指令错误定义显示的URI。
  - http：为HTTP服务器提供配置上下文。
  - keepalive_disable：针对行为异常的浏览器关闭长连接功能。
  - listen：设置nginx监听地址，nginx从这里接受请求。
  - root：为请求设置根目录。
  - server：表示开始设置虚拟主机的配置。
  - server_name：设置虚拟主机名。
  - type：设置文件扩展名和响应的MIME类型的映射表，可以将多个扩展名映射到同一种类型。
  - default_type：定义响应的默认MIME类型。设置文件扩展名和响应的MIME类型的映射表则使用types指令。
2. auth_basic
  - auth_basic:开启使用“HTTP基本认证”协议的用户名密码验证。
  - auth_basic_user_file :指定保存用户名和密码的文件。密码应该使用crypt()函数加密。 可以用Apache发行包中的htpasswd命令来创建此类文件。 
3. proxy
  - proxy_pass：设置后端服务器的协议和地址，还可以设置可选的URI以定义本地路径和后端服务器的映射关系。
4. upstream
5. index
  - index：定义将要被作为默认页的文件。
6. access
  - 模块 ngx_http_access_module 允许限制某些IP地址的客户端访问。也可以通过密码来限制访问。使用 satisfy 指令就能同时通过IP地址和密码来限制访问。 
  - allow：允许指定的网络地址访问。
  - deny：拒绝指定的网络地址访问。 
7. log
  - log_format：指定日志的格式。