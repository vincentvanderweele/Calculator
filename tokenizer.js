"use strict"

var Token = require('./token');

function Tokenizer() {

   // split expression into array of tokens
   this.tokenize = function(expression) {
      var tokens = [];

      var currentNumber = '';
      var fraction = false;

      for (var i = 0, ch; ch = expression[i]; i++) {
         if (ch === ' ') continue;

         if (isNumberCharacter(ch)) {
            if (ch === '.') {
               // only one '.' per number is allowed
               if (fraction) {
                  throwUnexpectedCharacter(ch, i);
               }
               fraction = true;
            }

            currentNumber += ch;

            // create a number token if the next character does
            //   not belong to this number
            if (!isNumberCharacter(expression[i + 1])) {
               tokens.push(new Token(Token.TOKEN_TYPE.NUMBER,
                                     parseFloat(currentNumber),
                                     i + 1 - currentNumber.length));
               currentNumber = '';
               fraction = false;
            }
         } else {
            var operator = operators[ch];

            if (operator !== undefined) {
               tokens.push(new Token(operator, ch, i));
            } else {
               throwUnexpectedCharacter(ch, i);
            }
         }
      }

      return tokens;
   }

   var operators = {
      '+': Token.TOKEN_TYPE.PLUS,
      '-': Token.TOKEN_TYPE.MINUS,
      '*': Token.TOKEN_TYPE.TIMES,
      '/': Token.TOKEN_TYPE.OVER,
      '(': Token.TOKEN_TYPE.LEFT_BRACKET,
      ')': Token.TOKEN_TYPE.RIGHT_BRACKET,
   };

   var isNumberCharacter = function(ch) {
      return (ch >= '0' && ch <= '9') || ch === '.';
   }

   var throwUnexpectedCharacter = function(ch, p) {
      throw new Error('Unexpected character ' + ch + ' at position ' + p);
   }
}

module.exports = Tokenizer;
