/***** Perfectly Precise Math Library Devel *****/

/* requires "tools.js" */

(function (win, undef){
  var err = $.err;
  
  ////// Default precision //////
  
  var prec = 16;
  
  function setPrec(p){
    prec = p;
  }
  
  ////// Javascript number constants //////
  
  // Javascript largest integer: 2^53 = 9007199254740992
  // Javascript largest float ≈ 1.79769313486231580793728e+308
  // shortened to 1.7976931348623157e+308
  
  ////// Complex number functions //////
  
  //// Converters ////
  
  function comp(z){
    if (validp(z))return canon(z);
    if (validpr(z))return N(canonr(z), "0");
    if ($.nump(z))return N(String(z), "0");
    return false;
  }
  
  function compReal(z){
    if (validp(z)){
      if (realp(z))return canon(z);
      return false;
    }
    if (validpr(z))return N(canonr(z), "0");
    if ($.nump(z))return N(String(z), "0");
    return false;
  }
  
  //// Validators ////
  
  function validp(z){
    return $.arrp(z) && z.length == 2 && validpr(z[0]) && validpr(z[1]);
  }
  
  /*! All comp num functions past here assumes all inputs are validated !*/
  
  //// [a, b] functions ////
  
  function N(a, b){
    return [a, b];
  }
  
  function car(z){
    return z[0];
  }
  
  function cdr(z){
    return z[1];
  }
  
  //// Canonicalizers ////
  
  function canon(z){
    return N(canonr(car(z)), canonr(cdr(z)));
  }
  
  //// is... functions ////
  
  function realp(z){
    return cdr(z) == "0";
  }
  
  /*! All comp num functions past here assumes all inputs are canonicalized !*/
  
  function intp(z){
    return realp(z) && intpr(car(z));
  }
  
  //// Processing functions ////
  
  //// Basic operation functions ////
  
  function add(z, w, p){
    return N(addr(car(z), car(w), p),
             addr(cdr(z), cdr(w), p));
  }
  
  function sub(z, w, p){
    return N(subr(car(z), car(w), p),
             subr(cdr(z), cdr(w), p));
  }
  
  function mult(z, w, p){
    var a, b, c, d;
    a = car(z); b = cdr(z);
    c = car(w); d = cdr(w);
    
    return N(subr(multr(a, c), multr(b, d), p),
             addr(multr(a, d), multr(b, c), p));
  }
  
  function div(z, w, p){
    if (p === undef)p = prec;
    
    var a, b, c, d;
    a = car(z); b = cdr(z);
    c = car(w); d = cdr(w);
    
    if (c == "0" && d == "0")err(div, "w cannot be 0");
    
    var sum = addr(powr(c, "2"), powr(d, "2"));
    return N(divr(addr(multr(a, c), multr(b, d)), sum, p),
             divr(subr(multr(b, c), multr(a, d)), sum, p));
  }
  
  //// Rounding functions ////
  
  function round(z, p){
    return N(roundr(car(z), p),
             roundr(cdr(z), p));
  }
  
  function ceil(z, p){
    return N(ceilr(car(z), p),
             ceilr(cdr(z), p));
  }
  
  function floor(z, p){
    return N(floorr(car(z), p),
             floorr(cdr(z), p));
  }
  
  function trunc(z, p){
    return N(truncr(car(z), p),
             truncr(cdr(z), p));
  }
  
  //// Extended operation functions ////
  
  function exp(z, p){
    if (p === undef)p = prec;
    
    var a, b;
    a = car(z); b = cdr(z);
    
    var ea = expr(a, p+2);
    return N(multr(ea, cosr(b, p+2+len(ea)), p),
             multr(ea, sinr(b, p+2+len(ea)), p));
  }
  
  function ln(z, p){
    if (p === undef)p = prec;
    return N(lnr(car(abs(z, p+2)), p),
             car(arg(z, p)));
  }
  
  function pow(z, w, p){
    if (p === undef)p = prec;
    
    var a, b, c, d;
    a = car(z); b = cdr(z);
    c = car(w); d = cdr(w);
    
    if (b == "0" && d == "0" && (intpr(c) || !negpr(a))){
      return N(powr(a, c, p), "0");
    }
    
    return exp(mult(w, ln(z, p+4), p+2), p);
  }
  
  // @param String n
  function root(n, z, p){
    if (p === undef)p = prec;
    
    // if z is real and n is odd, return real root
    if (cdr(z) == "0" && !evenpr(n)){
      var c = car(z);
      return N(sgno(c) + powr(absr(c), divr("1", n, p+2), p), "0");
    }
    
    return pow(z, N(divr("1", n, p+2), "0"), p);
  }
  
  function sqrt(z, p){
    if (p === undef)p = prec;
    
    var a, b;
    a = car(z); b = cdr(z);
    
    var az = car(abs(z, p+4));
    return N(sqrtr(divr(addr(a, az), "2", p+2), p),
             sgno(b) + sqrtr(divr(addr(negr(a), az), "2", p+2), p));
  }
  
  function cbrt(z, p){
    return root("3", z, p);
  }
  
  function fact(x, p){
    return N(factr(x, p), "0");
  }
  
  function bin(x, y, p){
    return N(binr(x, y, p), "0");
  }
  
  function agm(x, y, p){
    return N(agmr(x, y, p), "0");
  }
  
  function sin(z, p){
    if (p === undef)p = prec;
    
    var a, b;
    a = car(z); b = cdr(z);
    
    var ch = coshr(b, p+2);
    var sh = sinhr(b, p+2);
    return N(multr(sinr(a, p+2+len(ch)), ch, p),
             multr(cosr(a, p+2+len(sh)), sh, p));
  }
  
  function cos(z, p){
    if (p === undef)p = prec;
    
    var a, b;
    a = car(z); b = cdr(z);
    
    var ch = coshr(b, p+2);
    var sh = sinhr(b, p+2);
    return N(multr(cosr(a, p+2+len(ch)), ch, p),
             negr(multr(sinr(a, p+2+len(sh)), sh, p)));
  }
  
  function sinh(z, p){
    if (p === undef)p = prec;
    
    var a, b;
    a = car(z); b = cdr(z);
    
    var sh = sinhr(a, p+2);
    var ch = coshr(a, p+2);
    return N(multr(sh, cosr(b, p+2+len(sh)), p),
             multr(ch, sinr(b, p+2+len(ch)), p));
  }
  
  function cosh(z, p){
    if (p === undef)p = prec;
    
    var a, b;
    a = car(z); b = cdr(z);
    
    var ch = coshr(a, p+2);
    var sh = sinhr(a, p+2);
    return N(multr(ch, cosr(b, p+2+len(ch)), p),
             multr(sh, sinr(b, p+2+len(sh)), p));
  }
  
  //// Other operation functions ////
  
  function abs(z, p){
    if (p === undef)p = prec;
    return N(sqrtr(addr(powr(car(z), "2"),
                        powr(cdr(z), "2")), p), "0");
  }
  
  // needs atan2r
  function arg(z, p){
    if (p === undef)p = prec;
    return N(atan2r(cdr(z), car(z), p), "0");
  }
  
  function sgn(z, p){
    if (p === undef)p = prec;
    if (car(z) == "0" && cdr(z) == "0")return z;
    return div(z, abs(z, p+2), p);
  }
  
  function re(z){
    return N(car(z), "0");
  }
  
  function im(z){
    return N(cdr(z), "0");
  }
  
  function conj(z){
    return N(car(z), negr(cdr(z)));
  }
  
  //// Mathematical constants ////
  
  function pi(p){
    return N(pir(p), "0");
  }
  
  function e(p){
    return N(er(p), "0");
  }
  
  function phi(p){
    return N(phir(p), "0");
  }
  
  function ln2(p){
    return N(ln2r(p), "0");
  }
  
  function ln5(p){
    return N(ln5r(p), "0");
  }
  
  function ln10(p){
    return N(ln10r(p), "0");
  }
  
  //// C object exposure ////
  
  win.C = {
    comp: comp,
    compReal: compReal,
    
    validp: validp,
    canon: canon,
    
    realp: realp,
    intp: intp,
    
    num: N,
    car: car,
    cdr: cdr,
    
    add: add,
    sub: sub,
    mult: mult,
    div: div,
    
    round: round,
    ceil: ceil,
    floor: floor,
    trunc: trunc,
    
    exp: exp,
    ln: ln,
    pow: pow,
    root: root,
    sqrt: sqrt,
    cbrt: cbrt,
    fact: fact,
    bin: bin,
    agm: agm,
    sin: sin,
    cos: cos,
    sinh: sinh,
    cosh: cosh,
    
    abs: abs,
    arg: arg,
    sgn: sgn,
    re: re,
    im: im,
    conj: conj,
    
    pi: pi,
    e: e,
    phi: phi,
    ln2: ln2,
    ln5: ln5,
    ln10: ln10
  };
  
  ////// Real number functions //////
  
  //// Converters ////
  
  function real(a){
    if (validp(a)){
      if (realp(a))return car(a);
      return false;
    }
    if (validpr(a))return a;
    if ($.nump(a))return String(a);
    return false;
  }
  
  function realInt(a){
    if (validp(a)){
      if (realp(a) && intpr(car(a)))return car(a);
      return false;
    }
    if (validpr(a)){
      if (intpr(a))return a;
      return false;
    }
    if ($.nump(a) && intpr(String(a)))return String(a);
    return false;
  }
  
  //// Validators ////
  
  function validpr(a){
    return $.strp(a) && /^(\+|-)?[0-9]+(\.[0-9]+)?$/.test(a);
  }
  
  /*! All real num functions past here assumes all inputs are validated !*/
  
  //// Canonicalizers ////
  
  function canonr(a){
    var sign = "+";
    if (signpr(a)){
      sign = getSign(a);
      a = remSign(a);
    }
    a = decpr(a)?trimDec(a):trimInt(a);
    return (a != "0" && sign == "-")?sign+a:a;
  }
  
  // Trim unsigned number
  function trimNum(a){
    return decpr(a)?trimDec(a):trimInt(a);
  }
  
  // Trim zeros at start of non-negative integer
  function trimInt(a){
    for (var i = 0; i <= a.length; i++){
      if (a[i] != '0'){
        if (i == a.length)a = "0";
        else if (i != 0)a = a.substring(i, a.length);
        break;
      }
    }
    return a;
  }
  
  function trimDec(a){
    a = trimDecStart(a);
    a = trimDecEnd(a);
    return a;
  }
  
  // Trim zeros at start of integer part
  function trimDecStart(a){
    for (var i = 0; i <= a.length; i++){
      if (a[i] != '0'){
        if (a[i] == '.')a = a.substring(i-1, a.length);
        else if (i != 0)a = a.substring(i, a.length);
        break;
      }
    }
    return a;
  }
  
  // Trim zeros at end of decimal part
  function trimDecEnd(a){
    for (var i = a.length-1; i >= 0; i--){
      if (a[i] != '0'){
        if (a[i] == '.')a = a.substring(0, i);
        else if (i != a.length-1)a = a.substring(0, i+1);
        break;
      }
    }
    return a;
  }
  
  function pospr(a){
    return a[0] == '+';
  }
  
  function signpr(a){
    return negpr(a) || pospr(a);
  }
  
  function getSign(a){
    return a[0];
  }
  
  function remSign(a){
    return a.substring(1, a.length);
  }
  
  function absrNoCanon(a){
    return signpr(a)?remSign(a):a;
  }
  
  /*! All real num functions past here assumes all inputs are canonicalized !*/
  
  //// is... functions
  
  function intpr(a){
    return a.indexOf(".") == -1;
  }
  
  function decpr(a){
    return a.indexOf(".") != -1;
  }
  
  function negpr(a){
    return a[0] == '-';
  }
  
  function evenpr(a){
    if (decpr(a))return false;
    return $.inp(a[a.length-1], '0', '2', '4', '6', '8');
  }
  
  function oddpr(a){
    if (decpr(a))return false;
    return $.inp(a[a.length-1], '1', '3', '5', '7', '9');
  }
  
  function fivepr(a){
    if (decpr(a))return false;
    return $.inp(a[a.length-1], '0', '5');
  }
  
  //// Processing functions ////
  
  // remDec can take non-canonicalized input
  function remDec(a){
    var dot = a.indexOf(".");
    if (dot == -1)return a;
    return a.substring(0, dot) + a.substring(dot+1, a.length);
  }
  
  function decPos(a){
    var dot = a.indexOf(".");
    return (dot == -1)?a.length:dot;
  }
  
  function decLen(a){
    var dot = a.indexOf(".");
    if (dot == -1)return 0;
    return a.length-1-dot;
  }
  
  function decPart(a){
    var dot = a.indexOf(".");
    if (dot == -1)return "";
    return a.substring(dot+1, a.length);
  }
  
  // alias of remSign
  function remNeg(a){
    return a.substring(1, a.length);
  }
  
  function padZeros(a, b){
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
  
  // return roundr(a, p) == "0";
  // not part of "is... functions" because it involves rounding and p
  function zero(a, p){ 
    if (a == "0")return true;
    if (p === undef)p = 0;
    
    if (negpr(a))a = remNeg(a);
    
    var adot = a.indexOf(".");
    if (p < 0){
      if (adot == -1)adot = a.length;
      if (adot+p <= -1)return true;
      return adot+p == 0 && Number(a[adot+p]) < 5;
    } else {
      if (adot == -1 || a[0] != '0')return false;
      if (p == 0)return Number(a[adot+1]) < 5;
      if (adot+1+p >= a.length)return false;
      
      for (var i = adot+1; i < adot+1+p; i++){
        if (a[i] != '0')return false;
      }
      return Number(a[adot+1+p]) < 5;
    }
  }
  
  // return zero(subr(a, b), p);
  function diffZero(a, b, p){
    if (a == b)return true;
    if (p === undef)p = 0;
    
    if (negpr(a)){
      if (!negpr(b)){
        return zero(subr(a, b), p);
        //b = addr(remNeg(a), b);
        //a = "0";
      } else {
        a = remNeg(a);
        b = remNeg(b);
      }
    } else if (negpr(b)){
      return zero(subr(a, b), p);
      //a = addr(a, remNeg(b));
      //b = "0";
    }
    
    var padArr = padZeros(a, b);
    a = padArr[0]; b = padArr[1];
    
    var dot = decPos(a);
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
        if (Number(a[i]) > Number(b[i])){
          // a = 100.0, b = 099.9, p = 0
          // in if: a = 200.0, b = 099.9, p = 0
          if (Number(b[i]) != Number(a[i])-1)return false;
          // a = 100.0, b = 099.9, p = 0
          for (i = i+1; i < pos; i++){
            if (a[i] == '.')continue;
            // in if: a = 100.0, b = 098.9, p = 0
            if (a[i] != '0' || b[i] != '9')return false;
          }
          var diff = Number(a[i]) - Number(b[i]);
          // in if: a = 100.0, b = 099.4, p = 0
          if (diff != -5)return diff < -5;
          for (i = i+1; i < a.length; i++){
            if (a[i] != b[i]){
              // a = 100.02, b = 099.51, p = 0
              return Number(a[i]) < Number(b[i]);
            }
          }
          // a = 100.01, b = 099.51, p = 0
          return false;
        } else {
          // b > a: flip all references to a and b
          if (Number(a[i]) != Number(b[i])-1)return false;
          for (i = i+1; i < pos; i++){
            if (b[i] == '.')continue;
            if (b[i] != '0' || a[i] != '9')return false;
          }
          var diff = Number(b[i]) - Number(a[i]);
          if (diff != -5)return diff < -5;
          for (i = i+1; i < b.length; i++){
            if (b[i] != a[i]){
              return Number(b[i]) < Number(a[i]);
            }
          }
          return false;
        }
      }
    }
    // a = 5.9, b = 5.0, p = 0
    var diff = Number(a[i]) - Number(b[i]);
    if (diff >= 0){
      // in if: a = 5.9, b = 5.0, p = 0
      if (diff != 5)return diff < 5;
      // a = 5.54, b = 5.04, p = 0
      for (i = i+1; i < a.length; i++){
        if (a[i] != b[i]){
          // a = 5.54, b = 5.00, p = 0
          return Number(a[i]) < Number(b[i]);
        }
      }
      // a = 5.5111, b = 5.0111, p = 0
      return false;
    } else {
      // b > a: flip all references to a and b
      if (diff != -5)return diff > -5;
      for (i = i+1; i < b.length; i++){
        if (b[i] != a[i]){
          return Number(b[i]) < Number(a[i]);
        }
      }
      return false;
    }
  }
  
  // equals floor(log(abs(a)))+1
  function len(a){
    if (a == "0")return -Infinity;
    
    if (negpr(a))a = remNeg(a);
    
    var fa = truncr(a);
    if (fa != "0")return fa.length;
    
    // 2 = a.indexOf(".")+1
    // 2-i = -(i-(a.indexOf(".")+1))
    for (var i = 2; i < a.length; i++){
      if (a[i] != '0')return 2-i;
    }
    
    err(len, "Something strange happened");
  }
  
  // equals floor(log(abs(a)));
  function nlen(a){
    if (a == "0")return -Infinity;
    
    if (negpr(a))a = remNeg(a);
    
    var fa = truncr(a);
    if (fa != "0")return fa.length-1;
    
    // 2 = a.indexOf(".")+1
    // 2-i = -(i-(a.indexOf(".")+1))
    for (var i = 2; i < a.length; i++){
      if (a[i] != '0')return 2-i-1;
    }
    
    err(nlen, "Something strange happened");
  }
  
  // input a = Number(a);
  function checkE(a){
    a = String(a);
    
    if (a == "Infinity")a = "1.7976931348623157e+308";
    else if (a == "-Infinity")a = "-1.7976931348623157e+308";
    
    var pos = a.indexOf("e");
    if (pos == -1)return a;
    
    var front = a.substring(0, pos);
    var sign = a[pos+1];
    var back = Number(a.substring(pos+2, a.length));
    
    if (sign == '+')return right(front, back);
    if (sign == '-')return left(front, back);
  }
  
  function sgno(a){
    return (a[0] == '-')?"-":"";
  }
  
  //// Floating point ////
  
  function numToFloat(a){
    var sign = "";
    if (negpr(a)){
      a = remNeg(a);
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
  
  function floatToNum(a){
    if (a[1] > 0){
      return right(a[0], a[1]);
    } else if (a[1] == 0){
      return a[0];
    } else if (a[1] < 0){
      return left(a[0], -a[1]);
    }
  }
  
  //// Dot movers ////
  
  // @param String a
  // @param Number n
  function left(a, n){ // 32.44 -> 3.244
    if (n == 0 || a == "0")return a;
    if (n < 0)return right(a, -n);
    
    var sign = "";
    if (negpr(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    if (adot == -1)adot = alen;
    
    var numZeros = n-adot;
    if (numZeros >= 0){
      for (var i = numZeros; i >= 1; i--)a = "0" + a;
      a = "0." + remDec(a);
    } else {
      if (adot == alen){
        a = a.substring(0, adot-n) + "." + a.substring(adot-n, alen);
      } else {
        a = a.substring(0, adot-n) + "." + a.substring(adot-n, adot) + a.substring(adot+1, alen);
      }
    }
    
    if (adot == alen)a = trimDecEnd(a);
    return sign + a;
  }
  
  // @param String a
  // @param Number n
  function right(a, n){ // 32.44 -> 324.4
    if (n == 0 || a == "0")return a;
    if (n < 0)return left(a, -n);
    
    // sign only used for trimDecStart
    var sign = "";
    if (negpr(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    var adot = a.indexOf(".");
    if (adot != -1){
      var alen = a.length;
      var numZeros = n-(alen-1-adot);
      if (numZeros >= 0){
        for (var i = numZeros; i >= 1; i--)a += "0";
        a = a.substring(0, adot) + a.substring(adot+1, a.length);
      } else {
        a = a.substring(0, adot) + a.substring(adot+1, adot+1+n) + "." + a.substring(adot+1+n, alen);
      }
    } else {
      for (var i = n; i >= 1; i--)a += "0";
    }
    
    if (adot != alen)a = trimDecStart(a);
    return sign + a;
  }
  
  //// Comparison functions ////
  
  function gt(a, b){ // is (a > b) ?
    if (a == b)return false;
    
    if (negpr(a)){
      if (negpr(b))return gt(remNeg(b), remNeg(a));
      return false;
    } else if (negpr(b))return true;
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    a = remDec(a);
    b = remDec(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (Number(a[i]) > Number(b[i]));
    }
    
    err(gt, "Something strange happened (input not canonical)");
  }
  
  function lt(a, b){ // is (a < b) ?
    if (a == b)return false;
    
    if (negpr(a)){
      if (negpr(b))return lt(remNeg(b), remNeg(a));
      return true;
    } else if (negpr(b))return false;
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    a = remDec(a);
    b = remDec(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (Number(a[i]) < Number(b[i]));
    }
    
    err(lt, "Something strange happened (input not canonical)");
  }
  
  function ge(a, b){ // is (a >= b) ?
    if (a == b)return true;
    
    if (negpr(a)){
      if (negpr(b))return gt(remNeg(b), remNeg(a));
      return false;
    } else if (negpr(b))return true;
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    a = remDec(a);
    b = remDec(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (Number(a[i]) > Number(b[i]));
    }
    
    err(ge, "Something strange happened (input not canonical)");
  }
  
  function le(a, b){ // is (a <= b) ?
    if (a == b)return true;
    
    if (negpr(a)){
      if (negpr(b))return lt(remNeg(b), remNeg(a));
      return true;
    } else if (negpr(b))return false;
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    a = remDec(a);
    b = remDec(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (Number(a[i]) < Number(b[i]));
    }
    
    err(le, "Something strange happened (input not canonical)");
  }
  
  //// Basic operation functions ////
  
  function addr(a, b, p){
    if (p == -Infinity)return "0";
    
    var sign = "";
    if (negpr(a)){
      if (!negpr(b))return subr(b, remNeg(a), p);
      sign = "-";
      a = remNeg(a);
      b = remNeg(b);
    } else if (negpr(b))return subr(a, remNeg(b), p);
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    var smallSum;
    var sum = "";
    var carry = 0;
    for (var i = a.length-1; i >= 0; i--){
      if (a[i] == '.'){
        sum = "." + sum;
        continue;
      }
      smallSum = Number(a[i]) + Number(b[i]) + carry;
      if (smallSum >= 10){
        sum = (smallSum-10) + sum;
        carry = 1;
      } else {
        sum = smallSum + sum;
        carry = 0;
      }
    }
    if (carry == 1)sum = "1" + sum;
    sum = sign + sum;
    if (decpr(sum))sum = trimDecEnd(sum);
    
    return (p === undef)?sum:roundr(sum, p);
  }
  
  function subr(a, b, p){
    if (a == b)return "0";
    if (p == -Infinity)return "0";
    
    if (negpr(a)){
      if (!negpr(b))return addr(a, "-" + b, p);
      else {
        var c = a;
        a = remNeg(b);
        b = remNeg(c);
      }
    } else if (negpr(b))return addr(a, remNeg(b), p);
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    if (gt(b, a))return negr(subr(b, a, p));
    
    var smallDiff;
    var diff = "";
    var borrow = 0;
    for (var i = a.length-1; i >= 0; i--){
      if (a[i] == '.'){
        diff = "." + diff;
        continue;
      }
      smallDiff = 10 + Number(a[i]) - Number(b[i]) + borrow;
      if (smallDiff >= 10){
        diff = (smallDiff-10) + diff;
        borrow = 0;
      } else {
        diff = smallDiff + diff;
        borrow = -1;
      }
    }
    diff = canonr(diff);
    
    return (p === undef)?diff:roundr(diff, p);
  }
  
  function multr(a, b, p){
    if (a == "0" || b == "0")return "0";
    if (p == -Infinity)return "0";
    
    var sign = "";
    if (negpr(a)){
      a = remNeg(a);
      if (!negpr(b))sign = "-";
      else b = remNeg(b);
    } else if (negpr(b)){
      sign = "-";
      b = remNeg(b);
    }
    
    var numDec = 0;
    if (decpr(a)){
      numDec += decLen(a);
      a = remDec(a);
      a = trimInt(a);
    }
    if (decpr(b)){
      numDec += decLen(b);
      b = remDec(b);
      a = trimInt(a);
    }
    
    var prod = multrInt(a, b);
    if (numDec > 0)prod = left(prod, numDec);
    prod = sign + prod;
    
    return (p === undef)?prod:roundr(prod, p);
  }
  
  // multiply two positive (non-zero) integers
  function multrInt(a, b){
    if (a.length <= 7 && b.length <= 7){
      return String(Number(a)*Number(b));
    } else if (a.length <= 200 || b.length <= 200){
      return multrLong(a, b);
    } else {
      return multrKarat(a, b);
    }
  }
  
  // long multiplication; for 8-200 digits
  function multrLong(a, b){
    if (b.length > a.length)return multrLong(b, a);
    
    var prod = "0";
    var curra, currb, curr, small, len, carry;
    for (var i = b.length; i > 0; i -= 7){
      currb = Number(b.substring(i-7, i));
      if (currb == 0)continue;
      curr = ""; carry = 0;
      for (var f = (b.length-i)/7; f >= 1; f--)curr += "0000000";
      for (var j = a.length; j > 0; j -= 7){
        curra = Number(a.substring(j-7, j));
        if (curra == 0){
          if (carry != 0){
            small = String(carry);
          } else {
            if (j-7 > 0)curr = "0000000" + curr;
            continue;
          }
        } else {
          small = String(currb * curra + carry);
        }
        len = small.length;
        if (len > 7){
          curr = small.substring(len-7, len) + curr;
          carry = Number(small.substring(0, len-7));
        } else {
          curr = small + curr;
          if (j-7 > 0){
            for (var h = 7-len; h >= 1; h--)curr = "0" + curr;
          }
          carry = 0;
        }
      }
      if (carry != 0)curr = carry + curr;
      prod = addr(prod, curr);
    }
    
    return prod;
  }
  
  // Karatsuba multiplication; for more than 200 digits
  // http://en.wikipedia.org/wiki/Karatsuba_algorithm
  function multrKarat(a, b){
    var alen = a.length;
    var blen = b.length;
    
    if (blen > alen)return multrKarat(b, a);
    
    // Math.min(alen, blen) = blen
    if (blen <= 200)return multrLong(a, b);
    
    if (alen != blen){
      /*
      a = a1*10^m + a0
      a*b = (a1*10^m + a0)*b
          = (a1*b)*10^m + a0*b
      */
      var m = (alen > 2*blen)?Math.ceil(alen/2):(alen-blen);
      var a1 = a.substring(0, alen-m);
      var a0 = trimInt(a.substring(alen-m, alen));
      return addr(right(multrKarat(a1, b), m), multrKarat(a0, b));
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
    var a0 = trimInt(a.substring(alen-m, alen));
    var b1 = b.substring(0, blen-m);
    var b0 = trimInt(b.substring(blen-m, blen));
    
    var z2 = multrKarat(a1, b1);
    var z0 = multrKarat(a0, b0);
    var z1 = subr(subr(multrKarat(addr(a1, a0), addr(b1, b0)), z2), z0);
    
    return addr(addr(right(z2, 2*m), right(z1, m)), z0);
  }
  
  function divr(a, b, p){
    if (b == "0")err(divr, "b cannot be 0");
    if (a == "0")return "0";                  
    if (b == "1")return roundr(a, p);
    
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    var sign = "";
    if (negpr(a)){
      a = remNeg(a);
      if (!negpr(b))sign = "-";
      else b = remNeg(b);
    } else if (negpr(b)){
      sign = "-";
      b = remNeg(b);
    }
    
    var decA = (decpr(a))?decLen(a):0;
    var decB = (decpr(b))?decLen(b):0;
    var move = Math.max(decA, decB);
    if (move != 0){
      a = right(a, move);
      b = right(b, move);
    }
    
    var quot = divrLong(a, b, p);
    return (quot == "0")?quot:sign + quot;
  }
  
  // long division of positive (non-zero) integers a and b
  function divrLong(a, b, p){
    var quot = "0";
    var curr = "";
    var k;
    var arr = ["0", b, addr(b, b)];
    var alen = a.length;
    for (var i = 0; i < alen+p+1; i++){
      if (i < alen)curr += a[i];
      else {
        if (curr == "0")break;
        if (i == alen)quot += ".";
        curr += "0";
      }
      curr = trimInt(curr);
      if (ge(curr, b)){
        for (k = 2; ge(curr, arr[k]); k++){
          if (k+1 == arr.length)arr[k+1] = addr(arr[k], b);
        }
        quot += k-1;
        curr = subr(curr, arr[k-1]);
      } else {
        quot += "0";
      }
    }
    quot = canonr(quot);
    if (p < 0 && quot != "0"){
      for (var i = -p-1; i >= 1; i--)quot += "0";
    }
    
    return (quot == "0")?quot:roundr(quot, p);
  }
  
  //// Rounding functions ////
  
  function roundr(a, p){
    if (a == "0")return "0";
    if (p == -Infinity)return "0";
    
    var sign = "";
    if (negpr(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (p == 0 || p === undef){
      if (adot == -1)return sign + a;
      var round = a.substring(0, adot);
      if (Number(a[adot+1]) >= 5)round = addOne(round);
    } else if (p < 0){
      if (adot == -1)adot = alen;
      if (adot+p <= -1)return "0";
      
      var round = a.substring(0, adot+p);
      if (round == "")round = "0";
      if (Number(a[adot+p]) >= 5)round = addOne(round);
      if (round != "0"){
        for (var d = -p; d >= 1; d--)round += "0";
      }
    } else {
      if (adot == -1 || adot+p+1 >= alen)return sign + a;
      
      var round = a.substring(0, adot+p+1);
      if (Number(a[adot+p+1]) >= 5)round = addOneDec(round);
      round = trimNum(round);
    }
    
    return (round == "0")?round:sign + round;
  }
  
  function ceilr(a, p){
    if (a == "0")return "0";
    if (p == -Infinity)return "0";
    
    var sign = "";
    if (negpr(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (p == 0 || p === undef){
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
      round = trimNum(round);
    }
    
    return (round == "0")?round:sign + round;
  }
  
  function floorr(a, p){
    if (a == "0")return "0";
    if (p == -Infinity)return "0";
    
    var sign = "";
    if (negpr(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (p == 0 || p === undef){
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
      round = trimNum(round);
    }
    
    return (round == "0")?round:sign + round;
  }
  
  function truncr(a, p){
    if (a == "0")return "0";
    if (p == -Infinity)return "0";
    
    var sign = "";
    if (negpr(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (p == 0 || p === undef){
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
      round = trimDecEnd(round);
    }
    
    return (round == "0")?round:sign + round;
  }
  
  // add 1 to non-negative integer
  function addOne(a){
    for (var i = a.length-1; i >= 0; i--){
      if (a[i] != '9'){
        var sum = a.substring(0, i) + (Number(a[i])+1);
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
        var sum = a.substring(0, i) + (Number(a[i])+1);
        for (var j = a.indexOf(".")-1-i; j >= 1; j--)sum += "0";
        return sum;
      }
    }
    sum = "1";
    for (var i = a.indexOf("."); i >= 1; i--)sum += "0";
    return sum;
  }
  
  //// Extended operation functions ////
  
  function expr(a, p){
    if (a == "0")return roundr("1", p);
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    var sign = false;
    if (negpr(a)){
      a = remNeg(a);
      sign = true;
      p += 2;
    }
    
    var exp;
    if (intpr(a)){
      var an = Number(a);
      if (an == 1)exp = er(p);
      else if (an < 100)exp = powr(er(p+1+(an-1)*(len(a)+1)), a, p+1);
      else exp = exprTaylorFrac(a, p+2);
    } else {
      var fl = truncr(a);
      var flLen = fl.length;
      fl = Number(fl);
      var dec = decPart(a);
      var decLen = dec.length;
      a = "0." + dec;
      if (gt(a, "0.5")){
        a = subr(a, "1");
        fl++;
      }
      
      if (fl == 0){
        if (decLen <= 30)exp = exprTaylorFrac(a, p);
        else exp = exprTaylorTerms(a, p);
      } else {
        var expfl;
        if (fl == 1)expfl = er(p+2);
        else if (fl < 100)expfl = powr(er(p+1+(fl-1)*(flLen+1)), String(fl), p+1);
        else expfl = exprTaylorFrac(String(fl), p+2);
        
        if (decLen <= 30){
          exp = multr(expfl, exprTaylorFrac(a, p+2+len(expfl)), p);
        } else {
          exp = multr(expfl, exprTaylorTerms(a, p+2+len(expfl)), p);
        }
      }
    }
    
    if (sign)return divr("1", exp, p-2);
    else return exp;
  }
  
  // Taylor Series with big fraction
  function exprTaylorFrac(a, p){
    if (decpr(a))a = roundr(a, p+2);
    var frac1 = addr(a, "1");
    var frac2 = "1";
    var pow = a;
    for (var i = 2; true; i++){
      frac1 = multr(frac1, String(i));
      pow = multr(pow, a);
      frac1 = addr(frac1, pow);
      frac2 = multr(frac2, String(i));
      if (nlen(frac2)-len(pow)-2 >= p)break;
    }
    
    return divr(frac1, frac2, p);
  }
  
  // Taylor Series adding term by term
  function exprTaylorTerms(a, p){
    var ar = roundr(a, p+3);
    var pow = ar;
    var fact = "1";
    var frac = "1";
    var exp = addr(ar, "1");
    for (var i = 2; true; i++){
      pow = multr(pow, ar, p+3);
      fact = multr(fact, String(i));
      frac = divr(pow, fact, p+3);
      if (zero(frac, p+1))break;
      exp = addr(exp, frac);
    }
    
    return roundr(exp, p);
  }
  
  function lnr(a, p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    if (negpr(a))err(lnr, "a cannot be negative");
    if (a == "0")err(lnr, "a cannot be zero");
    
    var tens = len(a)-1;
    //if (tens > 0)a = left(a, tens);
    //else if (tens < 0)a = right(a, -tens);
    a = left(a, tens);
    
    var twos = tens;
    var fives = tens;
    
    switch (a[0]){
      case "1": if (intpr(a) || Number(a[2]) <= 3)break;
      case "2": a = divr(a, "2", Infinity); twos++; break;
      case "3":
      case "4": a = divr(a, "4", Infinity); twos += 2; break;
      case "5":
      case "6": a = divr(a, "5", Infinity); fives++; break;
      case "7":
      case "8": a = divr(a, "8", Infinity); twos += 3; break;
      case "9": a = left(a, 1); twos++; fives++; break;
    }
    twos = String(twos); fives = String(fives);
    
    var lnsmall = lnrTaylor(a, p+2);
    var ln;
    if (twos != "0"){
      if (twos == fives){
        var lnr10 = ln10r(p+2+len(twos));
        ln = addr(lnsmall, multr(twos, lnr10), p);
      } else {
        if (fives != "0"){
          var both = ln2and5(p+2+Math.max(len(twos), len(fives)));
          var lnr2 = both[0];
          var lnr5 = both[1];
          ln = addr(addr(lnsmall, multr(twos, lnr2)),
                    multr(fives, lnr5),
                    p);
        } else {
          var lnr2 = ln2r(p+2+len(twos));
          ln = addr(lnsmall, multr(twos, lnr2), p);
        }
      }
    } else {
      if (fives != "0"){
        var lnr5 = ln5r(p+2+len(fives));
        ln = addr(lnsmall, multr(fives, lnr5), p);
      } else {
        ln = roundr(lnsmall, p);
      }
    }
    
    return ln;
  }
  
  // Taylor series
  function lnrTaylor(a, p){
    var a1 = subr(a, "1");
    var frac1 = a1;
    var frac;
    var ln = a1;
    var sign = true;
    for (var i = 2; true; i++, sign = !sign){
      frac1 = roundr(multr(frac1, a1), p+2);
      frac = divr(frac1, String(i), p+2);
      if (zero(frac, p+1))break;
      if (sign)ln = subr(ln, frac);
      else ln = addr(ln, frac);
    }
   
    return roundr(ln, p);
  }
  
  function powr(a, b, p){
    if (a == "0" || a == "1" || b == "1")return roundr(a, p);
    if (b == "0")return roundr("1", p);
    if (b == "-1")return divr("1", a, p);
    if (p == -Infinity)return "0";
    
    var sign = negpr(b);
    if (sign)b = remNeg(b);
    
    var pow;
    if (intpr(b)){
      if (b == "2")pow = multr(a, a, p);
      else if (intpr(a) || p === undef)pow = powrExact(a, Number(b), p);
      else pow = powrDec(a, Number(b), p);
    } else {
      if (p === undef)p = prec;
      pow = expr(multr(b, lnr(a, p+6+len(b)), p+4), p);
    }
    
    return (sign)?divr("1", pow, p):pow;
  }
  
  // http://en.wikipedia.org/wiki/Exponentiation_by_squaring
  // @param String a
  // @param Number n
  function powrExact(a, n, p){
    var prod = "1";
    while (n > 0){
      if (n % 2 == 1){
        prod = multr(prod, a);
        n--;
      }
      a = multr(a, a);
      n = n/2;
    }
    return (p === undef)?prod:roundr(prod, p);
  }
  
  // @param String a
  // @param Number n
  function powrDec(a, n, p){
    var sign = "";
    if (negpr(a) && n % 2 == 1){
      sign = "-";
      a = remNeg(a);
    }
    
    var log = len(a);
    var d1 = p+2+(n-1)*log+n-1;
    var d2 = d1-1; // p+2+(n-1)*log+n-2
    var sub = log+1;
    var x = a;
    for (var i = 1; i <= n-1; i++){
      x = multr(roundr(x, d1), roundr(a, d2));
      d1 = d1-sub;
      d2 = d2-1;
    }
    
    return roundr(sign + x, p);
  }
  
  function sqrtr(a, p){
    if (negpr(a))err(sqrtr, "a cannot be negative");
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    if (intpr(a))return sqrtrCont(a, p);
    else if (p < 50)return sqrtrNewton(a, p);
    else return sqrtrShift(a, p);
  }
  
  // uses identity sqrt(a) = sqrt(100*a)/10 to remove decimals
  // and then uses continued fraction
  function sqrtrShift(a, p){
    var numDec = 0;
    if (decpr(a)){
      numDec += decLen(a);
      a = remDec(a);
      a = trimInt(a);
      if (numDec % 2 == 1)a += "0";
      numDec = Math.ceil(numDec/2);
    }
    
    var sqrt = sqrtrCont(a, p-numDec);
    return left(sqrt, numDec);
  }
  
  // continued fraction
  // http://en.wikipedia.org/wiki/Generalized_continued_fraction
  function sqrtrCont(a, p){
    var isqrt = isqrtr(a);
    var diff = subr(a, multr(isqrt, isqrt));
    if (diff == "0")return isqrt;
    var isqrt2 = multr("2", isqrt);
    
    var an = function (n){
      if (n == 0)return isqrt;
      else return isqrt2;
    }
    
    var bn = function (n){
      return diff;
    }
    
    return frac(an, bn, p);
  }
  
  // Newton's method
  // http://en.wikipedia.org/wiki/Methods_of_computing_square_roots
  function sqrtrNewton(a, p){
    var sqrt = sqrtrAppr(a);
    if (sqrt == "0")return "0";
    var func1;
    while (true){
      func1 = subr(multr(sqrt, sqrt, p+2), a);
      func1 = divr(func1, multr("2", sqrt), p+2);
      if (zero(func1, p+1))break;
      sqrt = subr(sqrt, func1);
    }
    
    return roundr(sqrt, p);
  }
  // With some input, there was an infinite loop fixed by replacing
  // multr(sqrt, sqrt, p+2) with multr(sqrt, sqrt) in prec-math 1.7
  // (complex-math 1.12). No idea what that input was
  
  // return trunc(sqrt(a))
  function isqrtr(a){
    var sqrt = sqrtrAppr(a);
    if (sqrt == "0")return "0";
    var func1;
    while (true){
      func1 = subr(multr(sqrt, sqrt, 2), a);
      func1 = divr(func1, multr("2", sqrt), 2);
      if (zero(func1, 1))break;
      sqrt = subr(sqrt, func1);
    }
    
    return truncr(sqrt);
  }
  
  // sqrt approximation that doesn't go bust when a.length >= 308
  // unlike checkE(Math.sqrt(Number(a)));
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
  function sqrtrAppr(a){
    a = numToFloat(a);
    a[0] = Number(a[0]);
    
    if (a[1] % 2 == 1 || a[1] % 2 == -1){
      a[0] = Math.sqrt(10 * a[0]);
      a[1] = ((a[1]-1) / 2);
    } else {
      a[0] = Math.sqrt(a[0]);
      a[1] = a[1] / 2;
    }
    
    a[0] = String(a[0]);
    a = floatToNum(a);
    
    return a;
  }
  
  function factr(a, p){
    if (decpr(a) || negpr(a))err(factr, "a must be a positive integer");
    if (p == -Infinity)return "0";
    a = Number(a);
    
    var fact = factrDiv(a);
    return (p === undef)?fact:roundr(fact, p);
  }
  
  // @param Number a
  // @return String prod
  function factrDiv(a){
    return multrRange(1, a);
  }
  
  function binr(n, k, p){
    if (gt(k, n))err(binr, "n must be >= k");
    if (!intpr(k) || !intpr(n) || negpr(k) || negpr(n)){
      err(binr, "n and k must be positive integers");
    }
    if (p == -Infinity)return "0";
    n = Number(n); k = Number(k);
    
    var bin = divr(multrRange(k+1, n), factrDiv(n-k));
    return (p === undef)?bin:roundr(bin, p);
  }
  
  // http://en.wikipedia.org/wiki/Arithmetic%E2%80%93geometric_mean
  function agmr(a, b, p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    var c, d;
    while (true){
      c = divr(addr(a, b), "2", p+2);
      d = sqrtr(multr(a, b, p+5+len(a)+len(b)), p+2);
      if (diffZero(a, c, p))break;
      a = c; b = d;
    }
    
    return roundr(c, p);
  }
  
  function sinr(a, p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    var sign = false;
    if (negpr(a)){
      a = remNeg(a);
      sign = !sign;
    }
    
    var intPart = Math.floor(Number(a))/3;
    if (intPart < 1)intPart = 1;
    var dec = decLen(a);
    if (dec <= 1)dec += 1;
    if (intPart*dec <= 75){
      var sin = sinrTaylorFrac(a, p);
      return (sign)?negr(sin):sin;
    }
    
    var pi = pir(p+3+len(a));
    var tpi = multr("2", pi); // 2*pi
    a = subr(a, multr(divr(a, tpi, 0), tpi));
    
    if (negpr(a)){
      a = remNeg(a);
      sign = !sign;
    }
    
    var hpi = divr(pi, "2", p+2); // pi/2
    var numhpi = divr(a, hpi, 0);
    var sin;
    switch (numhpi){
      case "0":
        sin = sinrTaylorTerms(a, p);
        break;
      case "1":
        a = subr(a, hpi);
        sin = cosrTaylorTerms(a, p);
        break;
      case "2":
        a = subr(a, pi);
        sin = sinrTaylorTerms(a, p);
        sign = !sign;
        break;
      case "3":
        a = subr(a, addr(hpi, pi));
        sin = cosrTaylorTerms(a, p);
        sign = !sign;
        break;
    }
    
    return (sign)?negr(sin):sin;
  }
  
  // Taylor series
  function sinrTaylorTerms(a, p){
    var intpr = (a.indexOf(".") == -1);
    var frac1 = a;
    var frac2 = "1";
    var frac;
    var sin = a;
    var sign = true;
    if (intpr)var a2 = multr(a, a);
    for (var i = 3; true; i += 2, sign = !sign){
      if (intpr)frac1 = multr(frac1, a2);
      else frac1 = powrDec(a, i, p+2);
      frac2 = multr(frac2, String(i*(i-1)));
      frac = divr(frac1, frac2, p+2);
      if (zero(frac, p+1))break;
      if (sign)sin = subr(sin, frac);
      else sin = addr(sin, frac);
    }
    
    return roundr(sin, p);
  }
  
  // Taylor series with big fraction
  function sinrTaylorFrac(a, p){
    var frac1 = a;
    var frac2 = "1";
    var pow = a;
    var sign = true;
    var a2 = multr(a, a);
    var prod;
    for (var i = 3; true; i += 2, sign = !sign){
      prod = String(i*(i-1));
      frac1 = multr(frac1, prod);
      pow = multr(pow, a2);
      if (sign)frac1 = subr(frac1, pow);
      else frac1 = addr(frac1, pow);
      frac2 = multr(frac2, prod);
      if (nlen(frac2)-len(pow)-2 >= p)break;
    }
    
    return divr(frac1, frac2, p);
  }
  
  function cosr(a, p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    var sign = false;
    if (negpr(a))a = remNeg(a);
    
    var intPart = Math.floor(Number(a))/3;
    if (intPart < 1)intPart = 1;
    var dec = decLen(a);
    if (dec <= 1)dec += 1;
    if (intPart*dec <= 75)return cosrTaylorFrac(a, p);
    
    var pi = pir(p+3+len(a));
    var tpi = multr("2", pi);
    a = subr(a, multr(divr(a, tpi, 0), tpi));
    
    if (negpr(a))a = remNeg(a);
    
    var hpi = divr(pi, "2", p+2);
    var numhpi = divr(a, hpi, 0);
    var cos;
    switch (numhpi){
      case "0":
        cos = cosrTaylorTerms(a, p);
        break;
      case "1":
        a = subr(a, hpi);
        cos = sinrTaylorTerms(a, p);
        sign = !sign;
        break;
      case "2":
        a = subr(a, pi);
        cos = cosrTaylorTerms(a, p);
        sign = !sign;
        break;
      case "3":
        a = subr(a, addr(hpi, pi));
        cos = sinrTaylorTerms(a, p);
        break;
    }
    
    return (sign)?negr(cos):cos;
  }
  
  function cosrTaylorTerms(a, p){
    var intpr = (a.indexOf(".") == -1);
    var frac1 = "1";
    var frac2 = "1";
    var frac;
    var cos = "1";
    var sign = true;
    if (intpr)var a2 = multr(a, a);
    for (var i = 2; true; i += 2, sign = !sign){
      if (intpr)frac1 = multr(frac1, a2);
      else frac1 = powrDec(a, i, p+2);
      frac2 = multr(frac2, String(i*(i-1)));
      frac = divr(frac1, frac2, p+2);
      if (zero(frac, p+1))break;
      if (sign)cos = subr(cos, frac);
      else cos = addr(cos, frac);
    }
    
    return roundr(cos, p);
  }
  
  function cosrTaylorFrac(a, p){
    var frac1 = "1";
    var frac2 = "1";
    var pow = "1";
    var sign = true;
    var a2 = multr(a, a);
    var prod;
    for (var i = 2; true; i += 2, sign = !sign){
      prod = String(i*(i-1));
      frac1 = multr(frac1, prod);
      pow = multr(pow, a2);
      if (sign)frac1 = subr(frac1, pow);
      else frac1 = addr(frac1, pow);
      frac2 = multr(frac2, prod);
      if (nlen(frac2)-len(pow)-2 >= p)break;
    }
    
    return divr(frac1, frac2, p);
  }
  
  // continued fraction
  // transform of http://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Continued_fractions_for_arctangent
  function acotrCont(a, p){
    var an = function (n){
      if (n == 0)return "0";
      return multr(String(2*n-1), a);
    }
    
    var bn = function (n){
      if (n == 1)return "1";
      return String((n-1)*(n-1));
    }
    
    return frac(an, bn, p);
  }
  
  // continued fraction
  // transform of http://functions.wolfram.com/ElementaryFunctions/ArcTanh/10/
  function acothrCont(a, p){
    var an = function (n){
      if (n == 0)return "0";
      return multr(String(2*n-1), a);
    }
    
    var bn = function (n){
      if (n == 1)return "1";
      return String(-(n-1)*(n-1));
    }
    
    return frac(an, bn, p);
  }
  
  // taylor series atan(1/x)
  function acotrTaylor(a, p){
    var sum = divr("1", a, p+2);
    var pow = a;
    var a2 = multr(a, a);
    var func1;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      pow = multr(pow, a2, p+2);
      func1 = divr("1", multr(String(i), pow), p+2);
      if (sign)sum = subr(sum, func1);
      else sum = addr(sum, func1);
      if (zero(func1, p+1))break;
    }
    
    return roundr(sum, p);
  }
  
  // @param String a
  // @param Number n
  function acotrTrans(a, n, p){
    for (var i = n; i >= 1; i--){
      a = addr(a, sqrtr(addr("1", multr(a, a)), p+i+2), p+i+2);
    }
    
    return roundr(a, p);
  }
  
  function acotrTaylorTrans(a, n, p){
    a = acotrTrans(a, n, p+2);
    return multr(powrExact("2", n), acotrTaylor(a, p+1), p); // 16 = 2^4
  }
  
  function atanr(a, p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    if (lt(a, "0.2"))return atanrTaylor(a, p);
    else return atanrTaylorTrans(a, p);
  }
  
  // Taylor Series without transform
  // faster when a <= 0.2
  function atanrTaylor(a, p){
    var frac;
    var atan = a;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      frac = divr(powrDec(a, i, p+2), String(i), p+2);
      if (zero(frac, p+2))break;
      if (sign)atan = subr(atan, frac);
      else atan = addr(atan, frac);
    }
    
    return roundr(atan, p);
  }
  
  // Taylor Series with transform
  // faster when a >= 0.2
  function atanrTaylorTrans(a, p){
    a = atanrTrans(a, 4, p);
    var frac;
    var atan = a;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      frac = divr(powrDec(a, i, p+2), String(i), p+2);
      if (zero(frac, p+1))break;
      if (sign)atan = subr(atan, frac);
      else atan = addr(atan, frac);
    }
    
    return roundr(multr("16", atan), p); // 16 = 2^4
  }
  
  // @param Number n
  function atanrTrans(a, n, p){
    for (var i = n-1; i >= 0; i--){
      a = divr(a, addr("1", sqrtr(addr("1", multr(a, a)), p+i+2)), p+i+2);
    }
    return a;
  }
  
  // return atan(a/b);
  function atan2r(a, b, p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    if (b == "0"){
      if (a == "0")err(atan2r, "a and b cannot both equal 0");
      var pi = pir(p+3);
      var hpi = divr(pi, "2", p);
      return negpr(a)?"-"+hpi:hpi;
    }
    var atan = atanr(divr(a, b, p+5), p+2);
    if (negpr(b)){
      var pi = pir(p+2);
      return negpr(a)?subr(atan, pi, p):
                      addr(atan, pi, p);
    }
    return roundr(atan, p);
  }
  
  function sinhr(a, p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    var exp = expr(a, p+2);
    var recexp = divr("1", exp, p+1);
    var sinh = divr(subr(exp, recexp), "2", p+1);
    
    return roundr(sinh, p);
  }
  
  function coshr(a, p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    var exp = expr(a, p+2);
    var recexp = divr("1", exp, p+1);
    var cosh = divr(addr(exp, recexp), "2", p+1);
    
    return roundr(cosh, p);
  }
  
  //// Other operation functions ////
  
  function absr(a){
    return negpr(a)?remNeg(a):a;
  }
  
  function negr(a){
    if (a == "0")return a;
    return negpr(a)?remNeg(a):("-" + a);
  }
  
  //// Mathematical constants ////
  
  function pir(p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    if (p <= 5)return pirCont(p);
    else return pirMachin(p);
  }
  
  // continued fraction 
  function pirCont(p){
    var an = function (n){
      if (n == 0)return "0";
      else return String(2*n-1);
    }
    
    var bn = function (n){
      if (n == 1)return "4";
      else return String((n-1)*(n-1));
    }
    
    return frac(an, bn, p);
  }
  
  // Machin-like formula 44*acot(57)+7*acot(239)-12*acot(682)+24*acot(12943)
  // http://en.wikipedia.org/wiki/Machin-like_formula#More_terms
  function pirMachin(p){
    var p1 = multr("44", acotrCont("57", p+4));
    var p2 = multr("7", acotrCont("239", p+3));
    var p3 = multr("12", acotrCont("682", p+4));
    var p4 = multr("24", acotrCont("12943", p+4));
    
    var sum = addr(subr(addr(p1, p2), p3), p4);
    
    return multr(sum, "4", p);
  }
  
  // continued fraction
  function er(p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    var p0 = "0";
    var p1 = "1";
    var q0 = "1";
    var q1 = "1";
    var pn, qn;
    for (var an = 6; true; an += 4){
      pn = addr(multr(String(an), p1), p0);
      qn = addr(multr(String(an), q1), q0);
      if (2*len(qn)-2 >= p)break;
      p0 = p1;
      q0 = q1;
      p1 = pn;
      q1 = qn;
    }
    
    var exp = addr("1", divr(multr("2", pn), qn, p+2));
    
    return roundr(exp, p);
  }
  
  // continued fraction
  function phir(p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    var f0 = "1";
    var f1 = "2";
    var fn;
    while (true){
      fn = addr(f0, f1);
      if (2*len(f1)-2 >= p)break;
      f0 = f1;
      f1 = fn;
    }
    
    var phi = divr(fn, f1, p+2);
    
    return roundr(phi, p);
  }
  
  function ln2r(p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    if (p <= 25)return ln2rCont(p);
    else return ln2rMachin(p);
  }
  
  // generalized continued fraction
  function ln2rCont(p){
    var an = function (n){
      if (n == 0)return "0";
      else if (n % 2 == 1)return String(n);
      else return "2";
    }
    
    var bn = function (n){
      if (n == 1)return "1";
      else return String(Math.floor(n/2));
    }
    
    return frac(an, bn, p);
  }
  
  // Machin-like formula
  // ln(2) = 18*acoth(26)-2*acoth(4801)+8*acoth(8749)
  function ln2rMachin(p){
    var p1 = multr("18", acothrCont("26", p+4));
    var p2 = multr("2", acothrCont("4801", p+3));
    var p3 = multr("8", acothrCont("8749", p+3));
    
    var sum = addr(subr(p1, p2), p3);
    
    return roundr(sum, p);
  }
  
  function ln5r(p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    return ln5rMachin(p);
  }
  
  // Machin-like formula
  // ln(5) = 334*acoth(251)+126*acoth(449)-88*acoth(4801)+144*acoth(8749)
  function ln5rMachin(p){
    var p1 = multr("334", acothrCont("251", p+5));
    var p2 = multr("126", acothrCont("449", p+5));
    var p3 = multr("88", acothrCont("4801", p+4));
    var p4 = multr("144", acothrCont("8749", p+5));
    
    var sum = addr(subr(addr(p1, p2), p3), p4);
    
    return roundr(sum, p);
  }
  
  // ln(2) = 144*acoth(251)+54*acoth(449)-38*acoth(4801)+62*acoth(8749)
  function ln2and5(p){
    var a1 = acothrCont("251", p+5);
    var a2 = acothrCont("449", p+5);
    var a3 = acothrCont("4801", p+4);
    var a4 = acothrCont("8749", p+5);
    
    var p1, p2, p3, p4;
    
    p1 = multr("144", a1);
    p2 = multr("54", a2);
    p3 = multr("38", a3);
    p4 = multr("62", a4);
    
    var ln2 = addr(subr(addr(p1, p2), p3), p4);
    ln2 = roundr(ln2, p);
    
    p1 = multr("334", a1);
    p2 = multr("126", a2);
    p3 = multr("88", a3);
    p4 = multr("144", a4);
    
    var ln5 = addr(subr(addr(p1, p2), p3), p4);
    ln5 = roundr(ln5, p);
    
    return [ln2, ln5];
  }
  
  function ln10r(p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    return ln10rMachin(p);
  }
  
  // Machin-like formula
  // ln(10) = 478*acoth(251)+180*acoth(449)-126*acoth(4801)+206*acoth(8749)
  function ln10rMachin(p){
    var p1 = multr("478", acothrCont("251", p+5));
    var p2 = multr("180", acothrCont("449", p+5));
    var p3 = multr("126", acothrCont("4801", p+5));
    var p4 = multr("206", acothrCont("8749", p+5));
    
    var sum = addr(subr(addr(p1, p2), p3), p4);
    
    return roundr(sum, p);
  }
  
  //// Special operation functions ////
  
  function qar(a, b){
    if (b == "0")err(qar, "b cannot be 0");
    if (a == "0")return [a, "0"];
    
    var sign = "";
    if (negpr(a)){
      a = remNeg(a);
      if (!negpr(b))sign = "-";
      else b = remNeg(b);
    } else if (negpr(b)){
      sign = "-";
      b = remNeg(b);
    }
    
    var decA = decpr(a)?decLen(a):0;
    var decB = decpr(b)?decLen(b):0;
    var move = Math.max(decA, decB);
    if (move != 0){
      a = right(a, move);
      b = right(b, move);
    }
    
    if (b == "1")return [a, "0"];
    
    var qr = qarLong(a, b);
    return [qr[0], left(qr[1], move)];
  }
  
  // long division of positive (non-zero) integers a and b
  function qarLong(a, b){
    var quot = "";
    var curr = "";
    var k;
    var arr = ["0", b, addr(b, b)];
    for (var i = 0; i < a.length; i++){
      curr += a[i];
      curr = trimInt(curr);
      if (ge(curr, b)){
        for (k = 2; ge(curr, arr[k]); k++){
          if (k+1 == arr.length)arr[k+1] = addr(arr[k], b);
        }
        quot += k-1;
        curr = subr(curr, arr[k-1]);
      } else {
        if (quot != "")quot += "0";
      }
    }
    if (quot == "")quot = "0";
    
    return [quot, curr];
  }
  
  // @param Number n
  // @param Number m
  // @return String prod
  function multrRange(n, m){
    if (n == m)return String(n);
    if (m < n)return "1";
    return multr(multrRange(n, Math.floor((n+m)/2)),
                 multrRange(Math.floor((n+m)/2)+1, m));
  }
  
  frac.nums = [0, "0", "1"]; // [n, pn, qn]
  function frac(a, b, p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    function finfrac(n, p1, q1){
      frac.nums = [n, p1, q1];
      return divr(p1, q1, p);
    }
    
    var p0 = "1";
    var p1 = a(0);
    if (p1 === null)return finfrac(0, "0", "1");
    var q0 = "0";
    var q1 = "1";
    var bn1 = b(1);
    if (bn1 === null)return finfrac(0, p1, q1);
    var prod = bn1;
    var pn, qn, an, bn;
    for (var n = 1; true; n++){
      an = a(n); bn = bn1;
      if (an === null || bn === null)return finfrac(n-1, p1, q1);
      bn1 = b(n+1);
      pn = addr(multr(an, p1), multr(bn, p0));
      qn = addr(multr(an, q1), multr(bn, q0));
      if (bn1 !== null)prod = multr(prod, bn1);
      if (qn === "0")err(frac, "qn can never equal 0");
      if (2*nlen(qn)-len(prod)-2 >= p)return finfrac(n, pn, qn);
      p0 = p1; q0 = q1;
      p1 = pn; q1 = qn;
    }
  }
  
  sfrac.nums = [0, "0", "1"]; // [n, pn, qn]
  function sfrac(a, p){
    if (p === undef)p = prec;
    if (p == -Infinity)return "0";
    
    function finfrac(n, p1, q1){
      sfrac.nums = [n, p1, q1];
      return divr(p1, q1, p);
    }
    
    var p0 = "1";
    var p1 = a(0);
    if (p1 === null)return finfrac(0, "0", "1");
    var q0 = "0";
    var q1 = "1";
    var pn, qn, an;
    for (var n = 1; true; n++){
      an = a(n);
      if (an === null)return finfrac(n-1, p1, q1);
      pn = addr(multr(an, p1), p0);
      qn = addr(multr(an, q1), q0);
      if (qn === "0")err(sfrac, "qn can never equal 0");
      if (2*nlen(qn)-2 >= p)return finfrac(n, pn, qn);
      p0 = p1; q0 = q1;
      p1 = pn; q1 = qn;
    }
  }
  
  // http://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
  function primes(n){
    if (n >= 40000000)alert("Warning: primeSieve: n = " + n + " >= 40000000; will take a long time; are you sure you want to proceed?");
    return primesErato(n);
  }
  
  function primesErato(n){
    var nums = [];
    var sqrtn = Math.floor(Math.sqrt(n));
    for (var i = 2; i <= sqrtn; i++){
      if (nums[i] === undef){
        for (var j = i*i; j <= n; j += i){
          nums[j] = false;
        }
      }
    }
    var primes = [];
    for (var i = 2; i <= n; i++){
      if (nums[i] === undef)primes.push(i);
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
    realInt: realInt,
    
    validp: validpr,
    canon: canonr,
    trimNum: trimNum,
    trimInt: trimInt,
    trimDec: trimDec,
    trimDecStart: trimDecStart,
    trimDecEnd: trimDecEnd,
    
    intp: intpr,
    decp: decpr,
    negp: negpr,
    evenp: evenpr,
    oddp: oddpr,
    fivep: fivepr,
    
    decLen: decLen,
    remNeg: remNeg,
    padZeros: padZeros,
    zero: zero,
    diffZero: diffZero,
    
    numToFloat: numToFloat,
    floatToNum: floatToNum,
    
    left: left,
    right: right,
    
    gt: gt,
    lt: lt,
    ge: ge,
    le: le,
    
    add: addr,
    sub: subr,
    mult: multr,
    div: divr,
    
    round: roundr,
    ceil: ceilr,
    floor: floorr,
    trunc: truncr,
    
    exp: expr,
    ln: lnr,
    pow: powr,
    sqrt: sqrtr,
    fact: factr,
    bin: binr,
    agm: agmr,
    sin: sinr,
    cos: cosr,
    sinh: sinhr,
    cosh: coshr,
    
    neg: negr,
    abs: absr,
    
    pi: pir,
    e: er,
    phi: phir,
    ln2: ln2r,
    ln5: ln5r,
    ln10: ln10r,
    
    qar: qar,
    multRange: multrRange,
    frac: frac,
    sfrac: sfrac
  };
  
  ////// Logging //////
  
  function log(name, data){
    logger(name, data);
  }
  
  function setLogger(func){
    logger = func;
  }
  
  var logger = function (name, data){};
  
  ////// PMath object exposure //////
  
  win.PMath = {
    setPrec: setPrec,
    setLogger: setLogger
  };
  
  ////// Speed tests //////
  
  function speed(fa, fb){
    var ta, tb;
    
    ta = speed2(fa);
    tb = speed2(fb);
    
    alert("expr1: " + ta + " expr2: " + tb);
  }
  
  function speed2(func){
    var t1, t2, f;
    
    t1 = (new Date()).getTime();
    for (f = 0; f < 1; f++)func();
    t2 = (new Date()).getTime();
    
    return t2-t1;
  }
  
  function a(){
    sfrac(function (n){return "1";}, 2000)
  }
  
  function b(){
    sfracOld(function (n){return "1";}, 2000)
  }
  
  //alert("");
  //speed(a, b);
  
  ////// Testing //////
  
  //alert(acothrCont("5", 1000));
  //alert($.toStr(factor(9007199254740992)))
  //$.prn($.toStr(primeSieve(40000000)));
  //lnr("3", 74)
  //alert(expr("31.81138866287038805391", 16);
  //10^ln(1000000)
  //(n=1000000),(x=5),(div(root(-n, x, 30)+root(n, x, 30), 2, 30)-1)*10^(2*ln(n)/ln(10))
  /*alert(C.add(C.cbrt(C.add(C.num(2,0), C.sqrt(C.num(5,0), 20))), 
              C.cbrt(C.sub(C.num(2,0), C.sqrt(C.num(5,0), 20)))));*/
  /*alert(add(cbrt(add(N(2,0), sqrt(N(5,0), 20))),
              cbrt(sub(N(2,0), sqrt(N(5,0), 20)))));*/
  //alert(C.add([5,6], [5,6], [34,0]));
  //alert(coshr("53", 100))
  //alert(sinhr("53", 100));
  //alert(acotrTaylorTrans("100", 100));
  //alert(acotrTaylor("100.1923482127318294820968048023985039752304", 300));
  //alert(acotrCont("100", 100));
  //alert(qar("11.1", "10"));
  //alert(R.add("234", "5342wef352", -2));
  //alert(R.add(234, 534352, -2));
  //alert(pirAgm(100));
  //alert(pir(100));
  //alert(cosr("3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117068", 100));
  //alert(cosr("345", 100));
  //alert(sinr("345", 100));
  //alert(powrDec("0.575191894877256230890772160745317261688633931261640307243905153859804691482989849083830787632877478036291", "3", 102));
  //divr("1", "1234234", 10000);
  //alert(recirNewton("1234234", 1000));
  //alert(agmr2("1", "5", 1000));
  //alert(Number("67807605593876998225639611741717507160044406952123769823017078477347541234546616714380003884811710403176445669043915873614906808830502905189260435685335795761967550017493759538635501269695284474671621052265475243600708269252935618694352594964091477818619517242971125270530710438712233364008605803645191272443"));
  //alert(sqrtrAppr("6780760559387699822563961174171750716004440695212376982301707847734754123454661671438000388481171040317644566904391587361490680883050290518926043568533579576196755001749375953863550126969528447467162105226547524360070826925293561869435259496409147781861951724297112527053071043871223336400860580364519127222202896924663571827"));
  //sqrtr("12384.1928342839058290580234908213492306804", 1000)
  //alert(sqrtrAppr("34235217823582093482903865902384902386502374023784023850287502174028438590238490238490238590238490324"));
  //alert($.toStr(floatToNum(numToFloat("0.00000023423453243"))));
  //alert(agmr("1", "5", 160));
  //alert(isqrtr("6780760559387699822563961174171750716004440695212376982301707847734754123454661671438000388481171040317644566904391587361490680883050290518926043568533579576196755001749375953863550126969528447467162105226547524360070826925293561869435259496409147781861951724297112527053071043871223336400860580364519127222202896924663571827"));
  //alert(sqrtr("6.780760559387699822563961174171750716004440695212376982301707847734754123454661671438000388481171040317644566904391587361490680883050290518926043568533579576196755001749375953863550126969528447467162105226547524360070826925293561869435259496409147781861951724297112527053071043871223336400860580364519127222202896924663571827", 162));
  //alert(sqrtrNewton(multr("2.618033988749894848204586834365638117720309179805762862135448622705260462818902449707207204189391137484754088075386891752126633862223536931793180060766726354433389", "2.590020064111351452684175395673489376179582365370676141822337340714210013770674048615727578674943945478898935722942703089672088513775856188413687579011184808974943"), 162));
  //alert(multr("2.618033988749894848204586834365638117720309179805762862135448622705260462818902449707207204189391137484754088075386891752126633862223536931793180060766726354433389", "2.590020064111351452684175395673489376179582365370676141822337340714210013770674048615727578674943945478898935722942703089672088513775856188413687579011184808974943"));
  //alert(sqrtrShift("0.34", 1000));
  //alert(sqrtrNewton("23423421.38", 1000));
  //alert(left(sqrtrCont("2342342138", 999), 1));
  //alert(sqrtr("234234235435235325", 100));
  //alert(diffZero("-253423621415.0127350928423492806541", "253423621415.5127350928423492806540", 0));
  //alert(sqrtrNewton2("234234235435", 100));
  //alert(diffZero3("10.9", "5.4", -1));
  //alert(diffZero3("10.07", "9.56", 0));
  //alert(sqrtrNewton2("234234235435", 100));
  //alert(isqrtr2("6"));
  //alert(roundr("2217119.999999999986868995423876", 2));
  //alert(sqrtrNewton(multr("1.24232492", left("1", 350)), 350));
  //alert(multr("1488.999664204126", "1488.999664204126", 2));
  //alert(checkE("2.34e-5"));
  //alert(pir(25));
  //alert(expr("400"));
  //alert(document.write(factrDiv(7000)));
  //alert(exprTaylor2("100", 16));
  //alert(divr("0", "0", 100))
  //alert(ge("3434.4", "3434.4"));
  //alert(divrLong("232354", "235234343", 100));
  //alert(zero("534", -4));
  //alert(addOne("98"));
  //alert(left("2.125", -3));
  //alert(floorr("-0.0004", -1));
  //alert(floorr("-0.0004", -1));
  //alert(trimDecEnd("0.0"));
  //alert($.toStr(multr("2.125", "8")));
  //alert($.toStr(multr("0.33", "0.61")));
  //alert($.toStr(multrKarat("11", "12")));
  //alert($.toStr(right("0", 3)));
  //alert($.toStr(multrKarat3("113", "122")));
  //alert($.toStr(multrKarat("12889304874632686622709889801374997985331608535613486153184514967230328583632747848036257469982508572688186681932235896221449373057559635914390302139001058088604612498464803714651813568325261804161685272593137009196211865717877230721450887059497494404191409168185560590069601524211690126856004610823898742171174787233827863475992465580934967787013678493354213629743687806200677568982345495217255907891972630589137893145288578735118248138334178942892688371680125033115325551384222140304267738554980447979050316735753243615685124600422684053835010951389209821531089879919221429933151887593143692918885438823447455305969701299650004792692860261362017725437384781206928452968705762886015451905991924983637757907828859716371381803958521772224509979149453702919220207438111281202333127668546378270696528833311475796075206863947539864658853504242910373327154388564044608258803212987592629450472312855637293642012934273865791072469048", "323453465848203984902384901823759872984729875983879058098509128904823095209348709238509437598023740928390583246534255238509238409238084423243264363415264352444632423323453465848203984902384902385092384092380844232432643634152643524323453465848203984902384901823759872984729875983879058098509128904823095209348709238509437598023740928390583246534255238509238409238084423243264363415264352444632423323453465848203984902384902385092384092380844232432643634152643524")));
  //alert($.toStr(multrKarat3("39849023849018237598729847298759838790580985091289048230952093487092385094375980237409283905832465343984902384901823759872984729875983879058098509128904823095209348709238509437598023740928390583246534198273408230948092680932840923840923759827489273850963904823908690486908903045893048690348902835093849058790465890843908230958024", "323453465848203984902384901823759872984729875983879058098509128904823095209348709238509437598023740928390583246534255238509238409238084423243264363415264352444632423323453465848203984902384902385092384092380844232432643634152643524323453465848203984902384901823759872984729875983879058098509128904823095209348709238509437598023740928390583246534255238509238409238084423243264363415264352444632423323453465848203984902384902385092384092380844232432643634152643524")));
})(window);
