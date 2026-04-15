const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello, World!");
  res.end();
});

server.listen(8000);
console.log("Le Ngoc Tan Hien - Server is listening on port 8000");
