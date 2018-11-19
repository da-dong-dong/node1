//客户端向服务器请求数据的，多少到多少的

module.exports = (totalSize,req,res) =>{            //需要整个的字节数，客户端，服务端
    const range = req.headers['range'];             //拿到
    if(!range){                                     //判断，拿不到就返回200
        return {code: 200};
    }

    const sizes = range.match(/bytes=(\d*)-(\d*)/); //用正则 返回3个数组，
    const end = sizes[2] || totalSize-1;            //如果取不到，取到结尾给你
    const start = sizes[1] || totalSize -end;       //同理

    if(start > end || start < 0 || end > totalSize){
        return {code: 200}                          //判断处理不了，返回200
    }

    res.setHeader('Accept-Ranges','bytes');
    res.setHeader('Content-Range',`bytes ${start}-${end}/${totalSize}`)
    res.setHeader('COntent-Length',end-start)
    return {
        code: 206,
        start: parseInt(start),
        end: parseInt(end)
    }
}