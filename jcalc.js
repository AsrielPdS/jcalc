"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFormulas = exports.calcAll = exports.parse = exports.clone = exports.analize = exports.$ = exports.ObjectVal = exports.TextValue = exports.VarVal = exports.NumbVal = exports.CallVal = exports.FnVal = exports.GroupVal = exports.SignalVal = exports.DicVal = exports.TernaryOp = exports.NulledOp = exports.PowOp = exports.GreaterOp = exports.GreaterEqualOp = exports.OrOp = exports.LessOp = exports.DifOp = exports.LesEqualOp = exports.ConcatOp = exports.AndOp = exports.EqualOp = exports.DivOp = exports.SubOp = exports.TimeOp = exports.SumOp = exports.OpVal = exports.ParseError = void 0;
const isF = (v) => typeof v == "function";
class ParseError {
    start;
    length;
    type;
}
exports.ParseError = ParseError;
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
                            if (isF(opts.vars))
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
        let args = this.args.map(a => a.calc(opts)), name = opts.uncase ? this.func.toLowerCase() : this.func, f = isF(opts.funcs);
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
        let t = new CallVal(exports.$.translate(this.func, dir));
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
        return isF(opts.vars) ? opts.vars(this.value) : opts.vars[this.value];
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
        let i = 1, l = this.levels, result = isF(opts.vars) ? opts.vars(l[0], true) : opts.vars[l[0]];
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
function analize(val, check) {
    let t = check(val);
    if (t)
        return t;
    val.analize(check);
    return val;
}
exports.analize = analize;
function clone(val) {
    return new Parser(val.toString()).parse();
}
exports.clone = clone;
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
function parse(exp, options) {
    if (exp && typeof exp == "string")
        exp = new Parser(exp, options).parse();
    return exp;
}
exports.parse = parse;
function calc(exp, options) {
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
exports.default = calc;
function calcAll(expressions, options) {
    var result = {};
    for (let key in expressions)
        result[key] = calc(expressions[key], options);
    return result;
}
exports.calcAll = calcAll;
const formulas = {};
function addFormulas(values) {
    for (let k in values) {
        let calc = values[k];
        if (isF(calc))
            values[k] = { calc };
    }
    Object.assign(formulas, values);
}
exports.addFormulas = addFormulas;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamNhbGMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqY2FsYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQVUsRUFBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQztBQWtCbEUsTUFBYSxVQUFVO0lBQ3JCLEtBQUssQ0FBUztJQUNkLE1BQU0sQ0FBVTtJQUNoQixJQUFJLENBQWlCO0NBR3RCO0FBTkQsZ0NBTUM7QUFLRCxNQUFzQixLQUFLO0lBQ3pCLElBQUksRUFBRSxLQUFXLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQU07SUFDUCxDQUFDLENBQU07SUFRUCxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsSUFBSSxDQUFDLFVBQWU7UUFDbEIsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUNSLE1BQU0sb0JBQW9CLENBQUM7UUFFN0IsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUNELFFBQVEsS0FBSyxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEMsSUFBSSxDQUFDLE9BQWlCLEVBQUU7UUFDdEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsU0FBUyxDQUFDLEdBQWlCO1FBQ3pCLElBQUksQ0FBQyxHQUFVLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFD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