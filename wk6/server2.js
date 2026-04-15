const http = require("http"); // Import Node.js core module
const server = http.createServer(function (req, res) {
  // create web server
  if (req.url == "/") {
    // check the URL of the current request
    // set response header
    res.writeHead(200, { "Content-Type": "text/html" });
    // set response content
    res.write("<html><body><p>This is home Page. - tanhien</p></body></html>");
    res.end();
  } else if (req.url == "/student") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(
      "<html><body><p>This is student Page. - tanhien</p></body></html>",
    );
    res.end();
  } else if (req.url == "/admin") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<html><body><p>This is admin Page. - tanhien</p></body></html>");
    res.end();
  } else if (req.url == "/data") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "Hello World JSON - tanhien" }));
    res.end();
  } else res.end("Invalid Request! - tanhien");
});
server.listen(8080); // listen for any incoming requests
console.log("Le Ngoc Tan Hien - Node.js web server at port 8080 is running...server2");
