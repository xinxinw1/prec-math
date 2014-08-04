/***** Pefectly Precise Math Library Devel *****/

/* requires "tools.js" */

(function (win, udf){
  ////// Import //////
  
  var inf = Infinity;
  
  var strp = $.strp;
  var nump = $.nump;
  var udfp = $.udfp;
  var nulp = $.nulp;
  var inp = $.inp;
  var num = Number;
  var str = String;
  
  var al = $.al;
  var err = $.err;
  var time = $.time;
  var last = $.last;
  
  ////// Functions //////
  
  function len(a){
    return a.length;
  }
  
  function pos(x, a, n){
    return a.indexOf(x, n);
  }
  
  function has(x, a){
    return pos(x, a) != -1;
  }
  
  function sli(a, n, m){
    return a.substring(n, m);
  }
  
  function nof(a, n){
    var s = "";
    for (var i = n; i >= 1; i--)s += a;
    return s;
  }
  
  ////// Default precision //////
  
  var precision = 16;
  
  function prec(p){
    if (udfp(p))return precision;
    return precision = p;
  }
  
  ////// Javascript number constants //////
  
  // Javascript largest intege: 2^53 = 9007199254740992
  // Javascript largest float ≈ 1.79769313486231580793728e+308
  // shortened to 1.7976931348623157e+308
  
  ////// Real number functions //////
  
  //// Converters ////
  
  function real(a){
    if (vldp(a))return a;
    if (nump(a))return str(a);
    return false;
  }
  
  function realint(a){
    if (vldp(a)){
      if (intp(a))return a;
      return false;
    }
    if (nump(a) && intp(str(a)))return str(a);
    return false;
  }
  
  //// Validators ////
  
  function vldp(a){
    return strp(a) && /^(\+|-)?[0-9]+(\.[0-9]+)?$/.test(a);
  }
  
  //// Predicates ////
  
  function posp(a){
    return a[0] != '-';
  }
  
  function negp(a){
    return a[0] == '-';
  }
  
  function intp(a){
    return !has(".", a);
  }
  
  function decp(a){
    return has(".", a);
  }
  
  function evnp(a){
    if (decp(a))return false;
    return inp(last(a), '0', '2', '4', '6', '8');
  }
  
  function oddp(a){
    if (decp(a))return false;
    return inp(last(a), '1', '3', '5', '7', '9');
  }
  
  function div5p(a){
    if (decp(a))return false;
    return inp(last(a), '0', '5');
  }
  
  //// Processing functions ////
  
  function posdot(a){
    var dot = pos(".", a);
    return (dot == -1)?len(a):dot;
  }
  
  function remdot(a){
    var dot = pos(".", a);
    if (dot == -1)return a;
    return sli(a, 0, dot) + sli(a, dot+1);
  }
  
  function intlen(a){
    return negp(a)?posdot(a)-1:posdot(a);
  }
  
  function declen(a){
    var dot = pos(".", a);
    return (dot == -1)?0:(len(a)-1-dot);
  }
  
  function intdec(a){
    var dot = pos(".", a);
    if (dot == -1)return [len(a), 0]
    return [dot, len(a)-1-dot];
  }
  
  function decrem(a){
    var dot = pos(".", a);
    if (dot == -1)return [0, a];
    return [len(a)-1-dot, triml(sli(a, 0, dot) + sli(a, dot+1))];
  }
  
  function intpt(a){
    var dot = pos(".", a);
    if (dot == -1)return a;
    return sli(a, 0, dot);
  }
  
  function decpt(a){
    var dot = pos(".", a);
    if (dot == -1)return "";
    return sli(a, dot+1);
  }
  
  function sign(a){
    return negp(a)?"-":"";
  }
  
  function abs(a){
    return negp(a)?sli(a, 1):a;
  }
  
  function nabs(a){
    return sli(a, 1);
  }
  
  function xorsign(a, b){
    if (negp(a)){
      if (!negp(b))return ["-", nabs(a), b];
      return ["", nabs(a), nabs(b)];
    }
    if (negp(b))return ["-", a, nabs(b)];
    return ["", a, b];
  }
  
  function neg(a){
    if (a == "0")return a;
    return negp(a)?nabs(a):"-"+a;
  }
  
  function nneg(a){
    return (a == "0")?a:"-"+a;
  }
  
  function trim(a){
    var s = negp(a);
    if (s)a = nabs(a);
    a = triml(intp(a)?a:trimr(a));
    return s?neg(a):a;
  }
  
  // cuts off negative sign
  function triml(a){
    for (var i = 0; i < len(a); i++){
      if (a[i] != '0'){
        if (a[i] == '.')return sli(a, i-1);
        if (i != 0)return sli(a, i);
        return a;
      }
    }
    return "0";
  }
  
  // a better be a decimal!
  function trimr(a){
    for (var i = len(a)-1; i >= 0; i--){
      if (a[i] != '0'){
        if (a[i] == '.')return sli(a, 0, i);
        if (i != len(a)-1)return sli(a, 0, i+1);
        return a;
      }
    }
    return "0";
  }
  
  function pad(a, b){
    var alen = a.length;
    var blen = b.length;
    var adot = a.indexOf(".");
    var bdot = b.indexOf(".");
    
    if (adot == -1){
      if (bdot == -1){
        for (var i = alen-blen; i >= 1; i--)b = "0" + b;
        for (var i = blen-alen; i >= 1; i--)a = "0" + a;
        return [a, b];
      } else {
        a += ".0";
        adot = alen;
        alen += 2;
      }
    } else if (bdot == -1){
      b += ".0";
      bdot = blen;
      blen += 2;
    }
    
    for (var i = (alen-adot)-(blen-bdot); i >= 1; i--)b += "0";
    for (var i = (blen-bdot)-(alen-adot); i >= 1; i--)a += "0";
    
    for (var i = adot-bdot; i >= 1; i--)b = "0" + b;
    for (var i = bdot-adot; i >= 1; i--)a = "0" + a;
    
    return [a, b];
  }
  
  // gets the pos of the critical character in rounding
  function rndpos(a, p){
    return posdot(a) + p + ((p >= 0)?1:0);
  }
  
  // gets the critical character in rounding
  function rndchr(a, p){
    var pos = rndpos(a, p);
    return (udfp(a[pos]) || a[pos] == '-')?"0":a[pos];
  }
  
  // return rnd(a, p) == "0";
  function zero(a, p){
    var pos = rndpos(a, p);
    var c = num(rndchr(a, p));
    if (c >= 5)return false;
    for (var i = pos-1; i >= 0; i--){
      if (udfp(a[i]) || a[i] == '.')continue;
      if (a[i] == '-')return true;
      if (a[i] != '0')return false;
    }
    return true;
  }
  
  // return zero(sub(a, b), p);
  function diff(a, b, p){
    if (a == b)return true;
    if (udfp(p))return false;
    
    if (negp(a)){
      if (!negp(b))return zero(sub(a, b), p);
      a = nabs(a);
      b = nabs(b);
    } else if (negp(b))return zero(sub(a, b), p);
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    var pos = rndpos(a, p);
    if (pos < 0)return true;
    if (pos >= len(a))return false;
    
    for (var i = 0; i < pos; i++){
      if (a[i] != b[i]){
        if (num(a[i]) <= num(b[i])){
          var c = a;
          b = a;
          a = c;
        }
        // a = 100.0, b = 099.9, p = 0
        // in if: a = 200.0, b = 099.9, p = 0
        if (num(b[i]) != num(a[i])-1)return false;
        // a = 100.0, b = 099.9, p = 0
        for (i = i+1; i < pos; i++){
          if (a[i] == '.')continue;
          // in if: a = 100.0, b = 098.9, p = 0
          if (a[i] != '0' || b[i] != '9')return false;
        }
        var dif = num(a[i]) - num(b[i]);
        // in if: a = 100.0, b = 099.4, p = 0
        if (dif != -5)return dif < -5;
        for (i = i+1; i < len(a); i++){
          if (a[i] != b[i]){
            // a = 100.02, b = 099.51, p = 0
            return num(a[i]) < num(b[i]);
          }
        }
        // a = 100.01, b = 099.51, p = 0
        return false;
      }
    }
    // a = 5.9, b = 5.0, p = 0
    var dif = num(a[i]) - num(b[i]);
    if (dif < 0){
      if (dif != -5)return dif > -5;
      var c = a;
      b = a;
      a = c;
    } else {
      // in if: a = 5.9, b = 5.0, p = 0
      if (dif != 5)return dif < 5;
    }
    // a = 5.54, b = 5.04, p = 0
    for (i = i+1; i < len(a); i++){
      if (a[i] != b[i]){
        // a = 5.54, b = 5.00, p = 0
        return num(a[i]) < num(b[i]);
      }
    }
    // a = 5.5111, b = 5.0111, p = 0
    return false;
  }
  
  // equals flr(log(abs(a)))+1
  function siz(a){
    if (a == "0")return -inf;
    a = abs(a);
    
    var fa = trn(a);
    if (fa != "0")return len(fa);
    
    // 2 = pos(".", a)+1
    // 2-i = -(i-(pos(".", a)+1))
    for (var i = 2; i < len(a); i++){
      if (a[i] != '0')return 2-i;
    }
    
    err(siz, "Something strange happened");
  }
  
  // equals flr(log(abs(a)));
  function nsiz(a){
    if (a == "0")return -inf;
    a = abs(a);
    
    var fa = trn(a);
    if (fa != "0")return len(fa)-1;
    
    // 2 = pos(".", a)+1
    // 2-i = -(i-(pos(".", a)+1))
    for (var i = 2; i < len(a); i++){
      if (a[i] != '0')return 2-i-1;
    }
    
    err(nsiz, "Something strange happened");
  }
  
  // input a = num(a);
  function chke(a){
    a = str(a);
    
    if (a == "inf")a = "1.7976931348623157e+308";
    else if (a == "-inf")a = "-1.7976931348623157e+308";
    
    var pos = pos("e", a);
    if (pos == -1)return a;
    
    var front = sli(a, 0, pos);
    var sign = a[pos+1];
    var back = num(sli(a, pos+2));
    
    if (sign == '+')return right(front, back);
    if (sign == '-')return left(front, back);
  }
  
  //// Floating point ////
  
  function num2flt(a){
    var s = sign(a);
    a = abs(a);
    
    if (a == "0")return ["0", 0];
    if (a[0] != '0'){
      // 152.53435435
      var adot = posdot(a);
      return [s + left(a, adot-1), adot-1];
    } else {
      // 0.00043534 2 = pos(".", a);
      for (var i = 2; i < len(a); i++){
        if (a[i] != '0'){
          return [s + right(a, i-1), -(i-1)];
        }
      }
      return ["0", 0];
    }
  }
  
  function flt2num(a){
    return right(a[0], a[1]);
  }
  
  //// Dot moves ////
  
  // @param str a
  // @param num n
  function left(a, n){ // 32.44 -> 3.244
    if (n == 0 || a == "0")return a;
    if (n < 0)return right(a, -n);
    
    var sign = "";
    if (negp(a)){
      a = nabs(a);
      sign = "-";
    }
    
    var alen = len(a);
    var adot = pos(".", a);
    if (adot == -1)adot = alen;
    
    var zeros = n-adot;
    if (zeros >= 0){
      a = "0." + nof("0", zeros) + remdot(a);
    } else {
      if (adot == alen){
        a = sli(a, 0, adot-n) + "." + sli(a, adot-n);
      } else {
        a = sli(a, 0, adot-n) + "." + sli(a, adot-n, adot) + sli(a, adot+1);
      }
    }
    
    if (adot == alen)a = trimr(a);
    return sign + a;
  }
  
  // @param str a
  // @param num n
  function right(a, n){ // 32.44 -> 324.4
    if (n == 0 || a == "0")return a;
    if (n < 0)return left(a, -n);
    
    // sign only used for trimDecStart
    var sign = "";
    if (negp(a)){
      a = nabs(a);
      sign = "-";
    }
    
    var adot = pos(".", a);
    var alen = len(a);
    if (adot != -1){
      var zeros = n-(alen-1-adot);
      if (zeros >= 0){
        a += nof("0", zeros);
        a = sli(a, 0, adot) + sli(a, adot+1);
      } else {
        a = sli(a, 0, adot) + sli(a, adot+1, adot+1+n) + "." + sli(a, adot+1+n);
      }
    } else {
      a += nof("0", n);
    }
    
    if (adot != alen)a = triml(a);
    return sign + a;
  }
  
  //// Comparison functions ////
  
  function gt(a, b){ // is (a > b) ?
    if (a == b)return false;
    
    if (negp(a)){
      if (negp(b))return gt(nabs(b), nabs(a));
      return false;
    } else if (negp(b))return true;
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    a = remdot(a);
    b = remdot(b);
    
    for (var i = 0; i < len(a); i++){
      if (a[i] != b[i])return num(a[i]) > num(b[i]);
    }
    
    err(gt, "Something strange happened (input not canonical)");
  }
  
  function lt(a, b){ // is (a < b) ?
    if (a == b)return false;
    
    if (negp(a)){
      if (negp(b))return lt(nabs(b), nabs(a));
      return true;
    } else if (negp(b))return false;
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    a = remdot(a);
    b = remdot(b);
    
    for (var i = 0; i < len(a); i++){
      if (a[i] != b[i])return num(a[i]) < num(b[i]);
    }
    
    err(lt, "Something strange happened (input not canonical)");
  }
  
  function ge(a, b){ // is (a >= b) ?
    if (a == b)return true;
    
    if (negp(a)){
      if (negp(b))return gt(nabs(b), nabs(a));
      return false;
    } else if (negp(b))return true;
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    a = remdot(a);
    b = remdot(b);
    
    for (var i = 0; i < len(a); i++){
      if (a[i] != b[i])return num(a[i]) > num(b[i]);
    }
    
    err(ge, "Something strange happened (input not canonical)");
  }
  
  function le(a, b){ // is (a <= b) ?
    if (a == b)return true;
    
    if (negp(a)){
      if (negp(b))return lt(nabs(b), nabs(a));
      return true;
    } else if (negp(b))return false;
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    a = remdot(a);
    b = remdot(b);
    
    for (var i = 0; i < len(a); i++){
      if (a[i] != b[i])return num(a[i]) < num(b[i]);
    }
    
    err(le, "Something strange happened (input not canonical)");
  }
  
  //// Basic opeation functions ////
  
  function add(a, b, p){
    if (p == -inf)return "0";
    
    var sign = "";
    if (negp(a)){
      if (!negp(b))return sub(b, nabs(a), p);
      sign = "-";
      a = nabs(a);
      b = nabs(b);
    } else if (negp(b))return sub(a, nabs(b), p);
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    var small;
    var sum = "";
    var carry = 0;
    for (var i = len(a)-1; i >= 0; i--){
      if (a[i] == '.'){
        sum = "." + sum;
        continue;
      }
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
    sum = sign + sum;
    if (decp(sum))sum = trimr(sum);
    
    return udfp(p)?sum:rnd(sum, p);
  }
  
  function sub(a, b, p){
    if (a == b)return "0";
    if (p == -inf)return "0";
    
    if (negp(a)){
      if (!negp(b))return add(a, "-" + b, p);
      var c = a;
      a = nabs(b);
      b = nabs(c);
    } else if (negp(b))return add(a, nabs(b), p);
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    if (gt(b, a))return neg(sub(b, a, p));
    
    var small;
    var diff = "";
    var borrow = 0;
    for (var i = len(a)-1; i >= 0; i--){
      if (a[i] == '.'){
        diff = "." + diff;
        continue;
      }
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
    
    return udfp(p)?diff:rnd(diff, p);
  }
  
  function mul(a, b, p){
    if (a == "0" || b == "0")return "0";
    if (p == -inf)return "0";
    
    var sign = "";
    if (negp(a)){
      a = nabs(a);
      if (!negp(b))sign = "-";
      else b = nabs(b);
    } else if (negp(b)){sign = "-"; b = nabs(b);}
    
    // list(dec, a) = decrem(a)
    var dec = 0; var dot;
    dot = pos(".", a);
    if (dot != -1){
      dec += len(a)-1-dot;
      a = triml(sli(a, 0, dot) + sli(a, dot+1));
    }
    dot = pos(".", b);
    if (dot != -1){
      dec += len(b)-1-dot;
      b = triml(sli(b, 0, dot) + sli(b, dot+1));
    }
    
    var prod = mulInt(a, b);
    if (dec > 0)prod = left(prod, dec);
    prod = sign + prod;
    
    return udfp(p)?prod:rnd(prod, p);
  }
  
  // multiply two positive (non-zero) integes
  function mulInt(a, b){
    if (len(a) <= 7 && len(b) <= 7)
      return str(num(a)*num(b));
    if (len(a) <= 200 || len(b) <= 200)
      return mulLong(a, b);
    else
      return mulKarat(a, b);
  }
  
  // long multiplication; for 8-200 digits
  function mulLong(a, b){
    if (len(b) > len(a))return mulLong(b, a);
    
    var prod = "0";
    var curra, currb, curr, small, ln, carry;
    for (var i = len(b); i > 0; i -= 7){
      currb = num(sli(b, i-7, i));
      if (currb == 0)continue;
      curr = ""; carry = 0;
      curr += nof("0000000", (len(b)-i)/7);
      for (var j = len(a); j > 0; j -= 7){
        curra = num(sli(a, j-7, j));
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
        ln = len(small);
        if (ln > 7){
          curr = sli(small, ln-7, ln) + curr;
          carry = num(sli(small, 0, ln-7));
        } else {
          curr = small + curr;
          if (j-7 > 0)curr = nof("0", 7-ln) + curr;
          carry = 0;
        }
      }
      if (carry != 0)curr = carry + curr;
      prod = add(prod, curr);
    }
    
    return prod;
  }
  
  // Karatsuba multiplication; for more than 200 digits
  // http://en.wikipedia.org/wiki/Karatsuba_algorithm
  function mulKarat(a, b){
    var alen = len(a);
    var blen = len(b);
    
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
      var a1 = sli(a, 0, alen-m);
      var a0 = triml(sli(a, alen-m, alen));
      return add(right(mulKarat(a1, b), m), mulKarat(a0, b));
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
    
    var a1 = sli(a, 0, alen-m);
    var a0 = triml(sli(a, alen-m, alen));
    var b1 = sli(b, 0, blen-m);
    var b0 = triml(sli(b, blen-m, blen));
    
    var z2 = mulKarat(a1, b1);
    var z0 = mulKarat(a0, b0);
    var z1 = sub(sub(mulKarat(add(a1, a0), add(b1, b0)), z2), z0);
    
    return add(add(right(z2, 2*m), right(z1, m)), z0);
  }
  
  function div(a, b, p){
    if (b == "0")err(div, "b cannot be 0");
    if (a == "0")return "0";
    if (b == "1")return rnd(a, p);
    
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    var sign = "";
    if (negp(a)){
      a = nabs(a);
      if (!negp(b))sign = "-";
      else b = nabs(b);
    } else if (negp(b)){
      sign = "-";
      b = nabs(b);
    }
    
    var move = Math.max(declen(a), declen(b));
    if (move != 0){
      a = right(a, move);
      b = right(b, move);
    }
    
    var quot = divLong(a, b, p);
    return (quot == "0")?quot:sign + quot;
  }
  
  // long division of positive (non-zero) integes a and b
  function divLong(a, b, p){
    var quot = "0";
    var curr = "";
    var k;
    var arr = ["0", b, add(b, b)];
    var alen = len(a);
    for (var i = 0; i < alen+p+1; i++){
      if (i < alen)curr += a[i];
      else {
        if (curr == "0")break;
        if (i == alen)quot += ".";
        curr += "0";
      }
      curr = triml(curr);
      if (ge(curr, b)){
        for (k = 2; ge(curr, arr[k]); k++){
          if (k+1 == len(arr))arr[k+1] = add(arr[k], b);
        }
        quot += k-1;
        curr = sub(curr, arr[k-1]);
      } else {
        quot += "0";
      }
    }
    quot = trim(quot);
    if (p < 0 && quot != "0")quot += nof("0", -p-1);
    
    return (quot == "0")?quot:rnd(quot, p);
  }
  
  //// Rounding functions ////
  
  function rnd(a, p){
    if (a == "0")return "0";
    if (p == -inf)return "0";
    
    var sign = "";
    if (negp(a)){sign = "-"; a = nabs(a);}
    
    var dot = pos(".", a);
    var r;
    if (p == 0 || udfp(p)){
      if (dot == -1)return sign+a;
      r = sli(a, 0, dot);
      if (num(a[dot+1]) >= 5)r = add1(r);
    } else if (p < 0){
      if (dot == -1)dot = len(a);
      if (dot+p < 0)return "0";
      r = sli(a, 0, dot+p);
      if (num(a[dot+p]) >= 5)r = add1(r);
      else if (r == "")return "0";
      r += nof("0", -p);
    } else {
      if (dot == -1 || dot+p+1 >= len(a))return sign+a;
      r = sli(a, 0, dot+p+1);
      if (num(a[dot+p+1]) >= 5)r = add1(r);
      r = trimr(r);
    }
    
    return (r == "0")?r:sign+r;
  }
  
  function cei(a, p){
    if (a == "0")return "0";
    if (negp(a))return nneg(flrPos(nabs(a), p));
    return ceiPos(a, p);
  }
  
  function flr(a, p){
    if (a == "0")return "0";
    if (negp(a))return nneg(ceiPos(nabs(a), p));
    return flrPos(a, p);
  }
  
  function trn(a, p){
    if (a == "0")return "0";
    if (negp(a))return nneg(flrPos(nabs(a), p));
    return flrPos(a, p);
  }
  
  function ceiPos(a, p){
    if (p == -inf)err(ceiPos, "p can't be -inf");
    var dot = pos(".", a);
    if (p == 0 || udfp(p)){
      if (dot == -1)return a;
      return add1(sli(a, 0, dot));
    }
    if (p < 0){
      if (dot == -1)dot = len(a);
      if (dot+p <= 0)return "1" + nof("0", -p);
      return add1(sli(a, 0, dot+p)) + nof("0", -p);
    }
    if (dot == -1 || dot+p+1 >= len(a))return a;
    return trimr(add1(sli(a, 0, dot+p+1)));
  }
  
  function flrPos(a, p){
    if (p == -inf)return "0";
    var dot = pos(".", a);
    if (p == 0 || udfp(p)){
      if (dot == -1)return a;
      return sli(a, 0, dot);
    }
    if (p < 0){
      if (dot == -1)dot = len(a);
      if (dot+p <= 0)return "0";
      return sli(a, 0, dot+p) + nof("0", -p);
    }
    if (dot == -1 || dot+p+1 >= len(a))return a;
    return trimr(sli(a, 0, dot+p+1));
  }
  
  // add 1 to last dec place of non-negative number
  function add1(a){
    var adot = posdot(a);
    for (var i = len(a)-1; i >= 0; i--){
      if (a[i] == '.')continue;
      if (a[i] != '9')
        return sli(a, 0, i) + (num(a[i])+1) + nof("0", adot-1-i);
    }
    return "1" + nof("0", adot);
  }
  
  //// Extended opeation functions ////
  
  function exp(a, p){
    if (a == "0")return rnd("1", p);
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    if (negp(a))return div("1", expPos(nabs(a), p+2), p)
    return expPos(a, p);
  }
  
  function expPos(a, p){
    if (intp(a))return expInt(a, p);
    
    var fl = trn(a);
    var flLen = len(fl);
    fl = num(fl);
    var dec = decpt(a);
    var declen = len(dec);
    a = "0." + dec;
    if (gt(a, "0.5")){
      a = sub(a, "1");
      fl++;
    }
    
    if (fl == 0){
      if (declen <= 30)return expFrac(a, p);
      return expTerms(a, p);
    }
    
    var expfl = expInt(fl, p+2);
    if (declen <= 30)
      return mul(expfl, expFrac(a, p+2+siz(expfl)), p);
    else
      return mul(expfl, expTerms(a, p+2+siz(expfl)), p);
  }
  
  function expInt(a, p){
    var an = num(a);
    if (an == 1)return e(p);
    if (an < 100)return pow(e(p+1+(an-1)*(len(a)+1)), a, p);
    return expFrac(a, p);
  }
  
  // Taylor Seies with big fraction
  function expFrac(a, p){
    if (decp(a))a = rnd(a, p+2);
    var frac1 = add(a, "1");
    var frac2 = "1";
    var pow = a;
    for (var i = 2; true; i++){
      frac1 = mul(frac1, str(i));
      pow = mul(pow, a);
      frac1 = add(frac1, pow);
      frac2 = mul(frac2, str(i));
      if (nsiz(frac2)-siz(pow)-2 >= p)return div(frac1, frac2, p);
    }
  }
  
  // Taylor Seies adding tem by tem
  function expTerms(a, p){
    var ar = rnd(a, p+3);
    var pow = ar;
    var fact = "1";
    var frac = "1";
    var exp = add(ar, "1");
    for (var i = 2; true; i++){
      pow = mul(pow, ar, p+3);
      fact = mul(fact, str(i));
      frac = div(pow, fact, p+3);
      if (zero(frac, p+1))return rnd(exp, p);
      exp = add(exp, frac);
    }
  }
  
  function ln(a, p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    if (negp(a))err(ln, "a cannot be negative");
    if (a == "0")err(ln, "a cannot be zero");
    
    var tens = siz(a)-1;
    a = left(a, tens);
    
    var twos = tens;
    var fives = tens;
    
    switch (a[0]){
      case "1": if (intp(a) || num(a[2]) <= 3)break;
      case "2": a = div(a, "2", inf); twos++; break;
      case "3":
      case "4": a = div(a, "4", inf); twos += 2; break;
      case "5":
      case "6": a = div(a, "5", inf); fives++; break;
      case "7":
      case "8": a = div(a, "8", inf); twos += 3; break;
      case "9": a = left(a, 1); twos++; fives++; break;
    }
    twos = str(twos); fives = str(fives);
    
    var lnsmall = lnTaylor(a, p+2);
    if (twos != "0"){
      if (twos == fives){
        var l10 = ln10(p+2+siz(twos));
        return add(lnsmall, mul(twos, l10), p);
      }
      if (fives != "0"){
        var both = ln2and5(p+2+Math.max(siz(twos), siz(fives)));
        var l2 = both[0];
        var l5 = both[1];
        return add(add(lnsmall, mul(twos, l2)), mul(fives, l5), p);
      }
      var l2 = ln2(p+2+siz(twos));
      return add(lnsmall, mul(twos, l2), p);
    }
    if (fives != "0"){
      var l5 = ln5(p+2+siz(fives));
      return add(lnsmall, mul(fives, l5), p);
    }
    return rnd(lnsmall, p);
  }
  
  // Taylor series
  function lnTaylor(a, p){
    var a1 = sub(a, "1");
    var frac1 = a1;
    var frac;
    var ln = a1;
    var sign = true;
    for (var i = 2; true; i++, sign = !sign){
      frac1 = rnd(mul(frac1, a1), p+2);
      frac = div(frac1, str(i), p+2);
      if (zero(frac, p+1))return rnd(ln, p);
      ln = (sign?sub:add)(ln, frac);
    }
  }
  
  function pow(a, b, p){
    if (a == "0" || a == "1" || b == "1")return rnd(a, p);
    if (b == "0")return rnd("1", p);
    if (b == "-1")return div("1", a, p);
    if (p == -inf)return "0";
    
    if (negp(b))return div("1", powPos(a, b, p+2), p);
    return powPos(a, b, p);
  }
  
  function powPos(a, b, p){
    if (intp(b)){
      if (b == "2")return mul(a, a, p);
      if (intp(a) || udfp(p))return powExact(a, num(b), p);
      return powDec(a, num(b), p);
    }
    if (udfp(p))p = prec();
    return exp(mul(b, ln(a, p+6+siz(b)), p+4), p);
  }
  
  // http://en.wikipedia.org/wiki/Exponentiation_by_squaring
  // @param str a
  // @param num n
  function powExact(a, n, p){
    var prod = "1";
    while (n > 0){
      if (n % 2 == 1){
        prod = mul(prod, a);
        n--;
      }
      a = mul(a, a);
      n /= 2;
    }
    return udfp(p)?prod:rnd(prod, p);
  }
  
  // @param str a
  // @param num n
  function powDec(a, n, p){
    var sign = "";
    if (negp(a) && n % 2 == 1){
      sign = "-";
      a = nabs(a);
    }
    
    var log = siz(a);
    var d1 = p+2+(n-1)*log+n-1;
    var d2 = d1-1; // p+2+(n-1)*log+n-2
    var sub = log+1;
    var x = a;
    for (var i = 1; i <= n-1; i++){
      x = mul(rnd(x, d1), rnd(a, d2));
      d1 = d1-sub;
      d2 = d2-1;
    }
    
    return rnd(sign + x, p);
  }
  
  function sqrt(a, p){
    if (negp(a))err(sqrt, "a cannot be negative");
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    if (intp(a))return sqrtCont(a, p);
    if (p < 50)return sqrtNewton(a, p);
    return sqrtShift(a, p);
  }
  
  // uses identity sqrt(a) = sqrt(100*a)/10 to remove decimals
  // and then uses continued fraction
  function sqrtShift(a, p){
    var dot = pos(".", a);
    if (dot != -1){
      var dec = len(a)-1-dot;
      a = triml(sli(a, 0, dot) + sli(a, dot+1));
      if (dec % 2 == 1)a += "0";
      dec = Math.ceil(dec/2);
      return left(sqrtCont(a, p-dec), dec);
    }
    return sqrtCont(a, p);
  }
  
  // continued fraction
  // http://en.wikipedia.org/wiki/Genealized_continued_fraction
  function sqrtCont(a, p){
    var rt = isqrt(a);
    var diff = sub(a, mul(rt, rt));
    if (diff == "0")return rt;
    var rt2 = mul("2", rt);
    
    var an = function (n){
      if (n == 0)return rt;
      return rt2;
    }
    
    var bn = function (n){
      return diff;
    }
    
    return frac(an, bn, p);
  }
  
  // Newton's method
  // http://en.wikipedia.org/wiki/Methods_of_computing_square_roots
  function sqrtNewton(a, p){
    var sqrt = sqrtAppr(a);
    if (sqrt == "0")return "0";
    var func1;
    while (true){
      func1 = sub(mul(sqrt, sqrt, p+2), a);
      func1 = div(func1, mul("2", sqrt), p+2);
      if (zero(func1, p+1))return rnd(sqrt, p);
      sqrt = sub(sqrt, func1);
    }
  }
  // With some input, there was an infinite loop fixed by replacing
  // mul(sqrt, sqrt, p+2) with mul(sqrt, sqrt) in prec-math 1.7
  // (complex-math 1.12). No idea what that input was
  
  // return trn(sqrt(a))
  function isqrt(a){
    var sqrt = sqrtAppr(a);
    if (sqrt == "0")return "0";
    var func1;
    while (true){
      func1 = sub(mul(sqrt, sqrt, 2), a);
      func1 = div(func1, mul("2", sqrt), 2);
      if (zero(func1, 1))return trn(sqrt);
      sqrt = sub(sqrt, func1);
    }
  }
  
  // sqrt approximation that doesn't go bust when len(a) >= 308
  // unlike checkE(Math.sqrt(num(a)));
  /*
  a1 is odd:
  a = a0*10^a1
  sqrt(a) = sqrt(a0*10^a1)
          = sqrt(a0)*sqrt(10^a1)
          = sqrt(a0)*10^(a1/2)
          = sqrt(a0)*10^((a1-1+1)/2)
          = sqrt(a0)*10^((a1-1)/2+1/2)
          = sqrt(a0)*10^((a1-1)/2)*10^(1/2)
          = sqrt(10*a0)*10^((a1-1)/2)
  a1 is even:
  a = a0*10^a1
  sqrt(a) = sqrt(a0*10^a1)
          = sqrt(a0)*sqrt(10^a1)
          = sqrt(a0)*10^(a1/2)
  */
  function sqrtAppr(a){
    a = num2flt(a);
    a[0] = num(a[0]);
    
    if (a[1] % 2 == 1 || a[1] % 2 == -1){
      a[0] = Math.sqrt(10 * a[0]);
      a[1] = (a[1]-1) / 2;
    } else {
      a[0] = Math.sqrt(a[0]);
      a[1] = a[1] / 2;
    }
    
    a[0] = str(a[0]);
    return flt2num(a);
  }
  
  function fact(a, p){
    if (decp(a) || negp(a))err(fact, "a must be a positive intege");
    if (p == -inf)return "0";
    a = num(a);
    
    var fact = factDiv(a);
    return udfp(p)?fact:rnd(fact, p);
  }
  
  // @param num a
  // @return str prod
  function factDiv(a){
    return mulran(1, a);
  }
  
  function bin(n, k, p){
    if (gt(k, n))err(bin, "n must be >= k");
    if (!intp(k) || !intp(n) || negp(k) || negp(n)){
      err(bin, "n and k must be positive integes");
    }
    if (p == -inf)return "0";
    n = num(n); k = num(k);
    
    var bin = div(mulran(k+1, n), factDiv(n-k));
    return udfp(p)?bin:rnd(bin, p);
  }
  
  // http://en.wikipedia.org/wiki/Arithmetic%E2%80%93geometric_mean
  function agm(a, b, p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    var c, d;
    while (true){
      c = div(add(a, b), "2", p+2);
      d = sqrt(mul(a, b, p+5+siz(a)+siz(b)), p+2);
      if (diff(a, c, p))return rnd(c, p);
      a = c; b = d;
    }
  }
  
  function sin(a, p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    var sign = false;
    if (negp(a)){
      a = nabs(a);
      sign = !sign;
    }
    
    var intpt = Math.floor(num(a))/3;
    if (intpt < 1)intpt = 1;
    var dec = declen(a);
    if (dec <= 1)dec += 1;
    if (intpt*dec <= 75){
      var sin = sinFrac(a, p);
      return sign?neg(sin):sin;
    }
    
    var pii = pi(p+3+siz(a));
    var tpi = mul("2", pii); // 2*pi
    a = sub(a, mul(div(a, tpi, 0), tpi));
    
    if (negp(a)){
      a = nabs(a);
      sign = !sign;
    }
    
    var hpi = div(pii, "2", p+2); // pi/2
    var nhpi = div(a, hpi, 0);
    var sn;
    switch (nhpi){
      case "0":
        sn = sinTerms(a, p);
        break;
      case "1":
        a = sub(a, hpi);
        sn = cosTerms(a, p);
        break;
      case "2":
        a = sub(a, pii);
        sn = sinTerms(a, p);
        sign = !sign;
        break;
      case "3":
        a = sub(a, add(hpi, pii));
        sn = cosTerms(a, p);
        sign = !sign;
        break;
    }
    
    return sign?neg(sn):sn;
  }
  
  // Taylor series
  function sinTerms(a, p){
    var isint = intp(a);
    var frac1 = a;
    var frac2 = "1";
    var frac;
    var sin = a;
    var sign = true;
    if (isint)var a2 = mul(a, a);
    for (var i = 3; true; i += 2, sign = !sign){
      if (isint)frac1 = mul(frac1, a2);
      else frac1 = powDec(a, i, p+2);
      frac2 = mul(frac2, str(i*(i-1)));
      frac = div(frac1, frac2, p+2);
      if (zero(frac, p+1))return rnd(sin, p);
      sin = (sign?sub:add)(sin, frac);
    }
  }
  
  // Taylor series with big fraction
  function sinFrac(a, p){
    var frac1 = a;
    var frac2 = "1";
    var pow = a;
    var sign = true;
    var a2 = mul(a, a);
    var prod;
    for (var i = 3; true; i += 2, sign = !sign){
      prod = str(i*(i-1));
      frac1 = mul(frac1, prod);
      pow = mul(pow, a2);
      frac1 = (sign?sub:add)(frac1, pow);
      frac2 = mul(frac2, prod);
      if (nsiz(frac2)-siz(pow)-2 >= p)return div(frac1, frac2, p);
    }
  }
  
  function cos(a, p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    var sign = false;
    if (negp(a))a = nabs(a);
    
    var intPart = Math.floor(num(a))/3;
    if (intPart < 1)intPart = 1;
    var dec = declen(a);
    if (dec <= 1)dec += 1;
    if (intPart*dec <= 75)return cosFrac(a, p);
    
    var pii = pi(p+3+siz(a));
    var tpi = mul("2", pii);
    a = sub(a, mul(div(a, tpi, 0), tpi));
    
    if (negp(a))a = nabs(a);
    
    var hpi = div(pii, "2", p+2);
    var numhpi = div(a, hpi, 0);
    var cos;
    switch (numhpi){
      case "0":
        cos = cosTerms(a, p);
        break;
      case "1":
        a = sub(a, hpi);
        cos = sinTerms(a, p);
        sign = !sign;
        break;
      case "2":
        a = sub(a, pii);
        cos = cosTerms(a, p);
        sign = !sign;
        break;
      case "3":
        a = sub(a, add(hpi, pii));
        cos = sinTerms(a, p);
        break;
    }
    
    return (sign)?neg(cos):cos;
  }
  
  function cosTerms(a, p){
    var isint = intp(a);
    var frac1 = "1";
    var frac2 = "1";
    var frac;
    var cos = "1";
    var sign = true;
    if (isint)var a2 = mul(a, a);
    for (var i = 2; true; i += 2, sign = !sign){
      if (isint)frac1 = mul(frac1, a2);
      else frac1 = powDec(a, i, p+2);
      frac2 = mul(frac2, str(i*(i-1)));
      frac = div(frac1, frac2, p+2);
      if (zero(frac, p+1))return rnd(cos, p);
      cos = (sign?sub:add)(cos, frac);
    }
  }
  
  function cosFrac(a, p){
    var frac1 = "1";
    var frac2 = "1";
    var pow = "1";
    var sign = true;
    var a2 = mul(a, a);
    var prod;
    for (var i = 2; true; i += 2, sign = !sign){
      prod = str(i*(i-1));
      frac1 = mul(frac1, prod);
      pow = mul(pow, a2);
      frac1 = (sign?sub:add)(frac1, pow);
      frac2 = mul(frac2, prod);
      if (nsiz(frac2)-siz(pow)-2 >= p)return div(frac1, frac2, p);
    }
  }
  
  function sinh(a, p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    var ex = exp(a, p+2);
    return div(sub(ex, div("1", ex, p+1)), "2", p);
  }
  
  function cosh(a, p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    var ex = exp(a, p+2);
    return div(add(ex, div("1", ex, p+1)), "2", p);
  }
  
  // continued fraction
  // transform of http://en.wikipedia.org/wiki/Invese_trigonometric_functions#Continued_fractions_for_arctangent
  function acotCont(a, p){
    var an = function (n){
      if (n == 0)return "0";
      return mul(str(2*n-1), a);
    }
    
    var bn = function (n){
      if (n == 1)return "1";
      return str((n-1)*(n-1));
    }
    
    return frac(an, bn, p);
  }
  
  // continued fraction
  // transform of http://functions.wolfram.com/ElementaryFunctions/ArcTanh/10/
  function acothCont(a, p){
    var an = function (n){
      if (n == 0)return "0";
      return mul(str(2*n-1), a);
    }
    
    var bn = function (n){
      if (n == 1)return "1";
      return str(-(n-1)*(n-1));
    }
    
    return frac(an, bn, p);
  }
  
  // taylor series atan(1/x)
  function acotTaylor(a, p){
    var sum = div("1", a, p+2);
    var pow = a;
    var a2 = mul(a, a);
    var func1;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      pow = mul(pow, a2, p+2);
      func1 = div("1", mul(str(i), pow), p+2);
      sum = (sign?sub:add)(sum, func1);
      if (zero(func1, p+1))return rnd(sum, p);
    }
  }
  
  // @param str a
  // @param num n
  function acotTrans(a, n, p){
    for (var i = n; i >= 1; i--){
      a = add(a, sqrt(add("1", mul(a, a)), p+i+2), p+i+2);
    }
    return rnd(a, p);
  }
  
  function acotTaylorTrans(a, n, p){
    a = acotTrans(a, n, p+2);
    return mul(powExact("2", n), acotTaylor(a, p+1), p); // 16 = 2^4
  }
  
  function atan(a, p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    if (lt(a, "0.2"))return atanTaylor(a, p);
    return atanTaylorTrans(a, p);
  }
  
  // Taylor Seies without transform
  // faste when a <= 0.2
  function atanTaylor(a, p){
    var frac;
    var atan = a;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      frac = div(powDec(a, i, p+2), str(i), p+2);
      if (zero(frac, p+2))return rnd(atan, p);
      atan = (sign?sub:add)(atan, frac);
    }
  }
  
  // Taylor Seies with transform
  // faste when a >= 0.2
  function atanTaylorTrans(a, p){
    a = atanTrans(a, 4, p);
    var frac;
    var atan = a;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      frac = div(powDec(a, i, p+2), str(i), p+2);
      if (zero(frac, p+1))return rnd(mul("16", atan), p); // 16 = 2^4
      atan = (sign?sub:add)(atan, frac);
    }
  }
  
  // @param num n
  function atanTrans(a, n, p){
    for (var i = n-1; i >= 0; i--){
      a = div(a, add("1", sqrt(add("1", mul(a, a)), p+i+2)), p+i+2);
    }
    return a;
  }
  
  // return atan(a/b);
  function atan2(a, b, p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    if (b == "0"){
      if (a == "0")err(atan2, "a and b cannot both equal 0");
      var hpi = div(pi(p+3), "2", p);
      return negp(a)?"-"+hpi:hpi;
    }
    var atn = atan(div(a, b, p+5), p+2);
    if (negp(b)){
      return (negp(a)?sub:add)(atn, pi(p+2), p);
    }
    return rnd(atn, p);
  }
  
  //// Mathematical constants ////
  
  function pi(p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    if (p <= 5)return piCont(p);
    return piMachin(p);
  }
  
  // continued fraction 
  function piCont(p){
    var an = function (n){
      if (n == 0)return "0";
      return str(2*n-1);
    }
    
    var bn = function (n){
      if (n == 1)return "4";
      return str((n-1)*(n-1));
    }
    
    return frac(an, bn, p);
  }
  
  // Machin-like formula 44*acot(57)+7*acot(239)-12*acot(682)+24*acot(12943)
  // http://en.wikipedia.org/wiki/Machin-like_formula#More_tems
  function piMachin(p){
    var p1 = mul("44", acotCont("57", p+4));
    var p2 = mul("7", acotCont("239", p+3));
    var p3 = mul("12", acotCont("682", p+4));
    var p4 = mul("24", acotCont("12943", p+4));
    return mul(add(sub(add(p1, p2), p3), p4), "4", p);
  }
  
  // continued fraction
  function e(p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    var p0 = "0";
    var p1 = "1";
    var q0 = "1";
    var q1 = "1";
    var pn, qn;
    for (var an = 6; true; an += 4){
      pn = add(mul(str(an), p1), p0);
      qn = add(mul(str(an), q1), q0);
      if (2*siz(qn)-2 >= p)break;
      p0 = p1;
      q0 = q1;
      p1 = pn;
      q1 = qn;
    }
    return add("1", div(mul("2", pn), qn, p+2), p);
  }
  
  // continued fraction
  function phi(p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    var f0 = "1";
    var f1 = "2";
    var fn;
    while (true){
      fn = add(f0, f1);
      if (2*siz(f1)-2 >= p)return div(fn, f1, p);
      f0 = f1;
      f1 = fn;
    }
  }
  
  function ln2(p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    if (p <= 25)return ln2Cont(p);
    return ln2Machin(p);
  }
  
  // genealized continued fraction
  function ln2Cont(p){
    var an = function (n){
      if (n == 0)return "0";
      if (n % 2 == 1)return str(n);
      return "2";
    }
    
    var bn = function (n){
      if (n == 1)return "1";
      return str(Math.floor(n/2));
    }
    
    return frac(an, bn, p);
  }
  
  // Machin-like formula
  // ln(2) = 18*acoth(26)-2*acoth(4801)+8*acoth(8749)
  function ln2Machin(p){
    var p1 = mul("18", acothCont("26", p+4));
    var p2 = mul("2", acothCont("4801", p+3));
    var p3 = mul("8", acothCont("8749", p+3));
    return add(sub(p1, p2), p3, p);
  }
  
  function ln5(p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    return ln5Machin(p);
  }
  
  // Machin-like formula
  // ln(5) = 334*acoth(251)+126*acoth(449)-88*acoth(4801)+144*acoth(8749)
  function ln5Machin(p){
    var p1 = mul("334", acothCont("251", p+5));
    var p2 = mul("126", acothCont("449", p+5));
    var p3 = mul("88", acothCont("4801", p+4));
    var p4 = mul("144", acothCont("8749", p+5));
    return add(sub(add(p1, p2), p3), p4, p);
  }
  
  // ln(2) = 144*acoth(251)+54*acoth(449)-38*acoth(4801)+62*acoth(8749)
  function ln2and5(p){
    var a1 = acothCont("251", p+5);
    var a2 = acothCont("449", p+5);
    var a3 = acothCont("4801", p+4);
    var a4 = acothCont("8749", p+5);
    
    var p1, p2, p3, p4;
    
    p1 = mul("144", a1);
    p2 = mul("54", a2);
    p3 = mul("38", a3);
    p4 = mul("62", a4);
    
    var ln2 = add(sub(add(p1, p2), p3), p4, p);
    
    p1 = mul("334", a1);
    p2 = mul("126", a2);
    p3 = mul("88", a3);
    p4 = mul("144", a4);
    
    var ln5 = add(sub(add(p1, p2), p3), p4, p);
    
    return [ln2, ln5];
  }
  
  function ln10(p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    return ln10Machin(p);
  }
  
  // Machin-like formula
  // ln(10) = 478*acoth(251)+180*acoth(449)-126*acoth(4801)+206*acoth(8749)
  function ln10Machin(p){
    var p1 = mul("478", acothCont("251", p+5));
    var p2 = mul("180", acothCont("449", p+5));
    var p3 = mul("126", acothCont("4801", p+5));
    var p4 = mul("206", acothCont("8749", p+5));
    return add(sub(add(p1, p2), p3), p4, p);
  }
  
  //// Special opeation functions ////
  
  function qar(a, b){
    if (b == "0")err(qar, "b cannot be 0");
    if (a == "0")return [a, "0"];
    
    var sign = "";
    if (negp(a)){
      a = nabs(a);
      if (!negp(b))sign = "-";
      else b = nabs(b);
    } else if (negp(b)){
      sign = "-";
      b = nabs(b);
    }
    
    var move = Math.max(declen(a), declen(b));
    if (move != 0){
      a = right(a, move);
      b = right(b, move);
    }
    
    if (b == "1")return [a, "0"];
    
    var qr = qarLong(a, b);
    return [qr[0], left(qr[1], move)];
  }
  
  // long division of positive (non-zero) integes a and b
  function qarLong(a, b){
    var quot = "";
    var curr = "";
    var k;
    var arr = ["0", b, add(b, b)];
    for (var i = 0; i < len(a); i++){
      curr += a[i];
      curr = triml(curr);
      if (ge(curr, b)){
        for (k = 2; ge(curr, arr[k]); k++){
          if (k+1 == len(arr))arr[k+1] = add(arr[k], b);
        }
        quot += k-1;
        curr = sub(curr, arr[k-1]);
      } else {
        if (quot != "")quot += "0";
      }
    }
    if (quot == "")quot = "0";
    
    return [quot, curr];
  }
  
  // @param num n
  // @param num m
  // @return str prod
  function mulran(n, m){
    if (n == m)return str(n);
    if (m < n)return "1";
    return mul(mulran(n, Math.floor((n+m)/2)),
               mulran(Math.floor((n+m)/2)+1, m));
  }
  
  frac.nums = [0, "0", "1"]; // [n, pn, qn]
  function frac(a, b, p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    function fin(n, p1, q1){
      frac.nums = [n, p1, q1];
      return div(p1, q1, p);
    }
    
    var p0 = "1";
    var p1 = a(0);
    if (nulp(p1))return fin(0, "0", "1");
    var q0 = "0";
    var q1 = "1";
    var bn1 = b(1);
    if (nulp(bn1))return fin(0, p1, q1);
    var prod = bn1;
    var pn, qn, an, bn;
    for (var n = 1; true; n++){
      an = a(n); bn = bn1;
      if (nulp(an) || nulp(bn))return fin(n-1, p1, q1);
      bn1 = b(n+1);
      pn = add(mul(an, p1), mul(bn, p0));
      qn = add(mul(an, q1), mul(bn, q0));
      if (!nulp(bn1))prod = mul(prod, bn1);
      if (qn === "0")err(frac, "qn can never equal 0");
      if (2*nsiz(qn)-siz(prod)-2 >= p)return fin(n, pn, qn);
      p0 = p1; q0 = q1;
      p1 = pn; q1 = qn;
    }
  }
  
  sfrac.nums = [0, "0", "1"]; // [n, pn, qn]
  function sfrac(a, p){
    if (udfp(p))p = prec();
    if (p == -inf)return "0";
    
    function fin(n, p1, q1){
      sfrac.nums = [n, p1, q1];
      return div(p1, q1, p);
    }
    
    var p0 = "1";
    var p1 = a(0);
    if (nulp(p1))return fin(0, "0", "1");
    var q0 = "0";
    var q1 = "1";
    var pn, qn, an;
    for (var n = 1; true; n++){
      an = a(n);
      if (nulp(an))return fin(n-1, p1, q1);
      pn = add(mul(an, p1), p0);
      qn = add(mul(an, q1), q0);
      if (qn === "0")err(sfrac, "qn can never equal 0");
      if (2*nsiz(qn)-2 >= p)return fin(n, pn, qn);
      p0 = p1; q0 = q1;
      p1 = pn; q1 = qn;
    }
  }
  
  // http://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
  function primes(n){
    if (n >= 40000000)al("Warning: primeSieve: n = $1 >= 40000000; will take a long time; are you sure you want to proceed?", n);
    return primesErato(n);
  }
  
  function primesErato(n){
    var nums = [];
    var sqrtn = Math.floor(Math.sqrt(n));
    for (var i = 2; i <= sqrtn; i++){
      if (udfp(nums[i])){
        for (var j = i*i; j <= n; j += i){
          nums[j] = false;
        }
      }
    }
    var primes = [];
    for (var i = 2; i <= n; i++){
      if (udfp(nums[i]))primes.push(i);
    }
    return primes;
  }
  
  function factor(n){
    var factors = [];
    var sqrt = Math.sqrt(n);
    var i = 2;
    while (i <= sqrt){
      if (n % i == 0){
        factors.push(i);
        n /= i;
        sqrt = Math.sqrt(n);
      } else {
        i += (i == 2)?1:2;
      }
    }
    factors.push(n);
    return factors;
  }
  
  function gcd(a, b){
    if (b == 0)return a;
    return gcd(b, a % b);
  }
  
  ////// R object exposure //////
  
  win.R = {
    real: real,
    realint: realint,
    
    vldp: vldp,
    
    posp: posp,
    negp: negp,
    intp: intp,
    decp: decp,
    evnp: evnp,
    oddp: oddp,
    div5p: div5p,
    
    posdot: posdot,
    remdot: remdot,
    intlen: intlen,
    declen: declen,
    intpt: intpt,
    decpt: decpt,
    sign: sign,
    abs: abs,
    nabs: nabs,
    neg: neg,
    trim: trim,
    triml: triml,
    trimr: trimr,
    pad: pad,
    rndpos: rndpos,
    rndchr: rndchr,
    zero: zero,
    diff: diff,
    siz: siz,
    nsiz: nsiz,
    chke: chke,
    
    num2flt: num2flt,
    flt2num: flt2num,
    
    left: left,
    right: right,
    
    gt: gt,
    lt: lt,
    ge: ge,
    le: le,
    
    add: add,
    sub: sub,
    mul: mul,
    div: div,
    
    rnd: rnd,
    cei: cei,
    flr: flr,
    trn: trn,
    
    exp: exp,
    ln: ln,
    pow: pow,
    sqrt: sqrt,
    fact: fact,
    bin: bin,
    agm: agm,
    sin: sin,
    cos: cos,
    sinh: sinh,
    cosh: cosh,
    atan: atan,
    atan2: atan2,
    
    pi: pi,
    e: e,
    phi: phi,
    ln2: ln2,
    ln5: ln5,
    ln10: ln10,
    
    qar: qar,
    mulran: mulran,
    frac: frac,
    sfrac: sfrac
  };
  
  ////// Logging //////
  
  var logger = function (subj, data){};
  
  function log(subj){
    logger(subj + ": ", $.apl($.stf, $.sli(arguments, 1)));
  }
  
  function logfn(f){
    if (udfp(f))return logger;
    return logger = f;
  }
  
  $.efn(function (e){
    logger("Error: ", e.s + ": " + e.a);
  });
  
  ////// PMath object exposure //////
  
  win.PMath = {
    prec: prec,
    log: log,
    logfn: logfn
  };
  
  ////// Speed tests //////
  
  function a(){
    pad("2343543", "0.12352436343", 5);
  }
  
  function b(){
    //pad3("2343543", "0.12352436343", 5);
  }
  
  //al("");
  //$.spd(a, b, 10000);
  
  ////// Testing //////
  
  //al(sub("159", "0"));
  //al(rnd("44.52352436343", -2));
  //al(add("235324", "25324832.23523423"));
  //al(add2("235324", "25324832.23523423"));
  //al(pad("234", "28374835.2385732432849328"));
  //al(pad2("234", "28374835.2385732432849328"));
  //al(pi(50));
  //al(mul("7", acotCont("239", 53)));
  //al(div("134", "545"));
  //al(sin("3", 50));
  //al(sin6("3", 50));
  
  //alert(acothCont("5", 1000));
  //alert($.toStr(factor(9007199254740992)))
  //$.prn($.toStr(primeSieve(40000000)));
  //ln("3", 74)
  //alert(exp("31.81138866287038805391", 16);
  //10^ln(1000000)
  //(n=1000000),(x=5),(div(root(-n, x, 30)+root(n, x, 30), 2, 30)-1)*10^(2*ln(n)/ln(10))
  /*alert(C.add(C.cbrt(C.add(C.num(2,0), C.sqrt(C.num(5,0), 20))), 
              C.cbrt(C.sub(C.num(2,0), C.sqrt(C.num(5,0), 20)))));*/
  /*alert(add(cbrt(add(N(2,0), sqrt(N(5,0), 20))),
              cbrt(sub(N(2,0), sqrt(N(5,0), 20)))));*/
  //alert(C.add([5,6], [5,6], [34,0]));
  //alert(cosh("53", 100))
  //alert(sinh("53", 100));
  //alert(acotTaylorTrans("100", 100));
  //alert(acotTaylor("100.1923482127318294820968048023985039752304", 300));
  //alert(acotCont("100", 100));
  //alert(qar("11.1", "10"));
  //alert(R.add("234", "5342wef352", -2));
  //alert(R.add(234, 534352, -2));
  //alert(piAgm(100));
  //alert(pi(100));
  //alert(cos("3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117068", 100));
  //alert(cos("345", 100));
  //alert(sin("345", 100));
  //alert(powDec("0.575191894877256230890772160745317261688633931261640307243905153859804691482989849083830787632877478036291", "3", 102));
  //div("1", "1234234", 10000);
  //alert(recirNewton("1234234", 1000));
  //alert(agm2("1", "5", 1000));
  //alert(num("67807605593876998225639611741717507160044406952123769823017078477347541234546616714380003884811710403176445669043915873614906808830502905189260435685335795761967550017493759538635501269695284474671621052265475243600708269252935618694352594964091477818619517242971125270530710438712233364008605803645191272443"));
  //alert(sqrtAppr("6780760559387699822563961174171750716004440695212376982301707847734754123454661671438000388481171040317644566904391587361490680883050290518926043568533579576196755001749375953863550126969528447467162105226547524360070826925293561869435259496409147781861951724297112527053071043871223336400860580364519127222202896924663571827"));
  //sqrt("12384.1928342839058290580234908213492306804", 1000)
  //alert(sqrtAppr("34235217823582093482903865902384902386502374023784023850287502174028438590238490238490238590238490324"));
  //alert($.toStr(flt2num(num2flt("0.00000023423453243"))));
  //alert(agm("1", "5", 160));
  //alert(isqrt("6780760559387699822563961174171750716004440695212376982301707847734754123454661671438000388481171040317644566904391587361490680883050290518926043568533579576196755001749375953863550126969528447467162105226547524360070826925293561869435259496409147781861951724297112527053071043871223336400860580364519127222202896924663571827"));
  //alert(sqrt("6.780760559387699822563961174171750716004440695212376982301707847734754123454661671438000388481171040317644566904391587361490680883050290518926043568533579576196755001749375953863550126969528447467162105226547524360070826925293561869435259496409147781861951724297112527053071043871223336400860580364519127222202896924663571827", 162));
  //alert(sqrtNewton(mul("2.618033988749894848204586834365638117720309179805762862135448622705260462818902449707207204189391137484754088075386891752126633862223536931793180060766726354433389", "2.590020064111351452684175395673489376179582365370676141822337340714210013770674048615727578674943945478898935722942703089672088513775856188413687579011184808974943"), 162));
  //alert(mul("2.618033988749894848204586834365638117720309179805762862135448622705260462818902449707207204189391137484754088075386891752126633862223536931793180060766726354433389", "2.590020064111351452684175395673489376179582365370676141822337340714210013770674048615727578674943945478898935722942703089672088513775856188413687579011184808974943"));
  //alert(sqrtShift("0.34", 1000));
  //alert(sqrtNewton("23423421.38", 1000));
  //alert(left(sqrtCont("2342342138", 999), 1));
  //alert(sqrt("234234235435235325", 100));
  //alert(diff("-253423621415.0127350928423492806541", "253423621415.5127350928423492806540", 0));
  //alert(sqrtNewton2("234234235435", 100));
  //alert(diff3("10.9", "5.4", -1));
  //alert(diff3("10.07", "9.56", 0));
  //alert(sqrtNewton2("234234235435", 100));
  //alert(isqrt2("6"));
  //alert(rnd("2217119.999999999986868995423876", 2));
  //alert(sqrtNewton(mul("1.24232492", left("1", 350)), 350));
  //alert(mul("1488.999664204126", "1488.999664204126", 2));
  //alert(checkE("2.34e-5"));
  //alert(pi(25));
  //alert(exp("400"));
  //alert(document.write(factDiv(7000)));
  //alert(expTaylor2("100", 16));
  //alert(div("0", "0", 100))
  //alert(ge("3434.4", "3434.4"));
  //alert(divLong("232354", "235234343", 100));
  //alert(zero("534", -4));
  //alert(add1("98"));
  //alert(left("2.125", -3));
  //alert(flr("-0.0004", -1));
  //alert(flr("-0.0004", -1));
  //alert(trimr("0.0"));
  //alert($.toStr(mul("2.125", "8")));
  //alert($.toStr(mul("0.33", "0.61")));
  //alert($.toStr(mulKarat("11", "12")));
  //alert($.toStr(right("0", 3)));
  //alert($.toStr(mulKarat3("113", "122")));
  //alert($.toStr(mulKarat("12889304874632686622709889801374997985331608535613486153184514967230328583632747848036257469982508572688186681932235896221449373057559635914390302139001058088604612498464803714651813568325261804161685272593137009196211865717877230721450887059497494404191409168185560590069601524211690126856004610823898742171174787233827863475992465580934967787013678493354213629743687806200677568982345495217255907891972630589137893145288578735118248138334178942892688371680125033115325551384222140304267738554980447979050316735753243615685124600422684053835010951389209821531089879919221429933151887593143692918885438823447455305969701299650004792692860261362017725437384781206928452968705762886015451905991924983637757907828859716371381803958521772224509979149453702919220207438111281202333127668546378270696528833311475796075206863947539864658853504242910373327154388564044608258803212987592629450472312855637293642012934273865791072469048", "323453465848203984902384901823759872984729875983879058098509128904823095209348709238509437598023740928390583246534255238509238409238084423243264363415264352444632423323453465848203984902384902385092384092380844232432643634152643524323453465848203984902384901823759872984729875983879058098509128904823095209348709238509437598023740928390583246534255238509238409238084423243264363415264352444632423323453465848203984902384902385092384092380844232432643634152643524")));
  //alert($.toStr(mulKarat3("39849023849018237598729847298759838790580985091289048230952093487092385094375980237409283905832465343984902384901823759872984729875983879058098509128904823095209348709238509437598023740928390583246534198273408230948092680932840923840923759827489273850963904823908690486908903045893048690348902835093849058790465890843908230958024", "323453465848203984902384901823759872984729875983879058098509128904823095209348709238509437598023740928390583246534255238509238409238084423243264363415264352444632423323453465848203984902384902385092384092380844232432643634152643524323453465848203984902384901823759872984729875983879058098509128904823095209348709238509437598023740928390583246534255238509238409238084423243264363415264352444632423323453465848203984902384902385092384092380844232432643634152643524")));
})(window);
