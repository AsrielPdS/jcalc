
interface Dic<T = any> { [key: string]: T; }
type Check = (old: Val) => Val | void;

const isF = (v: unknown): v is Function => typeof v == "function";

export const enum Error {
  /**call when a variable was not found */
  varNotFound = 10,
}
export interface IValue extends Iterable<IValue> {
  readonly op: string;
  valid(): boolean;
  calc(opts: CalcOptions): any;
  toString(): string;
  toJSON(): string;
  /**placeholder for render to the dom */
  render?(this: this): unknown;
  vars(vars?: string[]): string[];
  translate(dir: TranslateDir): IValue;
  analize?(check: Check): void;
}
export class ParseError {
  start: number;
  length?: number;
  type: ParseErrorType;
  /**placeholder for render to the dom */
  render?(this: this): unknown;
}

interface IScopeValue extends IValue {
  push(val: Val): void;
}
export abstract class OpVal implements IScopeValue {
  get op(): 'op' { return 'op'; }
  a: Val;
  b: Val;
  readonly abstract level: number;

  abstract calc(opts: CalcOptions);
  abstract toJSON(): string;

  render?(this: this): unknown;

  valid() { return !!this.b; }
  push(expression: Val) {
    if (this.b)
      throw "invalid expression";

    this.b = expression;
  }
  toString() { return this.toJSON(); }
  vars(vars: string[] = []) {
    this.a.vars(vars);
    this.b.vars(vars);
    return vars;
  }
  translate(dir: TranslateDir) {
    let t = <OpVal>Object.create(Object.getPrototypeOf(this));
    t.a = this.a.translate(dir);
    t.b = this.b.translate(dir);

    return t;
  }
  analize(check: Check) {
    let t = check(this.a);
    if (t)
      this.a = t;
    else this.a.analize(check);

    if (t = check(this.b))
      this.b = t;
    else this.b.analize(check);
  }
  *[Symbol.iterator]() {
    yield this;
    yield* this.a;
    yield* this.b;
  }
  static op: string;
}
export class SumOp extends OpVal {
  get level() { return 4; }

  calc(opts: CalcOptions) {
    let
      a = this.a.calc(opts) as number | string,
      b = this.b.calc(opts) as number | string;
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

  calc(opts: CalcOptions) {
    var
      a = this.a.calc(opts) as number,
      b = this.b.calc(opts) as number;
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

  calc(opts: CalcOptions) {
    var
      a = this.a.calc(opts) as number,
      b = this.b.calc(opts) as number;
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

  calc(opts: CalcOptions) {
    var
      a = this.a.calc(opts) as number,
      b = this.b.calc(opts) as number;
    if (opts.try) {
      if (!a)
        a = 0;
      if (!b)
        b = 0;
    }
    if (b == 0) return null;
    return a / b;
  }
  toJSON() {
    return this.a + '/' + this.b;
  }
  static /*override*/ op = '/';
}
export class EqualOp extends OpVal {
  get level() { return 2; }

  calc(opts: CalcOptions) {
    return this.a.calc(opts) == this.b.calc(opts);
  }
  toJSON() {
    return this.a + '=' + this.b;
  }
  static /*override*/ op = '=';
}
export class AndOp extends OpVal {
  get level() { return 1; }

  calc(opts: CalcOptions) {
    return this.a.calc(opts) && this.b.calc(opts);
  }
  toJSON() {
    return this.a + '&&' + this.b;
  }
  static /*override*/ op = '&&';
}
export class ConcatOp extends OpVal {
  get level() { return 3; }

  calc(opts: CalcOptions) {
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

  calc(opts: CalcOptions) {
    return this.a.calc(opts) <= this.b.calc(opts);
  }
  toJSON() {
    return this.a + '<=' + this.b;
  }
  static /*override*/ op = '<=';
}
export class DifOp extends OpVal {
  get level() { return 2; }

  calc(opts: CalcOptions) {
    return this.a.calc(opts) != this.b.calc(opts);
  }
  toJSON() {
    return this.a + '<>' + this.b;
  }
  static /*override*/ op = '<>';
}
export class LessOp extends OpVal {
  get level() { return 2; }

  calc(opts: CalcOptions) {
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

  calc(opts: CalcOptions) {
    return this.a.calc(opts) || this.b.calc(opts);
  }
  toJSON() {
    return this.a + '||' + this.b;
  }
}
export class GreaterEqualOp extends OpVal {
  get level() { return 2; }

  calc(opts: CalcOptions) {
    return this.a.calc(opts) >= this.b.calc(opts);
  }
  toJSON() {
    return this.a + '>=' + this.b;
  }
  static /*override*/ op = '>=';
}
export class GreaterOp extends OpVal {
  get level() { return 2; }

  calc(opts: CalcOptions) {
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

  calc(opts: CalcOptions) {
    var
      a = this.a.calc(opts) as number,
      b = this.b.calc(opts) as number;
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

  calc(opts: CalcOptions) {
    var
      a = this.a.calc(opts),
      b = this.b.calc(opts);

    return typeof a == 'number' ?
      isNaN(a as number) ? b : a :
      a == null ? b : a;
  }
  toJSON() {
    return this.a + '??' + this.b;
  }
}
export class TernaryOp extends OpVal {
  c: Val;
  get level() { return 1; }
  calc(opts: CalcOptions) {
    return this.a.calc(opts) ?
      this.b.calc(opts) :
      this.c.calc(opts);
  }

    /*override*/  push(value: Val) {
    if (this.b)
      if (this.c)
        throw null;
      else this.c = value;
    else this.b = value;
  }

    /*override*/   valid() { return !!this.c; }
    /*override*/   render?(this: this): unknown;
  toJSON() { return this.a + '?' + this.b + ':' + this.c; }
    /*override*/   toString() { return this.toJSON(); }
    /*override*/   vars(vars: string[] = []) {
    this.a.vars(vars);
    this.b.vars(vars);
    this.c.vars(vars);
    return vars;
  }
    /*override*/  *[Symbol.iterator]() {
    yield this;
    yield* this.a;
    yield* this.b;
    yield* this.c;
  }
}

export class DicVal implements IValue {
  get op(): 'dic' { return 'dic'; }
  render?(this: this): unknown;

  constructor(public data: Dic<Val>) { }

  calc(opts: CalcOptions): Dic<unknown> {
    let result: Dic<unknown> = {};
    for (let key in this.data)
      result[key] = this.data[key].calc(opts);

    return result;
  }

  toString(): string {
    return '';
  }

  valid() { return false; }
  translate(dir: TranslateDir) {
    let nd: Dic<IValue> = {};
    for (let k in this.data)
      nd[k] = this.data[k].translate(dir);

    return new DicVal(this.data);
  }
  toJSON(): string {
    return '';
  }

  analize(check: Check) {
    for (let key in this.data) {
      let
        t = this.data[key],
        u = check(t);
      if (u)
        this.data[key] = u;
      else t.analize(check);
    }
  }
  *[Symbol.iterator]() {
    yield this;
    for (let k in this.data)
      yield* this.data[k];
  }
  vars(vars?: string[]): string[] {
    for (let key in this.data)
      this.data[key].vars(vars);

    return vars;
  }
}
export const enum Signals {
  plus = '+',
  Minus = '-',
  Not = '!'
}

export class SignalVal implements IScopeValue {
  get op(): 'sig' { return 'sig'; }
  render?(this: this): unknown;
  //op: Operand = "_";
  //signal: '-' = '-';
  public value: Val;
  //constructor() { }

  //async calcAsync(opts: CalcOptions): Promise<T> {
  //   return <any>-(await this.first.calcAsync(opts));
  //}
  constructor(public signal: Signals) { }
  calc(opts: CalcOptions) {
    switch (this.signal) {
      case Signals.Minus:
        return <any>-this.value.calc(opts);

      case Signals.Not:
        return !this.value.calc(opts);

      case Signals.plus:
        return <any>+this.value.calc(opts);
      default:
    }
  }

  //push(expression: IValue) {
  //   if (this.first)
  //      throw "invalid";
  //   this.first = expression;
  //}

  valid() { return !!this.value; }
  push(value: Val) {
    if (this.value)
      throw "invalid expression";

    this.value = value;
    //this.values.push();
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return this.signal + this.value;
  }
  vars(vars: string[] = []) {
    this.value.vars(vars);
    return vars;
  }
  translate(dir: TranslateDir) {
    let t = new SignalVal(this.signal);
    t.value = this.value.translate(dir)
    return t;
  }
  analize(check: Check) {
    let t = check(this.value);
    if (t)
      this.value = t;
  }
  *[Symbol.iterator]() {
    yield this;
    yield* this.value;
  }
}

export class GroupVal implements IScopeValue {
  get op(): 'g' { return 'g'; }
  render?(this: this): unknown;
  public value?: Val;

  //async calcAsync(opts: CalcOptions): Promise<T> {
  //   return await this.value.calcAsync(opts);
  //}

  valid() { return !!this.value; }
  calc(opts: CalcOptions) {
    return this.value.calc(opts);
  }
  push(value: Val) {
    if (this.value)
      throw "invalid expression";

    this.value = value;
    //this.values.push();
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return '(' + this.value + ')';
  }
  analize(check: Check) {
    let t = check(this.value);
    if (t)
      this.value = t;
  }
  vars(vars: string[] = []) {
    this.value.vars(vars);
    return vars;
  }
  translate(dir: TranslateDir) {
    let t = new GroupVal();
    t.value = this.value.translate(dir)
    return t;
  }
  *[Symbol.iterator]() {
    yield this;
    yield* this.value;
  }
}
export class FnVal implements IScopeValue {
  get op(): 'fn' { return 'fn'; }

  render?(this: this): unknown;

  //args: string[] = [];
  //body: IValue;
  constructor(public args: string[], public body: Val) { }
  valid() { return !!this.body; }
  push(val: IValue): void {
    if (val instanceof VarVal)
      this.args.push(val.value);
    else throw null;
  }
  calc(opts: CalcOptions): Function {
    var t = this.args;
    return (...args: unknown[]) => {
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
              else return opts.vars[field];
            else throw null;
          else return args[index];
        }
      });
    };
  }
  toString(): string {
    return this.toJSON();
  }
  toJSON(): string {
    return '(' + this.args.join(',') + ')=>' + this.body;
  }
  vars(vars?: string[]): string[] {
    return this.body.vars(vars);
  }
  translate(dir: TranslateDir) {
    return new FnVal(this.args, this.body.translate(dir));
  }

  analize(check: Check) {
    let t = check(this.body);
    if (t)
      this.body = t;
  }
  *[Symbol.iterator]() {
    yield this;
  }
}
export class CallVal implements IScopeValue {
  get op(): 'call' { return 'call'; }
  render?(this: this): unknown;
  constructor(public func: string, public args: Val[] = []) { }

  calc(opts: CalcOptions) {
    let
      args = this.args.map(a => a.calc(opts)),
      name = opts.uncase ? this.func.toLowerCase() : this.func,
      f = isF(opts.funcs);

    if (f) {
      let v = (opts.funcs as Function)(name, args);
      if (v !== void 0)
        return v;
    }
    let fx = (!f && opts.funcs) && opts.funcs[name] || (name in formulas ? formulas[name].calc : null);

    if (!fx)
      throw { msg: "not_found", name };
    return fx.apply(opts, args);
  }

  valid() { return true; }
  push(expression: Val) {
    this.args.push(expression);
  }

  toString() { return this.toJSON(); }
  toJSON() {
    return this.func + '(' + this.args.join(',') + ')';
  }
  vars(vars: string[] = []) {
    for (let p of this.args)
      p.vars(vars);
    return vars;
  }
  translate(dir: TranslateDir) {
    //let formula = formulas[this.func.toLowerCase()];
    let t = new CallVal($.translate(this.func, dir));
    t.args = this.args.map(a => a.translate(dir));
    return t;
  }
  analize(check: Check) {
    for (let i = 0, a = this.args; i < a.length; i++) {
      let
        t = a[i],
        u = check(t);
      if (u)
        a[i] = u;
      else t.analize(check);
    }
  }
  *[Symbol.iterator]() {
    yield this;
    for (let t of this.args)
      yield* t;
  }
}

type AcceptScopeVal = GroupVal | FnVal | CallVal | OpVal | SignalVal;
interface IValValue extends IValue {
  value: unknown;
}
export class NumbVal implements IValValue {
  get op(): 'n' { return 'n'; }

  render?(this: this): unknown;
  public value: string;

  constructor(value: string) {
    this.value = value;
  }
  async calcAsync<T = any>(): Promise<T> {
    return this.value as any;
  }

  valid() { return true; }
  calc<T = any>(): T {
    return +this.value as any;
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return +this.value + '';
  }
  vars(vars: string[] = []) {
    return vars;
  }
  analize(_: Check) { }
  translate(dir: TranslateDir) { return this; }
  *[Symbol.iterator]() {
    yield this;
  }
}
export class VarVal implements IValValue {
  get op(): 'v' { return 'v'; }
  render?(this: this): unknown;
  constructor(public value: string) { }

  valid() { return true; }
  calc(opts: CalcOptions) {
    return isF(opts.vars) ? opts.vars(this.value) : opts.vars[this.value];
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return this.value;
  }
  vars(vars: string[] = []) {
    vars.push(this.value);
    return vars;
  }
  translate(dir: TranslateDir) { return this; }

  analize(_: Check) { }
  *[Symbol.iterator]() {
    yield this;
  }
}
export class ConstVal implements IValValue {
  get op(): 'c' { return 'c'; }
  render?(this: this): unknown;
  constructor(public value: string) { }

  valid() { return true; }
  calc(opts: CalcOptions) {
    return consts[this.value];
  }
  toString() { return this.value; }
  toJSON() { return this.value; }
  vars(vars: string[] = []) { return vars; }
  translate(dir: TranslateDir) { return this; }

  analize(_: Check) { }
  *[Symbol.iterator]() {
    yield this;
  }
}
export const consts: Dic<unknown> = { null: null, false: false, true: true };
export class TextValue implements IValValue {
  get op(): 't' { return 't'; }
  render?(this: this): unknown;
  constructor(public value: string, public charCode?: number) {
  }
  static create(text: string) {
    return new TextValue(text, '"'.charCodeAt(0));
  }
  get char() { return String.fromCharCode(this.charCode); }
  valid() { return true; }
  calc<T = any>(): T {
    return this.value as any;
  }

  toString() {
    return `"${this.value.replace(/"/g, '\\"')}"`;
  }
  toJSON() {
    return `'${this.value.replace(/'/g, "\\'")}'`;
  }
  vars(vars: string[] = []) { return vars; }
  translate(dir: TranslateDir) { return this; }

  analize(_: Check) { }
  *[Symbol.iterator]() {
    yield this;
  }
}
export class ObjectVal implements IValue {
  get op(): 'o' { return 'o'; }
  render?(this: this): unknown;
  constructor(public levels: string[]) { }


  valid() { return true; }
  calc(opts: CalcOptions) {
    let
      i = 1, l = this.levels,
      result = isF(opts.vars) ? <any>opts.vars(l[0], true) : opts.vars[l[0]];
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
  vars(vars: string[] = []) {
    vars.push(this.levels[0]);
    return vars;
  }
  translate(dir: TranslateDir) { return this; }

  analize(_: Check) { }
  *[Symbol.iterator]() {
    yield this;
  }
}

//export namespace _ {
//  export function v(value: string) {
//    return new VarVal(value);
//  }
//  export function t(value: string) {
//    return new TextValue(value);
//  }
//  export function ob(...args: string[]) {
//    return new ObjectVal(args);
//  }
//  export function call(fn: string, ...args: Val[]) {
//    return new CallVal(fn, args);
//  }
//}
export type AllVal = FnVal | DicVal | OpVal | GroupVal | SignalVal | SignalVal | TernaryOp | CallVal | NumbVal | VarVal | ObjectVal | TextValue;
export type Val = IValue; //

type TranslateDir = 1 | -1;
interface Settings {
  translate?(funcName: string, signal: TranslateDir): string;
}
export const $: Settings = {}
export function analize(val: Val, check: Check) {
  let t = check(val);
  if (t)
    return t;
  val.analize(check);
  return val;
}
export function clone(val: Val) {
  return new Parser(val.toString()).parse();
}
/** */
export interface DataType {
  boolean: boolean,
  text: string,
  number: number,
  datetime: Date,
  date: Date,
  time: Date,
  object: Dic,

  array: Array<any>,
  objectArray: Array<Dic>,
  numberArray: Array<number>,
  textArray: Array<string>,
  boolArray: Array<boolean>,
  dateArray: Array<Date>,
  any: any;
}
export type Expression = IValue | string;
export type DataTypes = keyof DataType;


export const enum ParseErrorType {

}


const enum PM {
  none = 0,

  sep = 4096,
  coma = sep | 1,
  op = sep | 2,

  concat = op | 128,

  Ter = op | 256,
  Ter1 = Ter | 4,
  Ter2 = Ter | 8,

  arit = op | 512,
  sum = arit | 4,
  sub = arit | 8,
  time = arit | 16,
  div = arit | 32,
  power = arit | 64,

  compare = op | 1024,
  less = compare | 4,
  greater = compare | 8,
  equal = compare | 16,

  lessEqual = less | equal,
  greaterEqual = greater | equal,
  diferent = less | greater,

  logic = op | 2048,
  and = logic | 4,
  or = logic | 8,
  xor = logic | 16,


  valueStart = sep * 2,

  begin = valueStart | 1,
  open = begin | 2,
  call = open | 4,

  valueEnd = valueStart * 2,
  end = valueEnd | 1,
  close = end | 2,

  value = valueStart | valueEnd,
  number = value | 1,
  string = value | 2,
  fn = value | 4,
  dic = value | 8,
  variable = value | 16,
  object = variable | 32,


  signal = valueEnd * 2,
  not = signal | 1,
  plus = signal | 1,
  minus = signal | 2,
}

function has<T extends number>(value: T, check: T): boolean {
  return (value & check) === check;
}

export interface ParseOptions {
  warn?: boolean;
  from?: number;
  /**if true when scope stop in middle of expression don't throw error */
  sub?: boolean;
}
class Parser {
  //GroupValue | OpValue | SignalValue | FuncValue | TernaryValue
  readonly scope: Array<AcceptScopeVal> = [];
  stored: Val;
  mode: PM = PM.begin;
  expression: string;
  end: number;

  constructor(exp: string, public options: ParseOptions = {}) {
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
  setStored(value: Val) {
    let s = this.scope, t = s[s.length - 1];
    if (t && t instanceof SignalVal) {
      s.pop();
      t.value = value;
      value = t;
    }
    this.stored = value;
  }
  setMode(mode: PM) {
    let old = this.mode;
    if (has(mode, PM.sep)) {
      if (!has(old, PM.valueEnd))
        throw 1;
    } else if (has(mode, PM.signal)) {
      if (!has(old, PM.begin) && !has(old, PM.sep))
        throw 2;
    } else if (has(mode, PM.valueStart)) {
      if (has(old, PM.valueEnd))
        throw 3;
    } else if (has(mode, PM.valueEnd)) {
      if (has(old, PM.sep) || has(old, PM.signal))
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

  appendOp(_new: OpVal) {
    var
      s = this.scope,
      old = s[s.length - 1],
      stored = this.popStored();

    if (old instanceof OpVal) {

      //assign: 2+3*4, 2*3^4
      if (_new.level > old.level) {
        _new.a = stored;
        s.push(_new);//new OpValue(_new, stored)
      }
      //assign: 2*3+4,3^4+1, 2*3/4
      else {
        old.b = stored;

        _new.a = old;
        s[s.length - 1] = _new;
      }

    } else {
      _new.a = stored;
      s.push(_new);
    }
    //else {
    //  _new.a = stored;
    //  s.push(_new);
    //}
  }
  parseString(i: number, exp: string, char: number) {
    let
      temp1 = "",
      letter = exp.charCodeAt(i + 1);
    //check se a letra não é " se for checa a proxima letra 
    while (letter != char || ((letter = exp.charCodeAt(++i + 1)) == char)) {
      //se chegar no final da expressão sem terminar a string
      if (Number.isNaN(letter))
        throw "error";
      temp1 += exp[i + 1];
      letter = exp.charCodeAt(++i + 1);
    }

    this.setMode(PM.string);

    this.setStored(new TextValue(temp1, char));

    return i;
  }

  parseVal(char: number, exp: string, i: number) {
    let storedText = exp[i], l = exp.length;
    //se for numero ou ponto
    if ((char > 47 && char < 58) || char == 46) {
      char = exp.charCodeAt(i + 1);
      while (((char > 47 && char < 58) || char == 46) && i < l) {
        storedText += exp[i + 1];
        char = exp.charCodeAt(++i + 1);
      }
      this.setStored(new NumbVal(storedText));
      this.setMode(PM.number);
      //se for letra ou underscore
      //letra minuscula>>>>>>>>>>>>>>>>>>>>>>>letra maiuscula>>>>>>>>>>>>>>>>>>underscore>>>>>>at>>>>>>>>>>>>dois pontos
    } else if ((char > 96 && char < 123) || (char > 64 && char < 91) || char === 95 || char === 64/* || letter == 58*/) {
      let obj: string[];
      do {
        char = exp.charCodeAt(i + 1);
        //>>>>>>>letra minuscula>>>>>>>>>>>>>>>>>>letra maiuscula>>>>>>>>>>>>>>>>>numero>>>>>>>>>>>>>>>>>>>>>>>>>underscore>>>>>>dois pontos
        while (((char > 96 && char < 123) || (char > 64 && char < 91) || (char > 47 && char < 58) || char == 95 /*|| char == 58*/) && i < l) {
          storedText += exp[i + 1];
          char = exp.charCodeAt(++i + 1);
        }

        //se for função
        if (char == 40) {

          this.setMode(PM.call);
          this.scope.push(new CallVal(storedText));
          i++;

        } else /*se for object*/if (char === 46) {
          obj ?
            obj.push(storedText) :
            (obj = [storedText]);
          //um passo para frente para passar o ponto
          //um passo para passar o primeiro caracter
          storedText = exp[i += 2];
        } else if (obj) {
          obj.push(storedText);
          this.setStored(new ObjectVal(obj));
          this.setMode(PM.object);
          obj = null;
        } else /*se for variavel*/ {
          this.setStored(storedText in consts? new ConstVal(storedText): new VarVal(storedText));
          this.setMode(PM.variable);
        }
      } while (obj);
    } else throw `invalid expression character found '${exp[i]}'`;
    return i;
  }
  parseDic() {

  }
  isCall(exp: string, i: number) {
    for (let l = exp.length - 3; i < l; i++) {
      if (exp[i] == '(')
        return false;

      if (exp[i] == ')')
        return exp[i + 1] == '=' && exp[i + 2] == '>';
    }
    return false;
  }
  parseNumb(exp: String, i: number) {
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
  parseVar(exp: string, i: number) {

    let r = '';
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>letra minuscula>>>>>>>>>>>>>>letra maiuscula>>>>>>>>>>>>>numero>>>>>>>>>>>>>>>>>>>>>>underscore
    for (let char = exp.charCodeAt(i); i < exp.length && ((char > 96 && char < 123) || (char > 64 && char < 91) || (char > 47 && char < 58) || char == 95); char = exp.charCodeAt(++i)) {
      r += exp[i];
    }
    return r;
  }
  error(error: string, index?: number) {
    throw {
      expression: this.expression,
      index: index,
      error: error
    };
  }
  jumpSpace(exp: string, i: number) {
    while (exp[i] == ' ')
      i++;
    return i;
  }
  parse(): Val {
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
            this.setMode(PM.sum);
          } else {
            this.setMode(PM.plus);
            scope.push(new SignalVal(Signals.plus));
          }
          break;

        //-
        case 45:
          if (this.stored) {
            this.appendOp(new SubOp());
            this.setMode(PM.sub);
            //scope.push(new SubOpExpression(getStored()));
          } else {
            this.setMode(PM.minus);
            scope.push(new SignalVal(Signals.Minus));
          }
          break;

        //*
        case 42:
          this.appendOp(new TimeOp());
          this.setMode(PM.time);
          break;

        // /
        case 47:
          this.appendOp(new DivOp());
          this.setMode(PM.div);
          break;


        //!
        case 33:
          if (this.stored) {
            throw "invalid expression";
          } else {
            this.setMode(PM.not);
            scope.push(new SignalVal(Signals.Not));
          }
          break;
        //||
        case 124:
          if (exp.charCodeAt(i + 1) === 124) {
            i++;
            this.appendOp(new OrOp());
            this.setMode(PM.or);
          } else throw "operator not found knowed";

          break;

        // &
        case 38:
          if (exp.charCodeAt(i + 1) === 38) {
            i++;
            this.appendOp(new AndOp());
            this.setMode(PM.and);
          } else {
            this.appendOp(new ConcatOp());
            this.setMode(PM.concat);
          }
          break;
        // {
        case 123: {
          //struct {p1:val1;p2:val2;p3:val3}
          let dic: Dic<Val> = {};

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
          this.setMode(PM.dic);
        } break;
        // }
        case 125:
          if (this.options.sub) {
            this.end = i - 1;
            i = exp.length;
          } else this.error('mas fim que inicio', i);
          break;
        // ?
        case 63: {
          if (exp.charCodeAt(i + 1) === 63) {
            i++;
            this.appendOp(new NulledOp());
            this.setMode(PM.or);
          } else {
            this.appendOp(new TernaryOp());
            this.setMode(PM.Ter1);
          }
        } break;
        // :
        case 58: {
          this.setMode(PM.Ter2);
          let
            stored = this.popStored(),
            before = scope[scope.length - 1];

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
        } break;
        // ( 
        case 40:
          if (this.isCall(exp, i + 1)) {
            let args: string[] = [];

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
            this.setMode(PM.fn);

            i = body.end || exp.length;

          } else {
            this.setMode(PM.open);
            scope.push(new GroupVal());
          }
          break;

        // )
        case 41: {
          let lastScope = scope.pop();

          //so adiciona o ultimo valor guardado se o ultimo scopo for fn mas o ultimo escopo não é o ultimo item inserido
          //para evitar funcões(fn) sem parametro
          if (!has(this.mode, PM.open)) {
            if (lastScope)
              lastScope.push(this.popStored());
            else if (this.options.sub) {
              this.end = i - 1;
              i = exp.length;
              break;
            } else this.error('mas fim que inicio', i);
          }
          //if (lastScope instanceof FnVal) {

          //  //se for so um grupo
          //} else lastScope.push(this.getStored());

          //o modo é posto depois para a fn poder checar o modo
          this.setMode(PM.close);

          while (!(lastScope instanceof CallVal) && !(lastScope instanceof GroupVal)) {
            let temp1 = lastScope;

            if (!scope.length)
              if (this.options.sub) {
                this.end = i - 1;
                i = exp.length;
                break;
              } else this.error('mas fim que inicio', i);

            (lastScope = scope.pop()).push(temp1);
          }
          this.setStored(lastScope);
        } break;
        // ,
        case 44:
        // ;
        case 59: {
          //func(2+3*4,...;func(4,
          this.setMode(PM.coma);
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
              } else this.error('mas fim que inicio', i);

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

        } break;
        // <
        case 60:
          switch (exp.charCodeAt(i + 1)) {
            case 61:
              i++;
              this.appendOp(new LesEqualOp());
              this.setMode(PM.lessEqual);
              break;
            case 62:
              i++;
              this.appendOp(new DifOp());
              this.setMode(PM.diferent);
              break;
            default:
              this.appendOp(new LessOp());
              this.setMode(PM.less);
          }
          break;

        // =
        case 61:
          this.appendOp(new EqualOp());
          this.setMode(PM.equal);
          break;

        // >
        case 62:
          if (exp.charCodeAt(i + 1) === 61) {
            i++;
            this.appendOp(new GreaterEqualOp());
          } else this.appendOp(new GreaterOp());
          this.setMode(PM.greater);
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
          this.setMode(PM.power);

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
      else throw "invalid expression";
    }
    //se o ultimo scope não for op
    if (scope.length && !(scope[0] instanceof OpVal))
      throw "invalid expression";

    if (this.mode == PM.begin || this.mode == PM.signal || this.mode == PM.op)
      throw "invalid expression";
    //return i;

    return scope[0] || this.stored;
  }
}

export function parse(exp: Expression, options?: ParseOptions): IValue {
  if (exp && typeof exp == "string")
    exp = new Parser(exp, options).parse()

  return <IValue>exp;
}

export interface CalcOptions {
  vars?: Dic<unknown> | ((name: string, obj?: boolean) => unknown)
  funcs?: Dic<(this: this, ...params: unknown[]) => unknown> | ((name: string, params: unknown[]) => any);
  object?: boolean;
  try?: boolean;
  optional?: boolean;
  uncase?: boolean;
}
export interface DicCalcOptions extends CalcOptions {
  vars?: Dic<unknown>;
}

export default function calc(exp: Expression, options: CalcOptions) {
  if (!exp) return null;
  if (typeof exp === 'string') {

    if (options.optional)
      if (exp[0] == '=')
        exp = exp.substring(1);
      else return <unknown>exp;

    exp = parse(exp);
  }
  return exp.calc(options);//[, ]//;
}

export function calcAll(expressions: Dic<Expression>, options: CalcOptions): Dic<unknown> {
  var result: Dic<unknown> = {};
  for (let key in expressions)
    result[key] = calc(expressions[key], options);
  return result;
}

export interface Parameter {
  range?: boolean;
  type: DataTypes | DataTypes[];
  name: string;
}
type Calc = (this: CalcOptions, ...args: unknown[]) => unknown;
export interface Formula {
  type?: DataTypes;
  /**se não tiver um grupo vai para o miscelenius(variado) */
  group?: string;
  args?: Parameter[];
  varargs?: Parameter;
  calc: Calc;
}
const formulas: Dic<Formula> = {};
export function addFormulas(values: Dic<Formula | Calc>) {
  for (let k in values) {
    let calc = values[k];
    if (isF(calc))
      values[k] = { calc };
  }
  Object.assign(formulas, values);
}
