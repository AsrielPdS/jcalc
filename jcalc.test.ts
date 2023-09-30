import { describe, it } from "node:test";
import calc, { Sum, Var, parse, Numb, Time, Text, Concat, IValue, OpVal, Const, Sub, Pair, Call, Fn, Obj, Range, letterToN, Group, Ternary } from "./jcalc.js";
import { deepStrictEqual, equal } from "assert";

function op(cl: { new(): OpVal }, a: IValue, b: IValue, c?: IValue) {
    let t = new cl();
    t.a = a;
    t.b = b;
    if (t instanceof Ternary) t.c = c;
    return t;
}
const /**'*/t1 = 39, /**"*/t2 = 34;
const n = (v: number) => new Numb(v);
const t = (v: string, _ = t1) => new Text(v, _);
const v = (v: string) => new Var(v);

describe("Parse Menbers", { timeout: 1_000 }, () => {
    it("1321", () => { deepStrictEqual(parse("1321"), n(1321)); })
    it("132.41", () => { deepStrictEqual(parse("132.41"), n(132.41)); })
    it("true", () => { deepStrictEqual(parse("true"), new Const(true, "true")); })
    it("'texto'", () => { deepStrictEqual(parse("'texto'"), t('texto', t1)); })
    it("''", () => { deepStrictEqual(parse("''"), t('', t1)); })
    it("var", () => { deepStrictEqual(parse("var"), v("var")); });
    it("object.var", () => { deepStrictEqual(parse("obj.var"), new Obj(["obj", "var"])); });
    it("A1:A23", () => { deepStrictEqual(parse("A1:A23", { range: true }), new Range(letterToN("A"), 1, letterToN("A"), 23)) })
    it("{a:1,b:2}", () => { deepStrictEqual(parse("{a:1,b:2}"), new Pair({ a: n(1), b: n(2) })); });
    it("(a)=>a", () => { deepStrictEqual(parse("(a)=>a"), new Fn(["a"], v("a"))); });
    it("()=>1", () => { deepStrictEqual(parse("()=>1"), new Fn([], n(1))); });
    it("( a1, b2,c3  )=>a1", () => { deepStrictEqual(parse("( a1, b2,c3  )=>a1"), new Fn(["a1", "b2", "c3"], v("a1"))); });
    it("(32)", () => { deepStrictEqual(parse("(23)"), Object.assign(new Group(), { value: n(23) })); });
});
describe("Parse Operators", { timeout: 1_000 }, () => {
    it("1+1", () => { deepStrictEqual(parse("1+1"), op(Sum, n(1), n(1))); })
    it("1+1*2", () => { deepStrictEqual(parse("1+1*2"), op(Sum, n(1), op(Time, n(1), n(2)))); })
    it("a-2", () => { deepStrictEqual(parse("a-2"), op(Sub, v("a"), n(2))); })
    it("452.2*var", () => { deepStrictEqual(parse("452.2*var"), op(Time, n(452.2), v("var"))); })
    it("a&b", () => { deepStrictEqual(parse("a&b"), op(Concat, v("a"), v("b"))); })
    it("a&'b'", () => { deepStrictEqual(parse("a&'b'"), op(Concat, v("a"), t("b"))); })
    it("'a'&b", () => { deepStrictEqual(parse("'a'&b"), op(Concat, t("a"), v("b"))); })
    it("(a)=>a+1", () => { deepStrictEqual(parse("(a)=>a+1"), new Fn(["a"], op(Sum, v("a"), n(1)))); });
    it("a+b+c", () => { deepStrictEqual(parse("a+b+c"), op(Sum, op(Sum, v("a"), v("b")), v("c"))); });
    it("var?1:2", () => { deepStrictEqual(parse("var?1:2"), op(Ternary, v("var"), n(1), n(2))); });
    it("var1?1:(var2?2:3)", () => { deepStrictEqual(parse("var1?1:(var2?2:3)"), op(Ternary, v("var1"), n(1), Object.assign(new Group(), { value: op(Ternary, v("var2"), n(2), n(3)) }))); });
    // let ter1=parse("var1?1:var2?2:3")
    it("var1?1:var2?2:3", () => { deepStrictEqual(parse("var1?1:var2?2:3"), op(Ternary, v("var1"), n(1), op(Ternary, v("var2"), n(2), n(3)))); });
    // let ter2=parse("var1?var2?1:2:3")
    it("var1?var2?1:2:3", () => { deepStrictEqual(parse("var1?var2?1:2:3"), op(Ternary, v("var1"), op(Ternary, v("var2"), n(1), n(2)), n(3))); });
});
describe("Calc", { timeout: 1_000 }, () => {
    it("1+1", () => { equal(calc("1+1"), 2) });
    it("1+2-3+4", () => { equal(calc("1+2-3+4"), 4) })
});
describe("Variables", { timeout: 1_000 }, () => {
    it("a+b+c+1", () => { deepStrictEqual(parse("a+b+c+1").vars(), ["a", "b", "c"]) })
});
describe("Ranges", { timeout: 1_000 }, () => {
    it("A1:B23", () => { deepStrictEqual(calc("A1:B23", { range: true, vars: { A1: 1, A2: 2 } }), [1, 2]) })
});