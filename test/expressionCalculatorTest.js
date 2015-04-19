"use strict"

var assert = require("assert");
var ExpressionCalculator = require("../expressionCalculator");

describe('ExpressionCalculator', function() {
   describe('calculate', function() {
      it('should calculate a valid expression', function() {
         var expressionString = "4 * (24/(3*2))- 11 * (2*3)";
         var calculator = new ExpressionCalculator();
         var result = calculator.calculate(expressionString);

         assert.strictEqual(-50, result);
      });

      it('should throw on an invalid expression', function() {
         var expressionString = "4 * (24/(3*2))- 11 * (2*";
         var calculator = new ExpressionCalculator();

         assert.throws(function() {
            var result = calculator.calculate(expressionString);
         }, function(err) {
            return err.message === 'Unexpected end of expression';
         });
      });
   });
});
