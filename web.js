var fs = require('fs');

var express = require('express');

var app = express.createServer(express.logger());

var input = fs.readFile('index.html', function (err, data) {
  if (err) throw err;
  console.log(data);
});

app.get('/', function(request, response) {
  response.send(input.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
