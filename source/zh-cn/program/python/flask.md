title: Flask基础
---

1. 定义的URL结尾带/的话，访问时/带不带都可以；但是定义时结尾不带/的话，访问时也不能带，带了会报404
2. 可以动态定义URL ` @app.route('/post/<int:post_id>')`，表示只接受整型
3. url_for方法用于构建URL，有三点好处：一处修改多处适用；处理特殊字符；处理位于非跟路(/)径下的应用
4. 静态文件位于与模块同目录下的./static目录下，`url_for('static', filename='style.css')`为其生成URL
5. 上传文件时一定要用secure_filename()函数对文件名作处理，以防上传的文件覆盖服务器系统文件
6. ` @app.errorhandler(errcode)`装饰器可以定制错误页面
7. 响应：由绑定在URL上的方法返回，可以是模版文件，字符串，合法的元组(response, status, headers)。make_response()可以处理响应对象
8. cookie：request.cookies.get()访问cookie，响应对象的set_cookie()设置cookie
9. g变量相当于thread.local，一个全局临时变量，用于保存
10. flask中jinja默认对.html，.htm，.xml和.xhtml文件开启自动转义，使用 **&#123;% autoescape %&#125;** 开启手动转义
11. 可以在模版文件中直接使用的对象：config，g，request，session，url_for，get_flashed_messages