//封装配置方法
module.exports = {
    hostname : '127.0.0.1',
    port : 9527,
    root : process.cwd(),//获取根目录，用户运行当前文件夹
    compress : /\.(html|js|css|md)/,//正则匹配所以的html css js
    cache:{                         //设置缓存时间
        maxAge: 600,
        expires: true,
        cacheControl: true,
        lastModified: true,
        etag:true
    }
};