interface Dic<T = any> {
    [key: string]: T;
}
declare type Check = (old: Val) => Val | void;
export declare const enum Error {
    /**call when a variable was not found */
    varNotFound = 10
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
export declare class ParseError {
    start: number;
    length?: number;
    type: ParseErrorType;
    /**placeholder for render to the dom */
    render?(this: this): unknown;
}
interface IScopeValue extends IValue {
    push(val: Val): void;
}
export declare abstract class OpVal implements IScopeValue {
    get op(): 'op';
    a: Val;
    b: Val;
    readonly abstract level: number;
    abstract calc(opts: CalcOptions): any;
    abstract toJSON(): string;
    render?(this: this): unknown;
    valid(): boolean;
    push(expression: Val): void;
    toString(): string;
    vars(vars?: string[]): string[];
    translate(dir: TranslateDir): OpVal;
    analize(check: Check): void;
    [Symbol.iterator](): Generator<IValue | this, void, undefined>;
    static op: string;
}
export declare class SumOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): number;
    toJSON(): string;
    static op: string;
}
export declare class TimeOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): number;
    toJSON(): string;
    static op: string;
}
export declare class SubOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): number;
    toJSON(): string;
    static op: string;
}
export declare class DivOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): number;
    toJSON(): string;
    static op: string;
}
export declare class EqualOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): boolean;
    toJSON(): string;
    static op: string;
}
export declare class AndOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): any;
    toJSON(): string;
    static op: string;
}
export declare class ConcatOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): string;
    toJSON(): string;
    static op: string;
}
export declare class LesEqualOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): boolean;
    toJSON(): string;
    static op: string;
}
export declare class DifOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): boolean;
    toJSON(): string;
    static op: string;
}
export declare class LessOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): boolean;
    toJSON(): string;
    static op: string;
}
export declare class OrOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): any;
    toJSON(): string;
}
export declare class GreaterEqualOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): boolean;
    toJSON(): string;
    static op: string;
}
export declare class GreaterOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): boolean;
    toJSON(): string;
    static op: string;
}
export declare class PowOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): number;
    toJSON(): string;
}
export declare class NulledOp extends OpVal {
    get level(): number;
    calc(opts: CalcOptions): any;
    toJSON(): string;
}
export declare class TernaryOp extends OpVal {
    c: Val;
    get level(): number;
    calc(opts: CalcOptions): any;
    push(value: Val): void;
    valid(): boolean;
    render?(this: this): unknown;
    toJSON(): string;
    toString(): string;
    vars(vars?: string[]): string[];
    [Symbol.iterator](): Generator<IValue | this, void, undefined>;
}
export declare class DicVal implements IValue {
    data: Dic<Val>;
    get op(): 'dic';
    render?(this: this): unknown;
    constructor(data: Dic<Val>);
    calc(opts: CalcOptions): Dic<unknown>;
    toString(): string;
    valid(): boolean;
    translate(dir: TranslateDir): DicVal;
    toJSON(): string;
    analize(check: Check): void;
    [Symbol.iterator](): Generator<IValue | this, void, undefined>;
    vars(vars?: string[]): string[];
}
export declare const enum Signals {
    plus = "+",
    Minus = "-",
    Not = "!"
}
export declare class SignalVal implements IScopeValue {
    signal: Signals;
    get op(): 'sig';
    render?(this: this): unknown;
    value: Val;
    constructor(signal: Signals);
    calc(opts: CalcOptions): any;
    valid(): boolean;
    push(value: Val): void;
    toString(): string;
    toJSON(): string;
    vars(vars?: string[]): string[];
    translate(dir: TranslateDir): SignalVal;
    analize(check: Check): void;
    [Symbol.iterator](): Generator<IValue | this, void, undefined>;
}
export declare class GroupVal implements IScopeValue {
    get op(): 'g';
    render?(this: this): unknown;
    value?: Val;
    valid(): boolean;
    calc(opts: CalcOptions): any;
    push(value: Val): void;
    toString(): string;
    toJSON(): string;
    analize(check: Check): void;
    vars(vars?: string[]): string[];
    translate(dir: TranslateDir): GroupVal;
    [Symbol.iterator](): Generator<IValue | this, void, undefined>;
}
export declare class FnVal implements IScopeValue {
    args: string[];
    body: Val;
    get op(): 'fn';
    render?(this: this): unknown;
    constructor(args: string[], body: Val);
    valid(): boolean;
    push(val: IValue): void;
    calc(opts: CalcOptions): Function;
    toString(): string;
    toJSON(): string;
    vars(vars?: string[]): string[];
    translate(dir: TranslateDir): FnVal;
    analize(check: Check): void;
    [Symbol.iterator](): Generator<this, void, unknown>;
}
export declare class CallVal implements IScopeValue {
    func: string;
    args: Val[];
    get op(): 'call';
    render?(this: this): unknown;
    constructor(func: string, args?: Val[]);
    calc(opts: CalcOptions): any;
    valid(): boolean;
    push(expression: Val): void;
    toString(): string;
    toJSON(): string;
    vars(vars?: string[]): string[];
    translate(dir: TranslateDir): CallVal;
    analize(check: Check): void;
    [Symbol.iterator](): Generator<IValue | this, void, undefined>;
}
interface IValValue extends IValue {
    value: unknown;
}
export declare class NumbVal implements IValValue {
    get op(): 'n';
    render?(this: this): unknown;
    value: string;
    constructor(value: string);
    calcAsync<T = any>(): Promise<T>;
    valid(): boolean;
    calc<T = any>(): T;
    toString(): string;
    toJSON(): string;
    vars(vars?: string[]): string[];
    analize(_: Check): void;
    translate(dir: TranslateDir): this;
    [Symbol.iterator](): Generator<this, void, unknown>;
}
export declare class VarVal implements IValValue {
    value: string;
    get op(): 'v';
    render?(this: this): unknown;
    constructor(value: string);
    valid(): boolean;
    calc(opts: CalcOptions): unknown;
    toString(): string;
    toJSON(): string;
    vars(vars?: string[]): string[];
    translate(dir: TranslateDir): this;
    analize(_: Check): void;
    [Symbol.iterator](): Generator<this, void, unknown>;
}
export declare class TextValue implements IValValue {
    value: string;
    charCode?: number;
    get op(): 't';
    render?(this: this): unknown;
    constructor(value: string, charCode?: number);
    static create(text: string): TextValue;
    get char(): string;
    valid(): boolean;
    calc<T = any>(): T;
    toString(): string;
    toJSON(): string;
    vars(vars?: string[]): string[];
    translate(dir: TranslateDir): this;
    analize(_: Check): void;
    [Symbol.iterator](): Generator<this, void, unknown>;
}
export declare class ObjectVal implements IValue {
    levels: string[];
    get op(): 'o';
    render?(this: this): unknown;
    constructor(levels: string[]);
    valid(): boolean;
    calc(opts: CalcOptions): any;
    toString(): string;
    toJSON(): string;
    vars(vars?: string[]): string[];
    translate(dir: TranslateDir): this;
    analize(_: Check): void;
    [Symbol.iterator](): Generator<this, void, unknown>;
}
export declare type AllVal = FnVal | DicVal | OpVal | GroupVal | SignalVal | SignalVal | TernaryOp | CallVal | NumbVal | VarVal | ObjectVal | TextValue;
export declare type Val = IValue;
declare type TranslateDir = 1 | -1;
interface Settings {
    translate?(funcName: string, signal: TranslateDir): string;
}
export declare const $: Settings;
export declare function analize(val: Val, check: Check): IValue;
export declare function clone(val: Val): IValue;
/** */
export interface DataType {
    boolean: boolean;
    text: string;
    number: number;
    datetime: Date;
    date: Date;
    time: Date;
    object: Dic;
    array: Array<any>;
    objectArray: Array<Dic>;
    numberArray: Array<number>;
    textArray: Array<string>;
    boolArray: Array<boolean>;
    dateArray: Array<Date>;
    any: any;
}
export declare type Expression = IValue | string;
export declare type DataTypes = keyof DataType;
export declare const enum ParseErrorType {
}
export interface ParseOptions {
    warn?: boolean;
    from?: number;
    /**if true when scope stop in middle of expression don't throw error */
    sub?: boolean;
}
export declare function parse(exp: Expression, options?: ParseOptions): IValue;
export interface CalcOptions {
    vars?: Dic<unknown> | ((name: string, obj?: boolean) => unknown);
    funcs?: Dic<(this: this, ...params: unknown[]) => unknown> | ((name: string, params: unknown[]) => any);
    object?: boolean;
    try?: boolean;
    optional?: boolean;
    uncase?: boolean;
}
export interface DicCalcOptions extends CalcOptions {
    vars?: Dic<unknown>;
}
export default function calc(exp: Expression, options: CalcOptions): any;
export declare function calcAll(expressions: Dic<Expression>, options: CalcOptions): Dic<unknown>;
export declare function compileExpression(expression: string): IValue;
export interface Parameter {
    range?: boolean;
    type: DataTypes | DataTypes[];
    name: string;
}
declare type Calc = (this: CalcOptions, ...args: unknown[]) => unknown;
export interface Formula {
    type?: DataTypes;
    /**se não tiver um grupo vai para o miscelenius(variado) */
    group?: string;
    args?: Parameter[];
    varargs?: Parameter;
    calc: Calc;
}
export declare function addFormulas(values: Dic<Formula | Calc>): void;
export declare const enum QueryAlgorithm {
    word = 0,
    like = 1
}
export interface QueryOptions {
    type: QueryAlgorithm;
    fields?: string[];
    sub?: boolean;
    subfields?: boolean;
}
export declare function queryInObj(words: string[], obj: any, fields?: string[]): boolean;
export declare function query<T>(query: string, array: Array<T>, options: QueryOptions): T[];
export {};
