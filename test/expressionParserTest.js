"use strict"

var assert = require("assert");
var Token = require("../token");
var ExpressionParser = require("../expressionParser");

describe('ExpressionParser', function() {
   describe('parseExpression', function() {
      it('should parse a simple expression', function() {
         var tokens = createTokens('1+2');
         var expressionParser = new ExpressionParser();

         var expression = expressionParser.parseExpression(tokens);

         assert.strictEqual(Token.TOKEN_TYPE.PLUS, expression._operator);
         assert.strictEqual(1, expression._lhs._number);
         assert.strictEqual(2, expression._rhs._number);
      });

      it('should parse an expression with all allowed tokens', function() {
         var tokens = createTokens('1*(2+3)/-4-5');
         var expressionParser = new ExpressionParser();

         var expression = expressionParser.parseExpression(tokens);

         assert.strictEqual(Token.TOKEN_TYPE.MINUS, expression._operator);

            // 1*(2+3)/-4
            var lhs = expression._lhs;
            assert.strictEqual(Token.TOKEN_TYPE.TIMES, lhs._operator);

               // 1
               var lhs1 = lhs._lhs;
               assert.strictEqual(1, lhs1._number);

               // (2+3)/-4
               var rhs1 = lhs._rhs;
               assert.strictEqual(Token.TOKEN_TYPE.OVER, rhs1._operator);

                  // (2+3)
                  var lhs2 = rhs1._lhs;
                  assert.strictEqual(Token.TOKEN_TYPE.PLUS, lhs2._operator);
                  assert.strictEqual(2, lhs2._lhs._number);
                  assert.strictEqual(3, lhs2._rhs._number);

                  // -4
                  var rhs2 = rhs1._rhs;
                  assert.strictEqual(Token.TOKEN_TYPE.MINUS, rhs2._operator);
                  assert.strictEqual(4, rhs2._expression._number);

            // 5
            var rhs = expression._rhs;
            assert.strictEqual(5, rhs._number);
      });

      it('should parse nested brackets', function() {
         var tokens = createTokens('((1/(2+3)))');
         var expressionParser = new ExpressionParser();

         var expression = expressionParser.parseExpression(tokens);

         assert.strictEqual(Token.TOKEN_TYPE.OVER, expression._operator);
         assert.strictEqual(1, expression._lhs._number);

         // 2+3
         var rhs = expression._rhs;
         assert.strictEqual(Token.TOKEN_TYPE.PLUS, rhs._operator);
         assert.strictEqual(2, rhs._lhs._number);
         assert.strictEqual(3, rhs._rhs._number);
      });

      it('should parse negated bracket expressions', function() {
         var tokens = createTokens('-(1)');
         var expressionParser = new ExpressionParser();

         var expression = expressionParser.parseExpression(tokens);

         assert.strictEqual(Token.TOKEN_TYPE.MINUS, expression._operator);
         assert.strictEqual(1, expression._expression._number);
      });

      it('should not allow input after a valid expression', function() {
         var tokens = createTokens('1+2(3+4)');
         var expressionParser = new ExpressionParser();

         assert.throws(function() {
            var expression = expressionParser.parseExpression(tokens);
         }, function(err) {
            return err.message === 'Unexpected token ( at position 3';
         });
      });

      it('should not allow expressions starting with an operator', function() {
         var tokens = createTokens('*1');
         var expressionParser = new ExpressionParser();

         assert.throws(function() {
            var expression = expressionParser.parseExpression(tokens);
         }, function(err) {
            return err.message === 'Unexpected token * at position 0';
         });
      });

      it('should not allow expressions with two consecutive operators', function() {
         var tokens = createTokens('1+/2');
         var expressionParser = new ExpressionParser();

         assert.throws(function() {
            var expression = expressionParser.parseExpression(tokens);
         }, function(err) {
            return err.message === 'Unexpected token / at position 2';
         });
      });

      it('should not allow expressions a unary minus before another operator', function() {
         var tokens = createTokens('1-+2');
         var expressionParser = new ExpressionParser();

         assert.throws(function() {
            var expression = expressionParser.parseExpression(tokens);
         }, function(err) {
            return err.message === 'Unexpected token + at position 2';
         });
      });

      it('should not allow non-matching brackets; too many opening', function() {
         var tokens = createTokens('((1)+1');
         var expressionParser = new ExpressionParser();

         assert.throws(function() {
            var expression = expressionParser.parseExpression(tokens);
         }, function(err) {
            return err.message === 'Unexpected end of expression';
         });
      });

      it('should not allow non-matching brackets; too many closing', function() {
         var tokens = createTokens('(1+2)+3)');
         var expressionParser = new ExpressionParser();

         assert.throws(function() {
            var expression = expressionParser.parseExpression(tokens);
         }, function(err) {
            return err.message === 'Unexpected token ) at position 7';
         });
      });

      it('should not allow incomplete expressions', function() {
         var tokens = createTokens('2*');
         var expressionParser = new ExpressionParser();

         assert.throws(function() {
            var expression = expressionParser.parseExpression(tokens);
         }, function(err) {
            return err.message === 'Unexpected end of expression';
         });
      });
   });
});

// simple tokenizer, expecting no spaces and only single-digit integers
function createTokens(expression) {
   var result = [];
   for (var i = 0, ch; ch = expression[i]; i++) {
      result.push(createToken(ch, i));
   }
   return result;
}

function createToken(ch, i) {
   switch (ch) {
      case '+': return new Token(Token.TOKEN_TYPE.PLUS, ch, i);
      case '-': return new Token(Token.TOKEN_TYPE.MINUS, ch, i);
      case '*': return new Token(Token.TOKEN_TYPE.TIMES, ch, i);
      case '/': return new Token(Token.TOKEN_TYPE.OVER, ch, i);
      case '(': return new Token(Token.TOKEN_TYPE.LEFT_BRACKET, ch, i);
      case ')': return new Token(Token.TOKEN_TYPE.RIGHT_BRACKET, ch, i);
      default: return new Token(Token.TOKEN_TYPE.NUMBER, parseInt(ch), i);
   }
}
