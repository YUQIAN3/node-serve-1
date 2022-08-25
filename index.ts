import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as fs from 'fs';
import * as p from 'path';
import * as url from 'url';

let cacheAge=3600*24*365;
const server = http.createServer();
const publicDir = p.resolve(__dirname, 'public');
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    const {method, url: path, headers} = request;
    if(method!=='GET'){
        response.statusCode=405;
        response.end();
        return;
    }
    if (path) {
        const {pathname, search} = url.parse(path);
        let filename = pathname?.substr(1) || '';
        if(filename===''){
            filename='index.html'
        }
        fs.readFile(p.resolve(publicDir, filename), (error, data) => {
            if (error) {
                response.statusCode = 404;
                fs.readFile(p.resolve(publicDir,'404.html'),(error,data)=>{
                    response.end(data);
                })
            } else {
                response.setHeader('Cache-Control',`public,max-age=${cacheAge}`)
                response.end(data);
            }

        });


    }

});

server.listen(8888);
