"use strict"

var Tokenizer = require('./tokenizer');
var ExpressionParser = require('./expressionParser');
var Calculator = require('./calculator');

function ExpressionCalculator() {
   var tokenizer = new Tokenizer();
   var expressionParser = new ExpressionParser();
   var calculator = new Calculator();

   this.calculate = function(expressionString) {
      var tokens = tokenizer.tokenize(expressionString);
      var expression = expressionParser.parseExpression(tokens);
      expression.accept(calculator);

      return expression.getValue();
   }
}

module.exports = ExpressionCalculator;
