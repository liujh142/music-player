//server
var http =  require('http')
var fs = require('fs');
var url = require('url');
var path = require('path')

http.createServer(function(req,res){
    var pathObj = url.parse(req.url);
    console.log(pathObj.pathname);
    switch(pathObj.pathname){
        case '/music.json':
            var filePath = path.join(__dirname,'/music.json');
            console.log(filePath);
            res.end(fs.readFileSync(filePath));
            break;
        default:
            res.end(fs.readFileSync(__dirname +"/static" + pathObj.pathname));
    }

}).listen(8080);
console.log('localhost:8080')