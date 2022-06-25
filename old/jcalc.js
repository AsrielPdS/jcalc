class ParseError {
  start;
  length;
  type;
}
class OpVal {
  get op() { return 'op'; }
  a;
  b;
  valid() { return !!this.b; }
  push(expression) {
    if (this.b)
      throw "invalid expression";
    this.b = expression;
  }
  toString() { return this.toJSON(); }
  vars(vars = []) {
    this.a.vars(vars);
    this.b.vars(vars);
    return vars;
  }
  translate(dir) {
    let t = Object.create(Object.getPrototypeOf(this));
    t.a = this.a.translate(dir);
    t.b = this.b.translate(dir);
    return t;
  }
  analize(check) {
    let t = check(this.a);
    if (t)
      this.a = t;
    else
      this.a.analize(check);
    if (t = check(this.b))
      this.b = t;
    else
      this.b.analize(check);
  }
  *[Symbol.iterator]() {
    yield this;
    yield* this.a;
    yield* this.b;
  }
  static op;
}
exports.OpVal = OpVal;

class SumOp extends OpVal {
  get level() { return 4; }
  calc(opts) {
    let a = this.a.calc(opts), b = this.b.calc(opts);
    if (opts.try) {
      if (!a)
        a = 0;
      if (!b)
        b = 0;
    }
    if (typeof a == 'string')
      a = parseFloat(a);
    if (typeof b == 'string')
      b = parseFloat(b);
    return a + b;
  }
  toJSON() {
    return this.a + '+' + this.b;
  }
  static /*override*/ op = '+';
}
exports.SumOp = SumOp;

class TimeOp extends OpVal {
  get level() { return 5; }
  calc(opts) {
    var a = this.a.calc(opts), b = this.b.calc(opts);
    if (opts.try) {
      if (!a)
        a = 0;
      if (!b)
        b = 0;
    }
    return a * b;
  }
  toJSON() {
    return this.a + '*' + this.b;
  }
  static /*override*/ op = '*';
}
exports.TimeOp = TimeOp;

class SubOp extends OpVal {
  get level() { return 4; }
  calc(opts) {
    var a = this.a.calc(opts), b = this.b.calc(opts);
    if (opts.try) {
      if (!a)
        a = 0;
      if (!b)
        b = 0;
    }
    return a - b;
  }
  toJSON() {
    return this.a + '-' + this.b;
  }
  static /*override*/ op = '-';
}
exports.SubOp = SubOp;

class DivOp extends OpVal {
  get level() { return 5; }
  calc(opts) {
    var a = this.a.calc(opts), b = this.b.calc(opts);
    if (opts.try) {
      if (!a)
        a = 0;
      if (!b)
        b = 0;
    }
    if (b == 0)
      return null;
    return a / b;
  }
  toJSON() {
    return this.a + '/' + this.b;
  }
  static /*override*/ op = '/';
}
exports.DivOp = DivOp;

class EqualOp extends OpVal {
  get level() { return 2; }
  calc(opts) {
    return this.a.calc(opts) == this.b.calc(opts);
  }
  toJSON() {
    return this.a + '=' + this.b;
  }
  static /*override*/ op = '=';
}
exports.EqualOp = EqualOp;

class AndOp extends OpVal {
  get level() { return 1; }
  calc(opts) {
    return this.a.calc(opts) && this.b.calc(opts);
  }
  toJSON() {
    return this.a + '&&' + this.b;
  }
  static /*override*/ op = '&&';
}
exports.AndOp = AndOp;

class ConcatOp extends OpVal {
  get level() { return 3; }
  calc(opts) {
    let a = this.a.calc(opts), b = this.b.calc(opts);
    return (a == null ? '' : a + '') + (b == null ? '' : b + '');
  }
  toJSON() {
    return this.a + '&' + this.b;
  }
  static /*override*/ op = '&';
}
exports.ConcatOp = ConcatOp;

class LesEqualOp extends OpVal {
  get level() { return 2; }
  calc(opts) {
    return this.a.calc(opts) <= this.b.calc(opts);
  }
  toJSON() {
    return this.a + '<=' + this.b;
  }
  static /*override*/ op = '<=';
}
exports.LesEqualOp = LesEqualOp;

class DifOp extends OpVal {
  get level() { return 2; }
  calc(opts) {
    return this.a.calc(opts) != this.b.calc(opts);
  }
  toJSON() {
    return this.a + '<>' + this.b;
  }
  static /*override*/ op = '<>';
}
exports.DifOp = DifOp;
class LessOp extends OpVal {
  get level() { return 2; }
  calc(opts) {
    let a = this.a.calc(opts), b = this.b.calc(opts);
    return a == null || b == null ? false : a < b;
  }
  toJSON() {
    return this.a + '<' + this.b;
  }
  static /*override*/ op = '<';
}
exports.LessOp = LessOp;

class OrOp extends OpVal {
  get level() { return 1; }
  calc(opts) {
    return this.a.calc(opts) || this.b.calc(opts);
  }
  toJSON() {
    return this.a + '||' + this.b;
  }
}
exports.OrOp = OrOp;

class GreaterEqualOp extends OpVal {
  get level() { return 2; }
  calc(opts) {
    return this.a.calc(opts) >= this.b.calc(opts);
  }
  toJSON() {
    return this.a + '>=' + this.b;
  }
  static /*override*/ op = '>=';
}
exports.GreaterEqualOp = GreaterEqualOp;

class GreaterOp extends OpVal {
  get level() { return 2; }
  calc(opts) {
    let a = this.a.calc(opts), b = this.b.calc(opts);
    return a == null || b == null ? false : a > b;
  }
  toJSON() {
    return this.a + '>' + this.b;
  }
  static /*override*/ op = '>';
}
exports.GreaterOp = GreaterOp;

class PowOp extends OpVal {
  get level() { return 6; }
  calc(opts) {
    var a = this.a.calc(opts), b = this.b.calc(opts);
    if (opts.try) {
      if (!a)
        a = 0;
      if (!b)
        b = 0;
    }
    return Math.pow(a, b);
  }
  toJSON() {
    return this.a + '^' + this.b;
  }
}
exports.PowOp = PowOp;

class NulledOp extends OpVal {
  get level() { return 7; }
  calc(opts) {
    var a = this.a.calc(opts), b = this.b.calc(opts);
    return typeof a == 'number' ?
      isNaN(a) ? b : a :
      a == null ? b : a;
  }
  toJSON() {
    return this.a + '??' + this.b;
  }
}
exports.NulledOp = NulledOp;

class TernaryOp extends OpVal {
  c;
  get level() { return 1; }
  calc(opts) {
    return this.a.calc(opts) ?
      this.b.calc(opts) :
      this.c.calc(opts);
  }
    /*override*/ push(value) {
    if (this.b)
      if (this.c)
        throw null;
      else
        this.c = value;
    else
      this.b = value;
  }
    /*override*/ valid() { return !!this.c; }
  toJSON() { return this.a + '?' + this.b + ':' + this.c; }
    /*override*/ toString() { return this.toJSON(); }
    /*override*/ vars(vars = []) {
    this.a.vars(vars);
    this.b.vars(vars);
    this.c.vars(vars);
    return vars;
  }
    /*override*/ *[Symbol.iterator]() {
    yield this;
    yield* this.a;
    yield* this.b;
    yield* this.c;
  }
}
exports.TernaryOp = TernaryOp;

class DicVal {
  data;
  get op() { return 'dic'; }
  constructor(data) {
    this.data = data;
  }
  calc(opts) {
    let result = {};
    for (let key in this.data)
      result[key] = this.data[key].calc(opts);
    return result;
  }
  toString() {
    return '';
  }
  valid() { return false; }
  translate(dir) {
    let nd = {};
    for (let k in this.data)
      nd[k] = this.data[k].translate(dir);
    return new DicVal(this.data);
  }
  toJSON() {
    return '';
  }
  analize(check) {
    for (let key in this.data) {
      let t = this.data[key], u = check(t);
      if (u)
        this.data[key] = u;
      else
        t.analize(check);
    }
  }
  *[Symbol.iterator]() {
    yield this;
    for (let k in this.data)
      yield* this.data[k];
  }
  vars(vars) {
    for (let key in this.data)
      this.data[key].vars(vars);
    return vars;
  }
}
exports.DicVal = DicVal;

class SignalVal {
  signal;
  get op() { return 'sig'; }
  //op: Operand = "_";
  //signal: '-' = '-';
  value;
  //constructor() { }
  //async calcAsync(opts: CalcOptions): Promise<T> {
  //   return <any>-(await this.first.calcAsync(opts));
  //}
  constructor(signal) {
    this.signal = signal;
  }
  calc(opts) {
    switch (this.signal) {
      case "-" /* Minus */:
        return -this.value.calc(opts);
      case "!" /* Not */:
        return !this.value.calc(opts);
      case "+" /* plus */:
        return +this.value.calc(opts);
      default:
    }
  }
  //push(expression: IValue) {
  //   if (this.first)
  //      throw "invalid";
  //   this.first = expression;
  //}
  valid() { return !!this.value; }
  push(value) {
    if (this.value)
      throw "invalid expression";
    this.value = value;
    //this.values.push();
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return this.signal + this.value;
  }
  vars(vars = []) {
    this.value.vars(vars);
    return vars;
  }
  translate(dir) {
    let t = new SignalVal(this.signal);
    t.value = this.value.translate(dir);
    return t;
  }
  analize(check) {
    let t = check(this.value);
    if (t)
      this.value = t;
  }
  *[Symbol.iterator]() {
    yield this;
    yield* this.value;
  }
}
exports.SignalVal = SignalVal;

class GroupVal {
  get op() { return 'g'; }
  value;
  //async calcAsync(opts: CalcOptions): Promise<T> {
  //   return await this.value.calcAsync(opts);
  //}
  valid() { return !!this.value; }
  calc(opts) {
    return this.value.calc(opts);
  }
  push(value) {
    if (this.value)
      throw "invalid expression";
    this.value = value;
    //this.values.push();
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return '(' + this.value + ')';
  }
  analize(check) {
    let t = check(this.value);
    if (t)
      this.value = t;
  }
  vars(vars = []) {
    this.value.vars(vars);
    return vars;
  }
  translate(dir) {
    let t = new GroupVal();
    t.value = this.value.translate(dir);
    return t;
  }
  *[Symbol.iterator]() {
    yield this;
    yield* this.value;
  }
}
exports.GroupVal = GroupVal;

class FnVal {
  args;
  body;
  get op() { return 'fn'; }
  //args: string[] = [];
  //body: IValue;
  constructor(args, body) {
    this.args = args;
    this.body = body;
  }
  valid() { return !!this.body; }
  push(val) {
    if (val instanceof VarVal)
      this.args.push(val.value);
    else
      throw null;
  }
  calc(opts) {
    var t = this.args;
    return (...args) => {
      return this.body.calc({
        funcs: opts.funcs,
        object: opts.object,
        optional: opts.optional,
        try: opts.try,
        vars(field, isObj) {
          let index = t.indexOf(field);
          if (index === -1)
            if (opts.vars)
              if (typeof opts.vars === 'function')
                return opts.vars(field, isObj);
              else
                return opts.vars[field];
            else
              throw null;
          else
            return args[index];
        }
      });
    };
  }
  toString() {
    return this.toJSON();
  }
  toJSON() {
    return '(' + this.args.join(',') + ')=>' + this.body;
  }
  vars(vars) {
    return this.body.vars(vars);
  }
  translate(dir) {
    return new FnVal(this.args, this.body.translate(dir));
  }
  analize(check) {
    let t = check(this.body);
    if (t)
      this.body = t;
  }
  *[Symbol.iterator]() {
    yield this;
  }
}
exports.FnVal = FnVal;

class CallVal {
  func;
  args;
  get op() { return 'call'; }
  constructor(func, args = []) {
    this.func = func;
    this.args = args;
  }
  calc(opts) {
    let args = this.args.map(a => a.calc(opts)), name = opts.uncase ? this.func.toLowerCase() : this.func, f = typeof opts.funcs == "function";
    if (f) {
      let v = opts.funcs(name, args);
      if (v !== void 0)
        return v;
    }
    let formula = (!f && opts.funcs) && opts.funcs[name] || (name in formulas ? formulas[name].calc : null);
    if (!formula)
      throw { msg: "not_found", name };
    return formula.apply(opts, args);
  }
  valid() { return true; }
  push(expression) {
    this.args.push(expression);
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return this.func + '(' + this.args.join(',') + ')';
  }
  vars(vars = []) {
    for (let p of this.args)
      p.vars(vars);
    return vars;
  }
  translate(dir) {
    //let formula = formulas[this.func.toLowerCase()];
    let t = new CallVal($.translate(this.func, dir));
    t.args = this.args.map(a => a.translate(dir));
    return t;
  }
  analize(check) {
    for (let i = 0, a = this.args; i < a.length; i++) {
      let t = a[i], u = check(t);
      if (u)
        a[i] = u;
      else
        t.analize(check);
    }
  }
  *[Symbol.iterator]() {
    yield this;
    for (let t of this.args)
      yield* t;
  }
}
exports.CallVal = CallVal;

class NumbVal {
  get op() { return 'n'; }
  value;
  constructor(value) {
    this.value = value;
  }
  async calcAsync() {
    return this.value;
  }
  valid() { return true; }
  calc() {
    return +this.value;
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return +this.value + '';
  }
  vars(vars = []) {
    return vars;
  }
  analize(_) { }
  translate(dir) { return this; }
  *[Symbol.iterator]() {
    yield this;
  }
}
exports.NumbVal = NumbVal;

class VarVal {
  value;
  get op() { return 'v'; }
  constructor(value) {
    this.value = value;
  }
  valid() { return true; }
  calc(opts) {
    return typeof opts.vars == 'function' ? opts.vars(this.value) : opts.vars[this.value];
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return this.value;
  }
  vars(vars = []) {
    vars.push(this.value);
    return vars;
  }
  translate(dir) { return this; }
  analize(_) { }
  *[Symbol.iterator]() {
    yield this;
  }
}
exports.VarVal = VarVal;

class TextValue {
  value;
  charCode;
  get op() { return 't'; }
  constructor(value, charCode) {
    this.value = value;
    this.charCode = charCode;
  }
  static create(text) {
    return new TextValue(text, '"'.charCodeAt(0));
  }
  get char() { return String.fromCharCode(this.charCode); }
  valid() { return true; }
  calc() {
    return this.value;
  }
  toString() {
    return `"${this.value.replace(/"/g, '\\"')}"`;
  }
  toJSON() {
    return `'${this.value.replace(/'/g, "\\'")}'`;
  }
  vars(vars = []) { return vars; }
  translate(dir) { return this; }
  analize(_) { }
  *[Symbol.iterator]() {
    yield this;
  }
}
exports.TextValue = TextValue;

class ObjectVal {
  levels;
  get op() { return 'o'; }
  constructor(levels) {
    this.levels = levels;
  }
  valid() { return true; }
  calc(opts) {
    let i = 1, l = this.levels, result = typeof opts.vars == 'function' ? opts.vars(l[0], true) : opts.vars[l[0]];
    for (; i < l.length; i++) {
      if (!result) {
        return null;
      }
      result = result[l[i]];
    }
    return result;
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return this.levels.join('.');
  }
  vars(vars = []) {
    vars.push(this.levels[0]);
    return vars;
  }
  translate(dir) { return this; }
  analize(_) { }
  *[Symbol.iterator]() {
    yield this;
  }
}
exports.ObjectVal = ObjectVal;

exports.$ = {};
exports.analize = (val, check) => {
  let t = check(val);
  if (t)
    return t;
  val.analize(check);
  return val;
}
exports.clone = (val) => {
  return new Parser(val.toString()).parse();
}
function has(value, check) {
  return (value & check) === check;
}
class Parser {
  options;
  //GroupValue | OpValue | SignalValue | FuncValue | TernaryValue
  scope = [];
  stored;
  mode = 8193 /* begin */;
  expression;
  end;
  constructor(exp, options = {}) {
    this.options = options;
    if (!exp)
      this.error('expression is null');
    this.expression = exp;
  }
  popStored() {
    if (!this.stored)
      throw "invalid expression";
    var temp = this.stored;
    this.stored = null;
    return temp;
  }
  setStored(value) {
    let s = this.scope, t = s[s.length - 1];
    if (t && t instanceof SignalVal) {
      s.pop();
      t.value = value;
      value = t;
    }
    this.stored = value;
  }
  setMode(mode) {
    let old = this.mode;
    if (has(mode, 4096 /* sep */)) {
      if (!has(old, 16384 /* valueEnd */))
        throw 1;
    }
    else if (has(mode, 32768 /* signal */)) {
      if (!has(old, 8193 /* begin */) && !has(old, 4096 /* sep */))
        throw 2;
    }
    else if (has(mode, 8192 /* valueStart */)) {
      if (has(old, 16384 /* valueEnd */))
        throw 3;
    }
    else if (has(mode, 16384 /* valueEnd */)) {
      if (has(old, 4096 /* sep */) || has(old, 32768 /* signal */))
        throw 4;
    }
    //if ((mode == PM.signal && old != PM.begin && old != PM.coma && old != PM.op) ||
    //  (mode == PM.value && (old == PM.value || old == PM.end)) ||
    //  ((mode == PM.op || mode == PM.end) && (old != PM.value && old != PM.fn && old != PM.end)) ||//(mode == PM.coma || mode == PM.begin || mode == PM.op || mode == PM.signal)
    //  (mode == PM.begin && (old == PM.end || old == PM.value)) ||
    //  (mode == PM.coma && (old == PM.begin || old == PM.signal || old == PM.coma))
    //)
    //  throw "invalid expression";
    this.mode = mode;
  }
  appendOp(_new) {
    var s = this.scope, old = s[s.length - 1], stored = this.popStored();
    if (old instanceof OpVal) {
      //ex: 2+3*4, 2*3^4
      if (_new.level > old.level) {
        _new.a = stored;
        s.push(_new); //new OpValue(_new, stored)
      }
      //ex: 2*3+4,3^4+1, 2*3/4
      else {
        old.b = stored;
        _new.a = old;
        s[s.length - 1] = _new;
      }
    }
    else {
      _new.a = stored;
      s.push(_new);
    }
    //else {
    //  _new.a = stored;
    //  s.push(_new);
    //}
  }
  parseString(i, exp, char) {
    let temp1 = "", letter = exp.charCodeAt(i + 1);
    //check se a letra não é " se for checa a proxima letra 
    while (letter != char || ((letter = exp.charCodeAt(++i + 1)) == char)) {
      //se chegar no final da expressão sem terminar a string
      if (Number.isNaN(letter))
        throw "error";
      temp1 += exp[i + 1];
      letter = exp.charCodeAt(++i + 1);
    }
    this.setMode(24578 /* string */);
    this.setStored(new TextValue(temp1, char));
    return i;
  }
  parseVal(char, exp, i) {
    let storedText = exp[i], l = exp.length;
    //se for numero ou ponto
    if ((char > 47 && char < 58) || char == 46) {
      char = exp.charCodeAt(i + 1);
      while (((char > 47 && char < 58) || char == 46) && i < l) {
        storedText += exp[i + 1];
        char = exp.charCodeAt(++i + 1);
      }
      this.setStored(new NumbVal(storedText));
      this.setMode(24577 /* number */);
      //se for letra ou underscore
      //letra minuscula>>>>>>>>>>>>>>>>>>>>>>>letra maiuscula>>>>>>>>>>>>>>>>>>underscore>>>>>>at>>>>>>>>>>>>dois pontos
    }
    else if ((char > 96 && char < 123) || (char > 64 && char < 91) || char === 95 || char === 64 /* || letter == 58*/) {
      let obj;
      do {
        char = exp.charCodeAt(i + 1);
        //>>>>>>>letra minuscula>>>>>>>>>>>>>>>>>>letra maiuscula>>>>>>>>>>>>>>>>>numero>>>>>>>>>>>>>>>>>>>>>>>>>underscore>>>>>>dois pontos
        while (((char > 96 && char < 123) || (char > 64 && char < 91) || (char > 47 && char < 58) || char == 95 /*|| char == 58*/) && i < l) {
          storedText += exp[i + 1];
          char = exp.charCodeAt(++i + 1);
        }
        //se for função
        if (char == 40) {
          this.setMode(8199 /* call */);
          this.scope.push(new CallVal(storedText));
          i++;
        }
        else /*se for object*/ if (char === 46) {
          obj ?
            obj.push(storedText) :
            (obj = [storedText]);
          //um passo para frente para passar o ponto
          //um passo para passar o primeiro caracter
          storedText = exp[i += 2];
        }
        else if (obj) {
          obj.push(storedText);
          this.setStored(new ObjectVal(obj));
          this.setMode(24624 /* object */);
          obj = null;
        }
        else /*se for variavel*/ {
          this.setStored(new VarVal(storedText));
          this.setMode(24592 /* variable */);
        }
      } while (obj);
    }
    else
      throw `invalid expression character found '${exp[i]}'`;
    return i;
  }
  parseDic() {
  }
  isCall(exp, i) {
    for (let l = exp.length - 3; i < l; i++) {
      if (exp[i] == '(')
        return false;
      if (exp[i] == ')')
        return exp[i + 1] == '=' && exp[i + 2] == '>';
    }
    return false;
  }
  parseNumb(exp, i) {
    let r = '', char = exp.charCodeAt(i);
    //-
    if (char == 45) {
      r = '-';
      char = exp.charCodeAt(++i);
    }
    for (; i < exp.length && ((char > 47 && char < 58) || char == 46); char = exp.charCodeAt(++i))
      r += exp[i];
    return r;
  }
  parseVar(exp, i) {
    let r = '';
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>letra minuscula>>>>>>>>>>>>>>letra maiuscula>>>>>>>>>>>>>numero>>>>>>>>>>>>>>>>>>>>>>underscore
    for (let char = exp.charCodeAt(i); i < exp.length && ((char > 96 && char < 123) || (char > 64 && char < 91) || (char > 47 && char < 58) || char == 95); char = exp.charCodeAt(++i)) {
      r += exp[i];
    }
    return r;
  }
  error(error, index) {
    throw {
      expression: this.expression,
      index: index,
      error: error
    };
  }
  jumpSpace(exp, i) {
    while (exp[i] == ' ')
      i++;
    return i;
  }
  parse() {
    let scope = this.scope;
    //let
    //  this.stored = this.this.stored,
    //  scope = this.scope;
    for (let i = this.options.from || 0, exp = this.expression; i < exp.length; i++) {
      let char = exp.charCodeAt(i);
      switch (char) {
        // space
        case 32:
          break;
        // +
        case 43:
          if (this.stored) {
            this.appendOp(new SumOp());
            this.setMode(4614 /* sum */);
          }
          else {
            this.setMode(32769 /* plus */);
            scope.push(new SignalVal("+" /* plus */));
          }
          break;
        //-
        case 45:
          if (this.stored) {
            this.appendOp(new SubOp());
            this.setMode(4618 /* sub */);
            //scope.push(new SubOpExpression(getStored()));
          }
          else {
            this.setMode(32770 /* minus */);
            scope.push(new SignalVal("-" /* Minus */));
          }
          break;
        //*
        case 42:
          this.appendOp(new TimeOp());
          this.setMode(4626 /* time */);
          break;
        // /
        case 47:
          this.appendOp(new DivOp());
          this.setMode(4642 /* div */);
          break;
        //!
        case 33:
          if (this.stored) {
            throw "invalid expression";
          }
          else {
            this.setMode(32769 /* not */);
            scope.push(new SignalVal("!" /* Not */));
          }
          break;
        //||
        case 124:
          if (exp.charCodeAt(i + 1) === 124) {
            i++;
            this.appendOp(new OrOp());
            this.setMode(6154 /* or */);
          }
          else
            throw "operator not found knowed";
          break;
        // &
        case 38:
          if (exp.charCodeAt(i + 1) === 38) {
            i++;
            this.appendOp(new AndOp());
            this.setMode(6150 /* and */);
          }
          else {
            this.appendOp(new ConcatOp());
            this.setMode(4226 /* concat */);
          }
          break;
        // {
        case 123:
          {
            //struct {p1:val1;p2:val2;p3:val3}
            let dic = {};
            i = this.jumpSpace(exp, i);
            if (exp[++i] != '}')
              while (true) {
                //----------------------
                let temp = this.parseVar(exp, i) || this.parseNumb(exp, i);
                if (!temp.length)
                  this.error('error parse', i);
                i += temp.length;
                i = this.jumpSpace(exp, i);
                //----------------------
                //se depois da var não vier dois ponto deve dar erro
                if (exp[i++] != ':')
                  this.error('":" not found');
                //i = this.jumpSpace(exp, i);
                //----------------------
                //não precisa chacar espaço antes e depois porque o parse vai filtrar isto
                let body = new Parser(exp, { from: i, sub: true, warn: this.options.warn });
                dic[temp] = body.parse();
                if (!(i = body.end))
                  this.error('');
                //----------------------
                //pula o ultima caracter da sub expression
                i++;
                //----------------------
                if (exp[i] == '}')
                  break;
                //----------------------
                if (i == exp.length)
                  this.error('unexpected end');
                //----------------------
                if (exp[i] != ',')
                  this.error('"," not found');
                i++;
                i = this.jumpSpace(exp, i);
              }
            this.setStored(new DicVal(dic));
            this.setMode(24584 /* dic */);
          }
          break;
        // }
        case 125:
          if (this.options.sub) {
            this.end = i - 1;
            i = exp.length;
          }
          else
            this.error('mas fim que inicio', i);
          break;
        // ?
        case 63:
          {
            if (exp.charCodeAt(i + 1) === 63) {
              i++;
              this.appendOp(new NulledOp());
              this.setMode(6154 /* or */);
            }
            else {
              this.appendOp(new TernaryOp());
              this.setMode(4358 /* Ter1 */);
            }
          }
          break;
        // :
        case 58:
          {
            this.setMode(4362 /* Ter2 */);
            let stored = this.popStored(), before = scope[scope.length - 1];
            while (!(before instanceof TernaryOp)) {
              scope.pop();
              //adiciona o valor guardado no escopo
              before.push(stored);
              //depois o escopo passa a ser o valor guardado
              stored = before;
              //e o last scope passa a ser ultimo scope
              before = scope[scope.length - 1];
              if (!before)
                throw "invalid expression";
            }
            before.push(stored);
          }
          break;
        // ( 
        case 40:
          if (this.isCall(exp, i + 1)) {
            let args = [];
            i = this.jumpSpace(exp, i);
            if (exp[++i] != ')')
              while (true) {
                //----------------------
                let temp = this.parseVar(exp, i);
                if (!temp.length)
                  this.error('error parse', i);
                i += temp.length;
                args.push(temp);
                i = this.jumpSpace(exp, i);
                //----------------------
                /*não precisa checar se ja chegou no fim da string porque o isCall faz essa checagem*/
                if (exp[i] == ')')
                  break;
                //----------------------
                if (exp[i] != ',')
                  this.error('"," not found');
                i = this.jumpSpace(exp, i);
                i++;
              }
            let body = new Parser(exp, { from: i += 3, sub: true, warn: this.options.warn });
            this.setStored(new FnVal(args, body.parse()));
            this.setMode(24580 /* fn */);
            i = body.end || exp.length;
          }
          else {
            this.setMode(8195 /* open */);
            scope.push(new GroupVal());
          }
          break;
        // )
        case 41:
          {
            let lastScope = scope.pop();
            //so adiciona o ultimo valor guardado se o ultimo scopo for fn mas o ultimo escopo não é o ultimo item inserido
            //para evitar funcões(fn) sem parametro
            if (!has(this.mode, 8195 /* open */)) {
              if (lastScope)
                lastScope.push(this.popStored());
              else if (this.options.sub) {
                this.end = i - 1;
                i = exp.length;
                break;
              }
              else
                this.error('mas fim que inicio', i);
            }
            //if (lastScope instanceof FnVal) {
            //  //se for so um grupo
            //} else lastScope.push(this.getStored());
            //o modo é posto depois para a fn poder checar o modo
            this.setMode(16387 /* close */);
            while (!(lastScope instanceof CallVal) && !(lastScope instanceof GroupVal)) {
              let temp1 = lastScope;
              if (!scope.length)
                if (this.options.sub) {
                  this.end = i - 1;
                  i = exp.length;
                  break;
                }
                else
                  this.error('mas fim que inicio', i);
              (lastScope = scope.pop()).push(temp1);
            }
            this.setStored(lastScope);
          }
          break;
        // ,
        case 44:
        // ;
        case 59:
          {
            //func(2+3*4,...;func(4,
            this.setMode(4097 /* coma */);
            let before = scope[scope.length - 1];
            let stored = this.popStored();
            while (!(before instanceof CallVal)) {
              if (!before)
                if (this.options.sub) {
                  this.end = i - 1;
                  i = exp.length;
                  //adiciona denovo o stored para poder retornar no fim
                  this.setStored(stored);
                  break;
                }
                else
                  this.error('mas fim que inicio', i);
              scope.pop();
              //adiciona o valor guardado no escopo
              before.push(stored);
              //depois o escopo passa a ser o valor guardado
              stored = before;
              //e o last scope passa a ser ultimo scope
              before = scope[scope.length - 1];
              //if (!scope.length)
              //  break;
            }
            if (before)
              before.push(stored);
          }
          break;
        // <
        case 60:
          switch (exp.charCodeAt(i + 1)) {
            case 61:
              i++;
              this.appendOp(new LesEqualOp());
              this.setMode(5142 /* lessEqual */);
              break;
            case 62:
              i++;
              this.appendOp(new DifOp());
              this.setMode(5134 /* diferent */);
              break;
            default:
              this.appendOp(new LessOp());
              this.setMode(5126 /* less */);
          }
          break;
        // =
        case 61:
          this.appendOp(new EqualOp());
          this.setMode(5138 /* equal */);
          break;
        // >
        case 62:
          if (exp.charCodeAt(i + 1) === 61) {
            i++;
            this.appendOp(new GreaterEqualOp());
          }
          else
            this.appendOp(new GreaterOp());
          this.setMode(5130 /* greater */);
          break;
        // "
        case 34:
        // '
        case 39:
          i = this.parseString(i, exp, char);
          break;
        // ^
        case 94:
          this.appendOp(new PowOp());
          this.setMode(4674 /* power */);
          break;
        //// ; isso esta amais
        //case 59: {
        //  if (!(scope[scope.length - 2] instanceof FnVal))
        //    throw "invalid expression";
        //  this.setMode(PM.end);
        //  let temp3 = scope.pop();
        //  temp3.push(this.getStored());
        //  this.setStored(temp3);
        //} break;
        // [
        case 91:
          break;
        // ]
        case 93:
          break;
        default:
          i = this.parseVal(char, exp, i);
      }
    }
    if (this.stored && scope.length)
      scope[scope.length - 1].push(this.popStored());
    while (scope.length > 1) {
      let last = scope.pop();
      if (last instanceof OpVal)
        scope[scope.length - 1].push(last);
      else
        throw "invalid expression";
    }
    //se o ultimo scope não for op
    if (scope.length && !(scope[0] instanceof OpVal))
      throw "invalid expression";
    if (this.mode == 8193 /* begin */ || this.mode == 32768 /* signal */ || this.mode == 4098 /* op */)
      throw "invalid expression";
    //return i;
    return scope[0] || this.stored;
  }
}
exports.parse = (exp, options) => {
  if (exp && typeof exp == "string")
    exp = new Parser(exp, options).parse();
  return exp;
}
exports.calc = (exp, options) => {
  if (!exp)
    return null;
  if (typeof exp === 'string') {
    if (options.optional)
      if (exp[0] == '=')
        exp = exp.substring(1);
      else
        return exp;
    exp = parse(exp);
  }
  return exp.calc(options); //[, ]//;
}
exports.calcAll = (expressions, options) => {
  var result = {};
  for (let key in expressions)
    result[key] = calc(expressions[key], options);
  return result;
}
exports.compileExpression = (expression) => {
  throw "unsetted797";
}
const formulas = {};
exports.addFormulas = (values) => {
  for (let k in values) {
    let calc = values[k];
    if (typeof calc == "function")
      values[k] = { calc };
  }
  Object.assign(formulas, values);
}

function queryInArray(query, array, fields) {
  var words = query.split(' ');
  return array.filter((row) => queryInObj(words, row, fields));
}
exports.queryInObj = (words, obj, fields) => {
  function helper(obj, fields) {
    if (typeof obj == "object") {
      var r = [];
      for (let key in obj)
        if (!fields || fields.indexOf(key) > -1)
          r.push.apply(r, helper(obj[key]));
      return r;
    }
    else if (typeof obj == "string" || (typeof obj == "number" && (obj = obj.toString()))) {
      var r = [];
      for (let word of words)
        if (obj.indexOf(word) > -1)
          r.push(word);
      return r;
    }
    return [];
  }
  let t = helper(obj, fields);
  return words.every((word) => t.indexOf(word) > -1);
}
exports.query = (query, array, options) => {
  switch (options.type) {
    case 0/*word */:
      return queryInArray(query, array, options.fields);
    case 0/*like */:
      break;
  }
  return null;
}
function compareString(str1, str2) {
  str1 = str1.replace(/\s+/g, '');
  str2 = str2.replace(/\s+/g, '');
  if (!str1.length && !str2.length)
    return 1; // if both are empty strings
  if (!str1.length || !str2.length)
    return 0; // if only one is empty string
  if (str1 === str2)
    return 1; // identical
  if (str1.length === 1 && str2.length === 1)
    return 0; // both are 1-letter strings
  if (str1.length < 2 || str2.length < 2)
    return 0; // if either is a 1-letter string
  let firstBigrams = new Map();
  for (let i = 0; i < str1.length - 1; i++) {
    const bigram = str1.substr(i, 2);
    const count = firstBigrams.has(bigram)
      ? firstBigrams.get(bigram) + 1
      : 1;
    firstBigrams.set(bigram, count);
  }
  ;
  let intersectionSize = 0;
  for (let i = 0; i < str2.length - 1; i++) {
    const bigram = str2.substr(i, 2);
    const count = firstBigrams.has(bigram)
      ? firstBigrams.get(bigram)
      : 0;
    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }
  return (2.0 * intersectionSize) / (str1.length + str2.length - 2);
}
