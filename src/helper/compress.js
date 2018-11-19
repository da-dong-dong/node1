//压缩文件类型
const {createGzip,createDeflate} = require('zlib');//封装好的压缩包
module.exports = (rs,req,res) =>{
    const  acceptEncoding = req.headers['accept-encoding'];//找到游览器支持的压缩文件类型
    //判断是否存在和游览器有没有正则配备的类型  /b表示非单词边界 传过来的gzip5 是不支持
    if(!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)){
        return rs;

    }else if(acceptEncoding.match(/\b(gzip)\b/)){
        res.setHeader('Content-Encoding','gzip');
        //封装好的方法，
        return rs.pipe(createGzip());
    }
    else if(acceptEncoding.match(/\b(deflate)\b/)){
        res.setHeader('Content-Encoding','deflate');
        //封装好的方法，
        return rs.pipe(createDeflate());
    }

}