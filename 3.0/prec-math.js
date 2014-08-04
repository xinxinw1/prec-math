/***** Perfectly Precise Math Library 3.0 *****/

/* requires "tools.js" */
  /* functions isArr */

(function (window, undefined){
  ////// Default precision //////
  
  var prec = 16;
  
  function setPrec(nprec){
    prec = nprec;
  }
  
  ////// Complex number functions //////
  
  //// Preparers ////
  
  function prep(z){
    if (!isValid(z))return false;
    return canon(z);
  }
  
  function prepReal(z){
    if (!isValid(z))return false;
    if (!isReal(z))return false;
    return canonr(getA(z));
  }
  
  function prepNum(z){
    if (!isValid(z))return false;
    if (!isReal(z))return false;
    return Number(getA(z));
  }
  
  function prepInt(z){
    if (!isValid(z))return false;
    if (!isReal(z))return false;
    z = canonr(getA(z));
    if (!isInt(z))return false;
    return Number(z);
  }
  
  //// Validators ////
  
  function isValid(z){
    return $.isArr(z) && isValidReal(z[0]) && isValidReal(z[1]);
  }
  
  /*! All comp num functions past here assumes all inputs are validated !*/
  
  //// [a, b] functions ////
  
  function N(a, b){
    return [a, b];
  }
  
  function getA(z){
    return z[0];
  }
  
  function getB(z){
    return z[1];
  }
  
  //// Canonicalizers ////
  
  function canon(z){
    return N(canonr(getA(z)), canonr(getB(z)));
  }
  
  //// is... functions ////
  
  function isReal(z){
    return getB(z) == "0";
  }
  
  /*! All comp num functions past here assumes all inputs are canonicalized !*/
  
  function isIntComp(z){
    return isReal(z) && isInt(getA(z));
  }
  
  //// Processing functions ////
  
  //// Basic operation functions ////
  
  function add(z, w, nprec){
    return N(addr(getA(z), getA(w), nprec),
             addr(getB(z), getB(w), nprec));
  }
  
  function sub(z, w, nprec){
    return N(subr(getA(z), getA(w), nprec),
             subr(getB(z), getB(w), nprec));
  }
  
  function mult(z, w, nprec){
    var a, b, c, d;
    a = getA(z); b = getB(z);
    c = getA(w); d = getB(w);
    
    return N(subr(multr(a, c), multr(b, d), nprec),
             addr(multr(a, d), multr(b, c), nprec));
  }
  
  function div(z, w, nprec){
    if (nprec == undefined)nprec = prec;
    
    var a, b, c, d;
    a = getA(z); b = getB(z);
    c = getA(w); d = getB(w);
    
    if (c == "0" && d == "0")error("Error: div(z, w, nprec): w cannot be 0");
    
    var sum = addr(powr(c, "2"), powr(d, "2"));
    return N(divr(addr(multr(a, c), multr(b, d)), sum, nprec),
             divr(subr(multr(b, c), multr(a, d)), sum, nprec));
  }
  
  //// Rounding functions ////
  
  function round(z, nprec){
    return N(roundr(getA(z), nprec),
             roundr(getB(z), nprec));
  }
  
  function ceil(z, nprec){
    return N(ceilr(getA(z), nprec),
             ceilr(getB(z), nprec));
  }
  
  function floor(z, nprec){
    return N(floorr(getA(z), nprec),
             floorr(getB(z), nprec));
  }
  
  function trunc(z, nprec){
    return N(truncr(getA(z), nprec),
             truncr(getB(z), nprec));
  }
  
  //// Extended operation functions ////
  
  function exp(z, nprec){
    if (nprec == undefined)nprec = prec;
    
    var a, b;
    a = getA(z); b = getB(z);
    
    var expra = expr(a, nprec+2);
    return N(multr(expra, cosr(b, nprec+2+len(expra)), nprec),
             multr(expra, sinr(b, nprec+2+len(expra)), nprec));
  }
  
  function ln(z, nprec){
    if (nprec == undefined)nprec = prec;
    return N(lnr(getA(abs(z, nprec+2)), nprec),
             getA(arg(z, nprec)));
  }
  
  function pow(z, w, nprec){
    if (nprec == undefined)nprec = prec;
    
    var a, b, c, d;
    a = getA(z); b = getB(z);
    c = getA(w); d = getB(w);
    
    if (b == "0" && d == "0" && (isInt(c) || !isNeg(a))){
      return N(powr(a, c, nprec), "0");
    }
    
    return exp(mult(w, ln(z, nprec+4), nprec+2), nprec);
  }
  
  // @param String n
  function root(n, z, nprec){
    if (nprec == undefined)nprec = prec;
    
    // if z is real and n is odd, return real root
    if (getB(z) == "0" && !isEven(n)){
      var c = getA(z);
      return N(sgno(c) + powr(absr(c), divr("1", n, nprec+2), nprec), "0");
    }
    
    return pow(z, N(divr("1", n, nprec+2), "0"), nprec);
  }
  
  function sqrt(z, nprec){
    if (nprec == undefined)nprec = prec;
    
    var a, b;
    a = getA(z); b = getB(z);
    
    var absz = getA(abs(z, nprec+4));
    return N(sqrtr(divr(addr(a, absz), "2", nprec+2), nprec),
             sgno(b) + sqrtr(divr(addr(negr(a), absz), "2", nprec+2), nprec));
  }
  
  function cbrt(z, nprec){
    return root("3", z, nprec);
  }
  
  function fact(x, nprec){
    return N(factr(x, nprec), "0");
  }
  
  function bin(x, y, nprec){
    return N(binr(x, y, nprec), "0");
  }
  
  function agm(x, y, nprec){
    return N(agmr(x, y, nprec), "0");
  }
  
  function sin(z, nprec){
    if (nprec == undefined)nprec = prec;
    
    var a, b;
    a = getA(z); b = getB(z);
    
    var cosh = coshr(b, nprec+2);
    var sinh = sinhr(b, nprec+2);
    return N(multr(sinr(a, nprec+2+len(cosh)), cosh, nprec),
             multr(cosr(a, nprec+2+len(sinh)), sinh, nprec));
  }
  
  function cos(z, nprec){
    if (nprec == undefined)nprec = prec;
    
    var a, b;
    a = getA(z); b = getB(z);
    
    var cosh = coshr(b, nprec+2);
    var sinh = sinhr(b, nprec+2);
    return N(multr(cosr(a, nprec+2+len(cosh)), cosh, nprec),
             negr(multr(sinr(a, nprec+2+len(sinh)), sinh, nprec)));
  }
  
  function sinh(z, nprec){
    if (nprec == undefined)nprec = prec;
    
    var a, b;
    a = getA(z); b = getB(z);
    
    var sinh = sinhr(a, nprec+2);
    var cosh = coshr(a, nprec+2);
    return N(multr(sinh, cosr(b, nprec+2+len(sinh)), nprec),
             multr(cosh, sinr(b, nprec+2+len(cosh)), nprec));
  }
  
  function cosh(z, nprec){
    if (nprec == undefined)nprec = prec;
    
    var a, b;
    a = getA(z); b = getB(z);
    
    var cosh = coshr(a, nprec+2);
    var sinh = sinhr(a, nprec+2);
    return N(multr(cosh, cosr(b, nprec+2+len(cosh)), nprec),
             multr(sinh, sinr(b, nprec+2+len(sinh)), nprec));
  }
  
  //// Other operation functions ////
  
  function abs(z, nprec){
    if (nprec == undefined)nprec = prec;
    return N(sqrtr(addr(powr(getA(z), "2"),
                        powr(getB(z), "2")), nprec), "0");
  }
  
  // needs atan2r
  function arg(z, nprec){
    if (nprec == undefined)nprec = prec;
    return N(atan2r(getB(z), getA(z), nprec), "0");
  }
  
  function sgn(z, nprec){
    if (nprec == undefined)nprec = prec;
    if (getA(z) == "0" && getB(z) == "0")return z;
    return div(z, abs(z, nprec+2), nprec);
  }
  
  function re(z){
    return N(getA(z), "0");
  }
  
  function im(z){
    return N(getB(z), "0");
  }
  
  function conj(z){
    return N(getA(z), negr(getB(z)));
  }
  
  //// Mathematical constants ////
  
  function pi(nprec){
    return N(pir(nprec), "0");
  }
  
  function e(nprec){
    return N(er(nprec), "0");
  }
  
  function phi(nprec){
    return N(phir(nprec), "0");
  }
  
  function ln2(nprec){
    return N(ln2r(nprec), "0");
  }
  
  function ln5(nprec){
    return N(ln5r(nprec), "0");
  }
  
  function ln10(nprec){
    return N(ln10r(nprec), "0");
  }
  
  //// C object exposure ////
  
  window.C = {
    prep: prep,
    prepReal: prepReal,
    prepNum: prepNum,
    prepInt: prepInt,
    
    isValid: isValid,
    canon: canon,
    
    isReal: isReal,
    isInt: isIntComp,
    
    num: N,
    getA: getA,
    getB: getB,
    
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
  
  //// Preparers ////
  
  function prepr(a){
    a = String(a);
    if (!isValidReal(a))return false;
    return canonr(a);
  }
  
  function preprNum(a){
    a = String(a);
    if (!isValidReal(a))return false;
    a = canonr(a);
    return Number(a);
  }
  
  function preprInt(a){
    a = String(a);
    if (!isValidReal(a))return false;
    a = canonr(a);
    if (!isInt(a))return false;
    return Number(a);
  }
  
  //// Validators ////
  
  function isValidReal(a){
    return /^(\+|-)?[0-9]+(\.[0-9]+)?$/.test(a);
  }
  
  /*! All real num functions past here assumes all inputs are validated !*/
  
  //// Canonicalizers ////
  
  function canonr(a){
    var sign = "+";
    if (hasSign(a)){
      sign = getSign(a);
      a = remSign(a);
    }
    a = isDec(a)?trimDec(a):trimInt(a);
    return (a != "0" && sign == "-")?sign+a:a;
  }
  
  // Trim unsigned number
  function trimNum(a){
    return isDec(a)?trimDec(a):trimInt(a);
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
  
  function isPlus(a){
    return a[0] == '+';
  }
  
  function hasSign(a){
    return isNeg(a) || isPlus(a);
  }
  
  function getSign(a){
    return a[0];
  }
  
  function remSign(a){
    return a.substring(1, a.length);
  }
  
  function absrNoCanon(a){
    return hasSign(a)?remSign(a):a;
  }
  
  /*! All real num functions past here assumes all inputs are canonicalized !*/
  
  //// is... functions
  
  function isInt(a){
    return a.indexOf(".") == -1;
  }
  
  function isDec(a){
    return a.indexOf(".") != -1;
  }
  
  function isNeg(a){
    return a[0] == '-';
  }
  
  function isEven(a){
    if (isDec(a))return false;
    
    var last = a[a.length-1];
    return (last == '0' || last == '2' || last == '4' || last == '6' || last == '8');
  }
  
  function isDivFive(a){
    if (isDec(a))return false;
    
    var last = a[a.length-1];
    return (last == '0' || last == '5');
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
  
  // return roundr(a, nprec) == "0";
  // not part of "is... functions" because it involves rounding and nprec
  function isZero(a, nprec){ 
    if (a == "0")return true;
    if (nprec == undefined)nprec = 0;
    
    if (isNeg(a))a = remNeg(a);
    
    var adot = a.indexOf(".");
    if (nprec < 0){
      if (adot == -1)adot = a.length;
      if (adot+nprec <= -1)return true;
      return adot+nprec == 0 && Number(a[adot+nprec]) < 5;
    } else {
      if (adot == -1 || a[0] != '0')return false;
      if (nprec == 0)return Number(a[adot+1]) < 5;
      if (adot+1+nprec >= a.length)return false;
      
      for (var i = adot+1; i < adot+1+nprec; i++){
        if (a[i] != '0')return false;
      }
      return Number(a[adot+1+nprec]) < 5;
    }
  }
  
  // return isZero(subr(a, b), nprec);
  function isDiffZero(a, b, nprec){
    if (a == b)return true;
    if (nprec == undefined)nprec = 0;
    
    if (isNeg(a)){
      if (!isNeg(b)){
        return isZero(subr(a, b), nprec);
        //b = addr(remNeg(a), b);
        //a = "0";
      } else {
        a = remNeg(a);
        b = remNeg(b);
      }
    } else if (isNeg(b)){
      return isZero(subr(a, b), nprec);
      //a = addr(a, remNeg(b));
      //b = "0";
    }
    
    var padArr = padZeros(a, b);
    a = padArr[0]; b = padArr[1];
    
    var dot = decPos(a);
    var pos;
    if (nprec < 0){
      pos = dot+nprec;
      if (pos < 0)return true;
    } else {
      pos = dot+nprec+1;
      if (pos >= a.length)return false;
    }
    
    for (var i = 0; i < pos; i++){
      if (a[i] != b[i]){
        if (Number(a[i]) > Number(b[i])){
          // a = 100.0, b = 099.9, nprec = 0
          // in if: a = 200.0, b = 099.9, nprec = 0
          if (Number(b[i]) != Number(a[i])-1)return false;
          // a = 100.0, b = 099.9, nprec = 0
          for (i = i+1; i < pos; i++){
            if (a[i] == '.')continue;
            // in if: a = 100.0, b = 098.9, nprec = 0
            if (a[i] != '0' || b[i] != '9')return false;
          }
          var diff = Number(a[i]) - Number(b[i]);
          // in if: a = 100.0, b = 099.4, nprec = 0
          if (diff != -5)return diff < -5;
          for (i = i+1; i < a.length; i++){
            if (a[i] != b[i]){
              // a = 100.02, b = 099.51, nprec = 0
              return Number(a[i]) < Number(b[i]);
            }
          }
          // a = 100.01, b = 099.51, nprec = 0
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
    // a = 5.9, b = 5.0, nprec = 0
    var diff = Number(a[i]) - Number(b[i]);
    if (diff >= 0){
      // in if: a = 5.9, b = 5.0, nprec = 0
      if (diff != 5)return diff < 5;
      // a = 5.54, b = 5.04, nprec = 0
      for (i = i+1; i < a.length; i++){
        if (a[i] != b[i]){
          // a = 5.54, b = 5.00, nprec = 0
          return Number(a[i]) < Number(b[i]);
        }
      }
      // a = 5.5111, b = 5.0111, nprec = 0
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
    
    if (isNeg(a))a = remNeg(a);
    
    var fa = truncr(a);
    if (fa != "0")return fa.length;
    
    // 2 = a.indexOf(".")+1
    // 2-i = -(i-(a.indexOf(".")+1))
    for (var i = 2; i < a.length; i++){
      if (a[i] != '0')return 2-i;
    }
    
    error("Error: len: Something strange happened");
  }
  
  // equals floor(log(abs(a)));
  function nlen(a){
    if (a == "0")return -Infinity;
    
    if (isNeg(a))a = remNeg(a);
    
    var fa = truncr(a);
    if (fa != "0")return fa.length-1;
    
    // 2 = a.indexOf(".")+1
    // 2-i = -(i-(a.indexOf(".")+1))
    for (var i = 2; i < a.length; i++){
      if (a[i] != '0')return 2-i-1;
    }
    
    error("Error: nlen: Something strange happened");
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
    
    if (sign == '+')return mDotRight(front, back);
    if (sign == '-')return mDotLeft(front, back);
  }
  
  function sgno(a){
    return (a[0] == '-')?"-":"";
  }
  
  //// Floating point ////
  
  function numToFloat(a){
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    if (a == "0")return ["0", 0];
    if (a[0] != '0'){
      // 152.53435435
      var adot = a.indexOf(".");
      if (adot == -1)adot = a.length;
      return [sign + mDotLeft(a, adot-1), adot-1];
    } else {
      // 0.00043534 2 = a.indexOf(".");
      var i;
      for (i = 2; a[i] == '0'; i++){}
      return [sign + mDotRight(a, i-1), -(i-1)];
    }
  }
  
  function floatToNum(a){
    if (a[1] > 0){
      return mDotRight(a[0], a[1]);
    } else if (a[1] == 0){
      return a[0];
    } else if (a[1] < 0){
      return mDotLeft(a[0], -a[1]);
    }
  }
  
  //// Dot movers ////
  
  // @param String a
  // @param Number n
  function mDotLeft(a, n){ // 32.44 -> 3.244
    if (n == 0 || a == "0")return a;
    if (n < 0)return mDotRight(a, -n);
    
    var sign = "";
    if (isNeg(a)){
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
  function mDotRight(a, n){ // 32.44 -> 324.4
    if (n == 0 || a == "0")return a;
    if (n < 0)return mDotLeft(a, -n);
    
    // sign only used for trimDecStart
    var sign = "";
    if (isNeg(a)){
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
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    a = remDec(a);
    b = remDec(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (Number(a[i]) > Number(b[i]));
    }
    
    error("Error: gt: Something strange happened (input not canonical)");
  }
  
  function lt(a, b){ // is (a < b) ?
    if (a == b)return false;
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    a = remDec(a);
    b = remDec(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (Number(a[i]) < Number(b[i]));
    }
    
    error("Error: lt: Something strange happened (input not canonical)");
  }
  
  function ge(a, b){ // is (a >= b) ?
    if (a == b)return true;
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    a = remDec(a);
    b = remDec(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (Number(a[i]) > Number(b[i]));
    }
    
    error("Error: ge: Something strange happened (input not canonical)");
  }
  
  function le(a, b){ // is (a <= b) ?
    if (a == b)return true;
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    a = remDec(a);
    b = remDec(b);
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (Number(a[i]) < Number(b[i]));
    }
    
    error("Error: le: Something strange happened (input not canonical)");
  }
  
  //// Basic operation functions ////
  
  function addr(a, b, nprec){
    if (nprec == -Infinity)return "0";
    
    var sign = "";
    if (isNeg(a)){
      if (!isNeg(b))return subr(b, remNeg(a), nprec);
      sign = "-";
      a = remNeg(a);
      b = remNeg(b);
    } else if (isNeg(b))return subr(a, remNeg(b), nprec);
    
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
    if (isDec(sum))sum = trimDecEnd(sum);
    
    return (nprec == undefined)?sum:roundr(sum, nprec);
  }
  
  function subr(a, b, nprec){
    if (a == b)return "0";
    if (nprec == -Infinity)return "0";
    
    if (isNeg(a)){
      if (!isNeg(b))return addr(a, "-" + b, nprec);
      else {
        var c = a;
        a = remNeg(b);
        b = remNeg(c);
      }
    } else if (isNeg(b))return addr(a, remNeg(b), nprec);
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    if (gt(b, a))return negr(subr(b, a, nprec));
    
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
    
    return (nprec == undefined)?diff:roundr(diff, nprec);
  }
  
  function multr(a, b, nprec){
    if (a == "0" || b == "0")return "0";
    if (nprec == -Infinity)return "0";
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      if (!isNeg(b))sign = "-";
      else b = remNeg(b);
    } else if (isNeg(b)){
      sign = "-";
      b = remNeg(b);
    }
    
    var numDec = 0;
    if (isDec(a)){
      numDec += decLen(a);
      a = remDec(a);
      a = trimInt(a);
    }
    if (isDec(b)){
      numDec += decLen(b);
      b = remDec(b);
      a = trimInt(a);
    }
    
    var prod = multrInt(a, b);
    if (numDec > 0)prod = mDotLeft(prod, numDec);
    prod = sign + prod;
    
    return (nprec == undefined)?prod:roundr(prod, nprec);
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
      return addr(mDotRight(multrKarat(a1, b), m), multrKarat(a0, b));
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
    
    return addr(addr(mDotRight(z2, 2*m), mDotRight(z1, m)), z0);
  }
  
  function divr(a, b, nprec){
    if (b == "0")error("Error: divr(a, b, nprec): b cannot be 0");
    if (a == "0")return "0";                  
    if (b == "1")return roundr(a, nprec);
    
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      if (!isNeg(b))sign = "-";
      else b = remNeg(b);
    } else if (isNeg(b)){
      sign = "-";
      b = remNeg(b);
    }
    
    var decA = (isDec(a))?decLen(a):0;
    var decB = (isDec(b))?decLen(b):0;
    var move = Math.max(decA, decB);
    if (move != 0){
      a = mDotRight(a, move);
      b = mDotRight(b, move);
    }
    
    var quot = divrLong(a, b, nprec);
    return (quot == "0")?quot:sign + quot;
  }
  
  // long division of positive (non-zero) integers a and b
  function divrLong(a, b, nprec){
    var quot = "0";
    var curr = "";
    var k;
    var arr = ["0", b, addr(b, b)];
    var alen = a.length;
    for (var i = 0; i < alen+nprec+1; i++){
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
    if (nprec < 0 && quot != "0"){
      for (var i = -nprec-1; i >= 1; i--)quot += "0";
    }
    
    return (quot == "0")?quot:roundr(quot, nprec);
  }
  
  //// Rounding functions ////
  
  function roundr(a, nprec){
    if (a == "0")return "0";
    if (nprec == -Infinity)return "0";
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (nprec == 0 || nprec == undefined){
      if (adot == -1)return sign + a;
      var round = a.substring(0, adot);
      if (Number(a[adot+1]) >= 5)round = addOne(round);
    } else if (nprec < 0){
      if (adot == -1)adot = alen;
      if (adot+nprec <= -1)return "0";
      
      var round = a.substring(0, adot+nprec);
      if (round == "")round = "0";
      if (Number(a[adot+nprec]) >= 5)round = addOne(round);
      if (round != "0"){
        for (var d = -nprec; d >= 1; d--)round += "0";
      }
    } else {
      if (adot == -1 || adot+nprec+1 >= alen)return sign + a;
      
      var round = a.substring(0, adot+nprec+1);
      if (Number(a[adot+nprec+1]) >= 5)round = addOneDec(round);
      round = trimNum(round);
    }
    
    return (round == "0")?round:sign + round;
  }
  
  function ceilr(a, nprec){
    if (a == "0")return "0";
    if (nprec == -Infinity)return "0";
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (nprec == 0 || nprec == undefined){
      if (adot == -1)return sign + a;
      var round = a.substring(0, adot);
      if (sign == "")round = addOne(round);
    } else if (nprec < 0){
      if (adot == -1)adot = alen;
      if (adot+nprec <= 0){
        if (sign == ""){
          var round = "1";
          for (var d = -nprec; d >= 1; d--)round += "0";
        } else {
          return "0";
        }
      }
      
      var round = a.substring(0, adot+nprec);
      if (sign == "")round = addOne(round);
      if (round != "0"){
        for (var d = -nprec; d >= 1; d--)round += "0";
      }
    } else {
      if (adot == -1 || adot+nprec+1 >= alen)return sign + a;
      
      var round = a.substring(0, adot+nprec+1);
      if (sign == "")round = addOneDec(round);
      round = trimNum(round);
    }
    
    return (round == "0")?round:sign + round;
  }
  
  function floorr(a, nprec){
    if (a == "0")return "0";
    if (nprec == -Infinity)return "0";
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (nprec == 0 || nprec == undefined){
      if (adot == -1)return sign + a;
      var round = a.substring(0, adot);
      if (sign == "-")round = addOne(round);
    } else if (nprec < 0){
      if (adot == -1)adot = alen;
      if (adot+nprec <= 0){
        if (sign == "-"){
          var round = "1";
          for (var d = -nprec; d >= 1; d--)round += "0";
        } else {
          return "0";
        }
      }
      
      var round = a.substring(0, adot+nprec);
      if (sign == "-")round = addOne(round);
      if (round != "0"){
        for (var d = -nprec; d >= 1; d--)round += "0";
      }
    } else {
      if (adot == -1 || adot+nprec+1 >= alen)return sign + a;
      
      var round = a.substring(0, adot+nprec+1);
      if (sign == "-")round = addOneDec(round);
      round = trimNum(round);
    }
    
    return (round == "0")?round:sign + round;
  }
  
  function truncr(a, nprec){
    if (a == "0")return "0";
    if (nprec == -Infinity)return "0";
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (nprec == 0 || nprec == undefined){
      if (adot == -1)return sign + a;
      var round = a.substring(0, adot);
    } else if (nprec < 0){
      if (adot == -1)adot = alen;
      if (nprec+adot <= -1)return "0";
      
      var round = a.substring(0, adot+nprec);
      if (round == "")round = "0";
      else if (round != "0"){
        for (var d = -nprec; d >= 1; d--)round += "0";
      }
    } else {
      if (adot == -1 || adot+nprec+1 >= alen)return sign + a;
      
      var round = a.substring(0, adot+nprec+1);
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
  
  function expr(a, nprec){
    if (a == "0")return roundr("1", nprec);
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    var sign = false;
    if (isNeg(a)){
      a = remNeg(a);
      sign = true;
      nprec += 2;
    }
    
    var exp;
    if (isInt(a)){
      var an = Number(a);
      if (an == 1)exp = er(nprec);
      else if (an < 100)exp = powr(er(nprec+1+(an-1)*(len(a)+1)), a, nprec+1);
      else exp = exprTaylorFrac(a, nprec+2);
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
        if (decLen <= 30)exp = exprTaylorFrac(a, nprec);
        else exp = exprTaylorTerms(a, nprec);
      } else {
        var expfl;
        if (fl == 1)expfl = er(nprec+2);
        else if (fl < 100)expfl = powr(er(nprec+1+(fl-1)*(flLen+1)), String(fl), nprec+1);
        else expfl = exprTaylorFrac(String(fl), nprec+2);
        
        if (decLen <= 30){
          exp = multr(expfl, exprTaylorFrac(a, nprec+2+len(expfl)), nprec);
        } else {
          exp = multr(expfl, exprTaylorTerms(a, nprec+2+len(expfl)), nprec);
        }
      }
    }
    
    if (sign)return divr("1", exp, nprec-2);
    else return exp;
  }
  
  // Taylor Series with big fraction
  function exprTaylorFrac(a, nprec){
    if (isDec(a))a = roundr(a, nprec+2);
    var frac1 = addr(a, "1");
    var frac2 = "1";
    var pow = a;
    for (var i = 2; true; i++){
      frac1 = multr(frac1, String(i));
      pow = multr(pow, a);
      frac1 = addr(frac1, pow);
      frac2 = multr(frac2, String(i));
      if (nlen(frac2)-len(pow)-2 >= nprec)break;
    }
    
    return divr(frac1, frac2, nprec);
  }
  
  // Taylor Series adding term by term
  function exprTaylorTerms(a, nprec){
    var ar = roundr(a, nprec+3);
    var pow = ar;
    var fact = "1";
    var frac = "1";
    var exp = addr(ar, "1");
    for (var i = 2; true; i++){
      pow = multr(pow, ar, nprec+3);
      fact = multr(fact, String(i));
      frac = divr(pow, fact, nprec+3);
      if (isZero(frac, nprec+1))break;
      exp = addr(exp, frac);
    }
    
    return roundr(exp, nprec);
  }
  
  function lnr(a, nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    if (isNeg(a))error("Error: lnr(a, nprec): a cannot be negative");
    if (a == "0")error("Error: lnr(a, nprec): a cannot be zero");
    
    var tens = len(a)-1;
    //if (tens > 0)a = mDotLeft(a, tens);
    //else if (tens < 0)a = mDotRight(a, -tens);
    a = mDotLeft(a, tens);
    
    var twos = tens;
    var fives = tens;
    
    switch (a[0]){
      case "1": if (isInt(a) || Number(a[2]) <= 3)break;
      case "2": a = divr(a, "2", Infinity); twos++; break;
      case "3":
      case "4": a = divr(a, "4", Infinity); twos += 2; break;
      case "5":
      case "6": a = divr(a, "5", Infinity); fives++; break;
      case "7":
      case "8": a = divr(a, "8", Infinity); twos += 3; break;
      case "9": a = mDotLeft(a, 1); twos++; fives++; break;
    }
    twos = String(twos); fives = String(fives);
    
    var lnsmall = lnrTaylor(a, nprec+2);
    var ln;
    if (twos != "0"){
      if (twos == fives){
        var lnr10 = ln10r(nprec+2+len(twos));
        ln = addr(lnsmall, multr(twos, lnr10), nprec);
      } else {
        if (fives != "0"){
          var both = ln2and5(nprec+2+Math.max(len(twos), len(fives)));
          var lnr2 = both[0];
          var lnr5 = both[1];
          ln = addr(addr(lnsmall, multr(twos, lnr2)),
                    multr(fives, lnr5),
                    nprec);
        } else {
          var lnr2 = ln2r(nprec+2+len(twos));
          ln = addr(lnsmall, multr(twos, lnr2), nprec);
        }
      }
    } else {
      if (fives != "0"){
        var lnr5 = ln5r(nprec+2+len(fives));
        ln = addr(lnsmall, multr(fives, lnr5), nprec);
      } else {
        ln = roundr(lnsmall, nprec);
      }
    }
    
    return ln;
  }
  
  // Taylor series
  function lnrTaylor(a, nprec){
    var a1 = subr(a, "1");
    var frac1 = a1;
    var frac;
    var ln = a1;
    var sign = true;
    for (var i = 2; true; i++, sign = !sign){
      frac1 = roundr(multr(frac1, a1), nprec+2);
      frac = divr(frac1, String(i), nprec+2);
      if (isZero(frac, nprec+1))break;
      if (sign)ln = subr(ln, frac);
      else ln = addr(ln, frac);
    }
   
    return roundr(ln, nprec);
  }
  
  function powr(a, b, nprec){
    if (a == "0" || a == "1" || b == "1")return roundr(a, nprec);
    if (b == "0")return roundr("1", nprec);
    if (b == "-1")return divr("1", a, nprec);
    if (nprec == -Infinity)return "0";
    
    var sign = isNeg(b);
    if (sign)b = remNeg(b);
    
    var pow;
    if (isInt(b)){
      if (b == "2")pow = multr(a, a, nprec);
      else if (isInt(a) || nprec == undefined)pow = powrExact(a, Number(b), nprec);
      else pow = powrDec(a, Number(b), nprec);
    } else {
      if (nprec == undefined)nprec = prec;
      pow = expr(multr(b, lnr(a, nprec+6+len(b)), nprec+4), nprec);
    }
    
    return (sign)?divr("1", pow, nprec):pow;
  }
  
  // http://en.wikipedia.org/wiki/Exponentiation_by_squaring
  // @param String a
  // @param Number n
  function powrExact(a, n, nprec){
    var prod = "1";
    while (n > 0){
      if (n % 2 == 1){
        prod = multr(prod, a);
        n--;
      }
      a = multr(a, a);
      n = n/2;
    }
    return (nprec == undefined)?prod:roundr(prod, nprec);
  }
  
  // @param String a
  // @param Number n
  function powrDec(a, n, nprec){
    var sign = "";
    if (isNeg(a) && n % 2 == 1){
      sign = "-";
      a = remNeg(a);
    }
    
    var log = len(a);
    var d1 = nprec+2+(n-1)*log+n-1;
    var d2 = d1-1; // nprec+2+(n-1)*log+n-2
    var sub = log+1;
    var x = a;
    for (var i = 1; i <= n-1; i++){
      x = multr(roundr(x, d1), roundr(a, d2));
      d1 = d1-sub;
      d2 = d2-1;
    }
    
    return roundr(sign + x, nprec);
  }
  
  function sqrtr(a, nprec){
    if (isNeg(a))error("Error: sqrtr(a, nprec): a cannot be negative");
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    if (isInt(a))return sqrtrCont(a, nprec);
    else if (nprec < 50)return sqrtrNewton(a, nprec);
    else return sqrtrShift(a, nprec);
  }
  
  // uses identity sqrt(a) = sqrt(100*a)/10 to remove decimals
  // and then uses continued fraction
  function sqrtrShift(a, nprec){
    var numDec = 0;
    if (isDec(a)){
      numDec += decLen(a);
      a = remDec(a);
      a = trimInt(a);
      if (numDec % 2 == 1)a += "0";
      numDec = Math.ceil(numDec/2);
    }
    
    var sqrt = sqrtrCont(a, nprec-numDec);
    return mDotLeft(sqrt, numDec);
  }
  
  // continued fraction
  // http://en.wikipedia.org/wiki/Generalized_continued_fraction
  function sqrtrCont(a, nprec){
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
    
    return genContFrac(an, bn, nprec);
  }
  
  // Newton's method
  // http://en.wikipedia.org/wiki/Methods_of_computing_square_roots
  function sqrtrNewton(a, nprec){
    var sqrt = sqrtrAppr(a);
    if (sqrt == "0")return "0";
    var func1;
    while (true){
      func1 = subr(multr(sqrt, sqrt, nprec+2), a);
      func1 = divr(func1, multr("2", sqrt), nprec+2);
      if (isZero(func1, nprec+1))break;
      sqrt = subr(sqrt, func1);
    }
    
    return roundr(sqrt, nprec);
  }
  // With some input, there was an infinite loop fixed by replacing
  // multr(sqrt, sqrt, nprec+2) with multr(sqrt, sqrt) in prec-math 1.7
  // (complex-math 1.12). No idea what that input was
  
  // return trunc(sqrt(a))
  function isqrtr(a){
    var sqrt = sqrtrAppr(a);
    if (sqrt == "0")return "0";
    var func1;
    while (true){
      func1 = subr(multr(sqrt, sqrt, 2), a);
      func1 = divr(func1, multr("2", sqrt), 2);
      if (isZero(func1, 1))break;
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
  
  function factr(a, nprec){
    if (isDec(a) || isNeg(a)){
      error("Error: factr(a): a must be a positive integer");
    }
    if (nprec == -Infinity)return "0";
    a = Number(a);
    
    var fact = factrDiv(a);
    return (nprec == undefined)?fact:roundr(fact, nprec);
  }
  
  // @param Number a
  // @return String prod
  function factrDiv(a){
    return multrRange(1, a);
  }
  
  function binr(n, k, nprec){
    if (gt(k, n))error("Error: binr(n, k): n must be >= k");
    if (!isInt(k) || !isInt(n) || isNeg(k) || isNeg(n)){
      error("Error: binr(n, k): n and k must be positive integers");
    }
    if (nprec == -Infinity)return "0";
    n = Number(n); k = Number(k);
    
    var bin = divr(multrRange(k+1, n), factrDiv(n-k));
    return (nprec == undefined)?bin:roundr(bin, nprec);
  }
  
  // http://en.wikipedia.org/wiki/Arithmetic%E2%80%93geometric_mean
  function agmr(a, b, nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    var c, d;
    while (true){
      c = divr(addr(a, b), "2", nprec+2);
      d = sqrtr(multr(a, b, nprec+5+len(a)+len(b)), nprec+2);
      if (isDiffZero(a, c, nprec))break;
      a = c; b = d;
    }
    
    return roundr(c, nprec);
  }
  
  function sinr(a, nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    var sign = false;
    if (isNeg(a)){
      a = remNeg(a);
      sign = !sign;
    }
    
    var intPart = Math.floor(Number(a))/3;
    if (intPart < 1)intPart = 1;
    var dec = decLen(a);
    if (dec <= 1)dec += 1;
    if (intPart*dec <= 75){
      var sin = sinrTaylorFrac(a, nprec);
      return (sign)?negr(sin):sin;
    }
    
    var pi = pir(nprec+3+len(a));
    var tpi = multr("2", pi); // 2*pi
    a = subr(a, multr(divr(a, tpi, 0), tpi));
    
    if (isNeg(a)){
      a = remNeg(a);
      sign = !sign;
    }
    
    var hpi = divr(pi, "2", nprec+2); // pi/2
    var numhpi = divr(a, hpi, 0);
    var sin;
    switch (numhpi){
      case "0":
        sin = sinrTaylorTerms(a, nprec);
        break;
      case "1":
        a = subr(a, hpi);
        sin = cosrTaylorTerms(a, nprec);
        break;
      case "2":
        a = subr(a, pi);
        sin = sinrTaylorTerms(a, nprec);
        sign = !sign;
        break;
      case "3":
        a = subr(a, addr(hpi, pi));
        sin = cosrTaylorTerms(a, nprec);
        sign = !sign;
        break;
    }
    
    return (sign)?negr(sin):sin;
  }
  
  // Taylor series
  function sinrTaylorTerms(a, nprec){
    var isInt = (a.indexOf(".") == -1);
    var frac1 = a;
    var frac2 = "1";
    var frac;
    var sin = a;
    var sign = true;
    if (isInt)var a2 = multr(a, a);
    for (var i = 3; true; i += 2, sign = !sign){
      if (isInt)frac1 = multr(frac1, a2);
      else frac1 = powrDec(a, i, nprec+2);
      frac2 = multr(frac2, String(i*(i-1)));
      frac = divr(frac1, frac2, nprec+2);
      if (isZero(frac, nprec+1))break;
      if (sign)sin = subr(sin, frac);
      else sin = addr(sin, frac);
    }
    
    return roundr(sin, nprec);
  }
  
  // Taylor series with big fraction
  function sinrTaylorFrac(a, nprec){
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
      if (nlen(frac2)-len(pow)-2 >= nprec)break;
    }
    
    return divr(frac1, frac2, nprec);
  }
  
  function cosr(a, nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    var sign = false;
    if (isNeg(a))a = remNeg(a);
    
    var intPart = Math.floor(Number(a))/3;
    if (intPart < 1)intPart = 1;
    var dec = decLen(a);
    if (dec <= 1)dec += 1;
    if (intPart*dec <= 75)return cosrTaylorFrac(a, nprec);
    
    var pi = pir(nprec+3+len(a));
    var tpi = multr("2", pi);
    a = subr(a, multr(divr(a, tpi, 0), tpi));
    
    if (isNeg(a))a = remNeg(a);
    
    var hpi = divr(pi, "2", nprec+2);
    var numhpi = divr(a, hpi, 0);
    var cos;
    switch (numhpi){
      case "0":
        cos = cosrTaylorTerms(a, nprec);
        break;
      case "1":
        a = subr(a, hpi);
        cos = sinrTaylorTerms(a, nprec);
        sign = !sign;
        break;
      case "2":
        a = subr(a, pi);
        cos = cosrTaylorTerms(a, nprec);
        sign = !sign;
        break;
      case "3":
        a = subr(a, addr(hpi, pi));
        cos = sinrTaylorTerms(a, nprec);
        break;
    }
    
    return (sign)?negr(cos):cos;
  }
  
  function cosrTaylorTerms(a, nprec){
    var isInt = (a.indexOf(".") == -1);
    var frac1 = "1";
    var frac2 = "1";
    var frac;
    var cos = "1";
    var sign = true;
    if (isInt)var a2 = multr(a, a);
    for (var i = 2; true; i += 2, sign = !sign){
      if (isInt)frac1 = multr(frac1, a2);
      else frac1 = powrDec(a, i, nprec+2);
      frac2 = multr(frac2, String(i*(i-1)));
      frac = divr(frac1, frac2, nprec+2);
      if (isZero(frac, nprec+1))break;
      if (sign)cos = subr(cos, frac);
      else cos = addr(cos, frac);
    }
    
    return roundr(cos, nprec);
  }
  
  function cosrTaylorFrac(a, nprec){
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
      if (nlen(frac2)-len(pow)-2 >= nprec)break;
    }
    
    return divr(frac1, frac2, nprec);
  }
  
  // continued fraction
  // transform of http://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Continued_fractions_for_arctangent
  function acotrCont(a, nprec){
    var an = function (n){
      if (n == 0)return "0";
      return multr(String(2*n-1), a);
    }
    
    var bn = function (n){
      if (n == 1)return "1";
      return String((n-1)*(n-1));
    }
    
    return genContFrac(an, bn, nprec);
  }
  
  // continued fraction
  // transform of http://functions.wolfram.com/ElementaryFunctions/ArcTanh/10/
  function acothrCont(a, nprec){
    var an = function (n){
      if (n == 0)return "0";
      return multr(String(2*n-1), a);
    }
    
    var bn = function (n){
      if (n == 1)return "1";
      return String(-(n-1)*(n-1));
    }
    
    return genContFrac(an, bn, nprec);
  }
  
  function atanr(a, nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    if (lt(a, "0.2"))return atanrTaylor(a, nprec);
    else return atanrTaylorTrans(a, nprec);
  }
  
  // Taylor Series without transform
  // faster when a <= 0.2
  function atanrTaylor(a, nprec){
    var frac;
    var atan = a;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      frac = divr(powrDec(a, i, nprec+2), String(i), nprec+2);
      if (isZero(frac, nprec+2))break;
      if (sign)atan = subr(atan, frac);
      else atan = addr(atan, frac);
    }
    
    return roundr(atan, nprec);
  }
  
  // Taylor Series with transform
  // faster when a >= 0.2
  function atanrTaylorTrans(a, nprec){
    a = atanrTrans(a, 4, nprec);
    var frac;
    var atan = a;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      frac = divr(powrDec(a, i, nprec+2), String(i), nprec+2);
      if (isZero(frac, nprec+1))break;
      if (sign)atan = subr(atan, frac);
      else atan = addr(atan, frac);
    }
    
    return roundr(multr("16", atan), nprec); // 16 = 2^4
  }
  
  // @param Number n
  function atanrTrans(a, n, nprec){
    for (var i = n-1; i >= 0; i--){
      a = divr(a, addr("1", sqrtr(addr("1", multr(a, a)), nprec+i+2)), nprec+i+2);
    }
    return a;
  }
  
  // return atan(a/b);
  function atan2r(a, b, nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    if (b == "0"){
      if (a == "0")error("Error: atan2r(a, b, nprec): a and b cannot both equal 0");
      var pi = pir(nprec+3);
      var hpi = divr(pi, "2", nprec);
      return isNeg(a)?"-"+hpi:hpi;
    }
    var atan = atanr(divr(a, b, nprec+5), nprec+2);
    if (isNeg(b)){
      var pi = pir(nprec+2);
      return isNeg(a)?subr(atan, pi, nprec):
                      addr(atan, pi, nprec);
    }
    return roundr(atan, nprec);
  }
  
  function sinhr(a, nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    var exp = expr(a, nprec+2);
    var recexp = divr("1", exp, nprec+1);
    var sinh = divr(subr(exp, recexp), "2", nprec+1);
    
    return roundr(sinh, nprec);
  }
  
  function coshr(a, nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    var exp = expr(a, nprec+2);
    var recexp = divr("1", exp, nprec+1);
    var cosh = divr(addr(exp, recexp), "2", nprec+1);
    
    return roundr(cosh, nprec);
  }
  
  //// Other operation functions ////
  
  function absr(a){
    return isNeg(a)?remNeg(a):a;
  }
  
  function negr(a){
    if (a == "0")return a;
    return isNeg(a)?remNeg(a):("-" + a);
  }
  
  //// Mathematical constants ////
  
  function pir(nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    if (nprec <= 5)return pirCont(nprec);
    else return pirMachin(nprec);
  }
  
  // continued fraction 
  function pirCont(nprec){
    var an = function (n){
      if (n == 0)return "0";
      else return String(2*n-1);
    }
    
    var bn = function (n){
      if (n == 1)return "4";
      else return String((n-1)*(n-1));
    }
    
    return genContFrac(an, bn, nprec);
  }
  
  // Machin-like formula 44*acot(57)+7*acot(239)-12*acot(682)+24*acot(12943)
  // http://en.wikipedia.org/wiki/Machin-like_formula#More_terms
  function pirMachin(nprec){
    var p1 = multr("44", acotrCont("57", nprec+4));
    var p2 = multr("7", acotrCont("239", nprec+3));
    var p3 = multr("12", acotrCont("682", nprec+4));
    var p4 = multr("24", acotrCont("12943", nprec+4));
    
    var sum = addr(subr(addr(p1, p2), p3), p4);
    
    return multr(sum, "4", nprec);
  }
  
  // continued fraction
  function er(nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    var p0 = "0";
    var p1 = "1";
    var q0 = "1";
    var q1 = "1";
    var pn, qn;
    for (var an = 6; true; an += 4){
      pn = addr(multr(String(an), p1), p0);
      qn = addr(multr(String(an), q1), q0);
      if (2*len(qn)-2 >= nprec)break;
      p0 = p1;
      q0 = q1;
      p1 = pn;
      q1 = qn;
    }
    
    var exp = addr("1", divr(multr("2", pn), qn, nprec+2));
    
    return roundr(exp, nprec);
  }
  
  // continued fraction
  function phir(nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    var f0 = "1";
    var f1 = "2";
    var fn;
    while (true){
      fn = addr(f0, f1);
      if (2*len(f1)-2 >= nprec)break;
      f0 = f1;
      f1 = fn;
    }
    
    var phi = divr(fn, f1, nprec+2);
    
    return roundr(phi, nprec);
  }
  
  function ln2r(nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    if (nprec <= 25)return ln2rCont(nprec);
    else return ln2rMachin(nprec);
  }
  
  // generalized continued fraction
  function ln2rCont(nprec){
    var an = function (n){
      if (n == 0)return "0";
      else if (n % 2 == 1)return String(n);
      else return "2";
    }
    
    var bn = function (n){
      if (n == 1)return "1";
      else return String(Math.floor(n/2));
    }
    
    return genContFrac(an, bn, nprec);
  }
  
  // Machin-like formula
  // ln(2) = 18*acoth(26)-2*acoth(4801)+8*acoth(8749)
  function ln2rMachin(nprec){
    var p1 = multr("18", acothrCont("26", nprec+4));
    var p2 = multr("2", acothrCont("4801", nprec+3));
    var p3 = multr("8", acothrCont("8749", nprec+3));
    
    var sum = addr(subr(p1, p2), p3);
    
    return roundr(sum, nprec);
  }
  
  function ln5r(nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    return ln5rMachin(nprec);
  }
  
  // Machin-like formula
  // ln(5) = 334*acoth(251)+126*acoth(449)-88*acoth(4801)+144*acoth(8749)
  function ln5rMachin(nprec){
    var p1 = multr("334", acothrCont("251", nprec+5));
    var p2 = multr("126", acothrCont("449", nprec+5));
    var p3 = multr("88", acothrCont("4801", nprec+4));
    var p4 = multr("144", acothrCont("8749", nprec+5));
    
    var sum = addr(subr(addr(p1, p2), p3), p4);
    
    return roundr(sum, nprec);
  }
  
  // ln(2) = 144*acoth(251)+54*acoth(449)-38*acoth(4801)+62*acoth(8749)
  function ln2and5(nprec){
    var a1 = acothrCont("251", nprec+5);
    var a2 = acothrCont("449", nprec+5);
    var a3 = acothrCont("4801", nprec+4);
    var a4 = acothrCont("8749", nprec+5);
    
    var p1, p2, p3, p4;
    
    p1 = multr("144", a1);
    p2 = multr("54", a2);
    p3 = multr("38", a3);
    p4 = multr("62", a4);
    
    var ln2 = addr(subr(addr(p1, p2), p3), p4);
    ln2 = roundr(ln2, nprec);
    
    p1 = multr("334", a1);
    p2 = multr("126", a2);
    p3 = multr("88", a3);
    p4 = multr("144", a4);
    
    var ln5 = addr(subr(addr(p1, p2), p3), p4);
    ln5 = roundr(ln5, nprec);
    
    return [ln2, ln5];
  }
  
  function ln10r(nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    return ln10rMachin(nprec);
  }
  
  // Machin-like formula
  // ln(10) = 478*acoth(251)+180*acoth(449)-126*acoth(4801)+206*acoth(8749)
  function ln10rMachin(nprec){
    var p1 = multr("478", acothrCont("251", nprec+5));
    var p2 = multr("180", acothrCont("449", nprec+5));
    var p3 = multr("126", acothrCont("4801", nprec+5));
    var p4 = multr("206", acothrCont("8749", nprec+5));
    
    var sum = addr(subr(addr(p1, p2), p3), p4);
    
    return roundr(sum, nprec);
  }
  
  //// Special operation functions ////
  
  function quotAndRem(a, b){
    if (b == "0")error("Error: quotAndRem(a, b): b cannot be 0");
    if (a == "0")return ["0", "0"];
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      if (!isNeg(b))sign = "-";
      else b = remNeg(b);
    } else if (isNeg(b)){
      sign = "-";
      b = remNeg(b);
    }
    
    var decA = (isDec(a))?decLen(a):0;
    var decB = (isDec(b))?decLen(b):0;
    var move = Math.max(decA, decB);
    if (move != 0){
      a = mDotRight(a, move);
      b = mDotRight(b, move);
    }
    
    if (b == "1")return [a, "0"];
    
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
    return multr(multrRange(n, Math.floor((n+m)/2)), multrRange(Math.floor((n+m)/2)+1, m));
  }
  
  genContFrac.lastNums = [0, "0", "1"]; // [n, pn, qn]
  function genContFrac(a, b, nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    var p0 = "1";
    var q0 = "0";
    var p1 = a(0);
    if (p1 === null){
      genContFrac.lastNums = [0, "0", "1"];
      return "0";
    }
    var q1 = "1";
    var pn = p1, qn = q1;
    var an, bn;
    var bn1 = b(1);
    if (bn1 === null){
      genContFrac.lastNums = [0, p1, q1];
      return p1;
    }
    var prod = bn1;
    for (var n = 1; true; n++){
      an = a(n); bn = bn1;
      if (an === null || bn === null){n--; break;}
      bn1 = b(n+1);
      if (bn1 !== null)prod = multr(prod, bn1);
      pn = addr(multr(an, p1), multr(bn, p0));
      qn = addr(multr(an, q1), multr(bn, q0));
      if (qn == "0")error("Error: genContFrac(a, b, nprec): qn can never equal 0");
      if (2*nlen(qn)-len(prod)-2 >= nprec)break;
      p0 = p1; q0 = q1;
      p1 = pn; q1 = qn;
    }
    genContFrac.lastNums = [n, pn, qn];
    
    return divr(pn, qn, nprec);
  }
  
  simpContFrac.lastNums = [0, "0", "1"]; // [n, pn, qn]
  function simpContFrac(a, nprec){
    if (nprec == undefined)nprec = prec;
    if (nprec == -Infinity)return "0";
    
    var p0 = "1";
    var q0 = "0";
    var p1 = a(0);
    if (p1 === null){
      simpContFrac.lastNums = [0, "0", "1"];
      return "0";
    }
    var q1 = "1";
    var pn = p1, qn = q1;
    var an;
    for (var n = 1; true; n++){
      an = a(n);
      if (an == null){n--; break;}
      pn = addr(multr(an, p1), p0);
      qn = addr(multr(an, q1), q0);
      if (qn == "0")error("Error: simpContFrac(a, b, nprec): qn can never equal 0");
      if (2*nlen(qn)-2 >= nprec)break;
      p0 = p1; q0 = q1;
      p1 = pn; q1 = qn;
    }
    simpContFrac.lastNums = [n, pn, qn];
    
    return divr(pn, qn, nprec);
  }
  
  ////// R object exposure //////
  
  window.R = {
    prep: prepr,
    prepNum: preprNum,
    prepInt: preprInt,
    
    isValid: isValidReal,
    canon: canonr,
    trimNum: trimNum,
    trimInt: trimInt,
    trimDec: trimDec,
    trimDecStart: trimDecStart,
    trimDecEnd: trimDecEnd,
    
    isInt: isInt,
    isDec: isDec,
    isNeg: isNeg,
    isEven: isEven,
    isDivFive: isDivFive,
    
    padZeros: padZeros,
    isZero: isZero,
    isDiffZero: isDiffZero,
    
    numToFloat: numToFloat,
    floatToNum: floatToNum,
    
    mDotLeft: mDotLeft,
    mDotRight: mDotRight,
    
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
    
    quotAndRem: quotAndRem,
    multRange: multrRange,
    genContFrac: genContFrac,
    simpContFrac: simpContFrac
  };
  
  ////// Error handling //////
                                           
  function error(str){
    throw str;
  }
  
  ////// PMath object exposure //////
  
  window.PMath = {
    setPrec: setPrec
  };
  
})(window);
