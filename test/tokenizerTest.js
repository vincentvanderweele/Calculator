"use strict"

var assert = require("assert");
var Token = require("../token");
var Tokenizer = require("../tokenizer");

describe('Tokenizer', function() {
   describe('tokenize', function() {
      it('should tokenize a simple expression', function() {
         var expression = "1 + 2";
         var tokenizer = new Tokenizer();

         var tokens = tokenizer.tokenize(expression);

         assert.strictEqual(3, tokens.length);

         verifyToken(tokens[0], Token.TOKEN_TYPE.NUMBER, 1, 0);
         verifyToken(tokens[1], Token.TOKEN_TYPE.PLUS, '+', 2);
         verifyToken(tokens[2], Token.TOKEN_TYPE.NUMBER, 2, 4);
      });

      it('should tokenize an expression with all allowed characters', function() {
         var expression = "0 + 123 * (45.6-78) / 9";
         var tokenizer = new Tokenizer();

         var tokens = tokenizer.tokenize(expression);

         assert.strictEqual(11, tokens.length);

         verifyToken(tokens[0], Token.TOKEN_TYPE.NUMBER, 0, 0);
         verifyToken(tokens[1], Token.TOKEN_TYPE.PLUS, '+', 2);
         verifyToken(tokens[2], Token.TOKEN_TYPE.NUMBER, 123, 4);
         verifyToken(tokens[3], Token.TOKEN_TYPE.TIMES, '*', 8);
         verifyToken(tokens[4], Token.TOKEN_TYPE.LEFT_BRACKET, '(', 10);
         verifyToken(tokens[5], Token.TOKEN_TYPE.NUMBER, 45.6, 11);
         verifyToken(tokens[6], Token.TOKEN_TYPE.MINUS, '-', 15);
         verifyToken(tokens[7], Token.TOKEN_TYPE.NUMBER, 78, 16);
         verifyToken(tokens[8], Token.TOKEN_TYPE.RIGHT_BRACKET, ')', 18);
         verifyToken(tokens[9], Token.TOKEN_TYPE.OVER, '/', 20);
         verifyToken(tokens[10], Token.TOKEN_TYPE.NUMBER, 9, 22);
      });

      it('should tokenize an incorrect syntax', function() {
         var expression = "1 2 +";
         var tokenizer = new Tokenizer();

         var tokens = tokenizer.tokenize(expression);

         assert.strictEqual(3, tokens.length);

         verifyToken(tokens[0], Token.TOKEN_TYPE.NUMBER, 1, 0);
         verifyToken(tokens[1], Token.TOKEN_TYPE.NUMBER, 2, 2);
         verifyToken(tokens[2], Token.TOKEN_TYPE.PLUS, '+', 4);
      });

      it('should throw an error on an illegal character', function() {
         var expression = "1 + 2a";
         var tokenizer = new Tokenizer();

         assert.throws(function() {
            var tokens = tokenizer.tokenize(expression);
         }, function(err) {
            return err.message === 'Unexpected character a at position 5';
         });
      });

      it('should throw an error on an illegal number format', function() {
         var expression = "1.1.1";
         var tokenizer = new Tokenizer();

         assert.throws(function() {
            var tokens = tokenizer.tokenize(expression);
         }, function(err) {
            return err.message === 'Unexpected character . at position 3';
         });
      });
   });
});

function verifyToken(token, tokenType, value, position) {
   assert.strictEqual(tokenType, token.getTokenType());
   assert.strictEqual(value, token.getValue());
   assert.strictEqual(position, token.getPosition());
}
