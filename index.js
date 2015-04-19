"use strict"

var express = require('express');
var ExpressionCalculator = require('./expressionCalculator');

var app = express();
app.set('port', (process.env.PORT || 5000));

app.get('/calculus', function(request, response) {
   try {
      var query = request.query.query;
      if (!query) {
         throw new Error('Parameter "query" not specified');
      }
      var expression = new Buffer(query, 'base64').toString('utf8');

      console.log("input: " + expression);

      var result = new ExpressionCalculator().calculate(expression);

      console.log("result: " + result);

      response.json({ error: false, result: result });
   } catch(error) {
      console.log(error);

      response.status(500).json({ error: true, message: error.message });
   }
});

app.listen(app.get('port'));
