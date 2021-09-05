"use strict";
function exp(value, options) {
    return exp.parse(value, options);
}
(function (exp_1) {
    let Error;
    (function (Error) {
        Error[Error["varNotFound"] = 10] = "varNotFound";
    })(Error = exp_1.Error || (exp_1.Error = {}));
    class ParseError {
    }
    exp_1.ParseError = ParseError;
    class OpVal {
        get op() { return 'op'; }
        valid() { return !!this.b; }
        push(expression) {
            if (this.b)
                throw "invalid expression";
            this.b = expression;
        }
        toString() { return this.toJSON(); }
        vars(vars = []) {
            this[0].vars(vars);
            this.b.vars(vars);
            return vars;
        }
        translate(dir) {
            let t = Object.create(Object.getPrototypeOf(this));
            t[0] = this[0].translate(dir);
            t.b = this.b.translate(dir);
            return t;
        }
        analize(check) {
            let t = check(this[0]);
            if (t)
                this[0] = t;
            else
                this[0].analize(check);
            if (t = check(this.b))
                this.b = t;
            else
                this.b.analize(check);
        }
        *[Symbol.iterator]() {
            yield this;
            yield* this[0];
            yield* this.b;
        }
    }
    exp_1.OpVal = OpVal;
    class SumOp extends OpVal {
        get level() { return 4; }
        calc(opts) {
            let a = this[0].calc(opts), b = this.b.calc(opts);
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
            return this[0] + '+' + this.b;
        }
    }
    SumOp.op = '+';
    exp_1.SumOp = SumOp;
    class TimeOp extends OpVal {
        get level() { return 5; }
        calc(opts) {
            var a = this[0].calc(opts), b = this.b.calc(opts);
            if (opts.try) {
                if (!a)
                    a = 0;
                if (!b)
                    b = 0;
            }
            return a * b;
        }
        toJSON() {
            return this[0] + '*' + this.b;
        }
    }
    TimeOp.op = '*';
    exp_1.TimeOp = TimeOp;
    class SubOp extends OpVal {
        get level() { return 4; }
        calc(opts) {
            var a = this[0].calc(opts), b = this.b.calc(opts);
            if (opts.try) {
                if (!a)
                    a = 0;
                if (!b)
                    b = 0;
            }
            return a - b;
        }
        toJSON() {
            return this[0] + '-' + this.b;
        }
    }
    SubOp.op = '-';
    exp_1.SubOp = SubOp;
    class DivOp extends OpVal {
        get level() { return 5; }
        calc(opts) {
            var a = this[0].calc(opts), b = this.b.calc(opts);
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
            return this[0] + '/' + this.b;
        }
    }
    DivOp.op = '/';
    exp_1.DivOp = DivOp;
    class EqualOp extends OpVal {
        get level() { return 2; }
        calc(opts) {
            return this[0].calc(opts) == this.b.calc(opts);
        }
        toJSON() {
            return this[0] + '=' + this.b;
        }
    }
    EqualOp.op = '=';
    exp_1.EqualOp = EqualOp;
    class AndOp extends OpVal {
        get level() { return 1; }
        calc(opts) {
            return this[0].calc(opts) && this.b.calc(opts);
        }
        toJSON() {
            return this[0] + '&&' + this.b;
        }
    }
    AndOp.op = '&&';
    exp_1.AndOp = AndOp;
    class ConcatOp extends OpVal {
        get level() { return 3; }
        calc(opts) {
            let a = this[0].calc(opts), b = this.b.calc(opts);
            return (a == null ? '' : a + '') + (b == null ? '' : b + '');
        }
        toJSON() {
            return this[0] + '&' + this.b;
        }
    }
    ConcatOp.op = '&';
    exp_1.ConcatOp = ConcatOp;
    class LesEqualOp extends OpVal {
        get level() { return 2; }
        calc(opts) {
            return this[0].calc(opts) <= this.b.calc(opts);
        }
        toJSON() {
            return this[0] + '<=' + this.b;
        }
    }
    LesEqualOp.op = '<=';
    exp_1.LesEqualOp = LesEqualOp;
    class DifOp extends OpVal {
        get level() { return 2; }
        calc(opts) {
            return this[0].calc(opts) != this.b.calc(opts);
        }
        toJSON() {
            return this[0] + '<>' + this.b;
        }
    }
    DifOp.op = '<>';
    exp_1.DifOp = DifOp;
    class LessOp extends OpVal {
        get level() { return 2; }
        calc(opts) {
            let a = this[0].calc(opts), b = this.b.calc(opts);
            return a == null || b == null ? false : a < b;
        }
        toJSON() {
            return this[0] + '<' + this.b;
        }
    }
    LessOp.op = '<';
    exp_1.LessOp = LessOp;
    class OrOp extends OpVal {
        get level() { return 1; }
        calc(opts) {
            return this[0].calc(opts) || this.b.calc(opts);
        }
        toJSON() {
            return this[0] + '||' + this.b;
        }
    }
    exp_1.OrOp = OrOp;
    class GreaterEqualOp extends OpVal {
        get level() { return 2; }
        calc(opts) {
            return this[0].calc(opts) >= this.b.calc(opts);
        }
        toJSON() {
            return this[0] + '>=' + this.b;
        }
    }
    GreaterEqualOp.op = '>=';
    exp_1.GreaterEqualOp = GreaterEqualOp;
    class GreaterOp extends OpVal {
        get level() { return 2; }
        calc(opts) {
            let a = this[0].calc(opts), b = this.b.calc(opts);
            return a == null || b == null ? false : a > b;
        }
        toJSON() {
            return this[0] + '>' + this.b;
        }
    }
    GreaterOp.op = '>';
    exp_1.GreaterOp = GreaterOp;
    class PowOp extends OpVal {
        get level() { return 6; }
        calc(opts) {
            var a = this[0].calc(opts), b = this.b.calc(opts);
            if (opts.try) {
                if (!a)
                    a = 0;
                if (!b)
                    b = 0;
            }
            return Math.pow(a, b);
        }
        toJSON() {
            return this[0] + '^' + this.b;
        }
    }
    exp_1.PowOp = PowOp;
    class NulledOp extends OpVal {
        get level() { return 7; }
        calc(opts) {
            var a = this[0].calc(opts), b = this.b.calc(opts);
            return typeof a == 'number' ?
                isNaN(a) ? b : a :
                a == null ? b : a;
        }
        toJSON() {
            return this[0] + '??' + this.b;
        }
    }
    exp_1.NulledOp = NulledOp;
    class TernaryOp extends OpVal {
        get level() { return 1; }
        calc(opts) {
            return this[0].calc(opts) ?
                this.b.calc(opts) :
                this.c.calc(opts);
        }
        push(value) {
            if (this.b)
                if (this.c)
                    throw null;
                else
                    this.c = value;
            else
                this.b = value;
        }
        valid() { return !!this.c; }
        toJSON() { return this[0] + '?' + this.b + ':' + this.c; }
        toString() { return this.toJSON(); }
        vars(vars = []) {
            this[0].vars(vars);
            this.b.vars(vars);
            this.c.vars(vars);
            return vars;
        }
        *[Symbol.iterator]() {
            yield this;
            yield* this[0];
            yield* this.b;
            yield* this.c;
        }
    }
    exp_1.TernaryOp = TernaryOp;
    class DicVal {
        constructor(data) {
            this.data = data;
        }
        get op() { return 'dic'; }
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
    exp_1.DicVal = DicVal;
    class SignalVal {
        constructor(signal) {
            this.signal = signal;
        }
        get op() { return 'sig'; }
        calc(opts) {
            switch (this.signal) {
                case "-":
                    return -this.value.calc(opts);
                case "!":
                    return !this.value.calc(opts);
                case "+":
                    return +this.value.calc(opts);
                default:
            }
        }
        valid() { return !!this.value; }
        push(value) {
            if (this.value)
                throw "invalid expression";
            this.value = value;
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
    exp_1.SignalVal = SignalVal;
    class GroupVal {
        get op() { return 'g'; }
        valid() { return !!this.value; }
        calc(opts) {
            return this.value.calc(opts);
        }
        push(value) {
            if (this.value)
                throw "invalid expression";
            this.value = value;
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
    exp_1.GroupVal = GroupVal;
    class FnVal {
        constructor(args, body) {
            this.args = args;
            this.body = body;
        }
        get op() { return 'fn'; }
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
    exp_1.FnVal = FnVal;
    class CallVal {
        constructor(func, args = []) {
            this.func = func;
            this.args = args;
        }
        get op() { return 'call'; }
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
            let t = new CallVal(translate(this.func, dir));
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
    exp_1.CallVal = CallVal;
    class NumbVal {
        constructor(value) {
            this.value = value;
        }
        get op() { return 'n'; }
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
    exp_1.NumbVal = NumbVal;
    class VarVal {
        constructor(value) {
            this.value = value;
        }
        get op() { return 'v'; }
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
    exp_1.VarVal = VarVal;
    class TextValue {
        constructor(value, charCode) {
            this.value = value;
            this.charCode = charCode;
        }
        get op() { return 't'; }
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
    exp_1.TextValue = TextValue;
    class ObjectVal {
        constructor(levels) {
            this.levels = levels;
        }
        get op() { return 'o'; }
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
    exp_1.ObjectVal = ObjectVal;
    var translate;
    function defineTranslateFunc(func) {
        translate = func;
    }
    exp_1.defineTranslateFunc = defineTranslateFunc;
    function analize(val, check) {
        let t = check(val);
        if (t)
            return t;
        val.analize(check);
        return val;
    }
    exp_1.analize = analize;
    function clone(val) {
        return new Parser(val.toString()).parse();
    }
    exp_1.clone = clone;
    function has(value, check) {
        return (value & check) === check;
    }
    class Parser {
        constructor(exp, options = {}) {
            this.options = options;
            this.scope = [];
            this.mode = 8193;
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
            if (has(mode, 4096)) {
                if (!has(old, 16384))
                    throw 1;
            }
            else if (has(mode, 32768)) {
                if (!has(old, 8193) && !has(old, 4096))
                    throw 2;
            }
            else if (has(mode, 8192)) {
                if (has(old, 16384))
                    throw 3;
            }
            else if (has(mode, 16384)) {
                if (has(old, 4096) || has(old, 32768))
                    throw 4;
            }
            this.mode = mode;
        }
        appendOp(_new) {
            var s = this.scope, old = s[s.length - 1], stored = this.popStored();
            if (old instanceof OpVal) {
                if (_new.level > old.level) {
                    _new[0] = stored;
                    s.push(_new);
                }
                else {
                    old.b = stored;
                    _new[0] = old;
                    s[s.length - 1] = _new;
                }
            }
            else {
                _new[0] = stored;
                s.push(_new);
            }
        }
        parseString(i, exp, char) {
            let temp1 = "", letter = exp.charCodeAt(i + 1);
            while (letter != char || ((letter = exp.charCodeAt(++i + 1)) == char)) {
                if (Number.isNaN(letter))
                    throw "error";
                temp1 += exp[i + 1];
                letter = exp.charCodeAt(++i + 1);
            }
            this.setMode(24578);
            this.setStored(new TextValue(temp1, char));
            return i;
        }
        parseVal(char, exp, i) {
            let storedText = exp[i], l = exp.length;
            if ((char > 47 && char < 58) || char == 46) {
                char = exp.charCodeAt(i + 1);
                while (((char > 47 && char < 58) || char == 46) && i < l) {
                    storedText += exp[i + 1];
                    char = exp.charCodeAt(++i + 1);
                }
                this.setStored(new NumbVal(storedText));
                this.setMode(24577);
            }
            else if ((char > 96 && char < 123) || (char > 64 && char < 91) || char === 95 || char === 64) {
                let obj;
                do {
                    char = exp.charCodeAt(i + 1);
                    while (((char > 96 && char < 123) || (char > 64 && char < 91) || (char > 47 && char < 58) || char == 95) && i < l) {
                        storedText += exp[i + 1];
                        char = exp.charCodeAt(++i + 1);
                    }
                    if (char == 40) {
                        this.setMode(8199);
                        this.scope.push(new CallVal(storedText));
                        i++;
                    }
                    else if (char === 46) {
                        obj ?
                            obj.push(storedText) :
                            (obj = [storedText]);
                        storedText = exp[i += 2];
                    }
                    else if (obj) {
                        obj.push(storedText);
                        this.setStored(new ObjectVal(obj));
                        this.setMode(24624);
                        obj = null;
                    }
                    else {
                        this.setStored(new VarVal(storedText));
                        this.setMode(24592);
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
            for (let i = this.options.from || 0, exp = this.expression; i < exp.length; i++) {
                let char = exp.charCodeAt(i);
                switch (char) {
                    case 32:
                        break;
                    case 43:
                        if (this.stored) {
                            this.appendOp(new SumOp());
                            this.setMode(4614);
                        }
                        else {
                            this.setMode(32769);
                            scope.push(new SignalVal("+"));
                        }
                        break;
                    case 45:
                        if (this.stored) {
                            this.appendOp(new SubOp());
                            this.setMode(4618);
                        }
                        else {
                            this.setMode(32770);
                            scope.push(new SignalVal("-"));
                        }
                        break;
                    case 42:
                        this.appendOp(new TimeOp());
                        this.setMode(4626);
                        break;
                    case 47:
                        this.appendOp(new DivOp());
                        this.setMode(4642);
                        break;
                    case 33:
                        if (this.stored) {
                            throw "invalid expression";
                        }
                        else {
                            this.setMode(32769);
                            scope.push(new SignalVal("!"));
                        }
                        break;
                    case 124:
                        if (exp.charCodeAt(i + 1) === 124) {
                            i++;
                            this.appendOp(new OrOp());
                            this.setMode(6154);
                        }
                        else
                            throw "operator not found knowed";
                        break;
                    case 38:
                        if (exp.charCodeAt(i + 1) === 38) {
                            i++;
                            this.appendOp(new AndOp());
                            this.setMode(6150);
                        }
                        else {
                            this.appendOp(new ConcatOp());
                            this.setMode(4226);
                        }
                        break;
                    case 123:
                        {
                            let dic = {};
                            i = this.jumpSpace(exp, i);
                            if (exp[++i] != '}')
                                while (true) {
                                    let temp = this.parseVar(exp, i) || this.parseNumb(exp, i);
                                    if (!temp.length)
                                        this.error('error parse', i);
                                    i += temp.length;
                                    i = this.jumpSpace(exp, i);
                                    if (exp[i++] != ':')
                                        this.error('":" not found');
                                    let body = new Parser(exp, { from: i, sub: true, warn: this.options.warn });
                                    dic[temp] = body.parse();
                                    if (!(i = body.end))
                                        this.error('');
                                    i++;
                                    if (exp[i] == '}')
                                        break;
                                    if (i == exp.length)
                                        this.error('unexpected end');
                                    if (exp[i] != ',')
                                        this.error('"," not found');
                                    i++;
                                    i = this.jumpSpace(exp, i);
                                }
                            this.setStored(new DicVal(dic));
                            this.setMode(24584);
                        }
                        break;
                    case 125:
                        if (this.options.sub) {
                            this.end = i - 1;
                            i = exp.length;
                        }
                        else
                            this.error('mas fim que inicio', i);
                        break;
                    case 63:
                        {
                            if (exp.charCodeAt(i + 1) === 63) {
                                i++;
                                this.appendOp(new NulledOp());
                                this.setMode(6154);
                            }
                            else {
                                this.appendOp(new TernaryOp());
                                this.setMode(4358);
                            }
                        }
                        break;
                    case 58:
                        {
                            this.setMode(4362);
                            let stored = this.popStored(), before = scope[scope.length - 1];
                            while (!(before instanceof TernaryOp)) {
                                scope.pop();
                                before.push(stored);
                                stored = before;
                                before = scope[scope.length - 1];
                                if (!before)
                                    throw "invalid expression";
                            }
                            before.push(stored);
                        }
                        break;
                    case 40:
                        if (this.isCall(exp, i + 1)) {
                            let args = [];
                            i = this.jumpSpace(exp, i);
                            if (exp[++i] != ')')
                                while (true) {
                                    let temp = this.parseVar(exp, i);
                                    if (!temp.length)
                                        this.error('error parse', i);
                                    i += temp.length;
                                    args.push(temp);
                                    i = this.jumpSpace(exp, i);
                                    if (exp[i] == ')')
                                        break;
                                    if (exp[i] != ',')
                                        this.error('"," not found');
                                    i = this.jumpSpace(exp, i);
                                    i++;
                                }
                            let body = new Parser(exp, { from: i += 3, sub: true, warn: this.options.warn });
                            this.setStored(new FnVal(args, body.parse()));
                            this.setMode(24580);
                            i = body.end || exp.length;
                        }
                        else {
                            this.setMode(8195);
                            scope.push(new GroupVal());
                        }
                        break;
                    case 41:
                        {
                            let lastScope = scope.pop();
                            if (!has(this.mode, 8195)) {
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
                            this.setMode(16387);
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
                    case 44:
                    case 59:
                        {
                            this.setMode(4097);
                            let before = scope[scope.length - 1];
                            let stored = this.popStored();
                            while (!(before instanceof CallVal)) {
                                if (!before)
                                    if (this.options.sub) {
                                        this.end = i - 1;
                                        i = exp.length;
                                        this.setStored(stored);
                                        break;
                                    }
                                    else
                                        this.error('mas fim que inicio', i);
                                scope.pop();
                                before.push(stored);
                                stored = before;
                                before = scope[scope.length - 1];
                            }
                            if (before)
                                before.push(stored);
                        }
                        break;
                    case 60:
                        switch (exp.charCodeAt(i + 1)) {
                            case 61:
                                i++;
                                this.appendOp(new LesEqualOp());
                                this.setMode(5142);
                                break;
                            case 62:
                                i++;
                                this.appendOp(new DifOp());
                                this.setMode(5134);
                                break;
                            default:
                                this.appendOp(new LessOp());
                                this.setMode(5126);
                        }
                        break;
                    case 61:
                        this.appendOp(new EqualOp());
                        this.setMode(5138);
                        break;
                    case 62:
                        if (exp.charCodeAt(i + 1) === 61) {
                            i++;
                            this.appendOp(new GreaterEqualOp());
                        }
                        else
                            this.appendOp(new GreaterOp());
                        this.setMode(5130);
                        break;
                    case 34:
                    case 39:
                        i = this.parseString(i, exp, char);
                        break;
                    case 94:
                        this.appendOp(new PowOp());
                        this.setMode(4674);
                        break;
                    case 91:
                        break;
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
            if (scope.length && !(scope[0] instanceof OpVal))
                throw "invalid expression";
            if (this.mode == 8193 || this.mode == 32768 || this.mode == 4098)
                throw "invalid expression";
            return scope[0] || this.stored;
        }
    }
    function parse(exp, options) {
        if (exp && typeof exp == "string")
            exp = new Parser(exp, options).parse();
        return exp;
    }
    exp_1.parse = parse;
    function calc(exp, options) {
        if (!exp)
            return null;
        if (typeof exp === 'string') {
            if (options.optional)
                if (exp[0] == '=')
                    exp = exp.substr(1);
                else
                    return exp;
            exp = parse(exp);
        }
        return exp.calc(options);
    }
    exp_1.calc = calc;
    function calcAll(expressions, options) {
        var result = {};
        for (let key in expressions)
            result[key] = calc(expressions[key], options);
        return result;
    }
    exp_1.calcAll = calcAll;
    function compileExpression(expression) {
        throw "unsetted797";
    }
    exp_1.compileExpression = compileExpression;
    const formulas = {};
    function addFormulas(values) {
        for (let k in values) {
            let calc = values[k];
            if (typeof calc == "function")
                values[k] = { calc };
        }
        Object.assign(formulas, values);
    }
    exp_1.addFormulas = addFormulas;
    let QueryAlgorithm;
    (function (QueryAlgorithm) {
        QueryAlgorithm[QueryAlgorithm["word"] = 0] = "word";
        QueryAlgorithm[QueryAlgorithm["like"] = 1] = "like";
    })(QueryAlgorithm = exp_1.QueryAlgorithm || (exp_1.QueryAlgorithm = {}));
    function queryInArray(query, array, fields) {
        var words = query.split(' ');
        return array.filter((row) => queryInObj(words, row, fields));
    }
    function queryInObj(words, obj, fields) {
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
    exp_1.queryInObj = queryInObj;
    function query(query, array, options) {
        switch (options.type) {
            case QueryAlgorithm.word:
                return queryInArray(query, array, options.fields);
            case QueryAlgorithm.like:
                break;
        }
        return null;
    }
    exp_1.query = query;
    function compareString(str1, str2) {
        str1 = str1.replace(/\s+/g, '');
        str2 = str2.replace(/\s+/g, '');
        if (!str1.length && !str2.length)
            return 1;
        if (!str1.length || !str2.length)
            return 0;
        if (str1 === str2)
            return 1;
        if (str1.length === 1 && str2.length === 1)
            return 0;
        if (str1.length < 2 || str2.length < 2)
            return 0;
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
})(exp || (exp = {}));
module.exports = exp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsU0FBUyxHQUFHLENBQUMsS0FBcUIsRUFBRSxPQUEwQjtJQUM1RCxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFDRCxXQUFVLEtBQUc7SUFLWCxJQUFZLEtBR1g7SUFIRCxXQUFZLEtBQUs7UUFFZixnREFBZ0IsQ0FBQTtJQUNsQixDQUFDLEVBSFcsS0FBSyxHQUFMLFdBQUssS0FBTCxXQUFLLFFBR2hCO0lBYUQsTUFBYSxVQUFVO0tBTXRCO0lBTlksZ0JBQVUsYUFNdEIsQ0FBQTtJQUtELE1BQXNCLEtBQUs7UUFDekIsSUFBSSxFQUFFLEtBQVcsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBVS9CLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsVUFBZTtZQUNsQixJQUFJLElBQUksQ0FBQyxDQUFDO2dCQUNSLE1BQU0sb0JBQW9CLENBQUM7WUFFN0IsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDdEIsQ0FBQztRQUNELFFBQVEsS0FBSyxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLE9BQWlCLEVBQUU7WUFDdEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxTQUFTLENBQUMsR0FBaUI7WUFDekIsSUFBSSxDQUFDLEdBQVUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FB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