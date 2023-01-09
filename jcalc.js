const isF = (v) => typeof v == "function";
export class ParseError {
    start;
    length;
    type;
}
export class OpVal {
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
export class SumOp extends OpVal {
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
export class TimeOp extends OpVal {
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
export class SubOp extends OpVal {
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
export class DivOp extends OpVal {
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
export class EqualOp extends OpVal {
    get level() { return 2; }
    calc(opts) {
        return this.a.calc(opts) == this.b.calc(opts);
    }
    toJSON() {
        return this.a + '=' + this.b;
    }
    static /*override*/ op = '=';
}
export class AndOp extends OpVal {
    get level() { return 1; }
    calc(opts) {
        return this.a.calc(opts) && this.b.calc(opts);
    }
    toJSON() {
        return this.a + '&&' + this.b;
    }
    static /*override*/ op = '&&';
}
export class ConcatOp extends OpVal {
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
export class LesEqualOp extends OpVal {
    get level() { return 2; }
    calc(opts) {
        return this.a.calc(opts) <= this.b.calc(opts);
    }
    toJSON() {
        return this.a + '<=' + this.b;
    }
    static /*override*/ op = '<=';
}
export class DifOp extends OpVal {
    get level() { return 2; }
    calc(opts) {
        return this.a.calc(opts) != this.b.calc(opts);
    }
    toJSON() {
        return this.a + '<>' + this.b;
    }
    static /*override*/ op = '<>';
}
export class LessOp extends OpVal {
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
export class OrOp extends OpVal {
    get level() { return 1; }
    calc(opts) {
        return this.a.calc(opts) || this.b.calc(opts);
    }
    toJSON() {
        return this.a + '||' + this.b;
    }
}
export class GreaterEqualOp extends OpVal {
    get level() { return 2; }
    calc(opts) {
        return this.a.calc(opts) >= this.b.calc(opts);
    }
    toJSON() {
        return this.a + '>=' + this.b;
    }
    static /*override*/ op = '>=';
}
export class GreaterOp extends OpVal {
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
export class PowOp extends OpVal {
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
export class NulledOp extends OpVal {
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
export class TernaryOp extends OpVal {
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
export class DicVal {
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
export class SignalVal {
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
export class GroupVal {
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
export class FnVal {
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
export class CallVal {
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
        let fx = (!f && opts.funcs) && opts.funcs[name] || (name in formulas ? formulas[name].calc : null);
        if (!fx)
            throw { msg: "not_found", name };
        return fx.apply(opts, args);
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
export class NumbVal {
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
export class VarVal {
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
        vars.includes(this.value) || vars.push(this.value);
        return vars;
    }
    translate(dir) { return this; }
    analize(_) { }
    *[Symbol.iterator]() {
        yield this;
    }
}
export class ConstVal {
    value;
    get op() { return 'c'; }
    constructor(value) {
        this.value = value;
    }
    valid() { return true; }
    calc(opts) {
        return consts[this.value];
    }
    toString() { return this.value; }
    toJSON() { return this.value; }
    vars(vars = []) { return vars; }
    translate(dir) { return this; }
    analize(_) { }
    *[Symbol.iterator]() {
        yield this;
    }
}
export const consts = { null: null, false: false, true: true };
export class TextValue {
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
export class ObjectVal {
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
        vars.includes(this.levels[0]) || vars.push(this.levels[0]);
        return vars;
    }
    translate(dir) { return this; }
    analize(_) { }
    *[Symbol.iterator]() {
        yield this;
    }
}
export const $ = {};
export function analize(val, check) {
    let t = check(val);
    if (t)
        return t;
    val.analize(check);
    return val;
}
export function clone(val) {
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
            //assign: 2+3*4, 2*3^4
            if (_new.level > old.level) {
                _new.a = stored;
                s.push(_new); //new OpValue(_new, stored)
            }
            //assign: 2*3+4,3^4+1, 2*3/4
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
                    this.setStored(storedText in consts ? new ConstVal(storedText) : new VarVal(storedText));
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
export function parse(exp, options) {
    if (exp && typeof exp == "string")
        exp = new Parser(exp, options).parse();
    return exp;
}
export default function calc(exp, options) {
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
export function calcAll(expressions, options) {
    var result = {};
    for (let key in expressions)
        result[key] = calc(expressions[key], options);
    return result;
}
const formulas = {};
export function addFormulas(values) {
    for (let k in values) {
        let calc = values[k];
        if (isF(calc))
            values[k] = { calc };
    }
    Object.assign(formulas, values);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamNhbGMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqY2FsYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQVUsRUFBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQztBQWtCbEUsTUFBTSxPQUFPLFVBQVU7SUFDckIsS0FBSyxDQUFTO0lBQ2QsTUFBTSxDQUFVO0lBQ2hCLElBQUksQ0FBaUI7Q0FHdEI7QUFLRCxNQUFNLE9BQWdCLEtBQUs7SUFDekIsSUFBSSxFQUFFLEtBQVcsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBTTtJQUNQLENBQUMsQ0FBTTtJQVFQLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixJQUFJLENBQUMsVUFBZTtRQUNsQixJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ1IsTUFBTSxvQkFBb0IsQ0FBQztRQUU3QixJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBQ0QsUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwQyxJQUFJLENBQUMsT0FBaUIsRUFBRTtRQUN0QixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxTQUFTLENBQUMsR0FBaUI7UUFDekIsSUFBSSxDQUFDLEdBQVUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FB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