/***** Perfectly Precise Math Library 1.7.1 *****/

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

////// Array Prototypes

Array.prototype.addAll = function (){
  var sum = "0";
  for (var i = 0; i < this.length; i++){
    sum = addr(sum, this[i]);
  }

  return sum;
}

////// Other Functions

function checkArgs(name, args, ignore){
  args = argsToArr(args);
  if (ignore == undefined)ignore = 0;
  var argNames = name.substring(name.indexOf("(")+1, name.indexOf(")"));
  var argNames = argNames.split(", ");
  while (args[args.length-1] == undefined)args.pop();
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

function checkE(a){
  a = String(a);
  
  var ePos = a.indexOf("e");
  if (ePos == -1)return a;
  
  var frontNum = a.substring(0, ePos);
  var sign = a[ePos+1];
  var backNum = a.substring(ePos+2, a.length);
  
  if (sign == '+')return mDotRight(frontNum, backNum);
  if (sign == '-')return mDotLeft(frontNum, backNum);
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
  //checkE(Math.pow(Number(a), Number(b)));
  
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
  
  if (isNeg(a))throw "Error: sqrtr(a, nprec): a cannot be negative";
  
  if (isInt(a))return sqrtrn(a, nprec);
  else return sqrtrd(a, nprec);
}

// continued fraction
// http://en.wikipedia.org/wiki/Generalized_continued_fraction
function sqrtrn(a, nprec){
  a = String(a);
  if (nprec == undefined)nprec = prec;
  
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
  
  if (isNeg(a))throw "Error: sqrtrd(a, nprec): a cannot be negative";
  var sqrt = checkE(Math.sqrt(Number(a)));
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
  var sqrt = checkE(Math.sqrt(Number(a)));
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
      if (decLen < 200)exp = exprsm(a, nprec);
      else exp = exprsm2(a, nprec);
    } else {
      var expfl;
      if (fl == 1)expfl = er(nprec+2);
      else if (fl < 100)expfl = powr(er(nprec+1+(fl-1)*(flLen+1)), fl, nprec+1);
      else expfl = exprsm(fl, nprec+2);
      
      if (decLen < 200){
        exp = multr(expfl, exprsm(a, nprec+2+len(expfl)), nprec);
      } else {
        exp = multr(expfl, exprsm2(a, nprec+2+len(expfl)), nprec);
      }
    }
  }
  
  if (sign)return divr(1, exp, nprec-2);
  else return exp;
}

// Taylor Series with big fraction
function exprsm(a, nprec){
  a = String(a);
  if (nprec == undefined)nprec = prec;
  
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
  
  var frac1 = a;
  var frac2 = "1";
  var frac = "1";
  var exp = addr(a, 1);
  for (var i = 2; true; i++){
    frac1 = powr(a, i, nprec+2);
    frac2 = multr(frac2, i);
    frac = divr(frac1, frac2, nprec+2);
    if (isZero(frac, nprec+1))break;
    exp = addr(exp, frac);
  }
  
  return roundr(exp, nprec);
}

function lnr(a, nprec){
  a = String(a);
  if (nprec == undefined)nprec = prec;
  
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
  
  if (nprec <= 25)return ln2cont(nprec);
  else return ln22(nprec);
}

// generalized continued fraction
function ln2cont(nprec){
  if (nprec == undefined)nprec = prec;
  
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
  
  var p1 = multr(18, acothrl("26", nprec+4));
  var p2 = multr(2, acothrl("4801", nprec+3));
  var p3 = multr(8, acothrl("8749", nprec+3));
  
  var sum = addr(subr(p1, p2), p3);
  
  return roundr(sum, nprec);
}

// Machin-like formula
// ln(5) = 334*acoth(251)+126*acoth(449)-88*acoth(4801)+144*acoth(8749)
function ln5(nprec){
  if (nprec == undefined)nprec = prec;
  
  var p1 = multr(334, acothrl("251", nprec+5));
  var p2 = multr(126, acothrl("449", nprec+5));
  var p3 = multr(88, acothrl("4801", nprec+4));
  var p4 = multr(144, acothrl("8749", nprec+5));
  
  var sum = addr(subr(addr(p1, p2), p3), p4);
  
  return roundr(sum, nprec);
}

// ln(2) = 144*acoth(251)+54*acoth(449)-38*acoth(4801)+62*acoth(8749)
function ln2and5(nprec){
  if (nprec == undefined)nprec = prec;
  
  var a1 = acothrl("251", nprec+5);
  var a2 = acothrl("449", nprec+5);
  var a3 = acothrl("4801", nprec+4);
  var a4 = acothrl("8749", nprec+5);
  
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

// Machin-like formula
// ln(10) = 478*acoth(251)+180*acoth(449)-126*acoth(4801)+206*acoth(8749)
function ln10(nprec){
  if (nprec == undefined)nprec = prec;
  
  var p1 = multr(478, acothrl("251", nprec+5));
  var p2 = multr(180, acothrl("449", nprec+5));
  var p3 = multr(126, acothrl("4801", nprec+5));
  var p4 = multr(206, acothrl("8749", nprec+5));
  
  var sum = addr(subr(addr(p1, p2), p3), p4);
  
  return roundr(sum, nprec);
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
  
  var exp = expr(a, nprec+2);
  var recexp = divr(1, exp, nprec+1);
  
  var sinh = divr(subr(exp, recexp), 2, nprec+1);
  
  return roundr(sinh, nprec);
}

function coshr(a, nprec){
  a = String(a);
  if (nprec == undefined)nprec = prec;
  
  var exp = expr(a, nprec+2);
  var recexp = divr(1, exp, nprec+1);
  
  var cosh = divr(addr(exp, recexp), 2, nprec+1);
  
  return roundr(cosh, nprec);
}

function atanr(a, nprec){
  a = String(a);
  if (nprec == undefined)nprec = prec;
  
  if (lt(a, "0.2"))return atanrsm(a, nprec);
  else return atanr1(a, nprec);
}

function atan2r(a, b, nprec){
  a = String(a); b = String(b);
  if (nprec == undefined)nprec = prec;
  
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

// continued fraction
// transform of http://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Continued_fractions_for_arctangent
function acotrl(a, nprec){
  a = String(a);
  if (nprec == undefined)nprec = prec;
  
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
function acothrl(a, nprec){
  a = String(a);
  if (nprec == undefined)nprec = prec;
  
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

function pir(nprec){
  if (nprec == undefined)nprec = prec;
  
  if (nprec <= 25)return pircont(nprec);
  else return pir2(nprec);
}

// continued fraction 
function pircont(nprec){
  if (nprec == undefined)nprec = prec;
  
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
  
  var p1 = multr(44, acotrl("57", nprec+4));
  var p2 = multr(7, acotrl("239", nprec+3));
  var p3 = multr(12, acotrl("682", nprec+4));
  var p4 = multr(24, acotrl("12943", nprec+4));
  
  var sum = addr(subr(addr(p1, p2), p3), p4);
  
  return multr(sum, 4, nprec);
}

// continued fraction
function er(nprec){
  if (nprec == undefined)nprec = prec;
  
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