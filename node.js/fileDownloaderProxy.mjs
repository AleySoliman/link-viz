
import { createServer } from "http";
import got from "got";
// import got from "got/dist/source";
// import { createServer } from "https";
// import request from "request"

const listeningPort = 8080
createServer((req, res) => {
    req.on('error', (err) => {
        // Error in request
        console.error(err)
        res.statusCode = 400
        res.end()
    })
    if (req.method === 'GET' && req.url.startsWith('/ico?')) {
        let domain = getDomain(req.url)
        if (domain) {
            // domain is a non-empty string
            let faviconURL = domain + "/favicon.ico"
            if (!faviconURL.startsWith("http")) {
                faviconURL = "http://" + faviconURL
            }
            try {
                // Download this favicon
                console.log('createServer, before res.setHeader')
                res.setHeader("content-disposition", "attachment; filename=favicon.ico");
                // request('https://www.google.com/favicon.ico').pipe(res);
                console.log('createServer, request')
                got.stream(faviconURL).pipe(res);
                console.log('createServer, post request')
            } catch (error) {
                // Let it be internal error
                console.error(error)
                console.error('sending response error 500')
                res.statusCode = 500;
                res.end(error.toString());
            }
        }
    } else {
        // return NOT Found response
        res.statusCode = 404;
        res.end();
    }
}).listen(listeningPort);

// Get the domain name from the url
function getDomain(url) {
    // You only have single parameter after '?'
    return url.substring(url.indexOf('?') + 1)
}
console.log("Server is listening on port " + listeningPort + ".")      //Terminal output