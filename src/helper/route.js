const fs = require('fs');//通过判断文件类型，输出文件列表
const promisify = require('util').promisify; //解决回调的方式
const stat = promisify(fs.stat);             //找到有回调的函数
const readdir = promisify(fs.readdir);
const path = require('path');                //一些工具和方法
const Handlebars = require('handlebars');    //引用插件HTML
const conf = require('../config/defaultConfig'); //引入config

const tplPath = path.join(__dirname,'../template/dir.html'); //找到绝对路径
const source = fs.readFileSync(tplPath);        //读文件
const template = Handlebars.compile(source.toString());    //读模板,载入变量

const mime =require('./mime');//处理请求头
const compress =require('./compress');//引入处理压缩文件的
const range = require('./range');//处理用户传入数据

const isFresh = require('./cache');//引用处理缓存数据

module.exports = async function(req,res,filePath){
    try{
        const stats = await stat(filePath);
        if(stats.isFile()){
            const contentType = mime(filePath)          //处理请求头

            res.setHeader('Content-Type',contentType);
            //*******bug弄不了//                                            //判断，如果有缓存，就执行里面，没有就请求服务器
            // if(isFresh(stats,req,res)){
            //     res.statusCode = 304;                   //表示有缓存了
            //     res.end();                              //就使用缓存
            //     return;                                 //下面不执行
            // }
            let rs;
            const {code,start,end} = range(stats.size,req,res);
            if(code === 200){
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);   //通过流的读取文件，一点一点吐出来
            }else{
                res.statusCode = 206;                   //读取一部分文件
                rs =  fs.createReadStream(filePath,{start,end});   //处理客户请求数据
            }
                                                      // 判断符合就压缩
            if(filePath.match(conf.compress)){
                rs = compress(rs,req,res);
            }
            rs.pipe(res);
        } else if(stats.isDirectory()){                 //判断是不是文件夹

            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type','text/html');
            const dir = path.relative(conf.root,filePath);//找到，一个文件的相对路径
            const data = {                               //返回数据
                title: path.basename(filePath),          //文件夹名字
                dir : dir ? `/${dir}` : '' ,             //判断，是否为根路径
                files : files.map(file => {              //文件列表
                    return{
                        file,
                        icon : mime(file)                //返回一下ico图标
                    }
                })
            }
            res.end(template(data));
        }
    }catch (e){
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain'); //文本形式
        res.end(`${filePath} is not derfinder ro file\n ${e.toString()}`);
    }
}