// Object of module call fs stands for File System
const fs = require('fs');

/**
 * That's the one that gives us networking capabilities
 * such as building an http server
 */
const http = require('http');
const url = require('url');

/* last part of url that contains a unique string
   that identifies the resource that the website is displaying

*/
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
///////////////////////////////////////////
//Files

// - Synchronous Way (Blocking)
/*
const textIn = fs.readFileSync("node-farm/txt/input.txt", "utf-8");
console.log(textIn);

const textOut = `This  is the what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("node-farm/txt/output.txt", textOut);
console.log("File written!");
*/

// - Asynchronous Way (non Blocking)
/* fs.readFile("node-farm/txt/start.txt", "utf-8", (err, data1) => {
 * return to don not excute any thing after error
  if (err) return console.log("ERROR!");

  fs.readFile(`node-farm/txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`node-farm/txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile(
        "node-farm/txt/final.txt",
        `${data2}\n${data3}`,
        "utf-8",
        (err) => {
          console.log("Your file has been written 😉");
        }
      );
    });
  });
});
console.log("Will read file!");

 * Nodejs  is the built around this philosophy of callbacks
 */

///////////////////////////////////////////
//Server

/**
 - To build a server we have to do two things
 * First we create a server
 * second we start the server so that
  we can actually listen to incoming requests.
 */

/* 
1- Create a server using createServer()
2- Passed in a callback function
that  is the excuted each time that a new request 
hits the server
3- We started listening for incoming requests
on the local host IP and then on port 8000
4- Once we had all this running, we actually did the request
by hitting this url (127.0.0.1:800)
5- this event make the callback function was called
6- And finally the result of that
we then got back this string (hello from the server)
const server = http.createServer((req, res) => {
  // Sending back a very simple response
  res.end("hello from the server");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000 ");
});
*/

///////////////////////////////////////////
//Routing
/*
By accessing the url property on the response object,
we can make our server respond to differently URLs:
*/
/*
However, if the user tries to visit a path other than the one we’ve specified,
the server get stuck and not know what to do.
Therefore, we need to add a fallback:
*/
/*       
We have the ability to pass an object of response headers
as the second argument to writeHead. 
If we set Content-type to text/html, 
we can format our error message:
*/

/*
Note that instead of reading the file from ./dev-data/data.json,
we’ve used the __dirname variable.
Because (.) refers to the current working directory,
the code will break if we run it from another location.
Therefore, it’s a better practice to use __dirname,
which points to the directory in while the file is located. Then,
we use the built-in Javascript method JSON.parse() to turn the JSON into a Javascript object.
*/

/*
However, this code is inefficient because the JSON has to be read anew every time someone access our /api path. 
So, we’ll refactor the code so that the JSON is only read once, outside of the callback functions.
We’ll use a synchronous file read here, which is fine since this top-level code only runs once.
*/

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');

    const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);

    res.end(output);
    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
