interface Dic<T = any> { [key: string]: T; }
type Check = (old: Val) => Val | void;

const isF = (v: unknown): v is Function => typeof v == "function";
const isS = (v: unknown): v is string => typeof v == "string";

const enum Error {
  /**call when a variable was not found */
  varNotFound = 10,
}

export interface IValue {// extends Iterable<IValue>
  // readonly op: string;
  valid(): boolean;
  calc(opts: CalcOptions): any;
  toString(): string;
  toJSON(): string;
  /**placeholder for render to the dom */
  render?(this: this): unknown;
  clone?(): IValue;
  vars(vars?: string[]): string[];
  translate(dir: TranslateDir): IValue;
  do?(check: Check): void;
}
class ParseError {
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
  // get op(): 'op' { return 'op'; }
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
  clone() {
    let r = new (this.constructor as any)() as OpVal;
    r.a = this.a.clone();
    r.b = this.b.clone();
    return r;
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
  do(check: Check) {
    let t = check(this.a);
    if (t)
      this.a = t;
    else this.a.do(check);

    if (t = check(this.b))
      this.b = t;
    else this.b.do(check);
  }
  // *[Symbol.iterator]() {
  //   yield this;
  //   yield* this.a;
  //   yield* this.b;
  // }
  static op: string;
}
export class Sum extends OpVal {
  get level() { return 4; }

  calc(opts: CalcOptions) {
    let
      a = this.a.calc(opts) as number | string,
      b = this.b.calc(opts) as number | string;
    if (opts.try) {
      if (!a) a = 0;
      if (!b) b = 0;
    }
    if (isS(a))
      a = parseFloat(a);
    if (isS(b))
      b = parseFloat(b);

    return a + b;
  }
  toJSON() {
    return this.a + '+' + this.b;
  }

  static /*override*/ op = '+';
}
export class Time extends OpVal {
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
export class Sub extends OpVal {
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
export class Div extends OpVal {
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
export class Eq extends OpVal {
  get level() { return 2; }

  calc(opts: CalcOptions) {
    return this.a.calc(opts) == this.b.calc(opts);
  }
  toJSON() {
    return this.a + '=' + this.b;
  }
  static /*override*/ op = '=';
}
export class And extends OpVal {
  get level() { return 1; }

  calc(opts: CalcOptions) {
    return this.a.calc(opts) && this.b.calc(opts);
  }
  toJSON() {
    return this.a + '&&' + this.b;
  }
  static /*override*/ op = '&&';
}
export class Concat extends OpVal {
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
// export type OpVal = | SumOp | TimeOp | SubOp | DivOp | EqualOp | AndOp | ConcatOp | LesEqualOp | DifOp | LessOp | OrOp | GreaterEqualOp | GreaterOp | PowOp | NulledOp;
export class Ternary extends OpVal {
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
  clone() {
    let r = new Ternary;
    r.a = this.a.clone();
    r.b = this.b.clone();
    r.c = this.c.clone();
    return r;
  }
  // *[Symbol.iterator]() {
  //   yield this;
  //   yield* this.a;
  //   yield* this.b;
  //   yield* this.c;
  // }
}

export class Pair implements IValue {
  //get op(): 'dic' { return 'dic'; }
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

    return new Pair(this.data);
  }
  toJSON(): string {
    return '';
  }

  do(check: Check) {
    for (let key in this.data) {
      let
        t = this.data[key],
        u = check(t);
      if (u)
        this.data[key] = u;
      else t.do(check);
    }
  }
  // *[Symbol.iterator]() {
  //   yield this;
  //   for (let k in this.data)
  //   yield* this.data[k];
  // }
  vars(vars?: string[]): string[] {
    for (let key in this.data)
      this.data[key].vars(vars);

    return vars;
  }
}
const enum Signals {
  plus = '+',
  Minus = '-',
  Not = '!'
}

export class SignalVal implements IScopeValue {
  //get op(): 'sig' { return 'sig'; }
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
  //    throw "invalid";
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
  do(check: Check) {
    let t = check(this.value);
    if (t)
      this.value = t;
    else this.value.do(check);
  }
  // *[Symbol.iterator]() {
  //   yield this;
  //   yield* this.value;
  // }
}

export class Group implements IScopeValue {
  //get op(): 'g' { return 'g'; }
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
  do(check: Check) {
    let t = check(this.value);
    if (t)
      this.value = t;
    else this.value.do(check);
  }
  clone() {
    let r = new Group();
    r.value = this.value.clone();
    return r;
  }
  vars(vars: string[] = []) {
    this.value.vars(vars);
    return vars;
  }
  translate(dir: TranslateDir) {
    let t = new Group();
    t.value = this.value.translate(dir)
    return t;
  }
  // *[Symbol.iterator]() {
  //   yield this;
  //   yield* this.value;
  // }
}
export class Fn implements IScopeValue {
  //get op(): 'fn' { return 'fn'; }

  render?(this: this): unknown;

  //args: string[] = [];
  //body: IValue;
  constructor(public args: string[], public body: Val) { }
  valid() { return !!this.body; }
  push(val: IValue): void {
    if (val instanceof Var)
      this.args.push(val.value);
    else throw null;
  }
  calc(opts: CalcOptions): Function {
    var t = this.args;
    return (...args: unknown[]) => {
      return this.body.calc({
        fn: opts.fn,
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
    return new Fn(this.args, this.body.translate(dir));
  }

  do(check: Check) {
    let t = check(this.body);
    if (t)
      this.body = t;
  }
  // *[Symbol.iterator]() {
  //   yield this;
  // }
}
function varcase(opts: GlobalOptions, fn: string) {
  switch (opts.uncase) {
    case "u":
      return fn.toUpperCase();
    case "l":
      return fn.toLowerCase();
    default:
      return fn;
  }
}
export class Call implements IScopeValue {
  //get op(): 'call' { return 'call'; }
  render?(this: this): unknown;
  constructor(public func: string, public args: Val[] = []) { }

  calc(opts: CalcOptions) {
    let args = this.args.map(a => a.calc(opts));
    let name = varcase(opts, this.func), f = isF(opts.fn);

    if (f) {
      let v = (opts.fn as Function)(name, args);
      if (v !== void 0)
        return v;
    }
    let fx = (!f && opts.fn) && opts.fn[name] || (name in formulas ? formulas[name].calc : null);

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
    let t = new Call($.translate(this.func, dir));
    t.args = this.args.map(a => a.translate(dir));
    return t;
  }
  do(check: Check) {
    for (let i = 0, a = this.args; i < a.length; i++) {
      let
        t = a[i],
        u = check(t);
      if (u)
        a[i] = u;
      else t.do(check);
    }
  }
  // *[Symbol.iterator]() {
  //   yield this;
  //   for (let t of this.args)
  //   yield* t;
  // }
}

type AcceptScopeVal = Group | Fn | Call | OpVal | SignalVal;
interface IValValue extends IValue {
  value: unknown;
}
export class Numb implements IValValue {
  //get op(): 'n' { return 'n'; }

  render?(this: this): unknown;
  constructor(public value: number) { }
  async calcAsync<T = any>(): Promise<T> {
    return this.value as any;
  }
  clone() { return new Numb(this.value); }
  valid() { return true; }
  calc<T = any>(): T {
    return this.value as any;
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return this.value + '';
  }
  vars(vars: string[] = []) {
    return vars;
  }
  do(_: Check) { }
  translate(dir: TranslateDir) { return this; }
  // *[Symbol.iterator]() {
  //   yield this;
  // }
}
export class Var implements IValValue {
  //get op(): 'v' { return 'v'; }
  render?(this: this): unknown;
  constructor(public value: string) { }

  clone() { return new Var(this.value); }
  valid() { return true; }
  calc(opts: CalcOptions) {
    let v = varcase(opts, this.value)
    return isF(opts.vars) ? opts.vars(v) : opts.vars[v];
  }
  toString() { return this.toJSON(); }
  toJSON() {
    return this.value;
  }
  vars(vars: string[] = []) {
    vars.includes(this.value) || vars.push(this.value);
    return vars;
  }
  translate(dir: TranslateDir) { return this; }

  do(_: Check) { }
  // *[Symbol.iterator]() {
  //   yield this;
  // }
}
export class Const implements IValValue {
  //get op(): 'c' { return 'c'; }
  render?(this: this): unknown;
  constructor(public value: any, public key: string) { }

  clone() { return new Const(this.value, this.key); }
  valid() { return true; }
  calc() { return this.value; }
  toString() { return this.key; }
  toJSON() { return this.key; }
  vars(vars: string[] = []) { return vars; }
  translate(dir: TranslateDir) { return this; }

  do(_: Check) { }
  // *[Symbol.iterator]() {
  //   yield this;
  // }
}
export class Text implements IValValue {
  //get op(): 't' { return 't'; }
  render?(this: this): unknown;
  constructor(public value: string, public char?: number) {
  }
  // static create(text: string) {
  //   return new Text(text, '"'.charCodeAt(0));
  // }
  // get char() { return String.fromCharCode(this.char); }
  clone() { return new Text(this.value, this.char); }
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

  do(_: Check) { }
  // *[Symbol.iterator]() {
  //   yield this;
  // }
}

export class Obj implements IValue {
  //get op(): 'o' { return 'o'; }
  render?(this: this): unknown;
  constructor(public levels: string[]) { }

  clone() { return new Obj(this.levels); }
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
    vars.includes(this.levels[0]) || vars.push(this.levels[0]);
    return vars;
  }
  translate(dir: TranslateDir) { return this; }

  do(_: Check) { }
  // *[Symbol.iterator]() {
  //   yield this;
  // }
}
function nToLetter(num: number) {
  num--;
  let letters = ''
  while (num >= 0) {
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters
    num = Math.floor(num / 26) - 1
  }
  return letters
}
export let letterToN = (v: string) => v.split('').reduce((r, a) => r * 26 + parseInt(a, 36) - 9, 0);
export class Range implements IValue {
  //get op(): 'r' { return 'r'; }
  render?(this: this): unknown;
  constructor(public h0: number, public v0: number, public h1: number, public v1: number,) {

  }
  valid() { return true; }
  calc(opts: CalcOptions) {
    let result = [];
    if (isF(opts.vars)) {
      throw "not implemented";
    } else {
      let vars = opts.vars;
      let { v0, v1, h0, h1 } = this;
      if (v1 < v0) [v1, v0] = [v0, v1];
      if (h1 < h0) [h1, h0] = [h0, h1];
      for (let h = v0; h <= v1; h++)
        for (let v = h0; v <= h1; v++) {
          let t = nToLetter(h) + v;
          if (t in vars) result.push(vars[t]);
        }
    }
    return result;
  }
  toString() { return this.toJSON(); }
  toJSON() {
    let { v0, v1, h0, h1 } = this;
    return `${nToLetter(h0)}${v0}:${nToLetter(h1)}${v1}`;
  }
  vars(): any {
    throw null;
  }
  translate(dir: TranslateDir) { return this; }

  do(_: Check) { }
  // *[Symbol.iterator]() {
  //   yield this;
  // }
}


//namespace _ {
//  function v(value: string) {
//  return new Var(value);
//  }
//  function t(value: string) {
//  return new Text(value);
//  }
//  function ob(...args: string[]) {
//  return new ObjectVal(args);
//  }
//  function call(fn: string, ...args: Val[]) {
//  return new CallVal(fn, args);
//  }
//}
type AllVal = Fn | Pair | OpVal | Group | SignalVal | SignalVal | Ternary | Call | Numb | Var | Obj | Text;
type Val = IValue; //

type TranslateDir = 1 | -1;
interface Settings {
  translate?(funcName: string, signal: TranslateDir): string;
}
const $: Settings = {}
export function analyze(val: Val, check: Check) {
  let t = check(val);
  if (t)
    return t;
  val.do(check);
  return val;
}
/** */
interface DataType {
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
type DataTypes = keyof DataType;


const enum ParseErrorType {

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
  range = variable | 64,


  signal = valueEnd * 2,
  not = signal | 1,
  plus = signal | 1,
  minus = signal | 2,
}

function has<T extends number>(value: T, check: T): boolean {
  return (value & check) === check;
}

interface ParseOptions {
  warn?: boolean;
  from?: number;
  /**if true when scope stop in middle of expression don't throw error */
  sub?: boolean;
  /**if should expect ranges in the expressions e.g:A3:D32 */
  range?: boolean;
  end?: number;
}
export function parse(exp: string, options: ParseOptions = {}): IValue {
  // parse(exp: string, options: ParseOptions): Val {
  let scope: Array<AcceptScopeVal> = [];
  let stored: Val;
  let mode: PM = PM.begin;
  let i = options.from || 0, l = exp.length;

  let setMode = (newMode: PM) => {
    if (has(newMode, PM.sep)) {
      if (!has(mode, PM.valueEnd))
        throw err(i);
    } else if (has(newMode, PM.signal)) {
      if (!has(mode, PM.begin) && !has(mode, PM.sep))
        throw err(i);
    } else if (has(newMode, PM.valueStart)) {
      if (has(mode, PM.valueEnd))
        throw err(i);
    } else if (has(newMode, PM.valueEnd)) {
      if (has(mode, PM.sep) || has(mode, PM.signal))
        throw err(i);
    }
    mode = newMode;
  }
  let parseNumb = () => {
    let r = '', char = exp.charCodeAt(i);
    //-
    if (char == 45) {
      r = '-';
      char = exp.charCodeAt(++i);
    }
    for (; i < l && ((char > 47 && char < 58) || char == 46); char = exp.charCodeAt(++i))
      r += exp[i];
    return r;
  }
  let jumpSpace = () => {
    while (exp[i] == ' ') i++;
    return i;
  }
  let parseVar = () => {
    let r = '';
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>letra minuscula>>>>>>>>>>>>>>letra maiuscula>>>>>>>>>>>>>numero>>>>>>>>>>>>>>>>>>>>>>underscore
    for (let char = exp.charCodeAt(i); i < l && ((char > 96 && char < 123) || (char > 64 && char < 91) || (char > 47 && char < 58) || char == 95); char = exp.charCodeAt(++i)) {
      r += exp[i];
    }
    return r;
  }
  let setStored = (value: Val) => {
    let s = scope, t = s[s.length - 1];
    if (t && t instanceof SignalVal) {
      s.pop();
      t.value = value;
      value = t;
    }
    stored = value;
  }
  let appendOp = (_new: OpVal) => {
    var
      s = scope,
      old = s[s.length - 1],
      stored = popStored();

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
  let popStored = () => {
    if (!stored)
      throw "invalid expression";
    var temp = stored;
    stored = null;
    return temp;
  }
  let error = (error?: string, index?: number) => {
    throw { exp, index, error };
  }
  let err = (i: number) => ({ index: i, exp: exp.slice(0, i + 1) });
  //let
  //  stored = this.stored,
  //  scope = scope;

  for (; i < l; i++) {
    let char = exp.charCodeAt(i);
    switch (char) {
      // space
      case 32:
        break;

      // +
      case 43:
        if (stored) {
          appendOp(new Sum());
          setMode(PM.sum);
        } else {
          setMode(PM.plus);
          scope.push(new SignalVal(Signals.plus));
        }
        break;

      //-
      case 45:
        if (stored) {
          appendOp(new Sub());
          setMode(PM.sub);
          //scope.push(new SubOpExpression(getStored()));
        } else {
          setMode(PM.minus);
          scope.push(new SignalVal(Signals.Minus));
        }
        break;

      //*
      case 42:
        appendOp(new Time());
        setMode(PM.time);
        break;

      // /
      case 47:
        appendOp(new Div());
        setMode(PM.div);
        break;
      case 33:
        if (stored) {
          throw "invalid expression";
        } else {
          setMode(PM.not);
          scope.push(new SignalVal(Signals.Not));
        }
        break;
      //||
      case 124:
        if (exp.charCodeAt(i + 1) === 124) {
          i++;
          appendOp(new OrOp());
          setMode(PM.or);
        } else throw "operator not found knowed";

        break;

      // &
      case 38:
        if (exp.charCodeAt(i + 1) === 38) {
          i++;
          appendOp(new And());
          setMode(PM.and);
        } else {
          appendOp(new Concat());
          setMode(PM.concat);
        }
        break;
      // {
      case 123: {
        //struct {p1:val1;p2:val2;p3:val3}
        let dic: Dic<Val> = {};

        jumpSpace();
        if (exp[++i] != '}')
          while (true) {

            //----------------------
            let temp = parseVar() || parseNumb();
            if (!temp.length)
              error('error parse', i);
            // i += temp.length;

            jumpSpace();

            //----------------------
            //se depois da var não vier dois ponto deve dar erro
            if (exp[i++] != ':')
              error('":" not found');

            //jumpSpace();

            //----------------------
            //não precisa chacar espaço antes e depois porque o parse vai filtrar isto
            let subOp: ParseOptions = { from: i, sub: true, warn: options.warn };
            dic[temp] = parse(exp, subOp);

            if (!(i = subOp.end))
              err(i);

            //----------------------
            // pula o ultima caracter da sub expression
            i++;
            //----------------------
            if (exp[i] == '}')
              break;

            //----------------------
            if (i == l)
              error('unexpected end');

            //----------------------
            if (exp[i] != ',')
              error('"," not found');

            i++;

            jumpSpace();
          }
        setStored(new Pair(dic));
        setMode(PM.dic);
      } break;
      // }
      case 125:
        if (options.sub) {
          options.end = i - 1;
          i = l;
        } else error('mas fim que inicio', i);
        break;
      // ?
      case 63: {
        if (exp.charCodeAt(i + 1) === 63) {
          i++;
          appendOp(new NulledOp());
          setMode(PM.or);
        } else {
          appendOp(new Ternary());
          setMode(PM.Ter1);
        }
      } break;
      // :
      case 58: {
        setMode(PM.Ter2);
        let stored = popStored();
        let before = scope[scope.length - 1];

        while (!(before instanceof Ternary)) {
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
      case 40: {
        let regex = /\(((?:\s*,?\s*(?:[a-zA-Z]\w*))*)?\s*\)=>/g;
        regex.lastIndex = i;
        let t0 = regex.exec(exp);
        if (t0 && t0.index == i) {
          let subOp: ParseOptions = { from: i + t0[0].length, sub: true, warn: options.warn };
          setStored(new Fn(t0[1] ? t0[1].split(',').map(v => v.trim()) : [], parse(exp, subOp)));
          setMode(PM.fn);

          i = subOp.end || l;

        } else {
          setMode(PM.open);
          scope.push(new Group());
        }

        // let isCall = () => {

        //   for (let l = eeel - 3; i < l; i++) {
        //     if (exp[i] == '(')
        //       return false;

        //     if (exp[i] == ')')
        //       return exp[i + 1] == '=' && exp[i + 2] == '>';
        //   }
        //   return false;
        // }
        // if (isCall(i + 1)) {

        // }
      }
        break;

      // )
      case 41: {
        let lastScope = scope.pop();

        //so adiciona o ultimo valor guardado se o ultimo scopo for fn mas o ultimo escopo não é o ultimo item inserido
        //para evitar funcões(fn) sem parametro
        if (!has(mode, PM.open)) {
          if (lastScope)
            lastScope.push(popStored());
          else if (options.sub) {
            options.end = i - 1;
            i = l;
            break;
          } else error('mas fim que inicio', i);
        }
        //if (lastScope instanceof FnVal) {

        //  //se for so um grupo
        //} else lastScope.push(this.getStored());

        //o modo é posto depois para a fn poder checar o modo
        setMode(PM.close);

        while (!(lastScope instanceof Call) && !(lastScope instanceof Group)) {
          let temp1 = lastScope;

          if (!scope.length)
            if (options.sub) {
              options.end = i - 1;
              i = l;
              break;
            } else error('mas fim que inicio', i);

          (lastScope = scope.pop()).push(temp1);
        }
        setStored(lastScope);
      } break;
      // ,
      case 44:
      // ;
      case 59: {
        //func(2+3*4,...;func(4,
        setMode(PM.coma);
        let before = scope[scope.length - 1];
        let stored = popStored();

        while (!(before instanceof Call)) {
          if (!before)
            if (options.sub) {
              options.end = i - 1;
              i = l;
              //adiciona denovo o stored para poder retornar no fim
              setStored(stored);
              break;
            } else error('mas fim que inicio', i);

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
            appendOp(new LesEqualOp());
            setMode(PM.lessEqual);
            break;
          case 62:
            i++;
            appendOp(new DifOp());
            setMode(PM.diferent);
            break;
          default:
            appendOp(new LessOp());
            setMode(PM.less);
        }
        break;

      // =
      case 61:
        appendOp(new Eq());
        setMode(PM.equal);
        break;

      // >
      case 62:
        if (exp.charCodeAt(i + 1) === 61) {
          i++;
          appendOp(new GreaterEqualOp());
        } else appendOp(new GreaterOp());
        setMode(PM.greater);
        break;
      // "
      case 34:
      // '
      case 39: {
        let txt = "";
        //para garantir que não é uma string vazia

        if (exp.charCodeAt(i + 1) != char) {
          let regex = char == 34 ? /[^"]"/g : /[^']'/g;
          regex.lastIndex = i + 1;
          let t = regex.exec(exp);
          if (!t) throw err(i);
          txt = exp.slice(i + 1, t.index + 1);
        }
        i += txt.length + 1;
        setMode(PM.string);
        setStored(new Text(txt, char));
        // letter = exp.charCodeAt(i + 1);
        // //check se a letra não é " se for checa a proxima letra 
        // while (letter != char || ((letter = exp.charCodeAt(++i + 1)) == char)) {
        //   //se chegar no final da expressão sem terminar a string
        //   if (Number.isNaN(letter))
        //   throw "error";
        //   temp1 += exp[i + 1];
        //   letter = exp.charCodeAt(++i + 1);
        // }
      } break;

      // ^
      case 94:
        appendOp(new PowOp());
        setMode(PM.power);

        break;
      // [
      case 91:
        break;

      // ]
      case 93:
        break;

      default:
        // i = this.parseVal(char, exp, i);
        {
          //se for numero ou ponto
          if ((char > 47 && char < 58) || char == 46) {
            let storedText = exp[i];
            char = exp.charCodeAt(i + 1);
            while (((char > 47 && char < 58) || char == 46) && i < l) {
              storedText += exp[i + 1];
              char = exp.charCodeAt(++i + 1);
            }
            let t = +storedText;
            if (isNaN(t)) throw err(i);
            setStored(new Numb(t));
            setMode(PM.number);
            //se for letra ou underscore
          } else {
            let regex = /[a-zA-Z_]\w*/g; regex.lastIndex = i;
            let t0 = regex.exec(exp);
            if (!t0 || t0.index != i) throw err(i);
            let t1 = t0[0];
            let t2 = exp[i += t1.length];
            switch (t2) {
              case "(":
                setMode(PM.call);
                scope.push(new Call(t1));
                break;
              case ".": {
                let obj = [t1];
                do {
                  t0 = regex.exec(exp)
                  if (!t0 || t0.index != i + 1) throw err(i);
                  obj.push(t0[0]);
                  if (exp[i += t0[0].length] != ".") break;
                } while (true);

                setStored(new Obj(obj));
                setMode(PM.object);
              } break;
              default:
                if (options.range && t2 == ":") {
                  let regex = /([A-Z]+)(\d+):([A-Z]+)(\d+)/g;
                  regex.lastIndex = i -= t1.length;
                  t0 = regex.exec(exp);
                  if (!t0 || t0.index != i) throw err(i);

                  setStored(new Range(letterToN(t0[1]), +t0[2], letterToN(t0[3]), +t0[4]));
                  setMode(PM.range);
                  i += t0[0].length;
                } else {
                  let t2 = varcase(options, t1);
                  setStored(t2 in consts ? new Const(consts[t2], t1) : new Var(t1));
                  setMode(PM.variable);
                  i--;
                }
            }
            // //   letra minuscula        letra maiuscula      underscore
            // //  (char > 96 && char < 123) || (char > 64 && char < 91) || char === 95
            // if () {
            //   let obj: string[];
            //   do {
            //   char = exp.charCodeAt(i + 1);
            //   //>>>>>>>letra minuscula>>>>>>>>>>>>>>>>>>letra maiuscula>>>>>>>>>>>>>>>>>numero>>>>>>>>>>>>>>>>>>>>>>>>>underscore>>>>>>dois pontos
            //   while (((char > 96 && char < 123) || (char > 64 && char < 91) || (char > 47 && char < 58) || char == 95 /*|| char == 58*/) && i < l) {
            //     storedText += exp[i + 1];
            //     char = exp.charCodeAt(++i + 1);
            //   }
            //   //se for função
            //   if (char == 40) {
            //   } else /*se for object*/if (char === 46) {
            //     obj ?
            //     obj.push(storedText) :
            //     (obj = [storedText]);
            //     //um passo para frente para passar o ponto
            //     //um passo para passar o primeiro caracter
            //     storedText = exp[i += 2];
            //   } else if (obj) {
            //     obj = null;
            //   } else /*se for variavel*/ {

            //   }
            //   } while (obj);
            // } else throw `invalid expression character found '${exp[i]}'`;
          }
          // return i;
        }
    }
  }

  if (stored && scope.length)
    scope[scope.length - 1].push(popStored());
  while (scope.length > 1) {
    let last = scope.pop();
    if (last instanceof OpVal)
      scope[scope.length - 1].push(last);
    else throw "invalid expression";
  }
  //se o ultimo scope não for op
  if (scope.length && !(scope[0] instanceof OpVal))
    throw "invalid expression";

  if (mode == PM.begin || mode == PM.signal || mode == PM.op)
    throw "invalid expression";
  //return i;

  return scope[0] || stored;
}

export interface GlobalOptions extends ParseOptions {
  object?: boolean;
  try?: boolean;
  /**@deprecated ??? */
  optional?: boolean;
  uncase?: "u" | "l";
}
interface CalcOptions extends GlobalOptions {
  vars?: Dic<unknown> | ((name: string, obj?: boolean) => unknown)
  fn?: Dic<(this: this, ...params: unknown[]) => unknown> | ((name: string, params: unknown[]) => any);
}
export const consts: Dic<unknown> = { null: null, false: false, true: true };
export const options: GlobalOptions = {}

export default function calc(exp: Expression, options: CalcOptions = {}) {
  if (!exp) return null;
  if (isS(exp)) {
    if (options.optional)
      if (exp[0] == '=')
        exp = exp.substring(1);
      else return <unknown>exp;

    exp = parse(exp, options);
  }
  return exp.calc(options);
}

function calcAll(expressions: Dic<Expression>, options: CalcOptions): Dic<unknown> {
  var result: Dic<unknown> = {};
  for (let key in expressions)
    result[key] = calc(expressions[key], options);
  return result;
}

interface Parameter {
  range?: boolean;
  type: DataTypes | DataTypes[];
  name: string;
}
type Calc = (this: CalcOptions, ...args: unknown[]) => unknown;
interface Formula {
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
