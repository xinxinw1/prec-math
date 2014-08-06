/***** Perfectly Precise Math Library 4.2.1 *****/

/* require tools 4.1.5 */

(function (udf){
  ////// Import //////
  
  var nodep = $.nodep;
  var inf = Infinity;
  var num = Number;
  var str = String;
  
  var strp = $.strp;
  var inp = $.inp;
  
  var al = $.al;
  
  var apl = $.apl;
  var sli = $.sli;
  var stf = $.stf;
  
  var spd = $.spd;
  var err = $.err;
  var sefn = $.sefn;
  
  ////// Default precision //////
  
  var prec = 16;
  
  function gprec(p){
    return prec;
  }
  
  function sprec(p){
    return prec = p;
  }
  
  ////// Real number functions //////
  
  //// Converters ////
  
  function real(a){
    a = str(a);
    if (!vldp(a))return false;
    return trim(a);
  }
  
  function realint(a){
    a = str(a);
    if (!vldp(a))return false;
    a = trim(a);
    if (!intp(a))return false;
    return num(a);
  }
  
  //// Validators ////
  
  function vldp(a){
    return strp(a) && /^-?[0-9]+(\.[0-9]+)?$/.test(a);
  }
  
  /*! All real num functions past here assumes all inputs are valid !*/
  
  //// Canonicalizers ////
  
  function trim(a){
    var s = negp(a);
    if (s)a = remneg(a);
    a = trimn(a);
    return (a != "0" && s)?"-"+a:a;
  }
  
  // Trim unsigned number
  function trimn(a){
    return decp(a)?trimd(a):trimi(a);
  }
  
  // Trim zeros at start of non-negative integer
  function trimi(a){
    for (var i = 0; i < a.length; i++){
      if (a[i] != '0'){
        if (i != 0)return a.substring(i, a.length);
        return a;
      }
    }
    return "0";
  }
  
  function trimd(a){
    a = trimdl(a);
    a = trimr(a);
    return a;
  }
  
  // Trim zeros at start of integer part
  function trimdl(a){
    for (var i = 0; i < a.length; i++){
      if (a[i] != '0'){
        if (a[i] == '.')return a.substring(i-1, a.length);
        if (i != 0)return a.substring(i, a.length);
        return a;
      }
    }
    return "0";
  }
  
  // Trim zeros at end of decimal part
  function trimr(a){
    for (var i = a.length-1; i >= 0; i--){
      if (a[i] != '0'){
        if (a[i] == '.')return a.substring(0, i);
        if (i != a.length-1)return a.substring(0, i+1);
        return a;
      }
    }
    return "0";
  }
  
  /*! All real num functions past here assumes all inputs are trimmed !*/
  
  //// is... functions
  
  function posp(a){
    return a[0] != '-';
  }
  
  function negp(a){
    return a[0] == '-';
  }
  
  function intp(a){
    return a.indexOf(".") == -1;
  }
  
  function decp(a){
    return a.indexOf(".") != -1;
  }
  
  function evnp(a){
    if (decp(a))return false;
    return inp(a[a.length-1], '0', '2', '4', '6', '8');
  }
  
  function oddp(a){
    if (decp(a))return false;
    return inp(a[a.length-1], '1', '3', '5', '7', '9');
  }
  
  function div5p(a){
    if (decp(a))return false;
    return inp(a[a.length-1], '0', '5');
  }
  
  //// Processing functions ////
  
  function posdot(a){
    var dot = a.indexOf(".");
    return (dot == -1)?a.length:dot;
  }
  
  function remdot(a){
    var dot = a.indexOf(".");
    if (dot == -1)return a;
    return a.substring(0, dot) + a.substring(dot+1, a.length);
  }
  
  function intlen(a){
    return negp(a)?posdot(a)-1:posdot(a);
  }
  
  function declen(a){
    var dot = a.indexOf(".");
    if (dot == -1)return 0;
    return a.length-1-dot;
  }
  
  function intpt(a){
    var dot = a.indexOf(".");
    if (dot == -1)return a;
    return a.substring(a, 0, dot);
  }
  
  function decpt(a){
    var dot = a.indexOf(".");
    if (dot == -1)return "";
    return a.substring(dot+1, a.length);
  }
  
  function sign(a){
    return (a[0] == '-')?"-":"";
  }
  
  // alias of remsgn
  function remneg(a){
    return a.substring(1, a.length);
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
  
  // return rnd(a, p) == "0";
  // not part of "is... functions" because it involves rounding and nprec
  function zero(a, p){ 
    if (a == "0")return true;
    if (p == udf)p = 0;
    
    if (negp(a))a = remneg(a);
    
    var adot = a.indexOf(".");
    if (p < 0){
      if (adot == -1)adot = a.length;
      if (adot+p <= -1)return true;
      return adot+p == 0 && num(a[adot+p]) < 5;
    } else {
      if (adot == -1 || a[0] != '0')return false;
      if (p == 0)return num(a[adot+1]) < 5;
      if (adot+1+p >= a.length)return false;
      
      for (var i = adot+1; i < adot+1+p; i++){
        if (a[i] != '0')return false;
      }
      return num(a[adot+1+p]) < 5;
    }
  }
  
  // return zero(sub(a, b), p);
  function diff(a, b, p){
    if (a == b)return true;
    if (p == udf)p = 0;
    
    if (negp(a)){
      if (!negp(b)){
        return zero(sub(a, b), p);
        //b = add(remneg(a), b);
        //a = "0";
      } else {
        a = remneg(a);
        b = remneg(b);
      }
    } else if (negp(b)){
      return zero(sub(a, b), p);
      //a = add(a, remneg(b));
      //b = "0";
    }
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    var dot = posdot(a);
    var pos;
    if (p < 0){
      pos = dot+p;
      if (pos < 0)return true;
    } else {
      pos = dot+p+1;
      if (pos >= a.length)return false;
    }
    
    for (var i = 0; i < pos; i++){
      if (a[i] != b[i]){
        if (num(a[i]) > num(b[i])){
          // a = 100.0, b = 099.9, p = 0
          // in if: a = 200.0, b = 099.9, p = 0
          if (num(b[i]) != num(a[i])-1)return false;
          // a = 100.0, b = 099.9, p = 0
          for (i = i+1; i < pos; i++){
            if (a[i] == '.')continue;
            // in if: a = 100.0, b = 098.9, p = 0
            if (a[i] != '0' || b[i] != '9')return false;
          }
          var diff = num(a[i]) - num(b[i]);
          // in if: a = 100.0, b = 099.4, p = 0
          if (diff != -5)return diff < -5;
          for (i = i+1; i < a.length; i++){
            if (a[i] != b[i]){
              // a = 100.02, b = 099.51, p = 0
              return num(a[i]) < num(b[i]);
            }
          }
          // a = 100.01, b = 099.51, p = 0
          return false;
        } else {
          // b > a: flip all references to a and b
          if (num(a[i]) != num(b[i])-1)return false;
          for (i = i+1; i < pos; i++){
            if (b[i] == '.')continue;
            if (b[i] != '0' || a[i] != '9')return false;
          }
          var diff = num(b[i]) - num(a[i]);
          if (diff != -5)return diff < -5;
          for (i = i+1; i < b.length; i++){
            if (b[i] != a[i]){
              return num(b[i]) < num(a[i]);
            }
          }
          return false;
        }
      }
    }
    // a = 5.9, b = 5.0, p = 0
    var diff = num(a[i]) - num(b[i]);
    if (diff >= 0){
      // in if: a = 5.9, b = 5.0, p = 0
      if (diff != 5)return diff < 5;
      // a = 5.54, b = 5.04, p = 0
      for (i = i+1; i < a.length; i++){
        if (a[i] != b[i]){
          // a = 5.54, b = 5.00, p = 0
          return num(a[i]) < num(b[i]);
        }
      }
      // a = 5.5111, b = 5.0111, p = 0
      return false;
    } else {
      // b > a: flip all references to a and b
      if (diff != -5)return diff > -5;
      for (i = i+1; i < b.length; i++){
        if (b[i] != a[i]){
          return num(b[i]) < num(a[i]);
        }
      }
      return false;
    }
  }
  
  // equals flr(log(abs(a)))+1
  function siz(a){
    if (a == "0")return -inf;
    
    if (negp(a))a = remneg(a);
    
    var fa = trn(a);
    if (fa != "0")return fa.length;
    
    // 2 = a.indexOf(".")+1
    // 2-i = -(i-(a.indexOf(".")+1))
    for (var i = 2; i < a.length; i++){
      if (a[i] != '0')return 2-i;
    }
    
    err(siz, "Something strange happened");
  }
  
  // equals flr(log(abs(a)));
  function nsiz(a){
    if (a == "0")return -inf;
    
    if (negp(a))a = remneg(a);
    
    var fa = trn(a);
    if (fa != "0")return fa.length-1;
    
    // 2 = a.indexOf(".")+1
    // 2-i = -(i-(a.indexOf(".")+1))
    for (var i = 2; i < a.length; i++){
      if (a[i] != '0')return 2-i-1;
    }
    
    err(nsiz, "Something strange happened");
  }
  
  // input a = num(a);
  function chke(a){
    a = str(a);
    
    if (a == "Infinity")a = "1.7976931348623157e+308";
    else if (a == "-Infinity")a = "-1.7976931348623157e+308";
    
    var pos = a.indexOf("e");
    if (pos == -1)return a;
    
    var front = a.substring(0, pos);
    var sign = a[pos+1];
    var back = num(a.substring(pos+2, a.length));
    
    if (sign == '+')return right(front, back);
    if (sign == '-')return left(front, back);
  }
  
  //// Floating point ////
  
  function num2flt(a){
    var sign = "";
    if (negp(a)){
      a = remneg(a);
      sign = "-";
    }
    
    if (a == "0")return ["0", 0];
    if (a[0] != '0'){
      // 152.53435435
      var adot = a.indexOf(".");
      if (adot == -1)adot = a.length;
      return [sign + left(a, adot-1), adot-1];
    } else {
      // 0.00043534 2 = a.indexOf(".");
      var i;
      for (i = 2; a[i] == '0'; i++){}
      return [sign + right(a, i-1), -(i-1)];
    }
  }
  
  function flt2num(a){
    if (a[1] > 0)return right(a[0], a[1]);
    if (a[1] == 0)return a[0];
    if (a[1] < 0)return left(a[0], -a[1]);
  }
  
  //// Dot movers ////
  
  // @param String a
  // @param Number n
  function left(a, n){ // 32.44 -> 3.244
    if (n == 0 || a == "0")return a;
    if (n < 0)return right(a, -n);
    
    var sign = "";
    if (negp(a)){
      a = remneg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    if (adot == -1)adot = alen;
    
    var zeros = n-adot;
    if (zeros >= 0){
      for (var i = zeros; i >= 1; i--)a = "0" + a;
      a = "0." + remdot(a);
    } else {
      if (adot == alen){
        a = a.substring(0, adot-n) + "." + a.substring(adot-n, alen);
      } else {
        a = a.substring(0, adot-n) + "." + a.substring(adot-n, adot) + a.substring(adot+1, alen);
      }
    }
    
    if (adot == alen)a = trimr(a);
    return sign + a;
  }
  
  // @param String a
  // @param Number n
  function right(a, n){ // 32.44 -> 324.4
    if (n == 0 || a == "0")return a;
    if (n < 0)return left(a, -n);
    
    // sign only used for trimdl
    var sign = "";
    if (negp(a)){
      a = remneg(a);
      sign = "-";
    }
    
    var adot = a.indexOf(".");
    if (adot != -1){
      var alen = a.length;
      var zeros = n-(alen-1-adot);
      if (zeros >= 0){
        for (var i = zeros; i >= 1; i--)a += "0";
        a = a.substring(0, adot) + a.substring(adot+1, a.length);
      } else {
        a = a.substring(0, adot) + a.substring(adot+1, adot+1+n) + "." + a.substring(adot+1+n, alen);
      }
    } else {
      for (var i = n; i >= 1; i--)a += "0";
    }
    
    if (adot != alen)a = trimdl(a);
    return sign + a;
  }
  
  //// Comparison functions ////
  
  function gt(a, b){ // is (a > b) ?
    if (a == b)return false;
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    a = remdot(a);
    b = remdot(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (num(a[i]) > num(b[i]));
    }
    
    err(gt, "Something strange happened (input not trimical)");
  }
  
  function lt(a, b){ // is (a < b) ?
    if (a == b)return false;
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    a = remdot(a);
    b = remdot(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (num(a[i]) < num(b[i]));
    }
    
    err(lt, "Something strange happened (input not trimical)");
  }
  
  function ge(a, b){ // is (a >= b) ?
    if (a == b)return true;
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    a = remdot(a);
    b = remdot(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (num(a[i]) > num(b[i]));
    }
    
    err(ge, "Something strange happened (input not trimical)");
  }
  
  function le(a, b){ // is (a <= b) ?
    if (a == b)return true;
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    a = remdot(a);
    b = remdot(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (num(a[i]) < num(b[i]));
    }
    
    err(le, "Something strange happened (input not trimical)");
  }
  
  //// Basic operation functions ////
  
  function add(a, b, p){
    if (p == -inf)return "0";
    
    var sign = "";
    if (negp(a)){
      if (!negp(b))return sub(b, remneg(a), p);
      sign = "-";
      a = remneg(a);
      b = remneg(b);
    } else if (negp(b))return sub(a, remneg(b), p);
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    var small;
    var sum = "";
    var carry = 0;
    for (var i = a.length-1; i >= 0; i--){
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
    
    return (p == udf)?sum:rnd(sum, p);
  }
  
  function sub(a, b, p){
    if (a == b)return "0";
    if (p == -inf)return "0";
    
    if (negp(a)){
      if (!negp(b))return add(a, "-" + b, p);
      else {
        var c = a;
        a = remneg(b);
        b = remneg(c);
      }
    } else if (negp(b))return add(a, remneg(b), p);
    
    var arr = pad(a, b);
    a = arr[0]; b = arr[1];
    
    if (gt(b, a))return neg(sub(b, a, p));
    
    var small;
    var diff = "";
    var borrow = 0;
    for (var i = a.length-1; i >= 0; i--){
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
    
    return (p == udf)?diff:rnd(diff, p);
  }
  
  function mul(a, b, p){
    if (a == "0" || b == "0")return "0";
    if (p == -inf)return "0";
    
    var sign = "";
    if (negp(a)){
      a = remneg(a);
      if (!negp(b))sign = "-";
      else b = remneg(b);
    } else if (negp(b)){
      sign = "-";
      b = remneg(b);
    }
    
    var dec = 0;
    if (decp(a)){
      dec += declen(a);
      a = remdot(a);
      a = trimi(a);
    }
    if (decp(b)){
      dec += declen(b);
      b = remdot(b);
      a = trimi(a);
    }
    
    var prod = mulInt(a, b);
    if (dec > 0)prod = left(prod, dec);
    prod = sign + prod;
    
    return (p == udf)?prod:rnd(prod, p);
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
      prod = add(prod, curr);
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
      var a0 = trimi(a.substring(alen-m, alen));
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
    
    var a1 = a.substring(0, alen-m);
    var a0 = trimi(a.substring(alen-m, alen));
    var b1 = b.substring(0, blen-m);
    var b0 = trimi(b.substring(blen-m, blen));
    
    var z2 = mulKarat(a1, b1);
    var z0 = mulKarat(a0, b0);
    var z1 = sub(sub(mulKarat(add(a1, a0), add(b1, b0)), z2), z0);
    
    return add(add(right(z2, 2*m), right(z1, m)), z0);
  }
  
  function div(a, b, p){
    if (b == "0")err(div, "b cannot be 0");
    if (a == "0")return "0";                  
    if (b == "1")return rnd(a, p);
    
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    var sign = "";
    if (negp(a)){
      a = remneg(a);
      if (!negp(b))sign = "-";
      else b = remneg(b);
    } else if (negp(b)){
      sign = "-";
      b = remneg(b);
    }
    
    var move = Math.max(declen(a), declen(b));
    if (move != 0){
      a = right(a, move);
      b = right(b, move);
    }
    
    var quot = divLong(a, b, p);
    return (quot == "0")?quot:sign + quot;
  }
  
  // long division of positive (non-zero) integers a and b
  function divLong(a, b, p){
    var quot = "0";
    var curr = "";
    var k;
    var arr = ["0", b, add(b, b)];
    var alen = a.length;
    for (var i = 0; i < alen+p+1; i++){
      if (i < alen)curr += a[i];
      else {
        if (curr == "0")break;
        if (i == alen)quot += ".";
        curr += "0";
      }
      curr = trimi(curr);
      if (ge(curr, b)){
        for (k = 2; ge(curr, arr[k]); k++){
          if (k+1 == arr.length)arr[k+1] = add(arr[k], b);
        }
        quot += k-1;
        curr = sub(curr, arr[k-1]);
      } else {
        quot += "0";
      }
    }
    quot = trim(quot);
    if (p < 0 && quot != "0"){
      for (var i = -p-1; i >= 1; i--)quot += "0";
    }
    
    return (quot == "0")?quot:rnd(quot, p);
  }
  
  //// Rounding functions ////
  
  function rnd(a, p){
    if (a == "0")return "0";
    if (p == -inf)return "0";
    
    var sign = "";
    if (negp(a)){
      a = remneg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (p == 0 || p == udf){
      if (adot == -1)return sign + a;
      var round = a.substring(0, adot);
      if (num(a[adot+1]) >= 5)round = addOne(round);
    } else if (p < 0){
      if (adot == -1)adot = alen;
      if (adot+p <= -1)return "0";
      
      var round = a.substring(0, adot+p);
      if (round == "")round = "0";
      if (num(a[adot+p]) >= 5)round = addOne(round);
      if (round != "0"){
        for (var d = -p; d >= 1; d--)round += "0";
      }
    } else {
      if (adot == -1 || adot+p+1 >= alen)return sign + a;
      
      var round = a.substring(0, adot+p+1);
      if (num(a[adot+p+1]) >= 5)round = addOneDec(round);
      round = trimn(round);
    }
    
    return (round == "0")?round:sign + round;
  }
  
  function cei(a, p){
    if (a == "0")return "0";
    if (p == -inf)return "0";
    
    var sign = "";
    if (negp(a)){
      a = remneg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (p == 0 || p == udf){
      if (adot == -1)return sign + a;
      var round = a.substring(0, adot);
      if (sign == "")round = addOne(round);
    } else if (p < 0){
      if (adot == -1)adot = alen;
      if (adot+p <= 0){
        if (sign == ""){
          var round = "1";
          for (var d = -p; d >= 1; d--)round += "0";
        } else {
          return "0";
        }
      }
      
      var round = a.substring(0, adot+p);
      if (sign == "")round = addOne(round);
      if (round != "0"){
        for (var d = -p; d >= 1; d--)round += "0";
      }
    } else {
      if (adot == -1 || adot+p+1 >= alen)return sign + a;
      
      var round = a.substring(0, adot+p+1);
      if (sign == "")round = addOneDec(round);
      round = trimn(round);
    }
    
    return (round == "0")?round:sign + round;
  }
  
  function flr(a, p){
    if (a == "0")return "0";
    if (p == -inf)return "0";
    
    var sign = "";
    if (negp(a)){
      a = remneg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (p == 0 || p == udf){
      if (adot == -1)return sign + a;
      var round = a.substring(0, adot);
      if (sign == "-")round = addOne(round);
    } else if (p < 0){
      if (adot == -1)adot = alen;
      if (adot+p <= 0){
        if (sign == "-"){
          var round = "1";
          for (var d = -p; d >= 1; d--)round += "0";
        } else {
          return "0";
        }
      }
      
      var round = a.substring(0, adot+p);
      if (sign == "-")round = addOne(round);
      if (round != "0"){
        for (var d = -p; d >= 1; d--)round += "0";
      }
    } else {
      if (adot == -1 || adot+p+1 >= alen)return sign + a;
      
      var round = a.substring(0, adot+p+1);
      if (sign == "-")round = addOneDec(round);
      round = trimn(round);
    }
    
    return (round == "0")?round:sign + round;
  }
  
  function trn(a, p){
    if (a == "0")return "0";
    if (p == -inf)return "0";
    
    var sign = "";
    if (negp(a)){
      a = remneg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (p == 0 || p == udf){
      if (adot == -1)return sign + a;
      var round = a.substring(0, adot);
    } else if (p < 0){
      if (adot == -1)adot = alen;
      if (p+adot <= -1)return "0";
      
      var round = a.substring(0, adot+p);
      if (round == "")round = "0";
      else if (round != "0"){
        for (var d = -p; d >= 1; d--)round += "0";
      }
    } else {
      if (adot == -1 || adot+p+1 >= alen)return sign + a;
      
      var round = a.substring(0, adot+p+1);
      round = trimr(round);
    }
    
    return (round == "0")?round:sign + round;
  }
  
  // add 1 to non-negative integer
  function addOne(a){
    for (var i = a.length-1; i >= 0; i--){
      if (a[i] != '9'){
        var sum = a.substring(0, i) + (num(a[i])+1);
        for (var j = a.length-1-i; j >= 1; j--)sum += "0";
        return sum;
      }
    }
    sum = "1";
    for (var i = a.length; i >= 1; i--)sum += "0";
    return sum;
  }
  
  // add 1 to last place value in decimal
  function addOneDec(a){
    for (var i = a.length-1; i >= 0; i--){
      if (a[i] == '.')continue;
      if (a[i] != '9'){
        var sum = a.substring(0, i) + (num(a[i])+1);
        for (var j = a.indexOf(".")-1-i; j >= 1; j--)sum += "0";
        return sum;
      }
    }
    sum = "1";
    for (var i = a.indexOf("."); i >= 1; i--)sum += "0";
    return sum;
  }
  
  //// Extended operation functions ////
  
  function exp(a, p){
    if (a == "0")return rnd("1", p);
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    if (negp(a))return div("1", expPos(remneg(a), p+2), p);
    return expPos(a, p);
  }
  
  function expPos(a, p){
    if (intp(a))return expInt(a, p);
    
    var fl = num(trn(a));
    a = "0." + decpt(a);
    if (gt(a, "0.5")){
      a = sub(a, "1");
      fl++;
    }
    
    if (fl == 0)return expDec(a, p);
    var expfl = expInt(str(fl), p+2);
    return mul(expfl, expDec(a, p+2+siz(expfl)), p);
  }
  
  function expInt(a, p){
    var an = num(a);
    if (an == 1)return e(p);
    return powDec(e(p+2+(an-1)*(siz(a)+1)), an, p);
  }
  
  function expDec(a, p){
    var dec = decpt(a);
    var declen = dec.length;
    if (declen <= 30)return expTaylorFrac(a, p);
    return expTaylorTerms(a, p);
  }
  
  // Taylor Series with big fraction
  function expTaylorFrac(a, p){
    if (decp(a))a = rnd(a, p+2);
    var frac1 = add(a, "1");
    var frac2 = "1";
    var pow = a;
    for (var i = 2; true; i++){
      frac1 = mul(frac1, str(i));
      pow = mul(pow, a);
      frac1 = add(frac1, pow);
      frac2 = mul(frac2, str(i));
      if (nsiz(frac2)-siz(pow)-2 >= p)break;
    }
    
    return div(frac1, frac2, p);
  }
  
  // Taylor Series adding term by term
  function expTaylorTerms(a, p){
    var ar = rnd(a, p+3);
    var pow = ar;
    var fact = "1";
    var frac = "1";
    var exp = add(ar, "1");
    for (var i = 2; true; i++){
      pow = mul(pow, ar, p+3);
      fact = mul(fact, str(i));
      frac = div(pow, fact, p+3);
      if (zero(frac, p+1))break;
      exp = add(exp, frac);
    }
    
    return rnd(exp, p);
  }
  
  function ln(a, p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    if (negp(a))err(ln, "a cannot be negative");
    if (a == "0")err(ln, "a cannot be zero");
    
    var tens = siz(a)-1;
    //if (tens > 0)a = left(a, tens);
    //else if (tens < 0)a = right(a, -tens);
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
        return add(add(lnsmall, mul(twos, l2)),
                   mul(fives, l5),
                   p);
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
      frac1 = mul(frac1, a1, p+2);
      frac = div(frac1, str(i), p+2);
      if (zero(frac, p+1))break;
      if (sign)ln = sub(ln, frac);
      else ln = add(ln, frac);
    }
   
    return rnd(ln, p);
  }
  
  function pow(a, b, p){
    if (a == "0" || a == "1" || b == "1")return rnd(a, p);
    if (b == "0")return rnd("1", p);
    if (b == "-1")return div("1", a, p);
    if (p == -inf)return "0";
    
    var sign = negp(b);
    if (sign)b = remneg(b);
    
    var pow;
    if (intp(b)){
      if (b == "2")pow = mul(a, a, p);
      else if (intp(a) || p == udf)pow = powExact(a, num(b), p);
      else pow = powDec(a, num(b), p);
    } else {
      if (p == udf)p = prec;
      pow = exp(mul(b, ln(a, p+6+siz(b)), p+4), p);
    }
    
    return (sign)?div("1", pow, p):pow;
  }
  
  // http://en.wikipedia.org/wiki/Exponentiation_by_squaring
  // @param String a
  // @param num n
  function powExact(a, n, p){
    var prod = "1";
    while (n > 0){
      if (n % 2 == 1){
        prod = mul(prod, a);
        n--;
      }
      a = mul(a, a);
      n = n/2;
    }
    return (p == udf)?prod:rnd(prod, p);
  }
  
  // @param String a
  // @param num n
  function powDec(a, n, p){
    var sign = "";
    if (negp(a) && n % 2 == 1){
      sign = "-";
      a = remneg(a);
    }
    return rnd(sign + powDec2(a, n, p), p);
  }
  
  function powDec2(a, n, p){
    if (n == 0)return "1";
    if (n % 2 == 1)return mul(a, powDec2(a, n-1, p+2+siz(a)), p);
    var a2 = powDec2(a, n/2, p+2+Math.ceil(n/2*siz(a)));
    return mul(a2, a2, p);
  }
  
  function sqrt(a, p){
    if (negp(a))err(sqrt, "a cannot be negative");
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    if (intp(a))return sqrtCont(a, p);
    if (p < 50)return sqrtNewton(a, p);
    return sqrtShift(a, p);
  }
  
  // uses identity sqrt(a) = sqrt(100*a)/10 to remove decimals
  // and then uses continued fraction
  function sqrtShift(a, p){
    var dec = 0;
    if (decp(a)){
      dec += declen(a);
      a = remdot(a);
      a = trimi(a);
      if (dec % 2 == 1)a += "0";
      dec = Math.ceil(dec/2);
    }
    
    var sqrt = sqrtCont(a, p-dec);
    return left(sqrt, dec);
  }
  
  // continued fraction
  // http://en.wikipedia.org/wiki/Generalized_continued_fraction
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
      if (zero(func1, p+1))break;
      sqrt = sub(sqrt, func1);
    }
    
    return rnd(sqrt, p);
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
      if (zero(func1, 1))break;
      sqrt = sub(sqrt, func1);
    }
    
    return trn(sqrt);
  }
  
  // sqrt approximation that doesn't go bust when a.length >= 308
  // unlike chke(Math.sqrt(num(a)));
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
      a[1] = ((a[1]-1) / 2);
    } else {
      a[0] = Math.sqrt(a[0]);
      a[1] = a[1] / 2;
    }
    
    a[0] = str(a[0]);
    a = flt2num(a);
    
    return a;
  }
  
  function fact(a, p){
    if (decp(a) || negp(a))err(fact, "a must be a positive integer");
    if (p == -inf)return "0";
    a = num(a);
    
    var fact = factDiv(a);
    return (p == udf)?fact:rnd(fact, p);
  }
  
  // @param num a
  // @return String prod
  function factDiv(a){
    return mulran(1, a);
  }
  
  function bin(n, k, p){
    if (gt(k, n))err(bin, "n must be >= k");
    if (!intp(k) || !intp(n) || negp(k) || negp(n)){
      err(bin, "n and k must be positive integers");
    }
    if (p == -inf)return "0";
    n = num(n); k = num(k);
    
    var b = div(mulran(k+1, n), factDiv(n-k));
    return (p == udf)?b:rnd(b, p);
  }
  
  // http://en.wikipedia.org/wiki/Arithmetic%E2%80%93geometric_mean
  function agm(a, b, p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    var c, d;
    while (true){
      c = div(add(a, b), "2", p+2);
      d = sqrt(mul(a, b, p+5+siz(a)+siz(b)), p+2);
      if (diff(a, c, p))break;
      a = c; b = d;
    }
    
    return rnd(c, p);
  }
  
  function sin(a, p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    var sign = false;
    if (negp(a)){
      a = remneg(a);
      sign = !sign;
    }
    
    var intPart = Math.floor(num(a))/3;
    if (intPart < 1)intPart = 1;
    var dec = declen(a);
    if (dec <= 1)dec += 1;
    if (intPart*dec <= 75){
      var sin = sinTaylorFrac(a, p);
      return (sign)?neg(sin):sin;
    }
    
    var pii = pi(p+3+siz(a));
    var tpi = mul("2", pii); // 2*pi
    a = sub(a, mul(div(a, tpi, 0), tpi));
    
    if (negp(a)){
      a = remneg(a);
      sign = !sign;
    }
    
    var hpi = div(pii, "2", p+2); // pi/2
    var numhpi = div(a, hpi, 0);
    var sin;
    switch (numhpi){
      case "0":
        sin = sinTaylorTerms(a, p);
        break;
      case "1":
        a = sub(a, hpi);
        sin = cosTaylorTerms(a, p);
        break;
      case "2":
        a = sub(a, pii);
        sin = sinTaylorTerms(a, p);
        sign = !sign;
        break;
      case "3":
        a = sub(a, add(hpi, pii));
        sin = cosTaylorTerms(a, p);
        sign = !sign;
        break;
    }
    
    return (sign)?neg(sin):sin;
  }
  
  // Taylor series
  function sinTaylorTerms(a, p){
    var intp = (a.indexOf(".") == -1);
    var frac1 = a;
    var frac2 = "1";
    var frac;
    var sin = a;
    var sign = true;
    if (intp)var a2 = mul(a, a);
    for (var i = 3; true; i += 2, sign = !sign){
      if (intp)frac1 = mul(frac1, a2);
      else frac1 = powDec(a, i, p+2);
      frac2 = mul(frac2, str(i*(i-1)));
      frac = div(frac1, frac2, p+2);
      if (zero(frac, p+1))break;
      if (sign)sin = sub(sin, frac);
      else sin = add(sin, frac);
    }
    
    return rnd(sin, p);
  }
  
  // Taylor series with big fraction
  function sinTaylorFrac(a, p){
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
      if (sign)frac1 = sub(frac1, pow);
      else frac1 = add(frac1, pow);
      frac2 = mul(frac2, prod);
      if (nsiz(frac2)-siz(pow)-2 >= p)break;
    }
    
    return div(frac1, frac2, p);
  }
  
  function sinTaylorFrac2(a, p){
    if (decp(a))a = rnd(a, p+2);
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
      if (sign)frac1 = sub(frac1, pow);
      else frac1 = add(frac1, pow);
      frac2 = mul(frac2, prod);
      if (nsiz(frac2)-siz(pow)-2 >= p)break;
    }
    
    return div(frac1, frac2, p);
  }
  
  function cos(a, p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    var sign = false;
    if (negp(a))a = remneg(a);
    
    var intPart = Math.floor(num(a))/3;
    if (intPart < 1)intPart = 1;
    var dec = declen(a);
    if (dec <= 1)dec += 1;
    if (intPart*dec <= 75)return cosTaylorFrac(a, p);
    
    var pii = pi(p+3+siz(a));
    var tpi = mul("2", pii);
    a = sub(a, mul(div(a, tpi, 0), tpi));
    
    if (negp(a))a = remneg(a);
    
    var hpi = div(pii, "2", p+2);
    var numhpi = div(a, hpi, 0);
    var cos;
    switch (numhpi){
      case "0":
        cos = cosTaylorTerms(a, p);
        break;
      case "1":
        a = sub(a, hpi);
        cos = sinTaylorTerms(a, p);
        sign = !sign;
        break;
      case "2":
        a = sub(a, pii);
        cos = cosTaylorTerms(a, p);
        sign = !sign;
        break;
      case "3":
        a = sub(a, add(hpi, pii));
        cos = sinTaylorTerms(a, p);
        break;
    }
    
    return (sign)?neg(cos):cos;
  }
  
  function cosTaylorTerms(a, p){
    var intp = (a.indexOf(".") == -1);
    var frac1 = "1";
    var frac2 = "1";
    var frac;
    var cos = "1";
    var sign = true;
    if (intp)var a2 = mul(a, a);
    for (var i = 2; true; i += 2, sign = !sign){
      if (intp)frac1 = mul(frac1, a2);
      else frac1 = powDec(a, i, p+2);
      frac2 = mul(frac2, str(i*(i-1)));
      frac = div(frac1, frac2, p+2);
      if (zero(frac, p+1))break;
      if (sign)cos = sub(cos, frac);
      else cos = add(cos, frac);
    }
    
    return rnd(cos, p);
  }
  
  function cosTaylorFrac(a, p){
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
      if (sign)frac1 = sub(frac1, pow);
      else frac1 = add(frac1, pow);
      frac2 = mul(frac2, prod);
      if (nsiz(frac2)-siz(pow)-2 >= p)break;
    }
    
    return div(frac1, frac2, p);
  }
  
  // continued fraction
  // transform of http://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Continued_fractions_for_arctangent
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
  
  function atan(a, p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    if (lt(a, "0.4"))return atanTaylor(a, p);
    return atanTaylorTrans(a, p);
  }
  
  // Taylor Series without transform
  // faster when a <= 0.2
  function atanTaylor(a, p){
    var frac;
    var atan = a;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      frac = div(powDec(a, i, p+2), str(i), p+2);
      if (zero(frac, p+2))break;
      if (sign)atan = sub(atan, frac);
      else atan = add(atan, frac);
    }
    
    return rnd(atan, p);
  }
  
  // Taylor Series with transform
  // faster when a >= 0.2
  function atanTaylorTrans(a, p){
    a = atanTrans(a, 4, p);
    var frac;
    var atan = a;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      frac = div(powDec(a, i, p+2), str(i), p+2);
      if (zero(frac, p+1))break;
      if (sign)atan = sub(atan, frac);
      else atan = add(atan, frac);
    }
    
    return rnd(mul("16", atan), p); // 16 = 2^4
  }
  
  // @param Number n
  function atanTrans(a, n, p){
    for (var i = n-1; i >= 0; i--){
      a = div(a, add("1", sqrt(add("1", mul(a, a)), p+i+2)), p+i+2);
    }
    return a;
  }
  
  // return atan(a/b);
  function atan2(a, b, p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    if (b == "0"){
      if (a == "0")err(atan2, "a and b cannot both equal 0");
      var pii = pi(p+3);
      var hpi = div(pii, "2", p);
      return negp(a)?"-"+hpi:hpi;
    }
    var atn = atan(div(a, b, p+5), p+2);
    if (negp(b)){
      var pii = pi(p+2);
      return negp(a)?sub(atn, pii, p):
                     add(atn, pii, p);
    }
    return rnd(atn, p);
  }
  
  function sinh(a, p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    var ex = exp(a, p+2);
    var recexp = div("1", ex, p+1);
    var sinh = div(sub(ex, recexp), "2", p+1);
    
    return rnd(sinh, p);
  }
  
  function cosh(a, p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    var ex = exp(a, p+2);
    var recexp = div("1", ex, p+1);
    var cosh = div(add(ex, recexp), "2", p+1);
    
    return rnd(cosh, p);
  }
  
  //// Other operation functions ////
  
  function abs(a){
    return negp(a)?remneg(a):a;
  }
  
  function neg(a){
    if (a == "0")return a;
    return negp(a)?remneg(a):("-" + a);
  }
  
  //// Mathematical constants ////
  
  function pi(p){
    if (p == udf)p = prec;
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
  // http://en.wikipedia.org/wiki/Machin-like_formula#More_terms
  function piMachin(p){
    var p1 = mul("44", acotCont("57", p+4));
    var p2 = mul("7", acotCont("239", p+3));
    var p3 = mul("12", acotCont("682", p+4));
    var p4 = mul("24", acotCont("12943", p+4));
    
    var sum = add(sub(add(p1, p2), p3), p4);
    
    return mul(sum, "4", p);
  }
  
  // continued fraction
  function e(p){
    if (p == udf)p = prec;
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
    
    var exp = add("1", div(mul("2", pn), qn, p+2));
    
    return rnd(exp, p);
  }
  
  // continued fraction
  function phi(p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    var f0 = "1";
    var f1 = "2";
    var fn;
    while (true){
      fn = add(f0, f1);
      if (2*siz(f1)-2 >= p)break;
      f0 = f1;
      f1 = fn;
    }
    
    var phi = div(fn, f1, p+2);
    
    return rnd(phi, p);
  }
  
  function ln2(p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    if (p <= 25)return ln2Cont(p);
    return ln2Machin(p);
  }
  
  // generalized continued fraction
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
    
    var sum = add(sub(p1, p2), p3);
    
    return rnd(sum, p);
  }
  
  function ln5(p){
    if (p == udf)p = prec;
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
    
    var sum = add(sub(add(p1, p2), p3), p4);
    
    return rnd(sum, p);
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
    
    var ln2 = add(sub(add(p1, p2), p3), p4);
    ln2 = rnd(ln2, p);
    
    p1 = mul("334", a1);
    p2 = mul("126", a2);
    p3 = mul("88", a3);
    p4 = mul("144", a4);
    
    var ln5 = add(sub(add(p1, p2), p3), p4);
    ln5 = rnd(ln5, p);
    
    return [ln2, ln5];
  }
  
  function ln10(p){
    if (p == udf)p = prec;
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
    
    var sum = add(sub(add(p1, p2), p3), p4);
    
    return rnd(sum, p);
  }
  
  //// Special operation functions ////
  
  /*
  
  qar("7", "3")
  = ["2", "1"]    <
  or ["3", "-2"]
  
  qar("7", "-3")
  = ["-2", "1"]   <
  or ["-3", "-2"]
  
  qar("-7", "3")
  = ["-2", "-1"]
  or ["-3", "2"]  <
  
  qar("-7", "-3")
  = ["2", "-1"]
  or ["3", "2"]   <
  
  a = 7, b = 3, q = 2, r = 1
  a = 7, b = -3, q = -2, r = 1
  a = -7, b = 3, q = -3, r = 2
  a = -7, b = -3, q = 3, r = 2
  
  a = 7, b = 1, q = 7
  a = 7, b = -1, q = -7
  a = -7, b = 1, q = -7
  a = -7, b = -1, q = 7
  
  a = 52, b = 30, q = 1, r = 22
  a = 5.2, b = 3, q = 1, r = 2.2
  a = 7, b = 2.3, q = 3, r = 0.1
  a = 70, b = 23, q = 3, r = 1
  a = -70, b = 23, q = -4, r = 22
  a = -7, b = 2.3, q = -4, r = 2.2
  
  q = sgn(b)*flr(a/|b|)
  r = a - b*q
  
  */
  
  function qar(a, b){
    if (b == "0")err(qar, "b cannot be 0");
    if (a == "0")return ["0", "0"];
    
    var na = negp(a);
    var nb = negp(b);
    if (na)a = remneg(a);
    if (nb)b = remneg(b);
    
    var move = Math.max(declen(a), declen(b));
    if (move != 0){
      a = right(a, move);
      b = right(b, move);
    }
    
    if (b == "1")return [negif(na !== nb, a), "0"];
    
    var quot = "";
    var curr = "";
    var k;
    var arr = ["0", b, add(b, b)];
    for (var i = 0; i < a.length; i++){
      curr += a[i];
      curr = trimi(curr);
      if (ge(curr, b)){
        for (k = 2; ge(curr, arr[k]); k++){
          if (k+1 == arr.length)arr[k+1] = add(arr[k], b);
        }
        quot += k-1;
        curr = sub(curr, arr[k-1]);
      } else {
        if (quot != "")quot += "0";
      }
    }
    if (quot == "")quot = "0";
    
    if (!na)return [negif(nb, quot), left(curr, move)]
    return [negif(!nb, add(quot, "1")), left(sub(b, curr), move)];
  }
  
  function negif(x, a){
    return x?neg(a):a;
  }
  
  // @param Number n
  // @param Number m
  // @return String prod
  function mulran(n, m){
    if (n == m)return str(n);
    if (m < n)return "1";
    return mul(mulran(n, Math.floor((n+m)/2)), mulran(Math.floor((n+m)/2)+1, m));
  }
  
  fracnums(0, "0", "1"); // [n, pn, qn]
  function frac(a, b, p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    var p0 = "1";
    var q0 = "0";
    var p1 = a(0);
    if (p1 === null){
      fracnums(0, "0", "1");
      return "0";
    }
    var q1 = "1";
    var pn = p1, qn = q1;
    var an, bn;
    var bn1 = b(1);
    if (bn1 === null){
      fracnums(0, p1, q1);
      return p1;
    }
    var prod = bn1;
    for (var n = 1; true; n++){
      an = a(n); bn = bn1;
      if (an === null || bn === null){n--; break;}
      bn1 = b(n+1);
      if (bn1 !== null)prod = mul(prod, bn1);
      pn = add(mul(an, p1), mul(bn, p0));
      qn = add(mul(an, q1), mul(bn, q0));
      if (qn == "0")err(frac, "qn can never equal 0");
      if (2*nsiz(qn)-siz(prod)-2 >= p)break;
      p0 = p1; q0 = q1;
      p1 = pn; q1 = qn;
    }
    fracnums(n, pn, qn);
    
    return div(pn, qn, p);
  }
  
  function fracnums(n, p, q){
    frac.n = n;
    frac.p = p;
    frac.q = q;
  }
  
  sfracnums(0, "0", "1");
  function sfrac(a, p){
    if (p == udf)p = prec;
    if (p == -inf)return "0";
    
    var p0 = "1";
    var q0 = "0";
    var p1 = a(0);
    if (p1 === null){
      sfracnums(0, "0", "1");
      return "0";
    }
    var q1 = "1";
    var pn = p1, qn = q1;
    var an;
    for (var n = 1; true; n++){
      an = a(n);
      if (an == null){n--; break;}
      pn = add(mul(an, p1), p0);
      qn = add(mul(an, q1), q0);
      if (qn == "0")err(sfrac, "qn can never equal 0");
      if (2*nsiz(qn)-2 >= p)break;
      p0 = p1; q0 = q1;
      p1 = pn; q1 = qn;
    }
    sfracnums(n, pn, qn);
    
    return div(pn, qn, p);
  }
  
  function sfracnums(n, p, q){
    sfrac.n = n;
    sfrac.p = p;
    sfrac.q = q;
  }
  
  ////// Logging //////
  
  var logfn = function (subj, data){};
  
  function log(subj){
    logfn(subj + ": ", apl(stf, sli(arguments, 1)));
  }
  
  function glogfn(f){
    return logfn;
  }
  
  function slogfn(f){
    return logfn = f;
  }
  
  sefn(function (e){
    logfn("Error: ", e.s + ": " + e.a);
  });
  
  ////// R object exposure //////
  
  var R = {
    real: real,
    //realnum: realnum,
    realint: realint,
    
    vldp: vldp,
    trim: trim,
    trimn: trimn,
    trimi: trimi,
    trimd: trimd,
    trimdl: trimdl,
    trimr: trimr,
    
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
    remneg: remneg,
    pad: pad,
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
    
    round: rnd,
    ceil: ceil,
    floor: flr,
    trunc: trn,
    
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
    
    neg: neg,
    abs: abs,
    
    pi: pi,
    e: e,
    phi: phi,
    ln2: ln2,
    ln5: ln5,
    ln10: ln10,
    
    qar: qar,
    mulran: mulran,
    frac: frac,
    sfrac: sfrac,
    
    gprec: gprec,
    sprec: sprec,
    log: log,
    glogfn: glogfn,
    slogfn: slogfn
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
