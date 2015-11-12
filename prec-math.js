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
  
  var out = $.out;
  var al = $.al;

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
  
  function mknumnull(a){
    if (a === null)return null;
    return mknum(a);
  }

  // a = js int
  function mknumint(a){
    if (a === 0)return zero();
    if (a < 0)return chktrimr(N(true, str(-a), 0));
    return chktrimr(N(false, str(a), 0));
  }

  // tostr(mknum(a)) -> a
  function tostr(a){
    var b = rightStr(a.dat, a.exp);
    if (negp(a))return negStr(b);
    return b;
  }
  
  function tonum(a){
    return num(tostr(a));
  }
  
  function mkstr(a){
    if (a === 0)return "";
    return str(a);
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
      return tonum(a);
    }
    if (nump(a))return realint(str(a));
    if (strp(a)){
      if (!vldpStr(a))return false;
      a = mknum(a);
      if (!intp(a))return false;
      return tonum(a);
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
  
  function two(){
    return N(false, "2", 0);
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
    if (a === b)return false;
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
  function divIntTrn(a, b, p){
    if (udfp(p))p = prec;
    if (p == -inf)return zero();
    var quot = "";
    var curr = "";
    var exp = 0;
    var k, i;
    var arr = ["", b, addInt(b, b)];
    var alen = a.length;
    for (i = 0; i < alen+p; i++){
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
    for (var j = -p; j >= 1; j--)quot += "0";
    return chktrimr(N(false, quot, exp));
  }
  
  function divInt(a, b, p){
    if (udfp(p))p = prec;
    return rnd(divIntTrn(a, b, p+1), p);
  }

  //// Predicates ////

  function zerop(a){
    return a.dat === "";
  }
  
  function onep(a){
    return is(a, one());
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
    if (n === len(a.dat))err(trimr, "Something happened");
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
    return len(a);
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
  
  function declen(a){
    return Math.max(0, -a.exp);
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

  // return rnd(a, p) === 0
  function byzero(a, p){
    if (zerop(a))return true;
    if (p == -inf)return true;
    if (udfp(p))p = 0;
    var pos = len(a.dat)+a.exp+p;
    if (pos < 0)return true;
    if (pos > 0)return false;
    return num(a.dat[pos]) < 5;
  }
  
  // hash simple (ie. no resume)
  // f(p) -> <real 35.25352>
  function hashs(f){
    //  h = [p, dat]
    var h = {p: -1, dat: udf};
    
    function run(p){
      if (p == udf)p = prec;
      if (p == -inf)return zero();
      if (p <= h.p)return rnd(h.dat, p);
      h.p = p;
      h.dat = f(p);
      return h.dat;
    }
    
    return {h: h, run: run};
  }
  
  // hashp = hash over precisions
  // hashp(fResume)(p) -> fResume(p).dat
  // fResume(p, o) -> {dat: <real 3>, p: 50, ...}
  function hashp(fResume){
    var h = [];
    
    function run(p){
      if (p == udf)p = prec;
      if (p == -inf)return zero();
      if (udfp(h[0])){
        h[0] = fResume(p);
      } else {
        if (p <= h[0].p)return rnd(h[0].dat, p);
        h[0] = fResume(p, h[0]);
      }
      return h[0].dat;
    }
    
    return {h: h, run: run};
  }
  
  // hash over a and p
  // mkFResume(a)(p, o) -> o = {dat: <real 3>, p: 50, ...}
  function hasha(mkFResume){
    var h = {};
    
    function run(a, p){
      var d = a.dat;
      if (udfp(h[d]))h[d] = hashp(mkFResume(a));
      return h[d].run(p);
    }
    
    return {h: h, run: run};
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
  
  function divTrn(a, b, p){
    if (zerop(b))err(div, "b cannot be 0");
    if (zerop(a))return a;
    if (udfp(p))p = prec;
    if (p == -inf)return zero();

    var sign = negp(a) != negp(b);
    if (negp(a))a = neg(a);
    if (negp(b))b = neg(b);
    // x-(a.exp-b.exp) = p --> x = p+a.exp-b.exp
    return wneg(right(divIntTrn(a.dat, b.dat, p+a.exp-b.exp), a.exp-b.exp), sign);
  }

  function div(a, b, p){
    if (udfp(p))p = prec;
    return rnd(divTrn(a, b, p+1), p);
  }
  
  // beware of infinite loops!
  function divInf(a, b){
    return div(a, b, inf);
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

  function ln(a, p){
    if (p == udf)p = prec;
    if (p == -inf)return zero();
    
    if (negp(a))err(ln, "a cannot be negative");
    if (zerop(a))err(ln, "a cannot be zero");
    
    var arr = lnReduce(a);
    a = arr[0]; var twos = arr[1]; var fives = arr[2];
    
    var lnsmall = lnTaylor(a, p+2);
    if (!zerop(twos)){
      if (is(twos, fives)){
        var l10 = ln10(p+2+siz(twos));
        return add(lnsmall, mul(twos, l10), p);
      }
      if (!zerop(fives)){
        var both = ln2and5(p+2+Math.max(siz(twos), siz(fives)));
        var l2 = both[0];
        var l5 = both[1];
        return add(add(lnsmall, mul(twos, l2)),
                   mul(fives, l5),
                   p);
      }
      var l2 = ln2(p+2+siz(twos));
      return add(lnsmall, mul(twos, l2), p);
    }
    if (!zerop(fives)){
      var l5 = ln5(p+2+siz(fives));
      return add(lnsmall, mul(fives, l5), p);
    }
    return rnd(lnsmall, p);
  }
  
  // 15342 -> 0.7671 * 2^5 * 5^4
  function lnReduce(a){
    var tens = siz(a)-1;
    a = left(a, tens);
    var twos = tens;
    var fives = tens;
    switch (a.dat[0]){
      case "1": if (intp(a) || num(a.dat[1]) <= 3)break;
      case "2": a = divInf(a, mknum("2")); twos++; break;
      case "3":
      case "4": a = divInf(a, mknum("4")); twos += 2; break;
      case "5":
      case "6": a = divInf(a, mknum("5")); fives++; break;
      case "7":
      case "8": a = divInf(a, mknum("8")); twos += 3; break;
      case "9": a = left(a, 1); twos++; fives++; break;
    }
    return [a, mknumint(twos), mknumint(fives)];
  }
  
  // Taylor series centered at a = 1
  function lnTaylor(a, p){
    var a1 = sub(a, one());
    var frac1 = a1;
    var frac;
    var ln = a1;
    var sign = true;
    for (var i = 2; true; i++, sign = !sign){
      frac1 = mul(frac1, a1, p+2);
      frac = div(frac1, mknumint(i), p+2);
      if (byzero(frac, p+2))break;
      if (sign)ln = sub(ln, frac);
      else ln = add(ln, frac);
    }
   
    return rnd(ln, p);
  }
  
  // @param String a
  // @param num n
  function powDec(a, n, p){
    if (n == 0)return one();
    if (n % 2 == 1)return mul(a, powDec(a, n-1, p+2+siz(a)), p);
    var a2 = powDec(a, n/2, p+2+Math.ceil(n/2*siz(a)));
    return mul(a2, a2, p);
  }

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
      d = sub(d, one());
      fl = add(fl, one());
    }

    if (zerop(fl))return expDec(d, p);
    var expfl = expInt(fl, p+2);
    return mul(expfl, expDec(d, p+2+siz(expfl)), p);
  }
  
  // a is a real obj
  function expInt(a, p){
    var an = tonum(a);
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
      if (byzero(frac, p+1))break;
      exp = add(exp, frac);
    }

    return rnd(exp, p);
  }

  function pow(a, b, p){
    if (zerop(a) || onep(a) || onep(b))return rnd(a, p);
    if (zerop(b))return rnd(one(), p);
    if (is(b, neg(one())))return div(one(), a, p);
    if (p == -inf)return zero();
    
    if (negp(b)){
      b = neg(b);
      var n = p+2+Math.ceil(-2*tonum(b)*nsiz(a));
      return div(one(), powPos(a, b, n), p);
    }
    return powPos(a, b, p);
  }
  
  // http://en.wikipedia.org/wiki/Exponentiation_by_squaring
  // @param real a
  // @param num n
  function powExact(a, n, p){
    var prod = one();
    while (n > 0){
      if (n % 2 == 1){
        prod = mul(prod, a);
        n--;
      }
      a = mul(a, a);
      n = n/2;
    }
    return udfp(p)?prod:rnd(prod, p);
  }
  
  function powPos(a, b, p){
    if (intp(b)){
      if (is(b, two()))return mul(a, a, p);
      if (intp(a) || p == udf)return powExact(a, tonum(b), p);
      return powDec(a, tonum(b), p);
    }
    if (p == udf)p = prec;
    var n = Math.max(p+3+Math.ceil(tonum(b)*siz(a)), 0);
    return exp(mul(b, ln(a, n+3+siz(b)), n), p);
  }
  
  // sqrt approximation that doesn't go bust when a.length >= 308
  // unlike chke(Math.sqrt(num(a)));
  /*
  n is odd:
  a = m*10^n
  sqrt(a) = sqrt(m*10^n)
          = sqrt(m)*sqrt(10^n)
          = sqrt(m)*10^(n/2)
          = sqrt(m)*10^((n-1+1)/2)
          = sqrt(m)*10^((n-1)/2+1/2)
          = sqrt(m)*10^((n-1)/2)*10^(1/2)
          = sqrt(10*m)*10^((n-1)/2)
  n is even:
  a = m*10^n
  sqrt(a) = sqrt(m*10^n)
          = sqrt(m)*sqrt(10^n)
          = sqrt(m)*10^(n/2)
  */
  function sqrtAppr(a){
    var n = siz(a)-2;
    var m = tonum(left(a, n));
    
    if (n % 2 != 0){
      m = Math.sqrt(10 * m);
      n = (n-1) / 2;
    } else {
      m = Math.sqrt(m);
      n = n / 2;
    }
    
    return right(mknum(mkstr(m)), n);
  }
  
  // a = an integer real
  // return trn(sqrt(a))
  function isqrt(a){
    var sqrt = sqrtAppr(a);
    if (zerop(sqrt))return zero();
    var func1;
    while (true){
      func1 = sub(mul(sqrt, sqrt, 2), a);
      func1 = div(func1, mul(two(), sqrt), 2);
      if (byzero(func1, 1))break;
      sqrt = sub(sqrt, func1);
    }
    
    return trn(sqrt);
  }
  
  // continued fraction
  // http://en.wikipedia.org/wiki/Generalized_continued_fraction
  function sqrtCont(a, p){
    var rt = isqrt(a);
    var diff = sub(a, mul(rt, rt));
    if (zerop(diff))return rt;
    var rt2 = mul(two(), rt);
    
    var an = function (n){
      if (n == 0)return rt;
      return rt2;
    }
    
    var bn = function (n){
      return diff;
    }
    
    return frac(an, bn, p);
  }
  
  /*
  a = m*10^n
  n is odd:
  sqrt(a, p) = sqrt(m*10^n)
             = sqrt(m)*sqrt(10^n)
             = sqrt(m)*10^(n/2)
             = sqrt(m)*10^((n-1+1)/2)
             = sqrt(m)*10^((n-1)/2+1/2)
             = sqrt(m)*10^((n-1)/2)*10^(1/2)
             = sqrt(10*m)*10^((n-1)/2)
  n is even:
  sqrt(a) = sqrt(m*10^n)
          = sqrt(m)*sqrt(10^n)
          = sqrt(m)*10^(n/2)
  */
  // uses identity sqrt(a) = sqrt(100*a)/10 to remove decimals
  // and then uses continued fraction
  function sqrtShift(a, p){
    var n = a.exp;
    if (n % 2 != 0)n -= 1;
    var m = left(a, n);
    return right(sqrtCont(m, p+n/2), n/2);
  }
  
  function sqrt(a, p){
    if (negp(a))err(sqrt, "a cannot be negative");
    if (p == udf)p = prec;
    if (p == -inf)return zero();
    return sqrtShift(a, p);
  }
  
  function cosTaylorTerms(a, p){
    var isint = intp(a);
    var frac1 = one();
    var frac2 = one();
    var frac;
    var cos = one();
    var sign = true;
    if (isint)var a2 = mul(a, a);
    for (var i = 2; true; i += 2, sign = !sign){
      if (isint)frac1 = mul(frac1, a2);
      else frac1 = powDec(a, i, p+2);
      frac2 = mul(frac2, mknumint(i*(i-1)));
      frac = div(frac1, frac2, p+2);
      if (byzero(frac, p+1))break;
      if (sign)cos = sub(cos, frac);
      else cos = add(cos, frac);
    }
    
    return rnd(cos, p);
  }
  
  function cosTaylorFrac(a, p){
    var frac1 = one();
    var frac2 = one();
    var pow = one();
    var sign = true;
    var a2 = mul(a, a, p+5);
    var prod;
    for (var i = 2; true; i += 2, sign = !sign){
      prod = mknumint(i*(i-1));
      frac1 = mul(frac1, prod);
      pow = mul(pow, a2, p+5);
      if (sign)frac1 = sub(frac1, pow);
      else frac1 = add(frac1, pow);
      frac2 = mul(frac2, prod);
      if (nsiz(frac2)-siz(pow)-2 >= p)break;
    }
    
    return div(frac1, frac2, p);
  }
  
  // Taylor series with big fraction
  function sinTaylorFrac(a, p){
    var frac1 = a;
    var frac2 = one();
    var pow = a;
    var sign = true;
    var a2 = mul(a, a, p+5);
    var prod;
    for (var i = 3; true; i += 2, sign = !sign){
      prod = mknumint(i*(i-1));
      frac1 = mul(frac1, prod);
      pow = mul(pow, a2, p+5);
      if (sign)frac1 = sub(frac1, pow);
      else frac1 = add(frac1, pow);
      frac2 = mul(frac2, prod);
      if (nsiz(frac2)-siz(pow)-2 >= p)break;
    }
    
    return div(frac1, frac2, p);
  }
  
  function sinTaylorTerms(a, p){
    var isint = intp(a);
    var frac1 = a;
    var frac2 = one();
    var frac;
    var sin = a;
    var sign = true;
    if (isint)var a2 = mul(a, a);
    for (var i = 3; true; i += 2, sign = !sign){
      if (isint)frac1 = mul(frac1, a2);
      else frac1 = powDec(a, i, p+2);
      frac2 = mul(frac2, mknumint(i*(i-1)));
      frac = div(frac1, frac2, p+2);
      if (byzero(frac, p+1))break;
      if (sign)sin = sub(sin, frac);
      else sin = add(sin, frac);
    }
    
    return rnd(sin, p);
  }
  
  
  
  /*function cos(a, p){
    if (p == udf)p = prec;
    if (p == -inf)return zero();
    
    a = abs(a);
    var pii = pi(p+3+siz(a));
    var tpi = mul(two(), pii);
    a = abs(sub(a, mul(div(a, tpi, 0), tpi)));
    
    var hpi = mul(pii, mknum("0.5"));
    var numhpi = tonum(div(a, hpi, 0));
    switch (numhpi){
      case 0: return cosTaylorTerms(a, p);
      case 1: return neg(sinTaylorTerms(sub(a, hpi), p));
      case 2: return neg(cosTaylorTerms(sub(a, pii), p));
      case 3: err(cos, "Something happened");
    }
    
    err(cos, "Something else happened, a = $1 | numhpi = $2", a, numhpi);
  }*/
  
  function cos(a, p){
    if (p == udf)p = prec;
    if (p == -inf)return zero();
    
    a = abs(a);
    // declen >= 150 -> extra = 20, declen = 0 -> extra = 0
    if (siz(a) <= 12)return cosTrans(a, p, Math.ceil(siz(a)/0.3)+Math.ceil(Math.min(20, declen(a)*20/150)));
    return cosShift(a, p);
  }
  
  // cos(a) = cos(-a)
  // 0 <= a <= inf
  // cos(a) = cos(a-2*pi)
  // nearest2pi = rnd(a/(2*pi))*2*pi
  // a = abs(a-nearest2pi)
  // 0 <= a <= pi
  // cos(a) = -cos(pi-a) // for a ~ pi
  // nearestpi = rnd(a/pi)*pi
  // a = abs(a-nearestpi)
  // 0 <= a <= pi/2
  function cosShift(a, p){
    var pii = pi(p+3+siz(a));
    var tpi = mul(two(), pii);
    var ntpi = div(a, rnd(tpi, 2+siz(a)), 0);
    if (!zerop(ntpi))a = abs(sub(a, mul(ntpi, tpi)));
    
    var npii = div(a, rnd(pii, 3+siz(a)), 0);
    if (!zerop(npii)){
      if (gt(npii, one()))err(cos, "What");
      a = abs(sub(a, pii));
      return neg(cosTrans(a, p, 20));
    }
    return cosTrans(a, p, 20);
  }
  
  function sin(a, p){
    if (p == udf)p = prec;
    if (p == -inf)return zero();
    
    var sgn = negp(a);
    a = abs(a);
    // declen >= 150 -> extra = 20, declen = 0 -> extra = 0
    var s;
    if (siz(a) <= 12)s = sinTrans(a, p, Math.ceil(siz(a)/0.3)+Math.ceil(Math.min(20, declen(a)*20/150)));
    else s = sinShift(a, p);
    return sgn?neg(s):s;
  }
  
  // sin(a) = -sin(-a)
  // 0 <= a <= inf
  // sin(a) = sin(a-2*pi)
  // nearest2pi = rnd(a/(2*pi))*2*pi
  // a = abs(a-nearest2pi)
  // 0 <= a <= pi
  // cos(a) = -cos(a-pi) // for a ~ pi
  // nearestpi = rnd(a/pi)*pi
  // a = abs(a-nearestpi)
  // 0 <= a <= pi/2
  function sinShift(a, p){
    var pii = pi(p+3+siz(a));
    var tpi = mul(two(), pii);
    var ntpi = div(a, rnd(tpi, 2+siz(a)), 0);
    if (!zerop(ntpi))a = sub(a, mul(ntpi, tpi));
    
    var sgn = negp(a);
    a = abs(a);
    
    var npii = div(a, rnd(pii, 3+siz(a)), 0);
    if (!zerop(npii)){
      if (gt(npii, one()))err(cos, "What");
      a = sub(a, pii);
      sgn = sgn != negp(a);
      a = abs(a);
      sgn = sgn != true;
    }
    var s = sinTrans(a, p, 20);
    return sgn?neg(s):s;
  }
  
  function cosTrans(a, p, i){
    if (udfp(i))i = 5;
    if (i == 0)return cosTaylorFrac(a, p);
    var c = cosTrans(mul(a, mknum("0.5")), p+4, i-1);
    return sub(mul(two(), pow(c, two(), p+1)), one(), p);
  }
  
  function cosTrans2(a, p, i){
    if (udfp(i))i = 5;
    if (i == 0)return [cosTaylorFrac(a, p)];
    var c = cosTrans2(mul(a, mknum("0.5")), p+3, i-1);
    c.push(sub(mul(two(), pow(c[c.length-1], two(), p+1)), one(), p));
    return c;
  }
  
  function sinTrans(a, p, i){
    if (udfp(i))i = 5;
    var arr = cosTrans2(mul(a, mknum("0.5")), p+3, i-1);
    var s = sinTaylorFrac(mul(a, powExact(mknum("0.5"), i)), p+3*i);
    for (var k = 0; k < arr.length; k++){
      s = mul(two(), mul(s, arr[k], p+3*(i-k-1)+1), p+3*(i-k-1));
    }
    return s;
  }
  
  var acothHash = hasha(mkAcothResume);
  var acothCont = acothHash.run;
  
  // var acoth2Resume = mkAcothResume(two());
  // a must be > 1
  // continued fraction
  // transform of http://functions.wolfram.com/ElementaryFunctions/ArcTanh/10/
  function mkAcothResume(a){
    var an = function (n){
      if (n == 0)return zero();
      return mul(mknumint(2*n-1), a);
    };
    
    var bn = function (n){
      if (n == 1)return one();
      return mknumint(-(n-1)*(n-1));
    };
    
    return function (p, o){
      return fracResume(an, bn, p, o);
    };
  }
  
  var acotHash = hasha(mkAcotResume);
  var acotCont = acotHash.run;
  
  // continued fraction
  // transform of http://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Continued_fractions_for_arctangent
  function mkAcotResume(a){
    var an = function (n){
      if (n == 0)return zero();
      return mul(mknumint(2*n-1), a);
    }
    
    var bn = function (n){
      if (n == 1)return one();
      return mknumint((n-1)*(n-1));
    }
    
    return function (p, o){
      return fracResume(an, bn, p, o);
    };
  }
  
  //// Mathematical constants ////

  var eHash = hashp(eResume);
  var e = eHash.run;
  
  // continued fraction
  function eResume(p, o){
    if (udfp(o))o = {dat: zero(), p: -1, p0: zero(), q0: one(), p1: one(), q1: one(), an: 2};
    if (p == udf)p = prec;
    if (p == -inf)return zero();

    var p0 = o.p0;
    var q0 = o.q0
    var p1 = o.p1;
    var q1 = o.q1;
    var pn = p1;
    var qn = q1;
    for (var an = o.an+4; true; an += 4){
      if (2*nsiz(qn)-3 >= p)break;
      pn = add(mul(mknumint(an), p1), p0);
      qn = add(mul(mknumint(an), q1), q0);
      p0 = p1;
      q0 = q1;
      p1 = pn;
      q1 = qn;
    }
    var exp = add(one(), div(mul(two(), pn), qn, p+2));
    exp = rnd(exp, p);
    return {dat: exp, p: p, p0: p0, q0: q0, p1: p1, q1: q1, an: an-4};
  }
  
  var ln2Hash = hashs(ln2Machin);
  var ln2 = ln2Hash.run;
  
  // Machin-like formula
  // ln(2) = 144*acoth(251)+54*acoth(449)-38*acoth(4801)+62*acoth(8749)
  // ln(2) = 18*acoth(26)-2*acoth(4801)+8*acoth(8749)
  function ln2Machin(p){
    var p1 = mul(mknum("144"), acothCont(mknum("251"), p+5));
    var p2 = mul(mknum("54"), acothCont(mknum("449"), p+5));
    var p3 = mul(mknum("38"), acothCont(mknum("4801"), p+4));
    var p4 = mul(mknum("62"), acothCont(mknum("8749"), p+5));
    var sum = add(sub(add(p1, p2), p3), p4);
    return rnd(sum, p);
  }
  
  var ln5Hash = hashs(ln5Machin);
  var ln5 = ln5Hash.run;
  
  // Machin-like formula
  // ln(5) = 334*acoth(251)+126*acoth(449)-88*acoth(4801)+144*acoth(8749)
  function ln5Machin(p){
    var p1 = mul(mknum("334"), acothCont(mknum("251"), p+5));
    var p2 = mul(mknum("126"), acothCont(mknum("449"), p+5));
    var p3 = mul(mknum("88"), acothCont(mknum("4801"), p+4));
    var p4 = mul(mknum("144"), acothCont(mknum("8749"), p+5));
    var sum = add(sub(add(p1, p2), p3), p4);
    return rnd(sum, p);
  }
  
  function ln2and5(p){
    return [ln2(p), ln5(p)];
  }
  
  var ln10Hash = hashs(ln10Machin);
  var ln10 = ln10Hash.run;
  
  // Machin-like formula
  // ln(10) = 478*acoth(251)+180*acoth(449)-126*acoth(4801)+206*acoth(8749)
  function ln10Machin(p){
    var p1 = mul(mknum("478"), acothCont(mknum("251"), p+5));
    var p2 = mul(mknum("180"), acothCont(mknum("449"), p+5));
    var p3 = mul(mknum("126"), acothCont(mknum("4801"), p+5));
    var p4 = mul(mknum("206"), acothCont(mknum("8749"), p+5));
    var sum = add(sub(add(p1, p2), p3), p4);
    return rnd(sum, p);
  }
  
  var piHash = hashs(piMachin);
  var pi = piHash.run;
  
  // Machin-like formula 44*acot(57)+7*acot(239)-12*acot(682)+24*acot(12943)
  // http://en.wikipedia.org/wiki/Machin-like_formula#More_terms
  function piMachin(p){
    var p1 = mul(mknum("44"), acotCont(mknum("57"), p+4));
    var p2 = mul(mknum("7"), acotCont(mknum("239"), p+3));
    var p3 = mul(mknum("12"), acotCont(mknum("682"), p+4));
    var p4 = mul(mknum("24"), acotCont(mknum("12943"), p+4));
    
    var sum = add(sub(add(p1, p2), p3), p4);
    
    return mul(sum, mknum("4"), p);
  }
  
  //// Special operation functions ////
  
  function frac(a, b, p){
    return fracResume(a, b, p).dat;
  }
  
  function fracResume(a, b, p, o){
    var r = fracResumeNd(a, b, p, o);
    r.dat = fracDat(r, p);
    return r;
  }
  
  function fracDat(o, p){
    return div(o.p1, o.q1, p);
  }
  
  // a and b must output real objects or null
  // a(0) cannot be null
  // o = {dat (opt), p, n, p0, q0, p1, q1, prod, bn1}
  // p should be the prec given
  // p1, q1 should be the latest p1 and q1, the ones used to calculate dat
  //   and involving, at most, a(n) and b(n)
  // prod should be b(1)*b(2)*...*b(n+1), unless b(n+1) === null, in which case it
  //   doesn't matter what prod is
  // bn1 is b(n+1)
  function fracResumeNd(a, b, p, o){
    if (udfp(o)){
      var p1 = a(0);
      var bn1 = b(1);
      o = {n: 0, p: -1, p0: one(), q0: zero(), p1: p1, q1: one(), prod: bn1, bn1: bn1};
    }
    if (udfp(p))p = prec;
    if (p == -inf)return zero();
    
    var p0 = o.p0;
    var q0 = o.q0;
    var p1 = o.p1;
    var q1 = o.q1;
    var pn = p1;
    var qn = q1;
    var an, bn;
    var bn1 = o.bn1;
    var prod = o.prod;
    for (var n = o.n+1; true; n++){
      if (bn1 === null)break;
      if (2*nsiz(qn)-siz(prod)-2 >= p)break;
      an = a(n); bn = bn1;
      if (an === null)break;
      bn1 = b(n+1);
      if (bn1 !== null)prod = mul(prod, bn1);
      pn = add(mul(an, p1), mul(bn, p0));
      qn = add(mul(an, q1), mul(bn, q0));
      if (zerop(qn))err(fracResume, "qn can never equal 0");
      p0 = p1; q0 = q1;
      p1 = pn; q1 = qn;
    }
    return {n: n-1, p: p, p0: p0, q0: q0, p1: p1, q1: q1, prod: prod, bn1: bn1};
  }
  
  function sfrac(a, p){
    return sfracResume(a, p).dat;
  }
  
  function sfracResume(a, p, o){
    var r = sfracResumeNd(a, p, o);
    r.dat = fracDat(r, p);
    return r;
  }
  
  function sfracResumeNd(a, p, o){
    if (udfp(o))o = {n: 0, p0: one(), q0: zero(), p1: a(0), q1: one()};
    if (udfp(p))p = prec;
    if (p == -inf)return zero();
    
    var p0 = o.p0;
    var q0 = o.q0;
    var p1 = o.p1;
    var q1 = o.q1;
    var pn = p1;
    var qn = q1;
    var an;
    for (var n = o.n+1; true; n++){
      if (2*nsiz(qn)-3 >= p)break;
      an = a(n);
      if (an === null)break;
      pn = add(mul(an, p1), p0);
      qn = add(mul(an, q1), q0);
      if (zerop(qn))err(sfracResume, "qn can never equal 0");
      p0 = p1; q0 = q1;
      p1 = pn; q1 = qn;
    }
    return {n: n-1, p0: p0, q0: q0, p1: p1, q1: q1};
  }
  
  // Euclidean definition
  // https://en.wikipedia.org/wiki/Modulo_operation
  function qar(a, b){
    var q = (negp(b)?cei:flr)(divTrn(a, b, 1));
    return [q, sub(a, mul(b, q))];
  }
  
  function mod(a, b){
    return qar(a, b)[1];
  }
  
  function npi(a){
    return divTrn(a, pi(declen(a)+3+siz(a)), 0);
  }

  ////// R object exposure //////

  var R = {
    mknum: mknum,
    mknumnull: mknumnull,
    mknumint: mknumint,
    tostr: tostr,
    real: real,
    realint: realint,

    num: N,
    zero: zero,
    one: one,
    two: two,
    realp: realp,

    gtInt: gtInt,
    addInt: addInt,
    add1Int: add1Int,
    subInt: subInt,
    mulInt: mulInt,
    divIntTrn: divIntTrn,
    divInt: divInt,

    zerop: zerop,
    onep: onep,
    negp: negp,
    intp: intp,
    decp: decp,
    evnp: evnp,
    oddp: oddp,
    div5p: div5p,
    
    trimr: trimr,
    triml: triml,
    cntr: cntr,
    cntl: cntl,
    right: right,
    left: left,
    wneg: wneg,
    matexp: matexp,
    siz: siz,
    nsiz: nsiz,
    fig: fig,
    chke: chke,
    byzero: byzero,

    is: is,

    gt: gt,
    ge: ge,
    lt: lt,
    le: le,

    add: add,
    sub: sub,
    mul: mul,
    divTrn: divTrn,
    div: div,
    divInf: divInf,

    rndf: rndf,
    rnd: rnd,
    cei: cei,
    flr: flr,
    trn: trn,

    dec: dec,

    exp: exp,
    expPos: expPos,
    expInt: expInt,
    expDec: expDec,
    expTaylorFrac: expTaylorFrac,
    expTaylorTerms: expTaylorTerms,
    
    ln: ln,
    lnReduce: lnReduce,
    lnTaylor: lnTaylor,
    
    pow: pow,
    powExact: powExact,
    powDec: powDec,
    
    sqrtAppr: sqrtAppr,
    isqrt: isqrt,
    sqrtCont: sqrtCont,
    sqrtShift: sqrtShift,
    sqrt: sqrt,
    
    cosTaylorTerms: cosTaylorTerms,
    cosTaylorFrac: cosTaylorFrac,
    sinTaylorFrac: sinTaylorFrac,
    sinTaylorTerms: sinTaylorTerms,
    cos: cos,
    cosTrans: cosTrans,
    cosShift: cosShift,
    sin: sin,
    sinTrans: sinTrans,
    
    acothCont: acothCont,
    acothHash: acothHash,
    acotCont: acotCont,
    acotHash: acotHash,
    
    e: e,
    eHash: eHash,
    eResume: eResume,
    ln2: ln2,
    ln2Hash: ln2Hash,
    ln5: ln5,
    ln5Hash: ln5Hash,
    ln2and5: ln2and5,
    ln10: ln10,
    ln10Hash: ln10Hash,
    pi: pi,
    piHash: piHash,
    
    frac: frac,
    fracResume: fracResume,
    sfrac: sfrac,
    sfracResume: sfracResume,
    qar: qar,
    mod: mod,
    npi: npi
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
