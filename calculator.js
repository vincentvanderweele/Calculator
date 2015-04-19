"use strict"

var Token = require('./token');

function Calculator() {
   this.calculateConstExpression = function(constExpression) {
      return constExpression.getNumber();
   }

   this.calculateUnaryExpression = function(unaryExpression) {
      var operator = unaryExpression.getOperator();
      var expressionValue = unaryExpression.getExpressionValue();

      var value;

      switch (operator) {
         case Token.TOKEN_TYPE.MINUS:
            value = -expressionValue;
            break;
         default:
            throw new Error('Unsupported unary operator: ' + operator);
      }

      return value;
   }

   this.calculateBinaryExpression = function(binaryExpression) {
      var operator = binaryExpression.getOperator();
      var lhsValue = binaryExpression.getLhsValue();
      var rhsValue = binaryExpression.getRhsValue();

      var value;

      switch (operator) {
         case Token.TOKEN_TYPE.PLUS:
            value = lhsValue + rhsValue;
            break;
         case Token.TOKEN_TYPE.MINUS:
            value = lhsValue - rhsValue;
            break;
         case Token.TOKEN_TYPE.TIMES:
            value = lhsValue * rhsValue;
            break;
         case Token.TOKEN_TYPE.OVER:
            if (rhsValue === 0) {
               throw new Error('Division by 0');
            }
            value = lhsValue / rhsValue;
            break;
         default:
            throw new Error('Unsupported binary operator: ' + operator);
      }

      return value;
   }
}

module.exports = Calculator;
