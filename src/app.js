//引入http，调用配置方法， http.createServer([options][, requestListener])；

const http = require('http');
const chalk = require('chalk');//打印好看一点
const path = require('path');//join 方法
const conf = require('./config/defaultConfig');
//const fs = require('fs');//通过判断文件类型，输出文件列表
// const promisify = require('util').promisify; //解决回调的方式
// const stat = promisify(fs.stat);             //找到有回调的函数
// const readdir = promisify(fs.readdir);//

//引用模块
const route = require('./helper/route');


// 创建HTTP

const server = http.createServer((req,res) => {
    const url = req.url;                            //获取客户端的地址
    const filePath = path.join(conf.root,url);      //获取根目录，用户运行当前文件夹 拼接url地址

    //解决回调promisify
    route(req,res,filePath);


    //有回调，
/*    fs.stat(filePath,(err,stats) => {
        if(err) {
           res.statusCode = 404;
           res.setHeader('Content-Type','text/plain'); //文本形式
           res.end(`${filePath} is not derfinder ro file`);
           return;
        }
                                                         //判断是不是文件
        if(stats.isFile()){

            res.statusCode = 200;
            res.setHeader('Content-Type','text/plain');
            fs.createReadStream(filePath).pipe(res);   //通过流的读取文件，一点一点吐出来

        } else if(stats.isDirectory()){                 //判断是不是文件夹

            fs.readdir(filePath,(err,files) =>{         //通过异步方式读取出来
                if(err) throw err;
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain');
                res.end(files.join(','));               //是一个数组，用join分开

            })
        }

    })*/

    //res.statusCode = 200;                           //成功
   // res.setHeader('Content-Type','text/html');     //设置请求头,注意格式，text/html是标签

   // res.end(filePath);
                                //输出 当没有设置类型text/html 输出到客户端是<pre></pre>标签
});

//设置监听
//端口号，主机号
server.listen(conf.port, conf.hostname, () =>{
    //es6 输出规则
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.log(`This Server at ${chalk.green(addr)}`);
});
// 写了一个要重启服务器很麻烦，弄个插件 相当于watch
// cmd下 npm install -g supervisor 全局安装
// 安装后 可以不用node启动命令 用supervisor 文件
