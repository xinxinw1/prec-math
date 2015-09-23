/***** Perfectly Precise Math Library 5.0 *****/

/* require tools 4.7.0 */

(function (udf){
  ////// Import //////
  
  var nodep = $.nodep;
  var inf = Infinity;
  var num = Number;
  var str = String;
  
  var udfp = $.udfp;
  var strp = $.strp;
  
  var inp = $.inp;
  
  var len = $.len_;
  var pos = $.posStrStr;
  var sli = $.sliStr;
  var las = $.las_;
  
  var typ = $.T.typ;
  var dat = $.T.dat;
  var isa = $.T.isa;
  var tagp = $.T.tagp;
  
  var err = $.err;
  
  ////// Real number functions //////
  
  //// Converters ////
  
  // mknum("35.35") -> N(false, "3535", -2)
  function mknum(a){
    var neg = false; var dat = remdotstr(a);
    if (negpstr(a)){
      neg = true;
      dat = sli(dat, 1);
    }
    return N(neg, dat, -declenstr(a));
  }
  
  function tostr(a){
    var b = rightstr(a.dat, a.exp);
    if (negp(a))return negstr(b);
    return b;
  }
  
  function negstr(a){
    if (a == "0")return a;
    return "-" + a;
  }
  
  function leftstr(a, n){ // 32.44 -> 3.244
    if (n == 0 || a == "0")return a;
    if (n < 0)return rightstr(a, -n);
    var alen = a.length;
    var zeros = n-alen;
    if (zeros >= 0){
      for (var i = zeros; i >= 1; i--)a = "0" + a;
      return "0." + a;
    }
    return sli(a, 0, alen-n) + "." + sli(a, alen-n, alen);
  }
  
  function rightstr(a, n){ // 32.44 -> 324.4
    if (n == 0 || a == "0")return a;
    if (n < 0)return leftstr(a, -n);
    for (var i = n; i >= 1; i--)a += "0";
    return a;
  }
  
  function negpstr(a){
    return a[0] == '-';
  }
  
  function remdotstr(a){
    var dot = pos(".", a);
    if (dot == -1)return a;
    return sli(a, 0, dot) + sli(a, dot+1, len(a));
  }
  
  function declenstr(a){
    var dot = pos(".", a);
    if (dot == -1)return 0;
    return len(a)-1-dot;
  }
  
  function vldpstr(a){
    return strp(a) && /^-?[0-9]+(\.[0-9]+)?$/.test(a);
  }
  
  // real("35.35") -> N(false, "3535", -2)
  // real(35.35)
  function real(a){
    if (tagp(a)){
      if (isa("num", a))return trim(a);
      return false;
    }
    a = str(a);
    if (!vldpstr(a))return false;
    return trim(mknum(a));
  }
  
  function realint(a){
    if (tagp(a)){
      if (isa("num", a)){
        a = trim(a);
        if (!intp(a))return false;
      }
      return false;
    }
    a = str(a);
    if (!vldp(a))return false;
    a = trim(a);
    if (!intp(a))return false;
    return num(a);
  }
  
  //// Builders ////
  
  // N(true, "153453", -3) -> -153.453
  function N(neg, dat, exp){
    return {type: "num", neg: neg, exp: exp, dat: dat};
  }
  
  function zero(){
    return N(false, "0", 0);
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
  
  //// Predicates ////
  
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
  
  function trimr(a){
    var n = cntr("0", a.dat);
    return N(a.neg, sli(a.dat, 0, len(a.dat)-n), a.exp+n);
  }
  
  function cntr(x, a){
    for (var i = len(a)-1; i >= 0; i--){
      if (a[i] !== x)return len(a)-1-i;
    }
    return 0;
  }
  
  function matexp(a, b){ // match exponents
    if (a.exp > b.exp){
      var adat = a.dat;
      for (var i = a.exp-b.exp; i >= 1; i--)adat += "0";
      return [N(a.neg, adat, b.exp), b];
    }
    if (a.exp < b.exp){
      var arr = matexp(b, a);
      return [arr[1], arr[0]];
    }
    return [a, b];
  }
  
  function pad(a, b){
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
  }
  
  //// Sign functions ////
  
  function abs(a){
    return N(false, a.dat, a.exp);
  }
  
  function neg(a){
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
    a = arr[0].dat; b = arr[1].dat;
    if (len(a) != len(b))return len(a) > len(b);
    
    for (var i = 0; i < len(a); i++){
      if (a[i] !== b[i])return num(a[i]) > num(b[i]);
    }
    
    err(gt, "Should never reach here");
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
    if (p == -inf)return "0";
    
    var sign = false;
    if (negp(a)){
      if (!negp(b))return sub(b, neg(a), p);
      sign = true;
      a = neg(a);
      b = neg(b);
    } else if (negp(b))return sub(a, neg(b), p);
    
    var arr = pad(a, b);
    var exp = arr[0].exp;
    a = arr[0].dat; b = arr[1].dat;
    
    var small;
    var sum = "";
    var carry = 0;
    for (var i = len(a)-1; i >= 0; i--){
      small = num(a[i]) + num(b[i]) + carry;
      if (small >= 10){
        sum = (small-10) + sum;
        carry = 1;
      } else {
        sum = small + sum;
        carry = 0;
      }
    }
    if (carry == 1)sum = "1" + sum;
    sum = N(sign, sum, exp);
    if (needtrimr(sum))sum = trimr(sum);
    return udfp(p)?sum:rnd(sum, p);
  }
  
  function sub(a, b, p){
    if (is(a, b))return "0";
    if (p == -inf)return "0";
    
    if (negp(a)){
      if (!negp(b))return add(a, neg(b), p);
      var c = a;
      a = neg(b);
      b = neg(c);
    } else if (negp(b))return add(a, neg(b), p);
    
    var arr = pad(a, b);
    var exp = arr[0].exp;
    a = arr[0]; b = arr[1];
    
    if (gt(b, a))return neg(sub(b, a, p));
    
    var small;
    var diff = "";
    var borrow = 0;
    for (var i = len(a)-1; i >= 0; i--){
      small = 10 + num(a[i]) - num(b[i]) + borrow;
      if (small >= 10){
        diff = (small-10) + diff;
        borrow = 0;
      } else {
        diff = small + diff;
        borrow = -1;
      }
    }
    diff = trim(diff);
    
    return (p == udf)?diff:rnd(diff, p);
  }
  
  ////// R object exposure //////
  
  var R = {
    mknum: mknum,
    tostr: tostr,
    num: N,
    
    trimr: trimr,
    matexp: matexp,
    pad: pad,
    
    gt: gt,
    
    add: add
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
