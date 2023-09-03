
jcalc is an expression evaluater library with similar sintax to excel

## basic usage

```js
import calc from "jcalc";

//simple expression
calc("(1+2)^2") //-> 9

//fornecing variables
calc("a+b*c",{vars:{a:1,b:2,c:3}}) //-> 7

//fornecing formulas
calc("upper('hello')",{fn:{upper:v=>v.toUpperCase()}}) //-> "HELLO"

//string concat 
calc("'hello '&w&'!'",{ vars:{w:"World"}}) // -> "hello world!"

// when concat null and undefined will result empty string
calc("fname&' '&lname",{ vars:{fname:"Asriel"}}) // -> "Asriel "

```
## install

### with npm

` npm i jcalc `

### with yarn

` yarn install jcalc `

## global formulas

```js
import calc, { addFormulas } from "jcalc";
addFormulas({
    sum:(a,b)=>a+b
});

calc("sum(1,2)") // -> 3
```
## define constant

```js
import calc, { consts } from "jcalc";

consts.PI = 3.14;
consts.E = 2.718;

calc("PI*2") // -> 6.28
calc("PI+E") // -> 5.858
```

## dynamic variables

here on `vars` options we pass a function that will be called for each variable found in the expression 
```js
import calc from "jcalc";

calc("a1-b1+a2-b2",{vars:v=>v[0]=="a"?2:1}) // -> 2-1+2-1 -> 2
```
## make variable and formulas uncase sensitive

if pass the option `uncase` all variable and formulas will be lower or upper depend what value been passed
```js
import calc from "jcalc";

calc("FirstName&' '&LastName",{
    vars:{ fistname:"Asriel", lastname:"Santos" },
    //l=all variable will be lower cased
    uncase: 'l'
});// -> fistname&' '&lastname -> 'Asriel Santos'

calc("x+y+z", {
    vars: { X:10, Y:20, Z:30 },
    //u=all variable will be upper cased
    uncase:'u'
});// -> X+Y+Z -> 60
```

## Excel Range

```js
import calc, { addFormulas } from "jcalc";

let vars = { A1:10, A7:12, A9:2, B10:20 };

addFormulas({
    SUM: v => v.reduce((a,b)=>a+b,0)
});

calc("SUM(A3:B12)",{ vars }) // -> SUM([A7,A9,B10]) -> SUM([12,2,20]) -> 34
```

## Function expression

```js
import calc, { addFormulas } from "jcalc";

addFormulas({
    map: fn => [1,2,3,4].reduce(fn)
});

calc("map((v)=>v*2)") // -> [2,4,6,8]
```

# Others utility

## vars

get all variables inside an expression
```js
import {parse} from "jcalc";

let exp = parse("'Users login is '&login&' and password is'&pw");
let vars = exp.vars() // -> ["login","pw"]

//if pw is in the expression throw an error
if(vars.includes("pw"))
    throw "can't access user's password";
```

## analize

```js
import { parse, analyze, Var } from "jcalc";

let exp = parse("(a+b+c+d)*2");

analyze(exp, v=>{
    //if found an variable change it src(value)
if(v instanceof Var)
    v.value+=1
})
console.log(exp) // -> (a1+b1+c1+d1)*2

if(vars.includes("pw"))
    throw "can't access user's password";
```