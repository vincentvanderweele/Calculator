function Token(tokenType, value, position) {
   this._tokenType = tokenType;
   this._value = value;
   this._position = position;
}

Token.prototype.getTokenType = function() {
   return this._tokenType;
}

Token.prototype.getValue = function() {
   return this._value;
}

Token.prototype.getPosition = function() {
   return this._position;
}

Token.prototype.toString = function() {
   return "[type: " + this._tokenType + "; value: " + this._value + "; position: " + this._position + "]";
}

Token.TOKEN_TYPE = Object.freeze({
   PLUS: 0,
   MINUS: 1,
   TIMES: 2,
   OVER: 3,
   NUMBER: 4,
   LEFT_BRACKET: 5,
   RIGHT_BRACKET: 6,
});

module.exports = Token;
