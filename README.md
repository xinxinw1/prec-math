# Perfectly Precise Math Library

An arbitrary precision math library that works in both web js and Node.js.

## How to use in HTML

1. Go to https://github.com/xinxinw1/tools/releases and download the latest release.
2. Go to https://github.com/xinxinw1/prec-math/releases and download the latest release.
3. Extract `tools.js` from the first download and `prec-math.js` from the second download into your project directory.
4. Add
   
   ```html
   <script src="tools.js"></script>
   <script src="prec-math.js"></script>
   ```
   
   to your html file.
5. Run `$.al(R.mul("28357328497389579234", "81659102395873434265"));` to make sure it works. (Should output 2315633991441755403248652686986908053010)

See http://xinxinw1.github.io/prec-math/ for a demo.

## How to use in Node.js

1. Go to https://github.com/xinxinw1/tools/releases and download the latest release.
2. Go to https://github.com/xinxinw1/prec-math/releases and download the latest release.
3. Extract `tools.js` from the first download and `prec-math.js` from the second download into your project directory.
4. Run `$ = require("./tools.js")` in node.
5. Run `R = require("./prec-math.js")` in node
6. Run `$.prn(R.mul("28357328497389579234", "81659102395873434265"));` to make sure it works. (Should output 2315633991441755403248652686986908053010 and return undefined)

## Function reference

```
Note: There are a couple of functions that exist, but haven't been
  documented yet

Note 2: These are all accessed by R.<insert name>

Conventions: a and b are almost always regular real numbers like
  "4.5" and "-234", n is always a real integer like "5", and p is always a
  js integer like 456

### Default precision

gprec(p)          get current precision
sprec(p)          set current precision

### Real number functions

#### Converters

real(a)           ensure a is a proper real number (could have been a regular
                    js number or a string number like "0002234.53000");
                    returns false if a is not a proper number
realint(a)        ensure a is a real integer;
                    returns false if a is not an integer

#### Validators

vldp(a)           is a a valid real number?

#### Canonicalizers

trim(a)           trim unnecessary parts of a ("00.3400" -> "0.34")

#### is... functions (Predicates)

posp(a)           is a >= 0  (a[0] != '-')
negp(a)           is a < 0  (a[0] == '-')
intp(a)           is a an integer  (a.indexOf(".") == -1)
decp(a)           is a not an integer  (a.indexOf(".") != -1)
evenp(a)           is a even
oddp(a)           is a odd
div5p(a)          is a divisible by 5

#### Processing functions

posdot(a)         get position of dot in a
remdot(a)         remove the dot in a if it exists
intlen(a)         length of integer portion of a
declen(a)         length of decimal portion of a
intpt(a)          get integer section of a (like trunc(a))
decpt(a)          get decimal section of a
sign(a)           negp(a)?"-":""
remneg(a)         remove the negative sign without checks

pad(a, b)         pad a and b with zeros until they are the same length
                    and the decimal is in the same position in each
zero(a, p)        rnd(a, p) == "0"  (rnd is round)
diff(a, b, p)     zero(sub(a, b), p)

siz(a)            flr(log(abs(a)))+1   (flr is floor)
                    this and nsiz(a) are used to quickly approximate log(a)
                    for handling precision
nsiz(a)           flr(log(abs(a)))
chke(a)           check for javascript overflow and convert these js floating
                    point numbers back to real numbers

#### Floating point

num2flt(a)        convert a to a floating point format
flt2num(a)        convert a back to a regular number

#### Dot movers

left(a, n)        move the decimal left n times in a (like a*10^n)
right(a, n)       move the decimal right n times in a (like a/10^n)

#### Comparison functions

gt(a, b)          a > b
lt(a, b)          a < b
ge(a, b)          a >= b
le(a, b)          a <= b

#### Basic operation functions

add(a, b, p)      a + b; if p is given, round the result to p decimal places;
                    note that p must be a js integer
sub(a, b, p)      a - b
mul(a, b, p)      a * b
div(a, b, p)      a / b

#### Rounding functions

rnd(a, p)         round a to p decimal places; p can be negative and -Infinity
cei(a, p)         ceiling of a at p decimal places
flr(a, p)         floor of a
trn(a, p)         truncate a

round(a, p)       aliases of the functions above
ceil(a, p)
floor(a, p)
trunc(a, p)

#### Extended operation functions

exp(a, p)         e^a rounded to p decimals
ln(a, p)          natural log of a
pow(a, b, p)      a^b
sqrt(a, p)        square root

fact(a, p)        a! factorial
bin(n, k, p)      binomial coefficient
agm(a, b, p)      arithmetic geometric mean

sin(a, p)         sine function
cos(a, p)         cosine
atan(a, p)        arctangent
atan2(a, b, p)    2 argument atan http://en.wikipedia.org/wiki/Atan2
sinh(a, p)        hyperbolic sine
cosh(a, p)        hyperbolic cosine

#### Other operation functions

abs(a)            absolute value
neg(a)            -a  negate a

#### Mathematical constants

pi(p)             pi to p decimal places
e(p)              Euler's number e to p decimal places
phi(p)            the golden ratio to p decimal places
ln2(p)            ln(2) to p decimals
ln5(p)            ln(5) to p decimals
ln10(p)           ln(10) to p decimals

#### Special operation functions

qar(a, b)         quotient and remainder from dividing a by b
                    (uses Euclidean definition of remainder)
                    http://en.wikipedia.org/wiki/Modulo_operation
mulran(n, m)      multiply all integers between n and m inclusive
frac(a, b, p)     continued fraction; a and b are functions so that the
                    fraction is a(0) + b(1)/(a(1) + b(2)/(a(2) + ...))
                    it uses as many terms as needed to get p decimals;
                    if a(n) or b(n) === null, then the fraction terminates;
                    (eg. if a(2) is null, frac(a, b, p) -> a(0) + b(1)/a(1) );
                    after each call to frac or sfrac, the final n, pn, and qn
                    are stored in R.frac.n, R.frac.pn, R.frac.qn and
                    analogously for R.sfrac
sfrac(a, p)       simple continued fraction; all bn equal 1;
                    a(0) + 1/(a(1) + 1/(a(2) + ...));
                    a(n) can be null like in frac() and
                    the final n, pn, and qn are stored as well

### Logging

logfn(f)          set logger callback; takes a function(subj, data);
                    currently nothing is actually logged in prec-math, but
                    use this if you want to catch future logged items

```


