/***** Perfectly Precise Math Library Devel *****/

(function (window, undefined){
  ////// ‘a,b’ Functions
  
  function getA(expr){
    return expr.substring(1, expr.indexOf(","));
  }
  
  function getB(expr){
    return expr.substring(expr.indexOf(",")+1, expr.length-1);
  }
  
  function N(a, b){
    return ("‘" + a + "," + b + "’");
  }
  
  ////// Other Functions
  
  function checkArgs(name, args, ignore){
    args = argsToArr(args);
    if (ignore == undefined)ignore = 0;
    var argNames = name.substring(name.indexOf("(")+1, name.indexOf(")"));
    var argNames = argNames.split(", ");
    while (args.length > 0 && args[args.length-1] == undefined)args.pop();
    if (argNames[argNames.length-1] == "nprec"){
      ignore++;
      var nprec = args[argNames.length-1];
      if (nprec != undefined && isNaN(Number(nprec)) && getB(nprec) != "0"){
        throw "Error: " + name + ": nprec must be real";
      }
    }
    var diff = argNames.length - args.length;
    if (diff > ignore){
      throw "Error: " + name + ": " + argNames[args.length] + " is undefined";
    }
  }
  
  function argsToArr(args){
    var nargs = [];
    for (var i = 0; i < args.length; i++){
      nargs[i] = args[i];
    }
    
    return nargs;
  }
  
  function getNprec(nprec){
    if (!isNaN(Number(nprec)))return Number(nprec);
    else return Number(getA(nprec));
  }
  
  ////// Math Functions
  
  var prec = 16; // precision
  
  function setPrec(nprec){
    prec = nprec;
  }
  
  window.PMath = {setPrec: setPrec};
  
  ////// Complex Functions
  
  function add(z, w, nprec){
    checkArgs("add(z, w, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    
    var a, b, c, d, ra, rb;
    a = getA(z); b = getB(z);
    c = getA(w); d = getB(w);
    
    ra = addr(a, c, nprec);
    rb = addr(b, d, nprec);
    
    return N(ra, rb);
  }
  
  function sub(z, w, nprec){
    checkArgs("sub(z, w, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    
    var a, b, c, d, ra, rb;
    a = getA(z); b = getB(z);
    c = getA(w); d = getB(w);
    
    ra = subr(a, c, nprec);
    rb = subr(b, d, nprec);
    
    return N(ra, rb);
  }
  
  function mult(z, w, nprec){
    checkArgs("mult(z, w, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    
    var a, b, c, d, ra, rb;
    a = getA(z); b = getB(z);
    c = getA(w); d = getB(w);
    
    ra = subr(multr(a, c), multr(b, d), nprec);
    rb = addr(multr(a, d), multr(b, c), nprec);
    
    return N(ra, rb);
  }
  
  function div(z, w, nprec){
    checkArgs("div(z, w, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    var a, b, c, d, ra, rb;
    a = getA(z); b = getB(z);
    c = getA(w); d = getB(w);
    
    if (c == "0" && d == "0")throw "Error: div(z, w, nprec): w cannot be 0";
    
    var sum = addr(powr(c, 2), powr(d, 2));
    ra = divr(addr(multr(a, c), multr(b, d)), sum, nprec);
    rb = divr(subr(multr(b, c), multr(a, d)), sum, nprec);
    
    return N(ra, rb);
  }
  
  function exp(z, nprec){
    checkArgs("exp(z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    var a, b, ra, rb;
    a = getA(z); b = getB(z);
    
    var expra = expr(a, nprec+2);
    ra = multr(expra, cosr(b, nprec+2+len(expra)), nprec);
    rb = multr(expra, sinr(b, nprec+2+len(expra)), nprec);
    
    return N(ra, rb);
  }
  
  function ln(z, nprec){
    checkArgs("ln(z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    var ra, rb;
    ra = lnr(getA(abs(z, nprec+2)), nprec);
    rb = getA(arg(z, nprec));
    
    return N(ra, rb);
  }
  
  function pow(z, w, nprec){
    checkArgs("pow(z, w, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    
    var a, b, c, d, ra, rb;
    a = getA(z); b = getB(z);
    c = getA(w); d = getB(w);
    
    if (b == "0" && d == "0" && (isInt(c) || !isNeg(a))){
      return N(powr(a, c, nprec), 0);
    } else {
      if (nprec == undefined)nprec = prec;
      return exp(mult(w, ln(z, nprec+4), nprec+2), nprec);
    }
  }
  
  function root(n, z, nprec){
    checkArgs("root(n, z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    var a, b, c, d;
    a = getA(n); b = getB(n);
    c = getA(z); d = getB(z);
    
    if (b != "0")throw "Error: root(n, z, nprec): n must be real";
    
    // if z is real and n is odd, return real root
    if (d == "0" && !isEven(a)){
      return N(sgno(c) + powr(absr(c), divr(1, a, nprec+2), nprec), 0);
    } else return pow(z, div(N(1, 0), n, nprec+2), nprec);
  }
  
  function sqrt(z, nprec){
    checkArgs("sqrt(z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    var a, b, ra, rb;
    a = getA(z); b = getB(z);
    
    var absz = getA(abs(z, nprec+4));
    ra = sqrtr(divr(addr(a, absz), 2, nprec+2), nprec);
    rb = sgno(b) + sqrtr(divr(addr(negr(a), absz), 2, nprec+2), nprec);
    
    return N(ra, rb);
  }
  
  function cbrt(z, nprec){
    checkArgs("cbrt(z, nprec)", arguments);
    return root(N(3, 0), z, nprec);
  }
  
  function abs(z, nprec){
    checkArgs("abs(z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    var a, b, ra;
    a = getA(z); b = getB(z);
    
    ra = sqrtr(addr(powr(a, 2), powr(b, 2)), nprec);
    
    return N(ra, 0);
  }
  
  function arg(z, nprec){
    checkArgs("arg(z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    return N(atan2r(getB(z), getA(z), nprec), 0);
  }
  
  function sgn(z, nprec){
    checkArgs("sgn(z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
  
    if (getA(z) == "0" && getB(z) == "0")return N(0, 0);
    else return div(z, abs(z, nprec+2), nprec);
  }
  
  function sin(z, nprec){
    checkArgs("sin(z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    var a, b, ra, rb;
    a = getA(z); b = getB(z);
    
    var cosh = coshr(b, nprec+2);
    var sinh = sinhr(b, nprec+2);
    ra = multr(sinr(a, nprec+2+len(cosh)), cosh, nprec);
    rb = multr(cosr(a, nprec+2+len(sinh)), sinh, nprec);
    
    return N(ra, rb);
  }
  
  function cos(z, nprec){
    checkArgs("cos(z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    var a, b, ra, rb;
    a = getA(z); b = getB(z);
    
    var cosh = coshr(b, nprec+2);
    var sinh = sinhr(b, nprec+2);
    ra = multr(cosr(a, nprec+2+len(cosh)), cosh, nprec);
    rb = negr(multr(sinr(a, nprec+2+len(sinh)), sinh, nprec));
    
    return N(ra, rb);
  }
  
  function sinh(z, nprec){
    checkArgs("sinh(z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    var a, b, ra, rb;
    a = getA(z); b = getB(z);
    
    var sinh = sinhr(a, nprec+2);
    var cosh = coshr(a, nprec+2);
    ra = multr(sinh, cosr(b, nprec+2+len(sinh)), nprec);
    rb = multr(cosh, sinr(b, nprec+2+len(cosh)), nprec);
    
    return N(ra, rb);
  }
  
  function cosh(z, nprec){
    checkArgs("cosh(z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    var a, b, ra, rb;
    a = getA(z); b = getB(z);
    
    var cosh = coshr(a, nprec+2);
    var sinh = sinhr(a, nprec+2);
    ra = multr(cosh, cosr(b, nprec+2+len(cosh)), nprec);
    rb = multr(sinh, sinr(b, nprec+2+len(sinh)), nprec);
    
    return N(ra, rb);
  }
  
  function round(z, nprec){
    checkArgs("round(z, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    
    var a, b, ra, rb;
    a = getA(z); b = getB(z);
    
    ra = roundr(a, nprec);
    rb = roundr(b, nprec);
    
    return N(ra, rb);
  }
  
  function trunc(z){
    checkArgs("trunc(z)", arguments);
    
    var a, b, ra, rb;
    a = getA(z); b = getB(z);
    
    ra = truncr(a);
    rb = truncr(b);
    
    return N(ra, rb);
  }
  
  function floor(z){
    checkArgs("floor(z)", arguments);
    
    var a, b, ra, rb;
    a = getA(z); b = getB(z);
    
    ra = floorr(a);
    rb = floorr(b);
    
    return N(ra, rb);
  }
  
  function ceil(z){
    checkArgs("ceil(z)", arguments);
    
    var a, b, ra, rb;
    a = getA(z); b = getB(z);
    
    ra = ceilr(a);
    rb = ceilr(b);
    
    return N(ra, rb);
  }
  
  function re(z){
    checkArgs("re(z)", arguments);
    return N(getA(z), 0);
  }
  
  function im(z){
    checkArgs("im(z)", arguments);
    return N(getB(z), 0);
  }
  
  function conj(z){
    checkArgs("conj(z)", arguments);
    return N(getA(z), negr(getB(z)));
  }
  
  ////// Complex Real Functions
  
  function fact(x){
    checkArgs("fact(x)", arguments);
    
    if (getB(x) != "0")throw "Error: fact(x): x must be real";
    
    return N(factr(getA(x)), 0);
  }
  
  function bin(x, y){
    checkArgs("bin(x, y)", arguments);
    
    if (getB(x) != "0")throw "Error: bin(x, y): x must be real";
    if (getB(y) != "0")throw "Error: bin(x, y): y must be real";
    
    return N(binr(getA(x), getA(y)), 0);
  }
  
  function agm(x, y, nprec){
    checkArgs("agm(x, y, nprec)", arguments);
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    
    if (getB(x) != "0")throw "Error: agm(x, y, nprec): x must be real";
    if (getB(y) != "0")throw "Error: agm(x, y, nprec): y must be real";
    
    return N(agmr(getA(x), getA(y), nprec), 0);
  }
  
  function pi(nprec){
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    return N(pir(nprec), 0);
  }
  
  function e(nprec){
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    return N(er(nprec), 0);
  }
  
  function phi(nprec){
    if (nprec != undefined)nprec = getNprec(nprec);
    else nprec = prec;
    return N(phir(nprec), 0);
  }
  
  window.C = {
    num: N,
    getA: getA,
    getB: getB,
    
    add: add,
    sub: sub,
    mult: mult,
    div: div,
    exp: exp,
    ln: ln,
    pow: pow,
    root: root,
    sqrt: sqrt,
    cbrt: cbrt,
    abs: abs,
    arg: arg,
    sgn: sgn,
    sin: sin,
    cos: cos,
    sinh: sinh,
    cosh: cosh,
    round: round,
    trunc: trunc,
    floor: floor,
    ceil: ceil,
    re: re,
    im: im,
    conj: conj,
    
    fact: fact,
    bin: bin,
    agm: agm,
    pi: pi,
    e: e,
    phi: phi
  };
  
  ////// Real Functions
  
  ////// Processing Functions
  
  function padZeros(a, b){
    a = String(a); b = String(b);
    
    a = trimZeros(a);
    b = trimZeros(b);
    
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
  
  function trimZeros(a){
    a = String(a);
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    for (var i = 0; i <= a.length; i++){
      if (a[i] != '0'){
        if (i == a.length)a = "0";
        else if (i != 0)a = a.substring(i, a.length);
        break;
      }
    }
    
    if (isDec(a)){
      if (a[0] == '.')a = "0" + a;
      for (var i = a.length-1; i >= 0; i--){
        if (a[i] != '0'){
          if (a[i] == '.')a = a.substring(0, i);
          else if (i != a.length-1)a = a.substring(0, i+1);
          break;
        }
      }
    }
    
    if (a != "0")a = sign + a;
    
    return a;
  }
  
  function gt(a, b){ // is (a > b) ?
    a = String(a); b = String(b);
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    a = remDot(a);
    b = remDot(b);
    
    if (a == b)return false;
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (Number(a[i]) > Number(b[i]));
    }
    
    return false;
  }
  
  function lt(a, b){ // is (a < b) ?
    a = String(a); b = String(b);
    
    var zeroArr = padZeros(a, b);
    a = zeroArr[0]; b = zeroArr[1];
    
    a = remDot(a);
    b = remDot(b);
    
    if (a == b)return false;
    
    for (var i = 0; i < a.length; i++){
      if (a[i] != b[i])return (Number(a[i]) < Number(b[i]));
    }
    
    return false;
  }
  
  function le(a, b){ // is (a <= b) ?
    return !gt(a, b);
  }
  
  function ge(a, b){ // is (a >= b) ?
    return !lt(a, b);
  }
  
  function mDotRight(a, n){ // 32.44 -> 324.4
    a = String(a); n = Number(n);
    a = trimZeros(a);
    
    if (n == 0 || a == "0")return a;
    
    var alen = a.length;
    var adot = a.indexOf(".");
    
    if (adot != -1){
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
    
    return trimZeros(a);
  }
  
  function mDotLeft(a, n){ // 32.44 -> 3.244
    a = String(a); n = Number(n);
    a = trimZeros(a);
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    if (n == 0 || a == "0")return a;
    
    var alen = a.length;
    var adot = a.indexOf(".");
    if (adot == -1)adot = alen;
    
    var numZeros = n-adot;
    if (numZeros >= 0){
      for (var i = numZeros; i >= 1; i--)a = "0" + a;
      a = "0." + remDot(a);
    } else {
      if (adot == alen){
        a = a.substring(0, adot-n) + "." + a.substring(adot-n, alen);
      } else {
        a = a.substring(0, adot-n) + "." + a.substring(adot-n, adot) + a.substring(adot+1, alen);
      }
    }
    
    return trimZeros(sign + a);
  }
  
  function getPrec(a, b, nprec){
    a = String(a); b = String(b);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    if (isNeg(a)){
      if (!isNeg(b)){
        b = addr(remNeg(a), b);
        a = "0";
      } else {
        a = remNeg(a);
        b = remNeg(b);
      }
    } else if (isNeg(b)){
      a = addr(a, remNeg(b));
      b = "0";
    }
    
    var padArr = padZeros(a, b);
    a = padArr[0]; b = padArr[1];
    
    if (a == b)return nprec+1;
    
    var len = a.length;
    var dot = a.indexOf(".");
    if (dot == -1)dot = len;
    for (var i = 0; i < len; i++){
      if (a[i] != b[i])return i-dot-2;
    }
  }
  
  // Javascript largest float ≈ 1.79769313486231580793728e+308
  // shortened to 1.7976931348623157e+308
  function checkE(a){
    a = String(a);
    
    if (a == "Infinity")a = "1.7976931348623157e+308";
    else if (a == "-Infinity")a = "-1.7976931348623157e+308";
    
    var ePos = a.indexOf("e");
    if (ePos == -1)return a;
    
    var frontNum = a.substring(0, ePos);
    var sign = a[ePos+1];
    var backNum = a.substring(ePos+2, a.length);
    
    if (sign == '+')return mDotRight(frontNum, backNum);
    if (sign == '-')return mDotLeft(frontNum, backNum);
  }
  
  function numToFloat(a){
    a = String(a);
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    a = trimZeros(a);
    
    if (a[0] != '0'){
      var adot = a.indexOf(".");
      if (adot == -1)adot = a.length;
      return [mDotLeft(a, adot-1), adot-1];
    } else if (a == "0"){
      return ["0", 0];
    } else {
      var i;
      for (i = 2; a[i] == '0'; i++){}
      return [mDotRight(a, i-1), -(i-1)];
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
  
  // equals ceil(log(abs(a)))
  function len(a){
    a = String(a);
    
    if (isNeg(a))a = remNeg(a);
    var fa = truncr(a);
    if (fa != "0")return fa.length;
    
    a = trimZeros(a);
    if (a == "0")return 0;
    
    // a.indexOf(".")+1 == 2
    for (var i = 2; a[i] == '0'; i++){}
    
    return 2-i; // -(i-(a.indexOf(".")+1))
  }
  
  // equals floor(log(abs(a)))
  function nlen(a){
    a = String(a);
    
    if (isNeg(a))a = remNeg(a);
    var fa = truncr(a);
    if (fa != "0")return fa.length-1;
    
    a = trimZeros(a);
    if (a == "0")return 0;
    
    // a.indexOf(".")+1 == 2
    for (var i = 2; a[i] == '0'; i++){}
    
    return 2-i-1; // -(i-(a.indexOf(".")+1))
  }
  
  function isZero(a, nprec){ // (roundr(a, nprec) == "0")?
    a = String(a);
    
    if (isNeg(a))a = remNeg(a);
    if (a.indexOf(".") == -1){
      if (a != "0")return false;
      else return true;
    }
    
    if (a[0] != '0')return false;
    
    var end = (2+nprec < a.length)?(2+nprec):a.length;
    for (var i = 2; i < end; i++){
      if (a[i] != '0')return false;
    }
    if (i == a.length)return true;
    if (Number(a[i]) >= 5)return false;
    
    return true;
  }
  
  function isEven(a){
    a = String(a);
    
    if (isDec(a))return false;
    
    var last = a[a.length-1];
    return (last == '0' || last == '2' || last == '4' || last == '6' || last == '8');
  }
  
  function isDivFive(a){
    a = String(a);
    
    if (isDec(a))return false;
    
    var last = a[a.length-1];
    return (last == '0' || last == '5');
  }
  
  function isInt(a){
    a = String(a);
    return (a.indexOf(".") == -1);
  }
  
  function isDec(a){
    a = String(a);
    return (a.indexOf(".") != -1);
  }
  
  function isNeg(a){
    a = String(a);
    return (a[0] == '-');
  }
  
  function quotAndRem(a, b){
    a = String(a); b = String(b);
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      if (!isNeg(b))sign = "-";
      else b = remNeg(b);
    } else if (isNeg(b)){
      sign = "-";
      b = remNeg(b);
    }
    
    a = trimZeros(a);
    b = trimZeros(b);
    
    if (b == "0")throw "Error: quotAndRem(a, b, nprec): b cannot be 0";
    if (a == "0")return ["0", "0"];
    
    var decA = (isDec(a))?decLen(a):0;
    var decB = (isDec(b))?decLen(b):0;
    var numMove = Math.max(decA, decB);
    if (numMove != 0){
      a = mDotRight(a, numMove);
      b = mDotRight(b, numMove);
    }
    
    var quot = "";
    var currDiv = "";
    var k;
    var multArr = ["0", b, addr(b, b)];
    for (var i = 0; i < a.length; i++){
      currDiv += a[i];
      if (ge(currDiv, b)){
        for (k = 2; ge(currDiv, multArr[k]); k++){
          if (k+1 == multArr.length)multArr[k+1] = addr(multArr[k], b);
        }
        quot += k-1;
        currDiv = subr(currDiv, multArr[k-1]);
      } else {
        if (quot != "")quot += "0";
      }
    }
    if (quot == "")quot = "0";
    
    return [quot, currDiv];
  }
  
  function decLen(a){
    a = String(a);
    var posDot = a.indexOf(".");
    if (posDot == -1)return 0;
    return a.length-1-posDot;
  }
  
  function decPart(a){
    a = String(a);
    var posDot = a.indexOf(".");
    if (posDot == -1)return "";
    return a.substring(posDot+1, a.length);
  }
  
  function fracPart(a){
    a = String(a);
    var posDot = a.indexOf(".");
    if (posDot == -1)return "0";
    return "0." + a.substring(posDot+1, a.length);
  }
  
  function remDot(a){
    var posDot = a.indexOf(".");
    if (posDot == -1)return a;
    else return a.substring(0, posDot) + a.substring(posDot+1, a.length);
  }
  
  function remNeg(a){
    return a.substring(1, a.length);
  }
  
  function sgno(a){
    a = String(a);
    
    if (a[0] == '-')return "-";
    else return "";
  }
  
  ////// Operation Functions
  
  function addr(a, b, nprec){
    a = String(a); b = String(b);
    if (nprec != undefined)nprec = Number(nprec);
    
    var sign = "";
    if (isNeg(a)){
      if (!isNeg(b))return subr(b, remNeg(a), nprec);
      else {
        sign = "-";
        a = remNeg(a);
        b = remNeg(b);
      }
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
    
    return (nprec == undefined)?trimZeros(sum):roundr(sum, nprec);
  }
  
  function subr(a, b, nprec){
    a = String(a); b = String(b);
    if (nprec != undefined)nprec = Number(nprec);
    
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
    
    var sign = "";
    if (gt(b, a)){
      var c = a;
      a = b;
      b = c;
      sign = "-";
    }
    
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
    diff = sign + diff;
    
    return (nprec == undefined)?trimZeros(diff):roundr(diff, nprec);
  }
  
  // Javascript largest integer: 2^53 = 9007199254740992
  function multr(a, b, nprec){
    a = String(a); b = String(b);
    if (nprec != undefined)nprec = Number(nprec);
    
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
      a = remDot(a);
    }
    if (isDec(b)){
      numDec += decLen(b);
      b = remDot(b);
    }
    
    a = trimZeros(a);
    b = trimZeros(b);
    
    if (a == "0" || b == "0")return "0";
    
    var prod;
    if (a.length <= 7 && b.length <= 7){
      prod = String(Number(a)*Number(b));
    } else if (a.length <= 100 && b.length <= 100){
      prod = multr1(a, b);
    } else {
      prod = multr2(a, b);
    }
    
    prod = mDotLeft(prod, numDec);
    prod = sign + prod;
    
    return (nprec == undefined)?trimZeros(prod):roundr(prod, nprec);
  }
  
  // long multiplication taking advantage of native mult up to 7 digits
  function multr1(a, b){
    a = String(a); b = String(b);
    
    if (a.length <= 7 && b.length <= 7){
      return String(Number(a)*Number(b));
    }
    
    if (b.length > a.length){
      var c = a;
      a = b;
      b = c;
    }
    
    var alen = a.length;
    var blen = b.length;
    
    var smallProd, sPLen;
    var prod = "0";
    var currProd;
    var carry = 0;
    var currA, currB;
    for (var d = blen; d >= 1; d -= 7){
      currB = Number(b.substring(d-7, d));
      if (currB == 0)continue;
      currProd = "";
      for (var f = blen-d; f >= 1; f--)currProd += "0";
      for (var i = alen; i >= 1; i -= 7){
        currA = Number(a.substring(i-7, i));
        if (currA == 0 && carry == 0){
          currProd = "0000000" + currProd;
          continue;
        }
        smallProd = String(currB * currA + carry);
        sPLen = smallProd.length;
        if (sPLen > 7){
          currProd = smallProd.substring(sPLen-7, sPLen) + currProd;
          carry = Number(smallProd.substring(0, sPLen-7));
        } else {
          currProd = smallProd + currProd;
          for (var h = 7-sPLen; h >= 1; h--)currProd = "0" + currProd;
          carry = 0;
        }
      }
      if (carry != 0){
        currProd = carry + currProd;
        carry = 0;
      }
      prod = addr(prod, currProd);
    }
    
    return prod;
  }
  
  // Karatsuba multiplication; used for more than 100 digits
  function multr2(a, b){
    a = String(a); b = String(b);
    
    
    var alen = a.length;
    var blen = b.length;
    
    if (alen <= 100 || blen <= 100)return multr1(a, b);
    
    if (alen != blen){
      if (blen > alen){
        var c = a;
        a = b;
        b = c;
        c = alen;
        alen = blen;
        blen = c;
      }
      var m = (alen > 2*blen)?Math.ceil(alen/2):(alen-blen);
      var a1 = a.substring(0, m);
      var a2 = a.substring(m, alen);
      return addr(mDotRight(multr2(a1, b), alen-m), multr2(a2, b));
    }
    
    var m = Math.ceil(alen/2);
    
    var a1 = a.substring(0, m);
    var a2 = a.substring(m, alen);
    var b1 = b.substring(0, m);
    var b2 = b.substring(m, blen);
    
    var A = multr2(a1, b1);
    var B = multr2(a2, b2);
    var C = multr2(addr(a1, a2), addr(b1, b2));
    var K = subr(subr(C, A), B);
    
    return addr(mDotRight(A, 2*(alen-m)), addr(mDotRight(K, alen-m), B));
  }
  
  function divr(a, b, nprec){
    a = String(a); b = String(b);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      if (!isNeg(b))sign = "-";
      else b = remNeg(b);
    } else if (isNeg(b)){
      sign = "-";
      b = remNeg(b);
    }
    
    a = trimZeros(a);
    b = trimZeros(b);
    
    if (b == "0")throw "Error: divr(a, b, nprec): b cannot be 0";
    if (a == "0")return "0";
    
    var decA = (isDec(a))?decLen(a):0;
    var decB = (isDec(b))?decLen(b):0;
    var numMove = Math.max(decA, decB);
    if (numMove != 0){
      a = mDotRight(a, numMove);
      b = mDotRight(b, numMove);
    }
    
    var quot = "";
    var currDiv = "";
    var k;
    var multArr = ["0", b, addr(b, b)];
    for (var i = 0; i < a.length+nprec+1; i++){
      if (i < a.length)currDiv += a[i];
      else {
        if (currDiv == "0")break;
        if (i == a.length)quot += ".";
        currDiv += "0";
      }
      if (ge(currDiv, b)){
        for (k = 2; ge(currDiv, multArr[k]); k++){
          if (k+1 == multArr.length)multArr[k+1] = addr(multArr[k], b);
        }
        quot += k-1;
        currDiv = subr(currDiv, multArr[k-1]);
      } else {
        quot += "0";
      }
    }
    
    return roundr(sign + quot, nprec);
  }
  
  function powr(a, b, nprec){
    a = String(a); b = String(b);
    if (nprec != undefined)nprec = Number(nprec);
    
    var sign = false;
    if (isNeg(b)){
      sign = true;
      b = remNeg(b);
    }
    
    var pow;
    if (isInt(b)){
      if (b == "2")pow = multr(a, a, nprec);
      else if (isInt(a) || nprec == undefined)pow = powrn(a, b);
      else pow = powrd(a, b, nprec);
    } else {
      if (nprec == undefined)nprec = prec;
      pow = expr(multr(b, lnr(a, nprec+6+len(b)), nprec+4), nprec);
    }
    
    return (sign)?divr(1, pow, nprec):pow;
  }
  
  // http://en.wikipedia.org/wiki/Exponentiation_by_squaring
  function powrn(a, n){
    a = String(a); n = Number(n);
    
    var prod = "1";
    while (n > 0){
      if (n % 2 == 1){
        prod = multr(prod, a);
        n--;
      }
      a = multr(a, a);
      n = n/2;
    }
    
    return prod;
  }
  
  function powrd(a, n, nprec){
    a = String(a); n = Number(n);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    if (n == 0)return "1";
    
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
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    if (isNeg(a))throw "Error: sqrtr(a, nprec): a cannot be negative";
    
    if (isInt(a))return sqrtrn(a, nprec);
    else return sqrtrd(a, nprec);
  }
  
  // continued fraction
  // http://en.wikipedia.org/wiki/Generalized_continued_fraction
  function sqrtrn(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var isqrt = isqrtr(a);
    var diff = subr(a, multr(isqrt, isqrt));
    if (diff == "0")return isqrt;
    var isqrt2 = multr(2, isqrt);
    
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
  function sqrtrd(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    if (isNeg(a))throw "Error: sqrtrd(a, nprec): a cannot be negative";
    var sqrt = sqrtrappr(a);
    if (sqrt == "0")return "0";
    var func1;
    while (true){
      func1 = subr(multr(sqrt, sqrt), a);
      func1 = divr(func1, multr("2", sqrt), nprec+2);
      if (isZero(func1, nprec+1))break;
      sqrt = subr(sqrt, func1);
    }
    
    return roundr(sqrt, nprec);
  }
  
  // Newton's method
  function isqrtr(a){
    a = String(a);
    var nprec = 0;
    
    if (isNeg(a))throw "Error: isqrtr(a, nprec): a cannot be negative";
    var sqrt = sqrtrappr(a);
    if (sqrt == "0")return "0";
    var func1;
    while (true){
      func1 = subr(multr(sqrt, sqrt, nprec+2), a);
      func1 = divr(func1, multr("2", sqrt), nprec+2);
      if (isZero(func1, nprec+1))break;
      sqrt = subr(sqrt, func1);
    }
    
    return truncr(sqrt);
  }
  
  function sqrtrappr(a){
    a = String(a);
    
    a = numToFloat(a);
    a[0] = Number(a[0]);
    
    if (a[1] % 2 == 1 || a[1] % 2 == -1){
      a[0] = Math.sqrt(10 * a[0]);
      a[1] = Math.floor(a[1] / 2);
    } else {
      a[0] = Math.sqrt(a[0]);
      a[1] = a[1] / 2;
    }
    
    a[0] = String(a[0]);
    a = floatToNum(a);
    
    return a;
  }
  
  function sqrtrcont(n, nprec){
    n = String(n);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var m = isqrtr(n);
    var a = subr(n, multr(m, m));
    if (a == "0")return m;
    
    var pn = m;
    var qn = a;
    var mn = quotAndRem(addr(m, pn), qn)[0];
    var ms = [mn];
    var len = 1;
    var get = function (num){
      if (qn == "1")return ms[(num-1) % len];
      pn = subr(multr(qn, mn), pn);
      qn = divr(subr(n, multr(pn, pn)), qn);
      mn = quotAndRem(addr(m, pn), qn)[0];
      ms.push(mn);
      len++;
      return ms[len-2];
    }
    
    var an = function (n){
      if (n == 0)return m;
      else return get(n);
    }
    
    return simpContFrac(an, nprec);
  }
  
  function sqrtrcont2(n, nprec){
    n = String(n);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var m = isqrtr(n);
    var a = subr(n, multr(m, m));
    if (a == "0")return m;
    
    var mn = m;
    var pn = m;
    var qn = a;
    var ms = [];
    while (qn != "1"){
      mn = quotAndRem(addr(m, pn), qn)[0];
      pn = subr(multr(qn, mn), pn);
      qn = divr(subr(n, multr(pn, pn)), qn);
      ms.push(mn);
    }
    ms.push(addr(m, pn));
    var len = ms.length;
    
    var an = function (n){
      if (n == 0)return m;
      else return ms[(n-1) % len];
    }
    
    return simpContFrac(an, nprec);
  }
  
  function factr(a){
    a = String(a);
    
    if (isDec(a) || isNeg(a)){
      throw "Error: factr(a): a must be a positive integer";
    }
    
    var prod = "1";
    for (var i = a; i > 1; i--){
      prod = multr(prod, i);
    }
    
    return prod;
  }
  
  function expr(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var sign = false;
    if (isNeg(a)){
      a = remNeg(a);
      sign = true;
      nprec += 2;
    }
    
    var exp;
    if (isInt(a)){
      a = Number(a);
      if (a == 1)exp = er(nprec);
      else if (a < 100)exp = powr(er(nprec+1+(a-1)*(len(a)+1)), a, nprec+1);
      else exp = exprsm(a, nprec+2);
    } else {
      var fl = truncr(a);
      var flLen = fl.length;
      fl = Number(fl);
      var dec = decPart(a);
      var decLen = dec.length;
      a = "0." + dec;
      if (gt(a, "0.5")){
        a = subr(a, 1);
        fl++;
      }
      
      if (fl == 0){
        if (decLen <= 30)exp = exprsm(a, nprec);
        else exp = exprsm2(a, nprec);
      } else {
        var expfl;
        if (fl == 1)expfl = er(nprec+2);
        else if (fl < 100)expfl = powr(er(nprec+1+(fl-1)*(flLen+1)), fl, nprec+1);
        else expfl = exprsm(fl, nprec+2);
        
        if (decLen <= 30){
          exp = multr(expfl, exprsm(a, nprec+2+len(expfl)), nprec);
        } else {
          exp = multr(expfl, exprsm2(a, nprec+2+len(expfl)), nprec);
        }
      }
    }
    
    if (sign)return divr(1, exp, nprec-2);
    else return exp;
  }
  
  function exprl(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var i = Number(ceilr(divr(a, ln10(3+len(a)), 1)));
    var lnr10 = ln10(nprec+2+i+2+len(a));
    a = divr(a, lnr10, nprec+2+i);
    
    var i = Number(floorr(a));
    var d = "0." + decPart(a);
    
    var exp = expr(multr(d, lnr10), nprec+2+i);
    exp = mDotRight(exp, i)
    
    return roundr(exp, nprec);
  }
  
  // Taylor Series with big fraction
  function exprsm(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    if (isDec(a))a = roundr(a, nprec+2);
    
    var frac1 = addr(a, 1);
    var frac2 = "1";
    var pow = a;
    for (var i = 2; true; i++){
      frac1 = multr(frac1, i);
      pow = multr(pow, a);
      frac1 = addr(frac1, pow);
      frac2 = multr(frac2, i);
      if (nlen(frac2)-len(pow)-2 >= nprec)break;
    }
    
    return divr(frac1, frac2, nprec);
  }
  
  // Taylor Series adding term by term
  function exprsm2(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var ar = roundr(a, nprec+3);
    var pow = ar;
    var fact = "1";
    var frac = "1";
    var exp = addr(ar, 1);
    for (var i = 2; true; i++){
      pow = multr(pow, ar, nprec+3);
      fact = multr(fact, i);
      frac = divr(pow, fact, nprec+3);
      if (isZero(frac, nprec+1))break;
      exp = addr(exp, frac);
    }
    
    return roundr(exp, nprec);
  }
  
  function expr2(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var i = truncr(a);
    var d = fracPart(a);
    
    var neg = false;
    var n1 = 0;
    if (gt(d, "0.75")){
      n1++;
      d = subr(d, "1");
      if (isNeg(d)){
        d = absr(d);
        neg = !neg;
      }
    }
    
    var n2 = 0;
    if (gt(d, "0.375")){
      if (neg)n2--;
      else n2++;
      d = subr(d, "0.5");
      if (isNeg(d)){
        d = absr(d);
        neg = !neg;
      }
    }
    
    var n4 = 0;
    if (gt(d, "0.225")){
      if (neg)n4--;
      else n4++;
      d = subr(d, "0.25");
      if (isNeg(d)){
        d = absr(d);
        neg = !neg;
      }
    }
    
    var n5 = 0;
    if (gt(d, "0.15")){
      if (neg)n5--;
      else n5++;
      d = subr(d, "0.2");
      if (isNeg(d)){
        d = absr(d);
        neg = !neg;
      }
    }
    
    var n10 = 0;
    if (gt(d, "0.05")){
      if (neg)n10--;
      else n10++;
      d = subr(d, "0.1");
      if (isNeg(d)){
        d = absr(d);
        neg = !neg;
      }
    }
    
    if (neg)d = negr(d);
    
    var expi = "1";
    var expd;
    if (decLen(d) <= 30)expd = exprsm(d, nprec+3);
    else expd = exprsm2(d, nprec+3);
    if (n1 != 0)expd = multr(expd, er(nprec+3));
    if (n2 != 0)expd = multr(expd, exprreci(n2*2, nprec+3));
    if (n4 != 0)expd = multr(expd, exprreci(n4*4, nprec+3));
    if (n5 != 0)expd = multr(expd, exprreci(n5*5, nprec+3));
    if (n10 != 0)expd = multr(expd, exprreci(n10*10, nprec+3));
    
    return multr(expi, expd, nprec);
  }
  
  function exprsm3(a){
    a = String(a);
    
    return checkE(Math.exp(Number(a)));
  }
  
  function exprreci(a, nprec){
    a = Number(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var an = function (n){
      if (n == 0)return 1;
      if (n % 3 == 1)return ((n-1)/3*2+1)*a-1;
      return 1;
    }
    
    return simpContFrac(an, nprec);
  }
  
  function lnr(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    if (isNeg(a))throw "Error: lnr(a, nprec): a cannot be negative";
    if (a == "0")throw "Error: lnr(a, nprec): a cannot be zero";
    
    var tens = len(a)-1;
    if (tens > 0)a = mDotLeft(a, tens);
    else if (tens < 0)a = mDotRight(a, -tens);
    
    var twos = tens;
    var fives = tens;
    
    switch (a[0]){
      case "1": if (isInt(a) || Number(a[2]) <= 3)break;
      case "2": a = divr(a, 2, Infinity); twos++; break;
      case "3":
      case "4": a = divr(a, 4, Infinity); twos += 2; break;
      case "5":
      case "6": a = divr(a, 5, Infinity); fives++; break;
      case "7":
      case "8": a = divr(a, 8, Infinity); twos += 3; break;
      case "9": a = mDotLeft(a, 1); twos++; fives++; break;
    }
    
    var lnsmall = lnrsmall(a, nprec+2);
    var ln;
    if (twos != 0){
      if (twos == fives){
        var lnr10 = ln10(nprec+2+len(twos));
        ln = addr(lnsmall, multr(twos, lnr10), nprec);
      } else {
        if (fives != 0){
          var both = ln2and5(nprec+2+Math.max(len(twos), len(fives)));
          var lnr2 = both[0];
          var lnr5 = both[1];
          ln = addr(addr(lnsmall, multr(twos, lnr2)), multr(fives, lnr5), nprec);
        } else {
          var lnr2 = ln2(nprec+2+len(twos));
          ln = addr(lnsmall, multr(twos, lnr2), nprec);
        }
      }
    } else {
      if (fives != 0){
        var lnr5 = ln5(nprec+2+len(fives));
        ln = addr(lnsmall, multr(fives, lnr5), nprec);
      } else {
        ln = roundr(lnsmall, nprec);
      }
    }
    
    return ln;
  }
  
  // taylor series
  function lnrsmall(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var a1 = subr(a, 1);
    var frac1 = a1;
    var frac;
    var ln = a1;
    var sign = true;
    for (var i = 2; true; i++, sign = !sign){
      frac1 = roundr(multr(frac1, a1), nprec+2);
      frac = divr(frac1, i, nprec+2);
      if (isZero(frac, nprec+1))break;
      if (sign)ln = subr(ln, frac);
      else ln = addr(ln, frac);
    }
   
    return roundr(ln, nprec);
  }
  
  function ln2(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    if (nprec <= 25)return ln2cont(nprec);
    else return ln22(nprec);
  }
  
  // generalized continued fraction
  function ln2cont(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var an = function (n){
      if (n == 0)return 0;
      else if (n % 2 == 1)return n;
      else return 2;
    }
    
    var bn = function (n){
      if (n == 1)return 1;
      else return Math.floor(n/2);
    }
    
    return genContFrac(an, bn, nprec);
  }
  
  // Machin-like formula
  // ln(2) = 18*acoth(26)-2*acoth(4801)+8*acoth(8749)
  function ln22(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var p1 = multr(18, acothrcont("26", nprec+4));
    var p2 = multr(2, acothrcont("4801", nprec+3));
    var p3 = multr(8, acothrcont("8749", nprec+3));
    
    var sum = addr(subr(p1, p2), p3);
    
    return roundr(sum, nprec);
  }
  
  /*function ln5(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    return addr(lnrcont(1, 4, nprec+2), multr(2, ln2(nprec+2)), nprec);
  }*/
  
  // Machin-like formula
  // ln(5) = 334*acoth(251)+126*acoth(449)-88*acoth(4801)+144*acoth(8749)
  function ln5(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var p1 = multr(334, acothrcont("251", nprec+5));
    var p2 = multr(126, acothrcont("449", nprec+5));
    var p3 = multr(88, acothrcont("4801", nprec+4));
    var p4 = multr(144, acothrcont("8749", nprec+5));
    
    var sum = addr(subr(addr(p1, p2), p3), p4);
    
    return roundr(sum, nprec);
  }
  
  // ln(2) = 144*acoth(251)+54*acoth(449)-38*acoth(4801)+62*acoth(8749)
  function ln2and5(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var a1 = acothrcont("251", nprec+5);
    var a2 = acothrcont("449", nprec+5);
    var a3 = acothrcont("4801", nprec+4);
    var a4 = acothrcont("8749", nprec+5);
    
    var p1, p2, p3, p4;
    
    p1 = multr(144, a1);
    p2 = multr(54, a2);
    p3 = multr(38, a3);
    p4 = multr(62, a4);
    
    var ln2 = addr(subr(addr(p1, p2), p3), p4);
    ln2 = roundr(ln2, nprec);
    
    p1 = multr(334, a1);
    p2 = multr(126, a2);
    p3 = multr(88, a3);
    p4 = multr(144, a4);
    
    var ln5 = addr(subr(addr(p1, p2), p3), p4);
    ln5 = roundr(ln5, nprec);
    
    return [ln2, ln5];
  }
  
  /*function ln10(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    return addr(lnrcont(1, 4, nprec+2), multr(3, ln2(nprec+2)), nprec);
  }*/
  
  // Machin-like formula
  // ln(10) = 478*acoth(251)+180*acoth(449)-126*acoth(4801)+206*acoth(8749)
  function ln10(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var p1 = multr(478, acothrcont("251", nprec+5));
    var p2 = multr(180, acothrcont("449", nprec+5));
    var p3 = multr(126, acothrcont("4801", nprec+5));
    var p4 = multr(206, acothrcont("8749", nprec+5));
    
    var sum = addr(subr(addr(p1, p2), p3), p4);
    
    return roundr(sum, nprec);
  }
  
  // generalized continued fraction a and b
  /*function lnrcont(a, b, nprec){
    a = Number(a); b = Number(b)
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var an = function (n){
      if (n == 0)return 0;
      else if (n % 2 == 1)return n*b;
      else return 2;
    }
    
    var bn = function (n){
      if (n == 1)return 1;
      else return Math.floor(n/2)*a;
    }
    
    var frac = genContFrac(an, bn, nprec);
    //alert(multr(genContFrac.lastN, b));
    return frac;
  }*/
  
  // taylor series centered at 10
  function lnr9(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var lnr10 = ln10(nprec+2);
    var a1 = mDotLeft(subr(a, 10), 1);
    var frac1 = a1;
    var frac;
    var ln = addr(lnr10, a1);
    var sign = true;
    for (var i = 2; true; i++, sign = !sign){
      frac1 = roundr(multr(frac1, a1), nprec+2);
      frac = divr(frac1, i, nprec+2);
      if (isZero(frac, nprec+1))break;
      if (sign)ln = subr(ln, frac);
      else ln = addr(ln, frac);
    }
    
    return roundr(ln, nprec);
  }
  
  function floorr(a){
    a = String(a);
    
    var adot = a.indexOf(".");
    if (adot == -1)return trimZeros(a);
    
    a = a.substring(0, adot);
    
    if (isNeg(a)){
      a = remNeg(a);
      var alen = a.length;
      for (var i = alen-1; i >= 0; i--){
        if (a[i] != '9'){
          a = a.substring(0, i) + (Number(a[i])+1);
          for (var d = alen-(i+1); d >= 1; d--)a += 0;
          break;
        }
      }
      if (i == -1){
        a = "1";
        for (var d = alen; d >= 1; d--)a += 0;
      }
      a = "-" + a;
    }
    
    return trimZeros(a);
  }
  
  function ceilr(a){
    a = String(a);
    
    var adot = a.indexOf(".");
    if (adot == -1)return trimZeros(a);
    
    a = a.substring(0, adot);
    
    if (!isNeg(a)){
      var alen = a.length;
      for (var i = alen-1; i >= 0; i--){
        if (a[i] != '9'){
          a = a.substring(0, i) + (Number(a[i])+1);
          for (var d = alen-(i+1); d >= 1; d--)a += 0;
          break;
        }
      }
      if (i == -1){
        a = "1";
        for (var d = alen; d >= 1; d--)a += 0;
      }
    }
    
    return trimZeros(a);
  }
  
  function truncr(a){
    a = String(a);
    
    var adot = a.indexOf(".");
    if (adot == -1)return trimZeros(a);
    
    a = a.substring(0, adot);
    
    return trimZeros(a);
  }
  
  function negr(a){
    a = String(a);
    
    if (a == "0")return a;
    
    if (isNeg(a))return remNeg(a);
    else return "-" + a;
  }
  
  function modr(a, b){
    a = String(a); b = String(b);
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      if (!isNeg(b))sign = "-";
      else b = remNeg(b);
    } else if (isNeg(b)){
      sign = "-";
      b = remNeg(b);
    }
    
    a = trimZeros(a);
    b = trimZeros(b);
    
    if (b == "0")throw "Error: modr(a, b): b cannot be 0";
    if (a == "0")return "0";
    
    while (isDec(a) || isDec(b)){
      a = mDotRight(a, 1);
      b = mDotRight(b, 1);
    }
    
    var smallDividend;
    var bMultArr = ["0", b];
    var quot = "";
    var remain = "0";
    for (var i = 0; i < a.length; i++){
      smallDividend = remain + a[i];
      while (smallDividend.length < b.length && i+1 < a.length){
        i++;
        smallDividend += a[i];
        quot += "0";
      }
      for (var c = 1; le(bMultArr[c], smallDividend); c++){
        if (c+1 == bMultArr.length)bMultArr[c+1] = addr(bMultArr[c], b);
      }
      remain = subr(smallDividend, bMultArr[c-1]);
      quot += c-1;
    }
    
    return remain;
  }
  
  function absr(a){
    a = String(a);
    return (isNeg(a))?remNeg(a):a;
  }
  
  function roundr(a, nprec){
    a = String(a);
    a = trimZeros(a);
    
    var sign = "";
    if (isNeg(a)){
      a = remNeg(a);
      sign = "-";
    }
    
    var alen = a.length;
    var adot = a.indexOf(".");
    if (nprec == undefined)nprec = 0;
    if (!isInt(nprec))throw "Error: roundr(a, nprec): nprec must be an integer";
    
    if (nprec < 0){
      if (adot == -1)adot = alen;
      if (nprec <= -(adot+1))return "0";
      
      if (Number(a[adot+nprec]) >= 5){
        for (var i = adot-1+nprec; i >= 0; i--){
          if (a[i] != '9'){
            a = a.substring(0, i) + (Number(a[i])+1);
            for (var d = adot-(i+1); d >= 1; d--)a += "0";
            break;
          }
        }
        if (i == -1){
          a = "1";
          for (var d = adot; d >= 1; d--)a += "0";
        }
      } else {
        a = a.substring(0, adot+nprec);
        for (var d = -nprec; d >= 1; d--)a += "0";
      }
    } else {
      if (adot == -1 || adot+nprec+1 >= alen)return sign + a;
      
      if (Number(a[adot+nprec+1]) >= 5){
        for (var i = adot+nprec; i >= 0; i--){
          if (a[i] == '.')continue;
          if (a[i] != '9'){
            a = a.substring(0, i) + (Number(a[i])+1);
            for (var d = adot-(i+1); d >= 1; d--)a += "0";
            break;
          }
        }
        if (i == -1){
          a = "1";
          for (var d = adot; d >= 1; d--)a += "0";
        }
      } else {
        a = a.substring(0, adot+nprec+1);
      }
    }
    
    return trimZeros(sign + a);
  }
  
  function binr(n, k){
    n = String(n); k = String(k);
    
    if (gt(k, n))throw "Error: binr(n, k): k must be <= n";
    if (!isInt(k) || !isInt(n) || isNeg(k) || isNeg(n)){
      throw "Error: binr(n, k): n and k must be positive integers";
    }
    
    return divr(factr(n), multr(factr(k), factr(subr(n, k))));
  }
  
  function agmr(a, b, nprec){
    a = String(a); b = String(b);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var currprec = 0;
    for (var i = 0; currprec < nprec+1; i++){
      c = divr(addr(a, b), 2, nprec+1);
      d = sqrtr(multr(a, b), nprec+1);
      currprec = getPrec(a, c, nprec);
      a = c; b = d;
    }
    
    return roundr(c, nprec);
  }
  
  function sinr(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var sign = false;
    if (isNeg(a)){
      a = remNeg(a);
      sign = !sign;
    }
    
    var intPart = Math.floor(a)/3;
    if (intPart < 1)intPart = 1;
    var dec = decLen(a);
    if (dec <= 1)dec += 1;
    if (intPart*dec <= 75){
      var sin = sinsmall2(a, nprec);
      return (sign)?negr(sin):sin;
    }
    
    var pi = pir(nprec+3+len(a));
    var tPI = multr(2, pi);
    a = subr(a, multr(divr(a, tPI, 0), tPI));
    
    if (isNeg(a)){
      a = remNeg(a);
      sign = !sign;
    }
    
    var hPI = divr(pi, 2, nprec+2);
    var numhPIs = divr(a, hPI, 0);
    var sin;
    switch (numhPIs){
      case "0":
        sin = sinsmall(a, nprec);
        break;
      case "1":
        a = subr(a, hPI);
        sin = cossmall(a, nprec);
        break;
      case "2":
        a = subr(a, pi);
        sin = sinsmall(a, nprec);
        sign = !sign;
        break;
      case "3":
        a = subr(a, addr(hPI, pi));
        sin = cossmall(a, nprec);
        sign = !sign;
        break;
    }
    
    return (sign)?negr(sin):sin;
  }
  
  // Taylor series
  function sinsmall(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var isInt = (a.indexOf(".") == -1);
    var frac1 = a;
    var frac2 = "1";
    var frac;
    var sin = a;
    var sign = true;
    if (isInt)var a2 = multr(a, a);
    for (var i = 3; true; i += 2, sign = !sign){
      if (isInt)frac1 = multr(frac1, a2);
      else frac1 = powrd(a, i, nprec+2);
      frac2 = multr(frac2, i*(i-1));
      frac = divr(frac1, frac2, nprec+2);
      if (isZero(frac, nprec+1))break;
      if (sign)sin = subr(sin, frac);
      else sin = addr(sin, frac);
    }
    
    return roundr(sin, nprec);
  }
  
  // Taylor series with big fraction
  function sinsmall2(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var frac1 = a;
    var frac2 = "1";
    var pow = a;
    var sign = true;
    var a2 = multr(a, a);
    var prod;
    for (var i = 3; true; i += 2, sign = !sign){
      prod = i*(i-1);
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
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var sign = false;
    if (isNeg(a))a = remNeg(a);
    
    var intPart = Math.floor(a)/3;
    if (intPart < 1)intPart = 1;
    var dec = decLen(a);
    if (dec <= 1)dec += 1;
    if (intPart*dec <= 75)return cossmall2(a, nprec);
    
    var pi = pir(nprec+3+len(a));
    var tPI = multr(2, pi);
    a = subr(a, multr(divr(a, tPI, 0), tPI));
    
    if (isNeg(a))a = remNeg(a);
    
    var hPI = divr(pi, 2, nprec+2);
    var numhPIs = divr(a, hPI, 0);
    var cos;
    switch (numhPIs){
      case "0":
        cos = cossmall(a, nprec);
        break;
      case "1":
        a = subr(a, hPI);
        cos = sinsmall(a, nprec);
        sign = !sign;
        break;
      case "2":
        a = subr(a, pi);
        cos = cossmall(a, nprec);
        sign = !sign;
        break;
      case "3":
        a = subr(a, addr(hPI, pi));
        cos = sinsmall(a, nprec);
        break;
    }
    
    return (sign)?negr(cos):cos;
  }
  
  function cossmall(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var isInt = (a.indexOf(".") == -1);
    var frac1 = "1";
    var frac2 = "1";
    var frac;
    var cos = "1";
    var sign = true;
    if (isInt)var a2 = multr(a, a);
    for (var i = 2; true; i += 2, sign = !sign){
      if (isInt)frac1 = multr(frac1, a2);
      else frac1 = powrd(a, i, nprec+2);
      frac2 = multr(frac2, i*(i-1));
      frac = divr(frac1, frac2, nprec+2);
      if (isZero(frac, nprec+1))break;
      if (sign)cos = subr(cos, frac);
      else cos = addr(cos, frac);
    }
    
    return roundr(cos, nprec);
  }
  
  function cossmall2(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var frac1 = "1";
    var frac2 = "1";
    var pow = "1";
    var sign = true;
    var a2 = multr(a, a);
    var prod;
    for (var i = 2; true; i += 2, sign = !sign){
      prod = i*(i-1);
      frac1 = multr(frac1, prod);
      pow = multr(pow, a2);
      if (sign)frac1 = subr(frac1, pow);
      else frac1 = addr(frac1, pow);
      frac2 = multr(frac2, prod);
      if (nlen(frac2)-len(pow)-2 >= nprec)break;
    }
    
    return divr(frac1, frac2, nprec);
  }
  
  function sinhr(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var exp = expr(a, nprec+2);
    var recexp = divr(1, exp, nprec+1);
    
    var sinh = divr(subr(exp, recexp), 2, nprec+1);
    
    return roundr(sinh, nprec);
  }
  
  function coshr(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var exp = expr(a, nprec+2);
    var recexp = divr(1, exp, nprec+1);
    
    var cosh = divr(addr(exp, recexp), 2, nprec+1);
    
    return roundr(cosh, nprec);
  }
  
  // Euler's Algorithm
  // http://www.maa.org/editorial/euler/HEDI 64 Estimating pi.pdf
  /*function atanr(a, nprec){
    a = atanTrans(a, nprec, 4);
    var isInt = (a.indexOf(".") == -1);
    var a2 = multr(a, a);
    var onePlusA2 = addr("1", a2);
    var topNum = "1";
    var botNum = "1";
    var frac1 = a;
    var frac2 = onePlusA2;
    var frac;
    var atan = divr(a, onePlusA2, nprec+2);
    for (var i = 2, c = 2; true; i += 2, c++){
      topNum = multr(topNum, i);
      botNum = multr(botNum, i+1)
      if (isInt)frac1 = multr(frac1, a2);
      else frac1 = powrd(a, i+1, nprec+2);
      if (isInt)frac2 = multr(frac2, onePlusA2);
      else frac2 = powrd(onePlusA2, c, nprec+2);
      frac = divr(multr(topNum, frac1), multr(botNum, frac2), nprec+2);
      if (isZero(frac, nprec+1))break;
      atan = addr(atan, frac);
    }
    
    return roundr(multr(16, atan), nprec);
  }*/
  
  function atanr(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    if (lt(a, "0.2"))return atanrsm(a, nprec);
    else return atanr1(a, nprec);
  }
  
  function atan2r(a, b, nprec){
    a = String(a); b = String(b);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    a = trimZeros(a);
    b = trimZeros(b);
    
    if (b == "0"){
      if (a == "0"){
        throw "Error: atan2r(a, b, nprec): a and b cannot both equal 0";
      } else {
        var pi = pir(nprec+3);
        var hPI = divr(pi, 2, nprec);
        if (isNeg(a)){
          return negr(hPI);
        } else {
          return hPI;
        }
      }
    } else {
      var atan = atanr(divr(a, b, nprec+5), nprec+2);
      if (isNeg(b)){
        var pi = pir(nprec+2);
        if (isNeg(a)){
          return subr(atan, pi, nprec);
        } else {
          return addr(atan, pi, nprec);
        }
      } else {
        return roundr(atan, nprec);
      }
    }
  }
  
  // Taylor Series with transform
  // faster when a >= 0.2
  function atanr1(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    a = atanTrans(a, nprec, 4);
    var frac;
    var atan = a;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      frac = divr(powrd(a, i, nprec+2), i, nprec+2);
      if (isZero(frac, nprec+1))break;
      if (sign)atan = subr(atan, frac);
      else atan = addr(atan, frac);
    }
    
    return roundr(multr(16, atan), nprec);
  }
  
  // Taylor Series without transform
  // faster when a <= 0.2
  function atanrsm(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var frac;
    var atan = a;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      frac = divr(powrd(a, i, nprec+2), i, nprec+2);
      if (isZero(frac, nprec+2))break;
      if (sign)atan = subr(atan, frac);
      else atan = addr(atan, frac);
    }
    
    return roundr(atan, nprec);
  }
  
  function atanTrans(a, nprec, n){
    for (var i = n-1; i >= 0; i--){
      a = divr(a, addr(1, sqrtr(addr(1, multr(a, a)), nprec+i+2)), nprec+i+2);
    }
    
    return a;
  }
  
  // taylor series atan(1/x)
  function acotrl(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var sum = divr(1, a, nprec+2);
    var pow = a;
    var a2 = multr(a, a);
    var func1;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      pow = multr(pow, a2, nprec+2);
      func1 = divr(1, multr(i, pow), nprec+2);
      if (sign)sum = subr(sum, func1);
      else sum = addr(sum, func1);
      if (isZero(func1, nprec+1))break;
    }
    
    return roundr(sum, nprec);
  }
  
  // taylor series atan(x)
  function atanrsmall2(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var sum = a;
    var pow = a;
    var a2 = multr(a, a);
    var func1;
    var sign = true;
    for (var i = 3; true; i += 2, sign = !sign){
      pow = multr(pow, a2, nprec+2);
      func1 = divr(pow, i, nprec+2);
      if (sign)sum = subr(sum, func1);
      else sum = addr(sum, func1);
      if (isZero(func1, nprec+1))break;
    }
    
    return roundr(sum, nprec);
  }
  
  // taylor series atan(x) at x=1
  function atanrsmall(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var a1 = subr(a, 1);
    var pow = a1;
    var a2 = multr(a1, a1);
    var func1;
    var sign = false;
    var pow2 = "2";
    var sum = divr(pir(nprec+2), 4, nprec+2);
    var k = 1;
    for (var i = 1; true; i += 1){
      if (i % 4 == 0)continue;
      //alert(pow);
      func1 = divr(pow, multr(i, pow2), nprec+2);
      if (sign)sum = subr(sum, func1);
      else sum = addr(sum, func1);
      if (isZero(func1, nprec+1))break;
      if (i % 4 == 3)pow = multr(pow, a2, nprec+2);
      else pow = multr(pow, a1, nprec+2);
      //alert(pow2);
      if (k % 3 != 1)pow2 = multr(pow2, 2);
      sign = !sign;
      k++;
    }
    
    return roundr(sum, nprec);
  }
  
  // continued fraction
  // transform of http://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Continued_fractions_for_arctangent
  function acotrcont(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var an = function (n){
      if (n == 0)return 0;
      return multr(2*n-1, a);
    }
    
    var bn = function (n){
      if (n == 1)return 1;
      return (n-1)*(n-1);
    }
    
    return genContFrac(an, bn, nprec);
  }
  
  // continued fraction
  // transform of http://functions.wolfram.com/ElementaryFunctions/ArcTanh/10/
  function acothrcont(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var an = function (n){
      if (n == 0)return 0;
      return multr(2*n-1, a);
    }
    
    var bn = function (n){
      if (n == 1)return 1;
      return -(n-1)*(n-1);
    }
    
    return genContFrac(an, bn, nprec);
  }
  
  function acothrl2(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var sum = divr(1, a, nprec+2);
    var pow = a;
    var a2 = multr(a, a);
    var func1;
    for (var i = 3; true; i += 2){
      pow = multr(pow, a2);
      func1 = divr(1, multr(i, pow), nprec+2);
      sum = addr(sum, func1);
      if (isZero(func1, nprec+1))break;
    }
    
    return roundr(sum, nprec);
  }
  
  function pir(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    if (nprec <= 25)return pircont(nprec);
    else return pir2(nprec);
  }
  
  // continued fraction 
  function pircont(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var an = function (n){
      if (n == 0)return 0;
      else return 2*n-1;
    }
    
    var bn = function (n){
      if (n == 1)return 4;
      else return Math.pow(n-1, 2);
    }
    
    return genContFrac(an, bn, nprec);
  }
  
  // Machin-like formula 44*acot(57)+7*acot(239)-12*acot(682)+24*acot(12943)
  // http://en.wikipedia.org/wiki/Machin-like_formula#More_terms
  function pir2(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var p1 = multr(44, acotrcont("57", nprec+4));
    var p2 = multr(7, acotrcont("239", nprec+3));
    var p3 = multr(12, acotrcont("682", nprec+4));
    var p4 = multr(24, acotrcont("12943", nprec+4));
    
    var sum = addr(subr(addr(p1, p2), p3), p4);
    
    return multr(sum, 4, nprec);
  }
  
  // continued fraction
  function er(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var p0 = 0;
    var p1 = 1;
    var q0 = 1;
    var q1 = 1;
    var pn, qn;
    for (var an = 6; true; an += 4){
      pn = addr(multr(an, p1), p0);
      qn = addr(multr(an, q1), q0);
      if (2*len(qn)-2 >= nprec)break;
      p0 = p1;
      q0 = q1;
      p1 = pn;
      q1 = qn;
    }
    
    var exp = addr(1, divr(multr(2, pn), qn, nprec+2));
    
    return roundr(exp, nprec);
  }
  
  // continued fraction
  function phir(nprec){
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var f0 = 1;
    var f1 = 2;
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
  
  genContFrac.lastN = 0;
  genContFrac.lastP = 0;
  genContFrac.lastQ = 1;
  function genContFrac(a, b, nprec){
    if (nprec == undefined)nprec = Infinity;
    else nprec = Number(nprec);
    
    var an = a(0);
    if (an == null)an = 0;
    var bn = b(1);
    if (bn == null)bn = 0;
    var bn1;
    var p0 = 1;
    var q0 = 0;
    var p1 = an;
    var q1 = 1;
    var pn = p1;
    var qn = q1;
    var prod = bn;
    if (prod == null)prod = 1;
    for (var n = 1; true; n++){
      an = a(n);
      if (an == null || bn == null){n--; break;}
      bn1 = b(n+1);
      if (bn1 != null)prod = multr(prod, bn1);
      pn = addr(multr(an, p1), multr(bn, p0));
      qn = addr(multr(an, q1), multr(bn, q0));
      if (qn == "0")throw "Error: genContFrac(a, b, nprec): qn can never equal 0";
      if (2*nlen(qn)-len(prod)-2 >= nprec)break;
      p0 = p1;
      q0 = q1;
      p1 = pn;
      q1 = qn;
      bn = bn1;
    }
    genContFrac.lastN = n;
    genContFrac.lastP = pn;
    genContFrac.lastQ = qn;
    
    return divr(pn, qn, (nprec != Infinity)?nprec:prec);
  }
  
  simpContFrac.lastN = 0;
  simpContFrac.lastP = 0;
  simpContFrac.lastQ = 1;
  function simpContFrac(a, nprec){
    if (nprec == undefined)nprec = Infinity;
    else nprec = Number(nprec);
    
    var an = a(0);
    if (an == null)an = 0;
    var p0 = 1;
    var q0 = 0;
    var p1 = an;
    var q1 = 1;
    var pn = p1;
    var qn = q1;
    for (var n = 1; true; n++){
      an = a(n);
      if (an == null){n--; break;}
      pn = addr(multr(an, p1), p0);
      qn = addr(multr(an, q1), q0);
      if (qn == "0")throw "Error: simpContFrac(a, b, nprec): qn can never equal 0";
      if (2*nlen(qn)-2 >= nprec)break;
      p0 = p1;
      q0 = q1;
      p1 = pn;
      q1 = qn;
    }
    simpContFrac.lastN = n;
    simpContFrac.lastP = pn;
    simpContFrac.lastQ = qn;
    
    return divr(pn, qn, (nprec != Infinity)?nprec:prec);
  }
  
  function zetar(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var sum = "1";
    var func1;
    for (var i = 2; true; i++){
      func1 = divr(1, powr(i, a), nprec+2);
      sum = addr(sum, func1);
      if (isZero(func1, nprec+1))break;
      //alert("i: " + i + " | sum: " + sum);
    }
    
    return roundr(sum, nprec);
  }
  
  function zetar2(a, nprec){
    a = String(a);
    if (nprec == undefined)nprec = prec;
    else nprec = Number(nprec);
    
    var sum = "1";
    var func1, pow;
    for (var i = 2; true; i++){
      pow = powrn(i, a);
      sum = addr(sum, divr(1, pow, nprec+2));
      if (nlen(pow) >= nprec+1)break;
      //alert("i: " + i + " | sum: " + sum);
    }
    
    return roundr(sum, nprec);
  }
  
  window.R = {
    padZeros: padZeros,
    trimZeros: trimZeros,
    gt: gt,
    lt: lt,
    le: le,
    ge: ge,
    mDotRight: mDotRight,
    mDotLeft: mDotLeft,
    isZero: isZero,
    isEven: isEven,
    isInt: isInt,
    isNeg: isNeg,
    quotAndRem: quotAndRem,
    
    add: addr,
    sub: subr,
    mult: multr,
    div: divr,
    pow: powr,
    sqrt: sqrtr,
    fact: factr,
    exp: expr,
    ln: lnr,
    floor: floorr,
    ceil: ceilr,
    trunc: truncr,
    neg: negr,
    mod: modr,
    abs: absr,
    round: roundr,
    bin: binr,
    agm: agmr,
    sin: sinr,
    cos: cosr,
    sinh: sinhr,
    cosh: coshr,
    atan: atanr,
    pi: pir,
    e: er,
    phi: phir,
    
    genContFrac: genContFrac,
    simpContFrac: simpContFrac
  };
  
  ////// Speed Tests
  
  function comp(expr1, expr2){
    var ta, tb;
    
    ta = comp2(expr1);
    tb = comp2(expr2);
    
    alert("expr1: " + ta + " expr2: " + tb);
  }
  
  function comp2(expr){
    var t1, t2, f;
    
    t1 = (new Date()).getTime();
    for (f = 0; f < 1; f++)expr();
    t2 = (new Date()).getTime();
    
    return t2-t1;
  }
  
  //var d = divr(4, 3, 20);
  //var f = ln2(1002);
  
  function a(){
    sinhr("53", 100)
  }
  
  function b(){
    
  }
  
  function c(){}
  
  
  //alert("");
  //comp(a, b);
  
  alert(coshr("53", 100));
  //alert(cosr("345", 100));
  //alert(sinr("345", 100));
  //alert(agmr("1", "5", 160));
  //alert(binr("2000", "1000"));
  //alert($.toStr(multr1("4463242353463423232346345344521442", "323453465848203984902384902385092384092380844232432643634152643524")));
  //alert(exprsm(divr(1, 7, 30), 100) == exprsm2(divr(1, 7, 30), 100));
  //alert(exprsm2(divr(1, 7, 1000), 5));
  //alert(powrd("6.9595",10,3));
  //alert(atanr2("0.012342534247465346363452", 100));
  //alert(sinr("0.001", 50));
  //alert(decLen(3.1, 234));
  //alert(atanr3("0.2", 100));
  //alert(tr4of1(50));
  //alert(pi5(100));
  //alert(sqrtr("3.9615705608064608982523644722684781", 33));
  //alert(powrd(er(1000), 200));
  //alert(er(1000));
  //alert(expr("100.2234536353536"));
  //alert(powrd("2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274274663919320030599218174135966290435729003342952605956307381323286279434907632338298807531952510190115738341879307021540891499348841675092447614606680822648001684774118537423454424371075390777449920695517027618386062613313845830007520449338265602976067371132007093287091274437470472306969772093101416928368190255151086574637721112523897844250569536967707854499699679468644549059879316368892300987931277361782154249992295763514822082698951936680331825288693984964651058209392398294887933203625094431173012381970684161403970198376793206832823764648042953118023287825098194558153017567173613320698112509961818815930416903515988885193458072738667385894228792284998920868058257492796104841984443634632449684875602336248270419786232090021609902353043699418491463140934317381436405462531520961836908887070167683964243781405927145635490613031072085103837505101157477041718986106873969655212671546889570350354", 100, 1000));
  //alert(len("-103432"));
  //alert(roundr2("-9345.5345", -5));
  //alert(roundr2("-0000", -50));
  //alert(pir(101));
  //alert(pir(102));
  //alert(atanr("1", 50));
  //alert(atan2r("-145345347534532", "0.000000000001859038594234126", 50));
  //alert(er(1000));
  //alert(divr(addr(1, sqrtr(5, 1002)), 2, 1000));
  //alert(sqrtr(addr(3, multr(2, sqrtr(2, 300))), 300));
  //alert(divr("120353758445170943323634863688222287637757420382152321778320958722476546161415813165153336115912719421227461928197551270201914055839241734961153218709225070417570399367725056", "38309791152473798306590901962905589606427648417948078189711753985888143280102486959258631234265118463206261679960949920361644598268615333561220738123218021788157658896793600", 200));
  //alert(divr("453973694165307953197296969697410619233826", "280571172992510140037611932413038677189525", 500));
  //alert(sqrtr("2217120", 0));
  //alert(sqrtr("2213245298420385902357120", 1005));
  //alert(expr(3, 200));
  //alert(lnr(201, 50));
  //alert(sqrtrd("0"));
  //alert(sqrtrd("345345.3434"));
  //alert(powr(2, 0.5, 50));
  //alert(powr("234", "12.4354", 50));
  //alert(expsmall(g, 100));
  //alert(decPart("0.432523"));
  //alert(expr2(divr(1,, 0));
  //alert(exprsm(0, 5));
  //alert(subr(g, 1));
  //alert(atanr1(1, 1000));
  //alert(decPart("2"));
  //alert(remDot("2343"));
  //alert(multr2("323453465848203984902384902385092384092380844232432643634152643524", "4463242353463423232346345344521442"));
  //alert(d);
  //alert(multr2(d, f));
  //alert(multr2(d, f) == multr5(d, f));
  //d = "10000";
  //f = "0.000000000001";
  //alert(multr(d, f));
  //alert(sinr("-1.57079632679489661923"));
  //alert(sqrtr("415537190588082976318767552.0915153157174756", 54));
  //alert(multr2("2038472934792323840234000000000000000000000000000000000000000000009615", "2038472934792323840234000000000000000000000000000000000000000000009615", 56));
  //alert(floorr("-000999.43893840200"));
  //alert(trimZeros("-003464534.6746340"));
  //alert();
  //alert(multr("-342523421524242.142426547987843", "-342523421524242.142426547987843") == multr5("-342523421524242.142426547987843", "-342523421524242.142426547987843"));
  //alert(agmr(1, "0.0000390625", 20));
  //alert(reci(1423523423, 10000));
  //alert(isZero("02.", 7));
  //alert(reci2(d, 10));
  //alert(divr2(1, 23, 100));
  //alert(padZeros2("-24.1", "-4453455.45645"));
  //alert(divr2("2.4392572348210840923810521", "2235.123534235213425", 10000) == divro("2.4392572348210840923810521", "2235.123534235213425", 10000));
  //alert(mDotRight("2235.123534235213425", 25));
  //alert(sqrtrcont("23536576575643279", 1000));
  //alert(sqrtrd2("2", 1000));
  //alert(lnr2("0.11803398874989484820458683436563811772030917980576", 100));
  //alert(lnr4("1.9", 100));
  //alert(lnr7(1, 4, 200));
  //alert(lnr9(11, 50));
  //alert(reci2("5", 50));
  //alert(divr4("12353441842385344184238509284902138593047402374750328534418423850928490213859304740237475032850928490213859304740237475032840", "3212348590680439859037489534418423850928490213859304740237475032823748975354"));
  //alert(divr4("123534418423853441844444184238534418.42385092849021385930474441842385344184238509284902138593047402374750328534418423850237475032853441842385184238534418423850928490213859304740237475032853441842385238509284902138593047402374750328534418423850928490213859304740237475032850928490213859304740237475032840", "3.212348590680439859037489534418423850928490213859304740237475032823748975354", 1000) == divr("123534418423853441844444184238534418.42385092849021385930474441842385344184238509284902138593047402374750328534418423850237475032853441842385184238534418423850928490213859304740237475032853441842385238509284902138593047402374750328534418423850928490213859304740237475032850928490213859304740237475032840", "3.212348590680439859037489534418423850928490213859304740237475032823748975354", 1000));
  //alert(divr4("1235344", "32354", 1000));
  //alert(truncr("-0"));
  //alert(sqrtrd2("3454354362345435436234543543623454354362.12934208342890278052704823058039475849763408509348097485895", 100) == sqrtrd("3454354362345435436234543543623454354362.12934208342890278052704823058039475849763408509348097485895", 100));
  //alert(sqrtrcont("99999999999999", 1500) == sqrtrn("99999999999999", 1500));
  //alert(areaReci(20, 21, undefined, undefined, 10));
  //alert(lnr3("1.3333333333333", 100));
  //alert(lnr("10.3534423412", 50));
  //alert(len("0.1"));
  //TODO: cbrt(234, 101) and cbrt(234, 100)
  //alert(zetar2(3, 15));
  //alert(acotr2l("1000000", 1000));
  //alert(pir3(1000));
  //alert(ln10(1000));
  //alert(atanrsmall("0.5", 100));
  ///alert(acotrl("20.48780487804878048780487804878048780487804878048780", 100));
  //alert(acotrcont("10", 200));
  //alert(sqrtrd(multr("1.24232492", mDotLeft(1, 350)), 350));
  //alert(lnrsmall2("1.1"));
  //alert(exprl("500", 50));
  //alert(expr2("0.9", 1000));
  //alert(exprsm3("0.9"));
})(window);
