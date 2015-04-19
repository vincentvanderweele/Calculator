"use strict"

var Token = require('./token');
var Expression = require('./expression');

// Expression parser for the following simple grammar:
// expression := addExpression
// addExpression := multiplyExpression (('+' | '-') addExpression)?
// multiplyExpression := primaryExpression (('*' | '/') multiplyExpression)?
// primaryExpression := '(' addExpression ')' | '-' primaryExpression | NUMBER

function ExpressionParser() {
   // expression := addExpression
   this.parseExpression = function(tokens) {
      var tokensClone = tokens.slice(0);
      var expression = parseAddExpression(tokensClone);
      if (tokensClone.length > 0) {
         throwUnexpectedToken(tokensClone[0]);
      }
      return expression;
   }

   // addExpression := multiplyExpression (('+' | '-') addExpression)?
   var parseAddExpression = function(tokens) {
      var lhs = parseMultiplyExpression(tokens);

      // (('+' | '-') addExpression)?
      var nextToken = tokens[0];
      if (nextToken && (nextToken.getTokenType() === Token.TOKEN_TYPE.PLUS
                     || nextToken.getTokenType() === Token.TOKEN_TYPE.MINUS)) {
         var opToken = tokens.shift();
         var rhs = parseAddExpression(tokens);
         return new Expression.BinaryExpression(lhs, opToken.getTokenType(), rhs);
      }

      return lhs;
   }

   // multiplyExpression := primaryExpression (('*' | '/') multiplyExpression)?
   var parseMultiplyExpression = function(tokens) {
      var lhs = parsePrimaryExpression(tokens);

      // (('*' | '/') multiplyExpression)?
      var nextToken = tokens[0];
      if (nextToken && (nextToken.getTokenType() === Token.TOKEN_TYPE.TIMES
                     || nextToken.getTokenType() === Token.TOKEN_TYPE.OVER)) {
         var opToken = tokens.shift();
         var rhs = parseMultiplyExpression(tokens);
         return new Expression.BinaryExpression(lhs, opToken.getTokenType(), rhs);
      }

      return lhs;
   }

   // primaryExpression := '(' addExpression ')' | '-' primaryExpression | NUMBER
   var parsePrimaryExpression = function(tokens) {
      var token = tokens.shift();

      if (!token) {
         throwUnexpectedEnd();
      }

      // '(' addExpression ')'
      if (token.getTokenType() === Token.TOKEN_TYPE.LEFT_BRACKET) {
         var expression = parseAddExpression(tokens);

         // consume ')'
         var nextToken = tokens.shift();
         if (!nextToken) {
            throwUnexpectedEnd();
         } else if (nextToken.getTokenType() !== Token.TOKEN_TYPE.RIGHT_BRACKET) {
            throwUnexpectedToken(nextToken);
         }

         return expression;
      }

      // '-' primaryExpression
      if (token.getTokenType() === Token.TOKEN_TYPE.MINUS) {
         var expression = parsePrimaryExpression(tokens);
         return new Expression.UnaryExpression(token.getTokenType(), expression);
      }

      // NUMBER
      if (token.getTokenType() === Token.TOKEN_TYPE.NUMBER) {
         return new Expression.ConstExpression(token.getValue());
      }

      throwUnexpectedToken(token);
   }

   var throwUnexpectedToken = function(token) {
      throw new Error('Unexpected token ' + token.getValue()
                     + ' at position ' + token.getPosition());
   }

   var throwUnexpectedEnd = function() {
      throw new Error('Unexpected end of expression');
   }
}

module.exports = ExpressionParser;
