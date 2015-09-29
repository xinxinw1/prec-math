/***** Perfectly Precise Math Library 5.0 *****/

/* require tools 4.7.0 */

(function (udf){
  ////// Import //////
  
  var nodep = $.nodep;
  var inf = Infinity;
  var num = Number;
  var str = String;
  
  var udfp = $.udfp;
  var nump = $.nump;
  var strp = $.strp;
  
  var inp = $.inp;
  
  var len = $.len_;
  var pos = $.posStrStr;
  var sli = $.sliStr;
  var las = $.las_;
  var fst = $.fst_;
  
  var typ = $.T.typ;
  var dat = $.T.dat;
  var isa = $.T.isa;
  var tagp = $.T.tagp;
  
  var err = $.err;
  
  ////// Real number functions //////
  
  //// Converters ////
  
  // mknum("35.35") -> N(false, "3535", -2)
  // mknum("0.000012") -> N(false, "12", -6)
  // mknum("-352534000") -> N(true, "352534", 3)
  // mknum("") -> zero()
  function mknum(a){
    var dat = remdotStr(a);
    var neg = negpStr(a);
    if (neg)dat = sli(dat, 1);
    var exp = -declenStr(a);
    return chktrim(N(neg, dat, exp));
  }
  
  // a = positive js int
  function mknumint(a){
    return chktrimr(N(false, str(a), 0));
  }
  
  // tostr(mknum(a)) -> a
  function tostr(a){
    var b = rightStr(a.dat, a.exp);
    if (negp(a))return negStr(b);
    return b;
  }
  
  // real("35.35") -> N(false, "3535", -2)
  // real(35.35) -> N(false, "3535", -2)
  // real(N(false, "35", 2)) -> N(false, "35", 2)
  function real(a){
    if (realp(a))return chktrim(a);
    if (nump(a))return real(str(a));
    if (strp(a)){
      if (!vldpStr(a))return false;
      return mknum(a);
    }
    return false;
  }
  
  // realint
  function realint(a){
    if (realp(a)){
      a = chktrim(a);
      if (!intp(a))return false;
      return num(tostr(a));
    }
    if (nump(a))return realint(str(a));
    if (strp(a)){
      if (!vldpStr(a))return false;
      a = mknum(a);
      if (!intp(a))return false;
      return num(tostr(a));
    }
    return false;
  }
  
  //// Builders ////
  
  // N(true, "153453", -3) -> -153.453
  function N(neg, dat, exp){
    return {neg: neg, exp: exp, dat: dat, type: "real"};
  }
  
  function zero(){
    return N(false, "", 0);
  }
  
  function one(){
    return N(false, "1", 0);
  }
  
  function realp(a){
    return tagp(a) && isa("real", a);
  }
  
  ////// Default precision //////
  
  var prec = 16;
  
  function gprec(p){
    return prec;
  }
  
  function sprec(p){
    return prec = p;
  }
  
  ////// Real number functions //////
  
  //// Str Functions ////
  
  function negStr(a){
    if (a == "")return a;
    return "-" + a;
  }
  
  function leftStr(a, n){ // 32.44 -> 3.244
    if (n == 0 || a == "")return a;
    if (n < 0)return rightStr(a, -n);
    var alen = a.length;
    var zeros = n-alen;
    if (zeros >= 0){
      for (var i = zeros; i >= 1; i--)a = "0" + a;
      return "0." + a;
    }
    return sli(a, 0, alen-n) + "." + sli(a, alen-n, alen);
  }
  
  function rightStr(a, n){ // 32.44 -> 324.4
    if (n == 0 || a == "")return a;
    if (n < 0)return leftStr(a, -n);
    return rightInt(a, n);
  }
  
  function negpStr(a){
    return a[0] == '-';
  }
  
  function remdotStr(a){
    var dot = pos(".", a);
    if (dot == -1)return a;
    return sli(a, 0, dot) + sli(a, dot+1, len(a));
  }
  
  function declenStr(a){
    var dot = pos(".", a);
    if (dot == -1)return 0;
    return len(a)-1-dot;
  }
  
  function vldpStr(a){
    return strp(a) && /^-?[0-9]+(\.[0-9]+)?$/.test(a);
  }
  
  //// Int Functions ////
  
  function rightInt(a, n){ // 3244 -> 324400
    for (var i = n; i >= 1; i--)a += "0";
    return a;
  }
  
  function trimlInt(a){
    if (a[0] !== '0')return a;
    for (var i = 0; i < a.length; i++){
      if (a[i] !== '0')return sli(a, i);
    }
    return "";
  }
  
  function gtInt(a, b){ // is a > b ?
    if (len(a) !== len(b))return len(a) > len(b);
    for (var i = 0; i < len(a); i++){
      if (a[i] !== b[i])return num(a[i]) > num(b[i]);
    }
    err(gtInt, "Should never reach here");
  }
  
  function geInt(a, b){ // is a >= b ?
    return !gtInt(b, a); // !(b > a) == b <= a == a >= b
  }
  
  function addInt(a, b){
    if (b.length > a.length)return addInt(b, a); // so a always has greater length
    var small;
    var sum = "";
    var carry = 0;
    for (var i = a.length-1, j = b.length-1; i >= 0; i--, j--){
      small = num(a[i]) + ((j < 0)?0:num(b[j])) + carry;
      if (small >= 10){
        sum = (small-10) + sum;
        carry = 1;
      } else {
        sum = small + sum;
        carry = 0;
      }
    }
    if (carry == 1)sum = "1" + sum;
    return sum;
  }
  
  function add1Int(a){
    for (var i = a.length-1; i >= 0; i--){
      if (a[i] !== '9'){
        var sum = a.substring(0, i) + (num(a[i])+1);
        for (var j = a.length-1-i; j >= 1; j--)sum += "0";
        return sum;
      }
    }
    sum = "1";
    for (var i = a.length; i >= 1; i--)sum += "0";
    return sum;
  }
  
  function subInt(a, b){
    if (b.length > a.length)err(subInt, "Answer is negative for a = $1 and b = $2", a, b);
    var small;
    var diff = "";
    var borrow = 0;
    for (var i = a.length-1, j = b.length-1; i >= 0; i--, j--){
      small = 10 + num(a[i]) - ((j < 0)?0:num(b[j])) + borrow;
      if (small >= 10){
        diff = (small-10) + diff;
        borrow = 0;
      } else {
        diff = small + diff;
        borrow = -1;
      }
    }
    return trimlInt(diff);
  }
  
  // multiply two positive (non-zero) integers
  function mulInt(a, b){
    if (a.length <= 7 && b.length <= 7)return str(num(a)*num(b));
    if (a.length <= 200 || b.length <= 200)return mulLong(a, b);
    return mulKarat(a, b);
  }
  
  // long multiplication; for 8-200 digits
  function mulLong(a, b){
    if (b.length > a.length)return mulLong(b, a);
    
    var prod = "0";
    var curra, currb, curr, small, len, carry;
    for (var i = b.length; i > 0; i -= 7){
      currb = num(b.substring(i-7, i));
      if (currb == 0)continue;
      curr = ""; carry = 0;
      for (var f = (b.length-i)/7; f >= 1; f--)curr += "0000000";
      for (var j = a.length; j > 0; j -= 7){
        curra = num(a.substring(j-7, j));
        if (curra == 0){
          if (carry != 0){
            small = str(carry);
          } else {
            if (j-7 > 0)curr = "0000000" + curr;
            continue;
          }
        } else {
          small = str(currb * curra + carry);
        }
        len = small.length;
        if (len > 7){
          curr = small.substring(len-7, len) + curr;
          carry = num(small.substring(0, len-7));
        } else {
          curr = small + curr;
          if (j-7 > 0){
            for (var h = 7-len; h >= 1; h--)curr = "0" + curr;
          }
          carry = 0;
        }
      }
      if (carry != 0)curr = carry + curr;
      prod = addInt(prod, curr);
    }
    
    return prod;
  }
  
  // Karatsuba multiplication; for more than 200 digits
  // http://en.wikipedia.org/wiki/Karatsuba_algorithm
  function mulKarat(a, b){
    var alen = a.length;
    var blen = b.length;
    
    if (blen > alen)return mulKarat(b, a);
    
    // Math.min(alen, blen) = blen
    if (blen <= 200)return mulLong(a, b);
    
    if (alen != blen){
      /*
      a = a1*10^m + a0
      a*b = (a1*10^m + a0)*b
          = (a1*b)*10^m + a0*b
      */
      var m = (alen > 2*blen)?Math.ceil(alen/2):(alen-blen);
      var a1 = a.substring(0, alen-m);
      var a0 = trimlInt(a.substring(alen-m, alen));
      return addInt(rightInt(mulKarat(a1, b), m), mulKarat(a0, b));
    }
    
    /*
    a = a1*10^m + a0
    b = b1*10^m + b0
    
    a*b = (a1*10^m + a0)*(b1*10^m + b0)
        = (a1*b1)*10^(2*m) + (a1*b0 + a0*b1)*10^m + a0*b0
        = (a1*b1)*10^(2*m) + ((a1+a0)*(b1+b0) - a1*b1 - a0*b0)*10^m + a0*b0
        = z2*10^(2*m) + z1*10^m + z0
    */
    
    m = Math.ceil(alen/2);
    
    var a1 = a.substring(0, alen-m);
    var a0 = trimlInt(a.substring(alen-m, alen));
    var b1 = b.substring(0, blen-m);
    var b0 = trimlInt(b.substring(blen-m, blen));
    
    var z2 = mulKarat(a1, b1);
    var z0 = mulKarat(a0, b0);
    var z1 = subInt(subInt(mulKarat(addInt(a1, a0), addInt(b1, b0)), z2), z0);
    
    return addInt(addInt(rightInt(z2, 2*m), rightInt(z1, m)), z0);
  }
  
  // long division of positive (non-zero) integers a and b
  function divInt(a, b, p){
    if (udfp(p))p = prec;
    if (p == -inf)return zero();
    var quot = "";
    var curr = "";
    var exp = 0;
    var k, i;
    var arr = ["", b, addInt(b, b)];
    var alen = a.length;
    for (i = 0; i < alen+p+1; i++){
      if (i < alen){
        if (curr !== "" || a[i] !== '0')curr += a[i];
      } else {
        if (curr === "")break;
        curr += "0";
        if (i >= alen)exp--;
      }
      if (geInt(curr, b)){
        for (k = 2; geInt(curr, arr[k]); k++){
          if (k+1 == arr.length)arr[k+1] = addInt(arr[k], b);
        }
        quot += k-1;
        curr = subInt(curr, arr[k-1]); // might return ""
      } else {
        if (quot != "")quot += "0";
      }
    }
    if (quot === "")return zero();
    if (p < 0){
      for (var j = -p-1; j >= 1; j--)quot += "0";
    }
    return rnd(chktrimr(N(false, quot, exp)), p);
  }
  
  //// Predicates ////
  
  function zerop(a){
    return a.dat === "";
  }
  
  function negp(a){
    return a.neg;
  }
  
  function intp(a){
    return a.exp >= 0;
  }
  
  function decp(a){
    return !intp(a);
  }
  
  function evnp(a){
    if (a.exp < 0)return false;
    if (a.exp > 0)return true;
    return inp(las(a.dat), '0', '2', '4', '6', '8');
  }
  
  function oddp(a){
    if (a.exp < 0)return false;
    if (a.exp > 0)return false;
    return inp(las(a.dat), '1', '3', '5', '7', '9');
  }
  
  function div5p(a){
    if (a.exp < 0)return false;
    if (a.exp > 0)return true;
    return inp(las(a.dat), '0', '5');
  }
  
  //// Processing functions ////
  
  // needtrimr(N(true, "1530", 5)) -> true
  function needtrimr(a){
    return las(a.dat) === '0';
  }
  
  function needtriml(a){
    return fst(a.dat) === '0';
  }
  
  function trimr(a){
    var n = cntr("0", a.dat);
    return N(a.neg, sli(a.dat, 0, len(a.dat)-n), a.exp+n);
  }
  
  function triml(a){
    var n = cntl("0", a.dat);
    return N(a.neg, sli(a.dat, n), a.exp);
  }
  
  function chktrimr(a){
    if (needtrimr(a))return trimr(a);
    return a;
  }
  
  function chktriml(a){
    if (needtriml(a))return triml(a);
    return a;
  }
  
  function chktrim(a){
    return chktriml(chktrimr(a));
  }
  
  // count right
  function cntr(x, a){
    for (var i = len(a)-1; i >= 0; i--){
      if (a[i] !== x)return len(a)-1-i;
    }
    return 0;
  }
  
  function cntl(x, a){
    for (var i = 0; i < len(a); i++){
      if (a[i] !== x)return i;
    }
    return len(a);
  }
  
  function right(a, n){
    if (zerop(a))return a;
    return N(a.neg, a.dat, a.exp+n);
  }
  
  function left(a, n){
    return right(a, -n);
  }
  
  function wneg(a, neg){
    if (zerop(a))return a;
    return N(neg, a.dat, a.exp);
  }
  
  function matexp(a, b){ // match exponents
    if (a.exp > b.exp){
      var adat = a.dat;
      if (adat !== ""){
        for (var i = a.exp-b.exp; i >= 1; i--)adat += "0";
      }
      return [N(a.neg, adat, b.exp), b];
    }
    if (a.exp < b.exp){
      var arr = matexp(b, a);
      return [arr[1], arr[0]];
    }
    return [a, b];
  }
  
  /*function pad(a, b){
    var arr = matexp(a, b);
    a = arr[0]; b = arr[1];
    var adat = a.dat; var bdat = b.dat;
    var alen = len(adat); var blen = len(bdat);
    if (alen > blen){
      for (var i = alen-blen; i >= 1; i--)bdat = "0" + bdat;
      return [a, N(b.neg, bdat, b.exp)];
    } else if (blen > alen){
      for (var i = blen-alen; i >= 1; i--)adat = "0" + adat;
      return [N(a.neg, adat, a.exp), b];
    }
    return arr;
  }*/
  
  function siz(a){
    if (zerop(a))return -inf;
    return len(a.dat)+a.exp;
  }
  
  function nsiz(a){
    return siz(a)-1;
  }
  
  // number of sig figs in a
  function fig(a){
    return len(a.dat);
  }
  
  // input a = num(a);
  function chke(a){
    a = str(a);
    
    if (a == "Infinity")a = "1.7976931348623157e+308";
    else if (a == "-Infinity")a = "-1.7976931348623157e+308";
    
    var pos = a.indexOf("e");
    if (pos == -1)return mknum(a);
    
    var front = sli(a, 0, pos);
    var sign = a[pos+1];
    var back = num(sli(a, pos+2));
    
    if (sign == '+')return right(mknum(front), back);
    if (sign == '-')return left(mknum(front), back);
  }
  
  //// Sign functions ////
  
  function abs(a){
    return N(false, a.dat, a.exp);
  }
  
  function neg(a){
    if (zerop(a))return a;
    return N(!a.neg, a.dat, a.exp);
  }
  
  //// Comparison functions ////
  
  function is(a, b){
    return a.neg === b.neg && a.exp === b.exp && a.dat === b.dat;
  }
  
  function gt(a, b){ // is a > b ?
    if (is(a, b))return false;
    if (negp(a)){
      if (negp(b)){
        var c = neg(a);
        a = neg(b);
        b = c;
      } else {
        return false; // -5 > 3
      }
    } else if (negp(b))return true; // 5 > -10
    var arr = matexp(a, b);
    return gtInt(arr[0].dat, arr[1].dat);
  }
  
  function ge(a, b){ // is a >= b ?
    return !gt(b, a); // !(b > a) == b <= a == a >= b
  }
  
  function lt(a, b){ // is a < b ?
    return gt(b, a);
  }
  
  function le(a, b){ // is a >= b ?
    return !gt(a, b);
  }
  
  //// Basic operation functions ////
  
  function add(a, b, p){
    if (p == -inf)return zero();
    
    var sign = false;
    if (negp(a)){
      if (!negp(b))return sub(b, neg(a), p);
      sign = true;
      a = neg(a);
      b = neg(b);
    } else if (negp(b))return sub(a, neg(b), p);
    
    var arr = matexp(a, b);
    var sum = chktrimr(N(sign, addInt(arr[0].dat, arr[1].dat), arr[0].exp));
    return udfp(p)?sum:rnd(sum, p);
  }
  
  function sub(a, b, p){
    if (is(a, b))return zero();
    if (p == -inf)return zero();
    
    if (negp(a)){
      if (!negp(b))return add(a, neg(b), p);
      var c = a;
      a = neg(b);
      b = neg(c);
    } else if (negp(b))return add(a, neg(b), p);
    
    if (gt(b, a))return neg(sub(b, a, p));
    
    var arr = matexp(a, b);
    var diff = chktrimr(N(false, subInt(arr[0].dat, arr[1].dat), arr[0].exp));
    // cannot be zero here
    return udfp(p)?diff:rnd(diff, p);
  }
  
  function mul(a, b, p){
    if (zerop(a) || zerop(b))return zero();
    if (p == -inf)return zero();
    
    var sign = negp(a) != negp(b);
    if (negp(a))a = neg(a);
    if (negp(b))b = neg(b);
    
    var prod = chktrimr(N(sign, mulInt(a.dat, b.dat), a.exp+b.exp));
    return udfp(p)?prod:rnd(prod, p);
  }
  
  function div(a, b, p){
    if (zerop(b))err(div, "b cannot be 0");
    if (zerop(a))return a;
    if (udfp(p))p = prec;
    if (p == -inf)return zero();
    
    var sign = negp(a) != negp(b);
    if (negp(a))a = neg(a);
    if (negp(b))b = neg(b);
    // x-(a.exp-b.exp) = p --> x = p+a.exp-b.exp
    return wneg(right(divInt(a.dat, b.dat, p+a.exp-b.exp), a.exp-b.exp), sign);
  }
  
  //// Rounding functions ////
  
  function rndf(a, p, f){
    if (zerop(a))return a;
    if (p == -inf)return zero();
    if (udfp(p))p = 0;
    var pos = len(a.dat)+a.exp+p;
    if (pos < 0)return zero();
    if (pos >= len(a.dat))return a;
    var round = sli(a.dat, 0, pos);
    if (f(num(a.dat[pos])))round = add1Int(round);
    if (round === "")return zero();
    return chktrimr(N(a.neg, round, -p));
  }
  
  function rnd(a, p){
    return rndf(a, p, function (n){return n >= 5;});
  }
  
  function cei(a, p){
    if (negp(a))return neg(flr(neg(a), p));
    return rndf(a, p, function (n){return true;});
  }
  
  function flr(a, p){
    if (negp(a))return neg(cei(neg(a), p));
    return rndf(a, p, function (n){return false;});
  }
  
  function trn(a, p){
    return rndf(a, p, function (n){return false;});
  }
  
  //// Decimal functions ////
  
  // return sub(a, trn(a, p))
  // tostr(dec(mknum("23.45215", -1))) -> 3.45215
  // tostr(dec(mknum("23.45215", 0))) -> 0.45215
  // tostr(dec(mknum("23.45215", 1))) -> 0.05215
  function dec(a, p){
    if (p == -inf)return zero();
    if (udfp(p))p = 0;
    var pos = len(a.dat)+a.exp+p;
    if (pos < 0)return a;
    if (pos >= len(a.dat))return zero();
    var decimal = sli(a.dat, pos);
    if (decimal === "")return zero();
    return chktriml(N(a.neg, decimal, a.exp));
  }
  
  //// Extended operation functions ////
  
  function exp(a, p){
    if (zerop(a))return rnd(one(), p);
    if (p == udf)p = prec;
    if (p == -inf)return zero();
    
    if (negp(a))return div(one(), expPos(neg(a), p+2), p);
    return expPos(a, p);
  }
  
  // exp positive
  function expPos(a, p){
    if (intp(a))return expInt(a, p);
    
    var fl = trn(a);
    var d = dec(a);
    if (gt(d, mknum("0.5"))){
      d = sub(d, "1");
      fl = add(fl, "1");
    }
    
    if (zerop(fl))return expDec(a, p);
    var expfl = expInt(fl, p+2);
    return mul(expfl, expDec(a, p+2+siz(expfl)), p);
  }
  
  // a is a real obj
  function expInt(a, p){
    var an = num(tostr(a));
    if (an == 1)return e(p);
    return powDec(e(p+2+(an-1)*(siz(a)+1)), an, p);
  }
  
  function expDec(a, p){
    var d = dec(a);
    var dl = fig(d); // dec length
    if (dl <= 30)return expTaylorFrac(a, p);
    return expTaylorTerms(a, p);
  }
  
  // Taylor Series with big fraction
  function expTaylorFrac(a, p){
    if (decp(a))a = rnd(a, p+2);
    var frac1 = add(a, one());
    var frac2 = one();
    var pow = a;
    for (var i = 2; true; i++){
      frac1 = mul(frac1, mknumint(i));
      pow = mul(pow, a);
      frac1 = add(frac1, pow);
      frac2 = mul(frac2, mknumint(i));
      if (nsiz(frac2)-siz(pow)-2 >= p)break;
    }
    
    return div(frac1, frac2, p);
  }
  
  // Taylor Series adding term by term
  function expTaylorTerms(a, p){
    var ar = rnd(a, p+3);
    var pow = ar;
    var fact = one();
    var frac = one();
    var exp = add(ar, one());
    for (var i = 2; true; i++){
      pow = mul(pow, ar, p+3);
      fact = mul(fact, mknumint(i));
      frac = div(pow, fact, p+3);
      if (zero(frac, p+1))break;
      exp = add(exp, frac);
    }
    
    return rnd(exp, p);
  }
  
  ////// R object exposure //////
  
  var R = {
    mknum: mknum,
    mknumint: mknumint,
    tostr: tostr,
    real: real,
    realint: realint,
    
    num: N,
    zero: zero,
    one: one,
    realp: realp,
    
    gtInt: gtInt,
    addInt: addInt,
    add1Int: add1Int,
    subInt: subInt,
    mulInt: mulInt,
    divInt: divInt,
    
    trimr: trimr,
    triml: triml,
    matexp: matexp,
    siz: siz,
    nsiz: nsiz,
    fig: fig,
    chke: chke,
    
    is: is,
    
    gt: gt,
    ge: ge,
    lt: lt,
    le: le,
    
    add: add,
    sub: sub,
    mul: mul,
    div: div,
    
    rndf: rndf,
    rnd: rnd,
    cei: cei,
    flr: flr,
    trn: trn,
    
    dec: dec,
    
    exp: exp,
    expPos: expPos,
    expDec: expDec,
    expTaylorFrac: expTaylorFrac,
    expTaylorTerms: expTaylorTerms
  };
  
  if (nodep)module.exports = R;
  else window.R = R;
  
  ////// Speed tests //////
  
  function a(){
    
  }
  
  function b(){
    
  }
  
  //al("");
  //spd(a, b, 1);
  
  ////// Testing //////
  
  
  
})();
