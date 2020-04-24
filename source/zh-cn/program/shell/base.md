title: Shell基础
---

## 表达式
```shell
if [ -f file ] //如果文件存在
if [ -d path ] //如果目录存在
if [ -s file ] //如果文件存在且非空 
if [ -r file ] //如果文件存在且可读
if [ -w file ] //如果文件存在且可写
if [ -x file ] //如果文件存在且可执行    
if [ int1 -eq int2 ] //如果int1等于int2   
if [ int1 -ne int2 ] //如果不等于    
if [ int1 -ge int2 ] //如果>=
if [ int1 -gt int2 ] //如果>
if [ int1 -le int2 ] //如果<=
if [ int1 -lt int2 ] //如果<
if [ $a = $b ]              //如果string1等于string2,字符串允许使用赋值号做等号
if [ $string1 != $string2 ] //如果string1不等于string2
if [ -n $string ]           //如果string非空(非0),返回0(true)
if [ -z $string ]           //如果string为空
if [ $sting ]               //如果string非空,返回0 (和-n类似)
if [ !表达式 ]               //逻辑非
if [ ! -d $num ]            //如果不存在目录$num
if [ 表达式1 –a 表达式2 ]     //逻辑与
if [ 表达式1 –o 表达式2 ]     //逻辑或
```

## 命令
- **jq**：跟sed，awk处理文本的方式很像，可以处理string类型的json格式数据
- **echo -e "\033[1;36;45m[\`date\`]\033[0m"** 颜色高亮输出。\033表示转义开始，[表示定义颜色开始，1表示高亮，36表示字体颜色，45表示背景色，m表示定义颜色结束，[\`date\`]表示实际输出的内容，\033[0m组合表示关闭前面的定义