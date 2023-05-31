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
export { SumOp };
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
export { TimeOp };
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
export { SubOp };
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
export { DivOp };
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
export { EqualOp };
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
export { AndOp };
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
export { ConcatOp };
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
export { LesEqualOp };
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
export { DifOp };
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
export { LessOp };
export class OrOp extends OpVal {
    get level() { return 1; }
    calc(opts) {
        return this.a.calc(opts) || this.b.calc(opts);
    }
    toJSON() {
        return this.a + '||' + this.b;
    }
}
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
export { GreaterEqualOp };
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
export { GreaterOp };
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
            case "-" /* Signals.Minus */:
                return -this.value.calc(opts);
            case "!" /* Signals.Not */:
                return !this.value.calc(opts);
            case "+" /* Signals.plus */:
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
    mode = 8193 /* PM.begin */;
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
        if (has(mode, 4096 /* PM.sep */)) {
            if (!has(old, 16384 /* PM.valueEnd */))
                throw 1;
        }
        else if (has(mode, 32768 /* PM.signal */)) {
            if (!has(old, 8193 /* PM.begin */) && !has(old, 4096 /* PM.sep */))
                throw 2;
        }
        else if (has(mode, 8192 /* PM.valueStart */)) {
            if (has(old, 16384 /* PM.valueEnd */))
                throw 3;
        }
        else if (has(mode, 16384 /* PM.valueEnd */)) {
            if (has(old, 4096 /* PM.sep */) || has(old, 32768 /* PM.signal */))
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
        this.setMode(24578 /* PM.string */);
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
            this.setMode(24577 /* PM.number */);
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
                    this.setMode(8199 /* PM.call */);
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
                    this.setMode(24624 /* PM.object */);
                    obj = null;
                }
                else /*se for variavel*/ {
                    this.setStored(storedText in consts ? new ConstVal(storedText) : new VarVal(storedText));
                    this.setMode(24592 /* PM.variable */);
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
                        this.setMode(4614 /* PM.sum */);
                    }
                    else {
                        this.setMode(32769 /* PM.plus */);
                        scope.push(new SignalVal("+" /* Signals.plus */));
                    }
                    break;
                //-
                case 45:
                    if (this.stored) {
                        this.appendOp(new SubOp());
                        this.setMode(4618 /* PM.sub */);
                        //scope.push(new SubOpExpression(getStored()));
                    }
                    else {
                        this.setMode(32770 /* PM.minus */);
                        scope.push(new SignalVal("-" /* Signals.Minus */));
                    }
                    break;
                //*
                case 42:
                    this.appendOp(new TimeOp());
                    this.setMode(4626 /* PM.time */);
                    break;
                // /
                case 47:
                    this.appendOp(new DivOp());
                    this.setMode(4642 /* PM.div */);
                    break;
                //!
                case 33:
                    if (this.stored) {
                        throw "invalid expression";
                    }
                    else {
                        this.setMode(32769 /* PM.not */);
                        scope.push(new SignalVal("!" /* Signals.Not */));
                    }
                    break;
                //||
                case 124:
                    if (exp.charCodeAt(i + 1) === 124) {
                        i++;
                        this.appendOp(new OrOp());
                        this.setMode(6154 /* PM.or */);
                    }
                    else
                        throw "operator not found knowed";
                    break;
                // &
                case 38:
                    if (exp.charCodeAt(i + 1) === 38) {
                        i++;
                        this.appendOp(new AndOp());
                        this.setMode(6150 /* PM.and */);
                    }
                    else {
                        this.appendOp(new ConcatOp());
                        this.setMode(4226 /* PM.concat */);
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
                        this.setMode(24584 /* PM.dic */);
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
                            this.setMode(6154 /* PM.or */);
                        }
                        else {
                            this.appendOp(new TernaryOp());
                            this.setMode(4358 /* PM.Ter1 */);
                        }
                    }
                    break;
                // :
                case 58:
                    {
                        this.setMode(4362 /* PM.Ter2 */);
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
                        this.setMode(24580 /* PM.fn */);
                        i = body.end || exp.length;
                    }
                    else {
                        this.setMode(8195 /* PM.open */);
                        scope.push(new GroupVal());
                    }
                    break;
                // )
                case 41:
                    {
                        let lastScope = scope.pop();
                        //so adiciona o ultimo valor guardado se o ultimo scopo for fn mas o ultimo escopo não é o ultimo item inserido
                        //para evitar funcões(fn) sem parametro
                        if (!has(this.mode, 8195 /* PM.open */)) {
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
                        this.setMode(16387 /* PM.close */);
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
                        this.setMode(4097 /* PM.coma */);
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
                            this.setMode(5142 /* PM.lessEqual */);
                            break;
                        case 62:
                            i++;
                            this.appendOp(new DifOp());
                            this.setMode(5134 /* PM.diferent */);
                            break;
                        default:
                            this.appendOp(new LessOp());
                            this.setMode(5126 /* PM.less */);
                    }
                    break;
                // =
                case 61:
                    this.appendOp(new EqualOp());
                    this.setMode(5138 /* PM.equal */);
                    break;
                // >
                case 62:
                    if (exp.charCodeAt(i + 1) === 61) {
                        i++;
                        this.appendOp(new GreaterEqualOp());
                    }
                    else
                        this.appendOp(new GreaterOp());
                    this.setMode(5130 /* PM.greater */);
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
                    this.setMode(4674 /* PM.power */);
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
        if (this.mode == 8193 /* PM.begin */ || this.mode == 32768 /* PM.signal */ || this.mode == 4098 /* PM.op */)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamNhbGMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqY2FsYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQVUsRUFBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQztBQWtCbEUsTUFBTSxPQUFPLFVBQVU7SUFDckIsS0FBSyxDQUFTO0lBQ2QsTUFBTSxDQUFVO0lBQ2hCLElBQUksQ0FBaUI7Q0FHdEI7QUFLRCxNQUFNLE9BQWdCLEtBQUs7SUFDekIsSUFBSSxFQUFFLEtBQVcsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBTTtJQUNQLENBQUMsQ0FBTTtJQVFQLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixJQUFJLENBQUMsVUFBZTtRQUNsQixJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ1IsTUFBTSxvQkFBb0IsQ0FBQztRQUU3QixJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBQ0QsUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwQyxJQUFJLENBQUMsT0FBaUIsRUFBRTtRQUN0QixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxTQUFTLENBQUMsR0FBaUI7UUFDekIsSUFBSSxDQUFDLEdBQVUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTVCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELE9BQU8sQ0FBQyxLQUFZO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O1lBQ1IsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0IsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O1lBQ1IsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNELENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hCLE1BQU0sSUFBSSxDQUFDO1FBQ1gsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNkLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxFQUFFLENBQVM7Q0FDbkI7QUFDRCxNQUFhLEtBQU0sU0FBUSxLQUFLO0lBQzlCLElBQUksS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6QixJQUFJLENBQUMsSUFBaUI7UUFDcEIsSUFDRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFvQixFQUN4QyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFvQixDQUFDO1FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxDQUFDO2dCQUNKLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDUixJQUFJLENBQUMsQ0FBQztnQkFDSixDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ1Q7UUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLFFBQVE7WUFDdEIsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLE9BQU8sQ0FBQyxJQUFJLFFBQVE7WUFDdEIsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixDQUFDO0lBQ0QsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDOztTQXhCbEIsS0FBSztBQTBCbEIsTUFBYSxNQUFPLFNBQVEsS0FBSztJQUMvQixJQUFJLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekIsSUFBSSxDQUFDLElBQWlCO1FBQ3BCLElBQ0UsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBVyxFQUMvQixDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFXLENBQUM7UUFDbEMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLENBQUM7Z0JBQ0osQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNSLElBQUksQ0FBQyxDQUFDO2dCQUNKLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDVDtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFDRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7O1NBbEJsQixNQUFNO0FBb0JuQixNQUFhLEtBQU0sU0FBUSxLQUFLO0lBQzlCLElBQUksS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6QixJQUFJLENBQUMsSUFBaUI7UUFDcEIsSUFDRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFXLEVBQy9CLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQVcsQ0FBQztRQUNsQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsQ0FBQztnQkFDSixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1IsSUFBSSxDQUFDLENBQUM7Z0JBQ0osQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNUO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUNELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQzs7U0FuQmxCLEtBQUs7QUFxQmxCLE1BQWEsS0FBTSxTQUFRLEtBQUs7SUFDOUIsSUFBSSxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpCLElBQUksQ0FBQyxJQUFpQjtRQUNwQixJQUNFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQVcsRUFDL0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBVyxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxDQUFDO2dCQUNKLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDUixJQUFJLENBQUMsQ0FBQztnQkFDSixDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ1Q7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUNELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQzs7U0FuQmxCLEtBQUs7QUFxQmxCLE1BQWEsT0FBUSxTQUFRLEtBQUs7SUFDaEMsSUFBSSxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpCLElBQUksQ0FBQyxJQUFpQjtRQUNwQixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7O1NBVGxCLE9BQU87QUFXcEIsTUFBYSxLQUFNLFNBQVEsS0FBSztJQUM5QixJQUFJLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekIsSUFBSSxDQUFDLElBQWlCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQzs7U0FUbkIsS0FBSztBQVdsQixNQUFhLFFBQVMsU0FBUSxLQUFLO0lBQ2pDLElBQUksS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6QixJQUFJLENBQUMsSUFBaUI7UUFDcEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpELE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFDRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7O1NBWGxCLFFBQVE7QUFhckIsTUFBYSxVQUFXLFNBQVEsS0FBSztJQUNuQyxJQUFJLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekIsSUFBSSxDQUFDLElBQWlCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQzs7U0FUbkIsVUFBVTtBQVd2QixNQUFhLEtBQU0sU0FBUSxLQUFLO0lBQzlCLElBQUksS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6QixJQUFJLENBQUMsSUFBaUI7UUFDcEIsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDOztTQVRuQixLQUFLO0FBV2xCLE1BQWEsTUFBTyxTQUFRLEtBQUs7SUFDL0IsSUFBSSxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpCLElBQUksQ0FBQyxJQUFpQjtRQUNwQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDOztTQVhsQixNQUFNO0FBYW5CLE1BQU0sT0FBTyxJQUFLLFNBQVEsS0FBSztJQUM3QixJQUFJLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekIsSUFBSSxDQUFDLElBQWlCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGO0FBQ0QsTUFBYSxjQUFlLFNBQVEsS0FBSztJQUN2QyxJQUFJLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekIsSUFBSSxDQUFDLElBQWlCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQzs7U0FUbkIsY0FBYztBQVczQixNQUFhLFNBQVUsU0FBUSxLQUFLO0lBQ2xDLElBQUksS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6QixJQUFJLENBQUMsSUFBaUI7UUFDcEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQzs7U0FWbEIsU0FBUztBQVl0QixNQUFNLE9BQU8sS0FBTSxTQUFRLEtBQUs7SUFDOUIsSUFBSSxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpCLElBQUksQ0FBQyxJQUFpQjtRQUNwQixJQUNFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQVcsRUFDL0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBVyxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxDQUFDO2dCQUNKLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDUixJQUFJLENBQUMsQ0FBQztnQkFDSixDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ1Q7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRjtBQUNELE1BQU0sT0FBTyxRQUFTLFNBQVEsS0FBSztJQUNqQyxJQUFJLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekIsSUFBSSxDQUFDLElBQWlCO1FBQ3BCLElBQ0UsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUNyQixDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEIsT0FBTyxPQUFPLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQztZQUMzQixLQUFLLENBQUMsQ0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUNELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGO0FBQ0QsTUFBTSxPQUFPLFNBQVUsU0FBUSxLQUFLO0lBQ2xDLENBQUMsQ0FBTTtJQUNQLElBQUksS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixJQUFJLENBQUMsSUFBaUI7UUFDcEIsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVDLFlBQVksQ0FBRSxJQUFJLENBQUMsS0FBVTtRQUM3QixJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ1IsSUFBSSxJQUFJLENBQUMsQ0FBQztnQkFDUixNQUFNLElBQUksQ0FBQzs7Z0JBQ1IsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7O1lBQ2pCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFQyxZQUFZLENBQUcsS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdDLE1BQU0sS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELFlBQVksQ0FBRyxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25ELFlBQVksQ0FBRyxJQUFJLENBQUMsT0FBaUIsRUFBRTtRQUN2QyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDQyxZQUFZLENBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEMsTUFBTSxJQUFJLENBQUM7UUFDWCxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2QsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNkLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEIsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLE1BQU07SUFJRTtJQUhuQixJQUFJLEVBQUUsS0FBWSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFHakMsWUFBbUIsSUFBYztRQUFkLFNBQUksR0FBSixJQUFJLENBQVU7SUFBSSxDQUFDO0lBRXRDLElBQUksQ0FBQyxJQUFpQjtRQUNwQixJQUFJLE1BQU0sR0FBaUIsRUFBRSxDQUFDO1FBQzlCLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUk7WUFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFDLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6QixTQUFTLENBQUMsR0FBaUI7UUFDekIsSUFBSSxFQUFFLEdBQWdCLEVBQUUsQ0FBQztRQUN6QixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV0QyxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsTUFBTTtRQUNKLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELE9BQU8sQ0FBQyxLQUFZO1FBQ2xCLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUN6QixJQUNFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUNsQixDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDO2dCQUNILElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztnQkFDaEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN2QjtJQUNILENBQUM7SUFDRCxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQixNQUFNLElBQUksQ0FBQztRQUNYLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUk7WUFDckIsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBQ0QsSUFBSSxDQUFDLElBQWU7UUFDbEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSTtZQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQU9ELE1BQU0sT0FBTyxTQUFTO0lBV0Q7SUFWbkIsSUFBSSxFQUFFLEtBQVksT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRWpDLG9CQUFvQjtJQUNwQixvQkFBb0I7SUFDYixLQUFLLENBQU07SUFDbEIsbUJBQW1CO0lBRW5CLGtEQUFrRDtJQUNsRCxxREFBcUQ7SUFDckQsR0FBRztJQUNILFlBQW1CLE1BQWU7UUFBZixXQUFNLEdBQU4sTUFBTSxDQUFTO0lBQUksQ0FBQztJQUN2QyxJQUFJLENBQUMsSUFBaUI7UUFDcEIsUUFBUSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ25CO2dCQUNFLE9BQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVyQztnQkFDRSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFaEM7Z0JBQ0UsT0FBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLFFBQVE7U0FDVDtJQUNILENBQUM7SUFFRCw0QkFBNEI7SUFDNUIsb0JBQW9CO0lBQ3BCLHdCQUF3QjtJQUN4Qiw2QkFBNkI7SUFDN0IsR0FBRztJQUVILEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFJLENBQUMsS0FBVTtRQUNiLElBQUksSUFBSSxDQUFDLEtBQUs7WUFDWixNQUFNLG9CQUFvQixDQUFDO1FBRTdCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLHFCQUFxQjtJQUN2QixDQUFDO0lBQ0QsUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwQyxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQztJQUNELElBQUksQ0FBQyxPQUFpQixFQUFFO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELFNBQVMsQ0FBQyxHQUFpQjtRQUN6QixJQUFJLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNuQyxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCxPQUFPLENBQUMsS0FBWTtRQUNsQixJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQztZQUNILElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFDRCxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQixNQUFNLElBQUksQ0FBQztRQUNYLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLFFBQVE7SUFDbkIsSUFBSSxFQUFFLEtBQVUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRXRCLEtBQUssQ0FBTztJQUVuQixrREFBa0Q7SUFDbEQsNkNBQTZDO0lBQzdDLEdBQUc7SUFFSCxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBSSxDQUFDLElBQWlCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELElBQUksQ0FBQyxLQUFVO1FBQ2IsSUFBSSxJQUFJLENBQUMsS0FBSztZQUNaLE1BQU0sb0JBQW9CLENBQUM7UUFFN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIscUJBQXFCO0lBQ3ZCLENBQUM7SUFDRCxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLE1BQU07UUFDSixPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsT0FBTyxDQUFDLEtBQVk7UUFDbEIsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBQ0QsSUFBSSxDQUFDLE9BQWlCLEVBQUU7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsU0FBUyxDQUFDLEdBQWlCO1FBQ3pCLElBQUksQ0FBQyxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNuQyxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQixNQUFNLElBQUksQ0FBQztRQUNYLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztDQUNGO0FBQ0QsTUFBTSxPQUFPLEtBQUs7SUFPRztJQUF1QjtJQU4xQyxJQUFJLEVBQUUsS0FBVyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFJL0Isc0JBQXNCO0lBQ3RCLGVBQWU7SUFDZixZQUFtQixJQUFjLEVBQVMsSUFBUztRQUFoQyxTQUFJLEdBQUosSUFBSSxDQUFVO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBSztJQUFJLENBQUM7SUFDeEQsS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9CLElBQUksQ0FBQyxHQUFXO1FBQ2QsSUFBSSxHQUFHLFlBQVksTUFBTTtZQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7O1lBQ3ZCLE1BQU0sSUFBSSxDQUFDO0lBQ2xCLENBQUM7SUFDRCxJQUFJLENBQUMsSUFBaUI7UUFDcEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNsQixPQUFPLENBQUMsR0FBRyxJQUFlLEVBQUUsRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ2IsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLO29CQUNmLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzdCLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQzt3QkFDZCxJQUFJLElBQUksQ0FBQyxJQUFJOzRCQUNYLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0NBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7O2dDQUM1QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7OzRCQUMxQixNQUFNLElBQUksQ0FBQzs7d0JBQ2IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFCLENBQUM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7SUFDSixDQUFDO0lBQ0QsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxNQUFNO1FBQ0osT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDdkQsQ0FBQztJQUNELElBQUksQ0FBQyxJQUFlO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNELFNBQVMsQ0FBQyxHQUFpQjtRQUN6QixPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQVk7UUFDbEIsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBQ0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEIsTUFBTSxJQUFJLENBQUM7SUFDYixDQUFDO0NBQ0Y7QUFDRCxNQUFNLE9BQU8sT0FBTztJQUdDO0lBQXFCO0lBRnhDLElBQUksRUFBRSxLQUFhLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQztJQUVuQyxZQUFtQixJQUFZLEVBQVMsT0FBYyxFQUFFO1FBQXJDLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUksQ0FBQztJQUU3RCxJQUFJLENBQUMsSUFBaUI7UUFDcEIsSUFDRSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQ3ZDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUN4RCxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QixJQUFJLENBQUMsRUFBRTtZQUNMLElBQUksQ0FBQyxHQUFJLElBQUksQ0FBQyxLQUFrQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUM7Z0JBQ2QsT0FBTyxDQUFDLENBQUM7U0FDWjtRQUNELElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVuRyxJQUFJLENBQUMsRUFBRTtZQUNMLE1BQU0sRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ25DLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELEtBQUssS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEIsSUFBSSxDQUFDLFVBQWU7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELFFBQVEsS0FBSyxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEMsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3JELENBQUM7SUFDRCxJQUFJLENBQUMsT0FBaUIsRUFBRTtRQUN0QixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJO1lBQ3JCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxTQUFTLENBQUMsR0FBaUI7UUFDekIsa0RBQWtEO1FBQ2xELElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUMsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBQ0QsT0FBTyxDQUFDLEtBQVk7UUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEQsSUFDRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNSLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7Z0JBQ04sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN2QjtJQUNILENBQUM7SUFDRCxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQixNQUFNLElBQUksQ0FBQztRQUNYLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUk7WUFDckIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztDQUNGO0FBTUQsTUFBTSxPQUFPLE9BQU87SUFDbEIsSUFBSSxFQUFFLEtBQVUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBR3RCLEtBQUssQ0FBUztJQUVyQixZQUFZLEtBQWE7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUNELEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxJQUFJLENBQUMsS0FBWSxDQUFDO0lBQzNCLENBQUM7SUFFRCxLQUFLLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLElBQUk7UUFDRixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQVksQ0FBQztJQUM1QixDQUFDO0lBQ0QsUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwQyxNQUFNO1FBQ0osT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFDRCxJQUFJLENBQUMsT0FBaUIsRUFBRTtRQUN0QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxPQUFPLENBQUMsQ0FBUSxJQUFJLENBQUM7SUFDckIsU0FBUyxDQUFDLEdBQWlCLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hCLE1BQU0sSUFBSSxDQUFDO0lBQ2IsQ0FBQztDQUNGO0FBQ0QsTUFBTSxPQUFPLE1BQU07SUFHRTtJQUZuQixJQUFJLEVBQUUsS0FBVSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFN0IsWUFBbUIsS0FBYTtRQUFiLFVBQUssR0FBTCxLQUFLLENBQVE7SUFBSSxDQUFDO0lBRXJDLEtBQUssS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEIsSUFBSSxDQUFDLElBQWlCO1FBQ3BCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRCxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUNELElBQUksQ0FBQyxPQUFpQixFQUFFO1FBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25ELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELFNBQVMsQ0FBQyxHQUFpQixJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUU3QyxPQUFPLENBQUMsQ0FBUSxJQUFJLENBQUM7SUFDckIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEIsTUFBTSxJQUFJLENBQUM7SUFDYixDQUFDO0NBQ0Y7QUFDRCxNQUFNLE9BQU8sUUFBUTtJQUdBO0lBRm5CLElBQUksRUFBRSxLQUFVLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUU3QixZQUFtQixLQUFhO1FBQWIsVUFBSyxHQUFMLEtBQUssQ0FBUTtJQUFJLENBQUM7SUFFckMsS0FBSyxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUMsSUFBaUI7UUFDcEIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDRCxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNqQyxNQUFNLEtBQUssT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMvQixJQUFJLENBQUMsT0FBaUIsRUFBRSxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMxQyxTQUFTLENBQUMsR0FBaUIsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFN0MsT0FBTyxDQUFDLENBQVEsSUFBSSxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hCLE1BQU0sSUFBSSxDQUFDO0lBQ2IsQ0FBQztDQUNGO0FBQ0QsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFpQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDN0UsTUFBTSxPQUFPLFNBQVM7SUFHRDtJQUFzQjtJQUZ6QyxJQUFJLEVBQUUsS0FBVSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFN0IsWUFBbUIsS0FBYSxFQUFTLFFBQWlCO1FBQXZDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFTO0lBQzFELENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVk7UUFDeEIsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxJQUFJLElBQUksS0FBSyxPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxLQUFLLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLElBQUk7UUFDRixPQUFPLElBQUksQ0FBQyxLQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDaEQsQ0FBQztJQUNELE1BQU07UUFDSixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDaEQsQ0FBQztJQUNELElBQUksQ0FBQyxPQUFpQixFQUFFLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzFDLFNBQVMsQ0FBQyxHQUFpQixJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUU3QyxPQUFPLENBQUMsQ0FBUSxJQUFJLENBQUM7SUFDckIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEIsTUFBTSxJQUFJLENBQUM7SUFDYixDQUFDO0NBQ0Y7QUFDRCxNQUFNLE9BQU8sU0FBUztJQUdEO0lBRm5CLElBQUksRUFBRSxLQUFVLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUU3QixZQUFtQixNQUFnQjtRQUFoQixXQUFNLEdBQU4sTUFBTSxDQUFVO0lBQUksQ0FBQztJQUd4QyxLQUFLLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQyxJQUFpQjtRQUNwQixJQUNFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQ3RCLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBTSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1gsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkI7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0QsUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwQyxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsSUFBSSxDQUFDLE9BQWlCLEVBQUU7UUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsU0FBUyxDQUFDLEdBQWlCLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRTdDLE9BQU8sQ0FBQyxDQUFRLElBQUksQ0FBQztJQUNyQixDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQixNQUFNLElBQUksQ0FBQztJQUNiLENBQUM7Q0FDRjtBQXVCRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQWEsRUFBRSxDQUFBO0FBQzdCLE1BQU0sVUFBVSxPQUFPLENBQUMsR0FBUSxFQUFFLEtBQVk7SUFDNUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLElBQUksQ0FBQztRQUNILE9BQU8sQ0FBQyxDQUFDO0lBQ1gsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQixPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFDRCxNQUFNLFVBQVUsS0FBSyxDQUFDLEdBQVE7SUFDNUIsT0FBTyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QyxDQUFDO0FBd0ZELFNBQVMsR0FBRyxDQUFtQixLQUFRLEVBQUUsS0FBUTtJQUMvQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQztBQUNuQyxDQUFDO0FBUUQsTUFBTSxNQUFNO0lBUXNCO0lBUGhDLCtEQUErRDtJQUN0RCxLQUFLLEdBQTBCLEVBQUUsQ0FBQztJQUMzQyxNQUFNLENBQU07SUFDWixJQUFJLHVCQUFnQjtJQUNwQixVQUFVLENBQVM7SUFDbkIsR0FBRyxDQUFTO0lBRVosWUFBWSxHQUFXLEVBQVMsVUFBd0IsRUFBRTtRQUExQixZQUFPLEdBQVAsT0FBTyxDQUFtQjtRQUN4RCxJQUFJLENBQUMsR0FBRztZQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztJQUN4QixDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUNkLE1BQU0sb0JBQW9CLENBQUM7UUFDN0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxTQUFTLENBQUMsS0FBVTtRQUNsQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksU0FBUyxFQUFFO1lBQy9CLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNSLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ2hCLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDWDtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFDRCxPQUFPLENBQUMsSUFBUTtRQUNkLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDcEIsSUFBSSxHQUFHLENBQUMsSUFBSSxvQkFBUyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRywwQkFBYztnQkFDeEIsTUFBTSxDQUFDLENBQUM7U0FDWDthQUFNLElBQUksR0FBRyxDQUFDLElBQUksd0JBQVksRUFBRTtZQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsc0JBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLG9CQUFTO2dCQUMxQyxNQUFNLENBQUMsQ0FBQztTQUNYO2FBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSwyQkFBZ0IsRUFBRTtZQUNuQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLDBCQUFjO2dCQUN2QixNQUFNLENBQUMsQ0FBQztTQUNYO2FBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSwwQkFBYyxFQUFFO1lBQ2pDLElBQUksR0FBRyxDQUFDLEdBQUcsb0JBQVMsSUFBSSxHQUFHLENBQUMsR0FBRyx3QkFBWTtnQkFDekMsTUFBTSxDQUFDLENBQUM7U0FDWDtRQUNELGlGQUFpRjtRQUNqRiwrREFBK0Q7UUFDL0QsNktBQTZLO1FBQzdLLCtEQUErRDtRQUMvRCxnRkFBZ0Y7UUFDaEYsR0FBRztRQUNILCtCQUErQjtRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQVc7UUFDbEIsSUFDRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFDZCxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQ3JCLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFNUIsSUFBSSxHQUFHLFlBQVksS0FBSyxFQUFFO1lBRXhCLHNCQUFzQjtZQUN0QixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDMUIsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSwyQkFBMkI7YUFDekM7WUFDRCw0QkFBNEI7aUJBQ3ZCO2dCQUNILEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO2dCQUVmLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUNiLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUN4QjtTQUVGO2FBQU07WUFDTCxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2Q7UUFDRCxRQUFRO1FBQ1Isb0JBQW9CO1FBQ3BCLGlCQUFpQjtRQUNqQixHQUFHO0lBQ0wsQ0FBQztJQUNELFdBQVcsQ0FBQyxDQUFTLEVBQUUsR0FBVyxFQUFFLElBQVk7UUFDOUMsSUFDRSxLQUFLLEdBQUcsRUFBRSxFQUNWLE1BQU0sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqQyx3REFBd0Q7UUFDeEQsT0FBTyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFO1lBQ3JFLHVEQUF1RDtZQUN2RCxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO2dCQUN0QixNQUFNLE9BQU8sQ0FBQztZQUNoQixLQUFLLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwQixNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNsQztRQUVELElBQUksQ0FBQyxPQUFPLHVCQUFXLENBQUM7UUFFeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUUzQyxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRCxRQUFRLENBQUMsSUFBWSxFQUFFLEdBQVcsRUFBRSxDQUFTO1FBQzNDLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUN4Qyx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFLEVBQUU7WUFDMUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUN4RCxVQUFVLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDaEM7WUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLE9BQU8sdUJBQVcsQ0FBQztZQUN4Qiw0QkFBNEI7WUFDNUIsa0hBQWtIO1NBQ25IO2FBQU0sSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxJQUFJLEtBQUssRUFBRSxDQUFBLG9CQUFvQixFQUFFO1lBQ2xILElBQUksR0FBYSxDQUFDO1lBQ2xCLEdBQUc7Z0JBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixvSUFBb0k7Z0JBQ3BJLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDbkksVUFBVSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNoQztnQkFFRCxlQUFlO2dCQUNmLElBQUksSUFBSSxJQUFJLEVBQUUsRUFBRTtvQkFFZCxJQUFJLENBQUMsT0FBTyxvQkFBUyxDQUFDO29CQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxDQUFDLEVBQUUsQ0FBQztpQkFFTDtxQkFBTSxpQkFBaUIsQ0FBQSxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7b0JBQ3ZDLEdBQUcsQ0FBQyxDQUFDO3dCQUNILEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDdEIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN2QiwwQ0FBMEM7b0JBQzFDLDBDQUEwQztvQkFDMUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQzFCO3FCQUFNLElBQUksR0FBRyxFQUFFO29CQUNkLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLE9BQU8sdUJBQVcsQ0FBQztvQkFDeEIsR0FBRyxHQUFHLElBQUksQ0FBQztpQkFDWjtxQkFBTSxtQkFBbUIsQ0FBQztvQkFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDekYsSUFBSSxDQUFDLE9BQU8seUJBQWEsQ0FBQztpQkFDM0I7YUFDRixRQUFRLEdBQUcsRUFBRTtTQUNmOztZQUFNLE1BQU0sdUNBQXVDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzlELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELFFBQVE7SUFFUixDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQVcsRUFBRSxDQUFTO1FBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHO2dCQUNmLE9BQU8sS0FBSyxDQUFDO1lBRWYsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRztnQkFDZixPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO1NBQ2pEO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBQ0QsU0FBUyxDQUFDLEdBQVcsRUFBRSxDQUFTO1FBQzlCLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxHQUFHO1FBQ0gsSUFBSSxJQUFJLElBQUksRUFBRSxFQUFFO1lBQ2QsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNSLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDNUI7UUFDRCxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0YsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELFFBQVEsQ0FBQyxHQUFXLEVBQUUsQ0FBUztRQUU3QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDWCxxSkFBcUo7UUFDckosS0FBSyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDbEwsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNiO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBQ0QsS0FBSyxDQUFDLEtBQWEsRUFBRSxLQUFjO1FBQ2pDLE1BQU07WUFDSixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0IsS0FBSyxFQUFFLEtBQUs7WUFDWixLQUFLLEVBQUUsS0FBSztTQUNiLENBQUM7SUFDSixDQUFDO0lBQ0QsU0FBUyxDQUFDLEdBQVcsRUFBRSxDQUFTO1FBQzlCLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUc7WUFDbEIsQ0FBQyxFQUFFLENBQUM7UUFDTixPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCxLQUFLO1FBQ0gsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN2QixLQUFLO1FBQ0wsbUNBQW1DO1FBQ25DLHVCQUF1QjtRQUV2QixLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvRSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTdCLFFBQVEsSUFBSSxFQUFFO2dCQUNaLFFBQVE7Z0JBQ1IsS0FBSyxFQUFFO29CQUNMLE1BQU07Z0JBRVIsSUFBSTtnQkFDSixLQUFLLEVBQUU7b0JBQ0wsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUMzQixJQUFJLENBQUMsT0FBTyxtQkFBUSxDQUFDO3FCQUN0Qjt5QkFBTTt3QkFDTCxJQUFJLENBQUMsT0FBTyxxQkFBUyxDQUFDO3dCQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksU0FBUyx3QkFBYyxDQUFDLENBQUM7cUJBQ3pDO29CQUNELE1BQU07Z0JBRVIsR0FBRztnQkFDSCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUMzQixJQUFJLENBQUMsT0FBTyxtQkFBUSxDQUFDO3dCQUNyQiwrQ0FBK0M7cUJBQ2hEO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxPQUFPLHNCQUFVLENBQUM7d0JBQ3ZCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLHlCQUFlLENBQUMsQ0FBQztxQkFDMUM7b0JBQ0QsTUFBTTtnQkFFUixHQUFHO2dCQUNILEtBQUssRUFBRTtvQkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLE9BQU8sb0JBQVMsQ0FBQztvQkFDdEIsTUFBTTtnQkFFUixJQUFJO2dCQUNKLEtBQUssRUFBRTtvQkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLE9BQU8sbUJBQVEsQ0FBQztvQkFDckIsTUFBTTtnQkFHUixHQUFHO2dCQUNILEtBQUssRUFBRTtvQkFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ2YsTUFBTSxvQkFBb0IsQ0FBQztxQkFDNUI7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLE9BQU8sb0JBQVEsQ0FBQzt3QkFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsdUJBQWEsQ0FBQyxDQUFDO3FCQUN4QztvQkFDRCxNQUFNO2dCQUNSLElBQUk7Z0JBQ0osS0FBSyxHQUFHO29CQUNOLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO3dCQUNqQyxDQUFDLEVBQUUsQ0FBQzt3QkFDSixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQzt3QkFDMUIsSUFBSSxDQUFDLE9BQU8sa0JBQU8sQ0FBQztxQkFDckI7O3dCQUFNLE1BQU0sMkJBQTJCLENBQUM7b0JBRXpDLE1BQU07Z0JBRVIsSUFBSTtnQkFDSixLQUFLLEVBQUU7b0JBQ0wsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7d0JBQ2hDLENBQUMsRUFBRSxDQUFDO3dCQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUMzQixJQUFJLENBQUMsT0FBTyxtQkFBUSxDQUFDO3FCQUN0Qjt5QkFBTTt3QkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQzt3QkFDOUIsSUFBSSxDQUFDLE9BQU8sc0JBQVcsQ0FBQztxQkFDekI7b0JBQ0QsTUFBTTtnQkFDUixJQUFJO2dCQUNKLEtBQUssR0FBRztvQkFBRTt3QkFDUixrQ0FBa0M7d0JBQ2xDLElBQUksR0FBRyxHQUFhLEVBQUUsQ0FBQzt3QkFFdkIsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMzQixJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUc7NEJBQ2pCLE9BQU8sSUFBSSxFQUFFO2dDQUVYLHdCQUF3QjtnQ0FDeEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBQzNELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtvQ0FDZCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FDL0IsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7Z0NBRWpCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FFM0Isd0JBQXdCO2dDQUN4QixvREFBb0Q7Z0NBQ3BELElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRztvQ0FDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztnQ0FFOUIsNkJBQTZCO2dDQUU3Qix3QkFBd0I7Z0NBQ3hCLDBFQUEwRTtnQ0FDMUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0NBQzVFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0NBRXpCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO29DQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dDQUVqQix3QkFBd0I7Z0NBQ3hCLDBDQUEwQztnQ0FDMUMsQ0FBQyxFQUFFLENBQUM7Z0NBQ0osd0JBQXdCO2dDQUN4QixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHO29DQUNmLE1BQU07Z0NBRVIsd0JBQXdCO2dDQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTTtvQ0FDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dDQUUvQix3QkFBd0I7Z0NBQ3hCLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUc7b0NBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztnQ0FFOUIsQ0FBQyxFQUFFLENBQUM7Z0NBRUosQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDOzZCQUM1Qjt3QkFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ2hDLElBQUksQ0FBQyxPQUFPLG9CQUFRLENBQUM7cUJBQ3RCO29CQUFDLE1BQU07Z0JBQ1IsSUFBSTtnQkFDSixLQUFLLEdBQUc7b0JBQ04sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTt3QkFDcEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQixDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztxQkFDaEI7O3dCQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLE1BQU07Z0JBQ1IsSUFBSTtnQkFDSixLQUFLLEVBQUU7b0JBQUU7d0JBQ1AsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7NEJBQ2hDLENBQUMsRUFBRSxDQUFDOzRCQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQyxDQUFDOzRCQUM5QixJQUFJLENBQUMsT0FBTyxrQkFBTyxDQUFDO3lCQUNyQjs2QkFBTTs0QkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksU0FBUyxFQUFFLENBQUMsQ0FBQzs0QkFDL0IsSUFBSSxDQUFDLE9BQU8sb0JBQVMsQ0FBQzt5QkFDdkI7cUJBQ0Y7b0JBQUMsTUFBTTtnQkFDUixJQUFJO2dCQUNKLEtBQUssRUFBRTtvQkFBRTt3QkFDUCxJQUFJLENBQUMsT0FBTyxvQkFBUyxDQUFDO3dCQUN0QixJQUNFLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQ3pCLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFFbkMsT0FBTyxDQUFDLENBQUMsTUFBTSxZQUFZLFNBQVMsQ0FBQyxFQUFFOzRCQUNyQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7NEJBQ1oscUNBQXFDOzRCQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUNwQiw4Q0FBOEM7NEJBQzlDLE1BQU0sR0FBRyxNQUFNLENBQUM7NEJBQ2hCLHlDQUF5Qzs0QkFDekMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUVqQyxJQUFJLENBQUMsTUFBTTtnQ0FDVCxNQUFNLG9CQUFvQixDQUFDO3lCQUM5Qjt3QkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNyQjtvQkFBQyxNQUFNO2dCQUNSLEtBQUs7Z0JBQ0wsS0FBSyxFQUFFO29CQUNMLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO3dCQUMzQixJQUFJLElBQUksR0FBYSxFQUFFLENBQUM7d0JBRXhCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFFM0IsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHOzRCQUNqQixPQUFPLElBQUksRUFBRTtnQ0FFWCx3QkFBd0I7Z0NBQ3hCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07b0NBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBQy9CLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO2dDQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNoQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBRTNCLHdCQUF3QjtnQ0FDeEIsc0ZBQXNGO2dDQUN0RixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHO29DQUNmLE1BQU07Z0NBRVIsd0JBQXdCO2dDQUN4QixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHO29DQUNmLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7Z0NBQzlCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FFM0IsQ0FBQyxFQUFFLENBQUM7NkJBQ0w7d0JBQ0gsSUFBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO3dCQUVqRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM5QyxJQUFJLENBQUMsT0FBTyxtQkFBTyxDQUFDO3dCQUVwQixDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDO3FCQUU1Qjt5QkFBTTt3QkFDTCxJQUFJLENBQUMsT0FBTyxvQkFBUyxDQUFDO3dCQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQztxQkFDNUI7b0JBQ0QsTUFBTTtnQkFFUixJQUFJO2dCQUNKLEtBQUssRUFBRTtvQkFBRTt3QkFDUCxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBRTVCLCtHQUErRzt3QkFDL0csdUNBQXVDO3dCQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLHFCQUFVLEVBQUU7NEJBQzVCLElBQUksU0FBUztnQ0FDWCxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2lDQUM5QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO2dDQUN6QixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQ2pCLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO2dDQUNmLE1BQU07NkJBQ1A7O2dDQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQzVDO3dCQUNELG1DQUFtQzt3QkFFbkMsd0JBQXdCO3dCQUN4QiwwQ0FBMEM7d0JBRTFDLHFEQUFxRDt3QkFDckQsSUFBSSxDQUFDLE9BQU8sc0JBQVUsQ0FBQzt3QkFFdkIsT0FBTyxDQUFDLENBQUMsU0FBUyxZQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLFlBQVksUUFBUSxDQUFDLEVBQUU7NEJBQzFFLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQzs0QkFFdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO2dDQUNmLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7b0NBQ3BCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQ0FDakIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7b0NBQ2YsTUFBTTtpQ0FDUDs7b0NBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFFN0MsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3lCQUN2Qzt3QkFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUMzQjtvQkFBQyxNQUFNO2dCQUNSLElBQUk7Z0JBQ0osS0FBSyxFQUFFLENBQUM7Z0JBQ1IsSUFBSTtnQkFDSixLQUFLLEVBQUU7b0JBQUU7d0JBQ1Asd0JBQXdCO3dCQUN4QixJQUFJLENBQUMsT0FBTyxvQkFBUyxDQUFDO3dCQUN0QixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDckMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUU5QixPQUFPLENBQUMsQ0FBQyxNQUFNLFlBQVksT0FBTyxDQUFDLEVBQUU7NEJBQ25DLElBQUksQ0FBQyxNQUFNO2dDQUNULElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7b0NBQ3BCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQ0FDakIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7b0NBQ2YscURBQXFEO29DQUNyRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29DQUN2QixNQUFNO2lDQUNQOztvQ0FBTSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUU3QyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7NEJBQ1oscUNBQXFDOzRCQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUNwQiw4Q0FBOEM7NEJBQzlDLE1BQU0sR0FBRyxNQUFNLENBQUM7NEJBQ2hCLHlDQUF5Qzs0QkFDekMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNqQyxvQkFBb0I7NEJBQ3BCLFVBQVU7eUJBRVg7d0JBRUQsSUFBSSxNQUFNOzRCQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBRXZCO29CQUFDLE1BQU07Z0JBQ1IsSUFBSTtnQkFDSixLQUFLLEVBQUU7b0JBQ0wsUUFBUSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTt3QkFDN0IsS0FBSyxFQUFFOzRCQUNMLENBQUMsRUFBRSxDQUFDOzRCQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLEVBQUUsQ0FBQyxDQUFDOzRCQUNoQyxJQUFJLENBQUMsT0FBTyx5QkFBYyxDQUFDOzRCQUMzQixNQUFNO3dCQUNSLEtBQUssRUFBRTs0QkFDTCxDQUFDLEVBQUUsQ0FBQzs0QkFDSixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQzs0QkFDM0IsSUFBSSxDQUFDLE9BQU8sd0JBQWEsQ0FBQzs0QkFDMUIsTUFBTTt3QkFDUjs0QkFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQzs0QkFDNUIsSUFBSSxDQUFDLE9BQU8sb0JBQVMsQ0FBQztxQkFDekI7b0JBQ0QsTUFBTTtnQkFFUixJQUFJO2dCQUNKLEtBQUssRUFBRTtvQkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLE9BQU8scUJBQVUsQ0FBQztvQkFDdkIsTUFBTTtnQkFFUixJQUFJO2dCQUNKLEtBQUssRUFBRTtvQkFDTCxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTt3QkFDaEMsQ0FBQyxFQUFFLENBQUM7d0JBQ0osSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLGNBQWMsRUFBRSxDQUFDLENBQUM7cUJBQ3JDOzt3QkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksU0FBUyxFQUFFLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLE9BQU8sdUJBQVksQ0FBQztvQkFDekIsTUFBTTtnQkFDUixJQUFJO2dCQUNKLEtBQUssRUFBRSxDQUFDO2dCQUNSLElBQUk7Z0JBQ0osS0FBSyxFQUFFO29CQUNMLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ25DLE1BQU07Z0JBR1IsSUFBSTtnQkFDSixLQUFLLEVBQUU7b0JBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7b0JBQzNCLElBQUksQ0FBQyxPQUFPLHFCQUFVLENBQUM7b0JBRXZCLE1BQU07Z0JBQ1Isc0JBQXNCO2dCQUN0QixZQUFZO2dCQUNaLG9EQUFvRDtnQkFDcEQsaUNBQWlDO2dCQUVqQyx5QkFBeUI7Z0JBQ3pCLDRCQUE0QjtnQkFDNUIsaUNBQWlDO2dCQUdqQywwQkFBMEI7Z0JBQzFCLFVBQVU7Z0JBQ1YsSUFBSTtnQkFDSixLQUFLLEVBQUU7b0JBQ0wsTUFBTTtnQkFFUixJQUFJO2dCQUNKLEtBQUssRUFBRTtvQkFDTCxNQUFNO2dCQUVSO29CQUNFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDbkM7U0FDRjtRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTTtZQUM3QixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDakQsT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdkIsSUFBSSxJQUFJLFlBQVksS0FBSztnQkFDdkIsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztnQkFDaEMsTUFBTSxvQkFBb0IsQ0FBQztTQUNqQztRQUNELDhCQUE4QjtRQUM5QixJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxLQUFLLENBQUM7WUFDOUMsTUFBTSxvQkFBb0IsQ0FBQztRQUU3QixJQUFJLElBQUksQ0FBQyxJQUFJLHVCQUFZLElBQUksSUFBSSxDQUFDLElBQUkseUJBQWEsSUFBSSxJQUFJLENBQUMsSUFBSSxvQkFBUztZQUN2RSxNQUFNLG9CQUFvQixDQUFDO1FBQzdCLFdBQVc7UUFFWCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ2pDLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBZSxFQUFFLE9BQXNCO0lBQzNELElBQUksR0FBRyxJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVE7UUFDL0IsR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUV4QyxPQUFlLEdBQUcsQ0FBQztBQUNyQixDQUFDO0FBY0QsTUFBTSxDQUFDLE9BQU8sVUFBVSxJQUFJLENBQUMsR0FBZSxFQUFFLE9BQW9CO0lBQ2hFLElBQUksQ0FBQyxHQUFHO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDdEIsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7UUFFM0IsSUFBSSxPQUFPLENBQUMsUUFBUTtZQUNsQixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHO2dCQUNmLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOztnQkFDcEIsT0FBZ0IsR0FBRyxDQUFDO1FBRTNCLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbEI7SUFDRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQSxTQUFTO0FBQ3BDLENBQUM7QUFFRCxNQUFNLFVBQVUsT0FBTyxDQUFDLFdBQTRCLEVBQUUsT0FBb0I7SUFDeEUsSUFBSSxNQUFNLEdBQWlCLEVBQUUsQ0FBQztJQUM5QixLQUFLLElBQUksR0FBRyxJQUFJLFdBQVc7UUFDekIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQWdCRCxNQUFNLFFBQVEsR0FBaUIsRUFBRSxDQUFDO0FBQ2xDLE1BQU0sVUFBVSxXQUFXLENBQUMsTUFBMkI7SUFDckQsS0FBSyxJQUFJLENBQUMsSUFBSSxNQUFNLEVBQUU7UUFDcEIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQztZQUNYLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO0tBQ3hCO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEMsQ0FBQyJ9