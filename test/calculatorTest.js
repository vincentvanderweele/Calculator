"use strict"

var assert = require('assert');
var Token = require('../token');
var Expression = require('../expression');
var Calculator = require('../calculator');

describe('Calculator', function() {
   describe('visitConstExpression', function() {
      it('should set the value of a const expression', function() {
         var result = calculateConstExpression(5);
         assert.strictEqual(5, result);
      });
   });

   describe('visitUnaryExpression', function() {
      it('should negate the value of a unary minus expression', function() {
         var result = calculateUnaryExpression(Token.TOKEN_TYPE.MINUS, 5);
         assert.strictEqual(-5, result);
      });

      it('should fail on an unknown unary operator', function() {
         assert.throws(function() {
            var result = calculateUnaryExpression(Token.TOKEN_TYPE.PLUS, 5);
         }, function(err) {
            return err.message === 'Unsupported unary operator: ' + Token.TOKEN_TYPE.PLUS;
         });
      });
   });

   describe('visitBinaryExpression', function() {
      it('should add two numbers', function() {
         var result = calculateBinaryExpression(6, Token.TOKEN_TYPE.PLUS, 2);
         assert.strictEqual(8, result);
      });

      it('should subtract two numbers', function() {
         var result = calculateBinaryExpression(6, Token.TOKEN_TYPE.MINUS, 2);
         assert.strictEqual(4, result);
      });

      it('should multiply two numbers', function() {
         var result = calculateBinaryExpression(6, Token.TOKEN_TYPE.TIMES, 2);
         assert.strictEqual(12, result);
      });

      it('should divide two numbers', function() {
         var result = calculateBinaryExpression(6, Token.TOKEN_TYPE.OVER, 2);
         assert.strictEqual(3, result);
      });

      it('should fail on an unknown binary operator', function() {
         assert.throws(function() {
            var result = calculateBinaryExpression(6, Token.TOKEN_TYPE.NUMBER, 2);
         }, function(err) {
            return err.message === 'Unsupported binary operator: ' + Token.TOKEN_TYPE.NUMBER;
         });
      });
   });

   it('should calculate an expression tree', function() {
      // expression: 2 * (23/(3*3))- 23 * (2*3)
      var expression = new Expression.BinaryExpression(  // 2 * (23/(3*3))- 23 * (2*3)
         new Expression.BinaryExpression(                // 2 * (23/(3*3))
            new Expression.ConstExpression(2),           // 2
            Token.TOKEN_TYPE.TIMES,
            new Expression.BinaryExpression(             // (23/(3*3))
               new Expression.ConstExpression(23),       // 23
               Token.TOKEN_TYPE.OVER,
               new Expression.BinaryExpression(          // 3*3
                  new Expression.ConstExpression(3),     // 3
                  Token.TOKEN_TYPE.TIMES,
                  new Expression.ConstExpression(3)      // 3
               )
            )
         ),
         Token.TOKEN_TYPE.MINUS,
         new Expression.BinaryExpression(                // 23 * (2*3)
            new Expression.ConstExpression(23),          // 23
            Token.TOKEN_TYPE.TIMES,
            new Expression.BinaryExpression(             // 2*3
               new Expression.ConstExpression(2),        // 2
               Token.TOKEN_TYPE.TIMES,
               new Expression.ConstExpression(3)         // 3
            )
         )
      );

      var calculator = new Calculator();

      expression.accept(calculator);

      var expected = -132.888888889;
      var actual = expression.getValue();

      assert(Math.abs(expected - actual) < 1e-9, "expected: " + expected + "; actual: " + actual);
   });
});

function calculateConstExpression(number) {
   var expression = new Expression.ConstExpression(number);
   var calculator = new Calculator();

   return calculator.calculateConstExpression(expression);
}

function calculateUnaryExpression(operator, number) {
   var subExpression = new Expression.ConstExpression(number);
   subExpression._value = number;
   var expression = new Expression.UnaryExpression(operator, subExpression);
   var calculator = new Calculator();

   return calculator.calculateUnaryExpression(expression);
}

function calculateBinaryExpression(lhsValue, operator, rhsValue) {
   var lhs = new Expression.ConstExpression(lhsValue);
   var rhs = new Expression.ConstExpression(rhsValue);
   lhs._value = lhsValue;
   rhs._value = rhsValue;
   var expression = new Expression.BinaryExpression(lhs, operator, rhs);
   var calculator = new Calculator();

   return calculator.calculateBinaryExpression(expression);
}
