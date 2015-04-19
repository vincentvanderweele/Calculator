"use strict"

function Expression() {}

Expression.prototype.getValue = function() {
   return this._value;
}

function ConstExpression(number) {
   this._number = number;
}

ConstExpression.prototype = Object.create(Expression.prototype);

ConstExpression.prototype.getNumber = function() {
   return this._number;
}

ConstExpression.prototype.accept = function(calculator) {
   this._value = calculator.calculateConstExpression(this);
}


function UnaryExpression(operator, expression) {
   this._operator = operator;
   this._expression = expression;
}

UnaryExpression.prototype = Object.create(Expression.prototype);

UnaryExpression.prototype.getOperator = function() {
   return this._operator;
}

UnaryExpression.prototype.getExpressionValue = function() {
   return this._expression.getValue();
}

UnaryExpression.prototype.accept = function(calculator) {
   this._expression.accept(calculator);
   this._value = calculator.calculateUnaryExpression(this);
}


function BinaryExpression(lhs, operator, rhs) {
   this._lhs = lhs;
   this._operator = operator;
   this._rhs = rhs;
}

BinaryExpression.prototype = Object.create(Expression.prototype);

BinaryExpression.prototype.getOperator = function() {
   return this._operator;
}

BinaryExpression.prototype.getLhsValue = function() {
   return this._lhs.getValue();
}

BinaryExpression.prototype.getRhsValue = function() {
   return this._rhs.getValue();
}

BinaryExpression.prototype.accept = function(calculator) {
   this._lhs.accept(calculator);
   this._rhs.accept(calculator);
   this._value = calculator.calculateBinaryExpression(this);
}

module.exports = {
   ConstExpression: ConstExpression,
   UnaryExpression: UnaryExpression,
   BinaryExpression: BinaryExpression,
}
