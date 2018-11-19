//缓存相关的

const {cache} = require('../config/defaultConfig');//es6拿到数据

function refreshRes(stats,res){
    const {maxAge,expires,cacheControl,lastModified,etag} = cache;

    if(expires){
        res.setHeader('Expires',(new Date(Date.now()+maxAge * 1000)).toUTCString());//设置缓存时间
    }
    if(cacheControl){
        res.setHeader('Cache-Control',`public,max-age=${maxAge}`);  //设置缓存时间
    }
    if(lastModified){
        res.setHeader('Last-Modified',stats.mtime.toUTCString());  //设置缓存时间
    }
    if(etag){
        res.setHeader('ETag',`${stats.size}-${stats.mtime}`);  //设置缓存时间
    }
}

module.exports = function isFresh(stats,req,res){
    refreshRes(stats,res);                                      //调用方法

    const lastModified = req.headers['if-modified-since'];      //找到游览器的是否有这些值
    const etag = req.headers['if-none-match'];
    console.log(etag);

    if(!lastModified && !etag){
        return false;
    }
    if(lastModified && lastModified !== res.getHeader('Last-Modified')){
        return false
    }
    if(etag && etag !== res.getHeader('ETag')){
        return false;
    }
    return true;
}