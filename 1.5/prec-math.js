/***** Perfectly Precise Math Library 1.5 *****/

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
  
  if (a.indexOf(".") == -1)a += ".0";
  if (b.indexOf(".") == -1)b += ".0";
  
  var alen = a.length;
  var blen = b.length;
  var adot = a.indexOf(".");
  var bdot = b.indexOf(".");
  
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
    a = a.replace("-", "");
    sign = "-";
  }
  
  for (var i = 0; i <= a.length; i++){
    if (a[i] != '0'){
      a = a.substring(i, a.length);
      break;
    }
  }
  
  if (a.indexOf(".") != -1){
    if (a[0] == '.')a = "0" + a;
    for (var i = a.length-1; i >= 0; i--){
      if (a[i] != '0'){
        a = a.substring(0, i+1);
        break;
      }
    }
    if (a[a.length-1] == '.')a = a.substring(0, a.length-1);
  }
  
  if (a == "")a = "0";
  if (a != "0")a = sign + a;
  
  return a;
}

function gt(a, b){ // is (a > b) ?
  a = String(a); b = String(b);
  
  var zeroArr = padZeros(a, b);
  a = zeroArr[0]; b = zeroArr[1];
  
  a = a.replace(".", "");
  b = b.replace(".", "");
  
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
  
  a = a.replace(".", "");
  b = b.replace(".", "");
  
  if (a == b)return false;
  
  for (var i = 0; i < a.length; i++){
    if (a[i] != b[i])return (Number(a[i]) < Number(b[i]));
  }
  
  return false;
}

function le(a, b){ // is (a <= b) ?
  return !gt(a, b);
}

function mDotRight(a, n){ // 32.44 -> 324.4
  a = String(a); n = Number(n);
  a = trimZeros(a);
  
  if (n == 0 || a == "0")return a;
  
  var alen = a.length;
  var adot = a.indexOf(".");
  
  if (adot != -1){
    var numZeros = n-(alen-(adot+1));
    if (numZeros >= 0){
      for (var i = numZeros; i >= 1; i--)a += "0";
      a = a.substring(0, adot) + a.substr(adot+1, n);
    } else {
      a = a.substring(0, adot) + a.substr(adot+1, n) + "." + a.substring(adot+1+n, alen);
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
    a = a.replace("-", "");
    sign = "-";
  }
  
  if (n == 0 || a == "0")return a;
  
  var alen = a.length;
  var adot = a.indexOf(".");
  if (adot == -1)adot = alen;
  
  var numZeros = n-adot;
  if (numZeros >= 0){
    a = a.replace(".", "");
    for (var i = numZeros; i >= 1; i--)a = "0" + a;
    a = "0." + a;
  } else {
    if (adot == alen)a = a.substring(0, adot-n) + "." + a.substr(adot-n, n);
    else {
      a = a.substring(0, adot-n) + "." + a.substr(adot-n, n) + a.substring(adot+1, alen);
    }
  }
  
  return trimZeros(sign + a);
}

function getPrec(a, b, nprec){
  a = String(a); b = String(b);
  if (nprec == undefined)nprec = prec;
  
  if (isNeg(a)){
    if (!isNeg(b)){
      b = addr(a.replace("-", ""), b);
      a = "0";
    } else {
      a = a.replace("-", "");
      b = b.replace("-", "");
    }
  } else if (isNeg(b)){
    a = addr(a, b.replace("-", ""));
    b = "0";
  }
  
  var padArr = padZeros(a, b);
  a = padArr[0]; b = padArr[1];
  
  if (a == b)return nprec+1;
  
  var len = a.length;
  var dot = a.indexOf(".");
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
  
  if (isNeg(a))a = a.replace("-", "");
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
  
  if (isNeg(a))a = a.replace("-", "");
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
  
  a = a.replace("-", "");
  var posDot = a.indexOf(".");
  if (posDot == -1){
    if (a != "0")return false;
    else return true;
  }
  if (a.substring(0, posDot) != "0")return false;
  
  var end = (nprec+2 <= a.length)?nprec+2:a.length;
  for (var i = posDot+1; i < end; i++){
    if (a[i] != '0')return false;
  }
  if (i == a.length)return true;
  if (Number(a[i]) >= 5)return false;
  
  return true;
}

function isEven(a){
  a = String(a);
  
  if (!isInt(a))return false;
  
  var last = a[a.length-1];
  return (last == '0' || last == '2' || last == '4' || last == '6' || last == '8');
}

function isDivFive(a){
  a = String(a);
  
  if (!isInt(a))return false;
  
  var last = a[a.length-1];
  return (last == '0' || last == '5');
}

function isInt(a){
  a = String(a);
  return (a.indexOf(".") == -1);
}

function isNeg(a){
  a = String(a);
  return (a[0] == '-');
}

function quotAndRem(a, b){
  a = String(a); b = String(b);
  
  var sign = "";
  if (isNeg(a) ^ isNeg(b))sign = "-";
  
  a = a.replace("-", "");
  b = b.replace("-", "");
  
  a = trimZeros(a);
  b = trimZeros(b);
  
  if (b == "0")throw "Error: modr(a, b): b cannot be 0";
  if (a == "0")return ["0", "0"];
  
  while (a.indexOf(".") != -1 || b.indexOf(".") != -1){
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
  
  return [trimZeros(quot), remain];
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
    if (!isNeg(b))return subr(b, a.replace("-", ""), nprec);
    else {
      sign = "-";
      a = a.replace("-", "");
      b = b.replace("-", "");
    }
  } else if (isNeg(b))return subr(a, b.replace("-", ""), nprec);
  
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
      a = b.replace("-", "");
      b = c.replace("-", "");
    }
  } else if (isNeg(b))return addr(a, b.replace("-", ""), nprec);
  
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

function multr(a, b, nprec){
  a = String(a); b = String(b);
  
  var sign = "";
  if (isNeg(a) ^ isNeg(b))sign = "-";
  
  a = a.replace("-", "");
  b = b.replace("-", "");
  
  a = trimZeros(a);
  b = trimZeros(b);
  
  if (b.length > a.length){
    var c = a;
    a = b;
    b = c;
  }
  
  var aDotBack = (a.indexOf(".") == -1)?0:a.length-(a.indexOf(".")+1);
  var bDotBack = (b.indexOf(".") == -1)?0:b.length-(b.indexOf(".")+1);
  var origDotBack = aDotBack + bDotBack;
  a = a.replace(".", "");
  b = b.replace(".", "");
  
  var aarr = [];
  var barr = [];
  for (var i = a.length-7; i > -7; i = i-7){
    aarr.unshift(Number(a.substring(i, i+7)));
  }
  for (var i = b.length-7; i > -7; i = i-7){
    barr.unshift(Number(b.substring(i, i+7)));
  }
  
  var smallProd, sPLen;
  var prodarr = [];
  var carry = 0;
  for (var d = barr.length-1, g = 0; d >= 0; d--, g++){
    if (barr[d] == 0){
      prodarr[g] = "0";
      continue;
    }
    prodarr[g] = "";
    for (var f = g; f >= 1; f--)prodarr[g] += "0000000";
    for (var i = aarr.length-1; i >= 0; i--){
      smallProd = String(barr[d] * aarr[i] + carry);
      sPLen = smallProd.length;
      prodarr[g] = smallProd.substring(sPLen-7, sPLen) + prodarr[g];
      if (sPLen > 7){
        carry = Number(smallProd.substring(0, sPLen-7));
      } else {
        carry = 0;
        for (var h = 7-sPLen; h > 0; h--){
          prodarr[g] = "0" + prodarr[g];
        }
      }
    }
    if (carry != 0){
      prodarr[g] = carry + prodarr[g];
      carry = 0;
    }
  }
  var prod = prodarr.addAll();
  
  for (var i = origDotBack-prod.length+1; i >= 1; i--)prod = "0" + prod;
  var newPosDot = prod.length-origDotBack;
  prod = prod.substring(0, newPosDot) + "." + prod.substring(newPosDot, prod.length);
  
  prod = sign + prod;
  
  return (nprec == undefined)?trimZeros(prod):roundr(prod, nprec);
}

function divr(a, b, nprec){
  a = String(a); b = String(b);
  if (nprec == undefined)nprec = prec;
  
  var sign = "";
  if (isNeg(a) ^ isNeg(b))sign = "-";
  
  a = a.replace("-", "");
  b = b.replace("-", "");
  
  a = trimZeros(a);
  b = trimZeros(b);
  
  if (b == "0")throw "Error: divr(a, b, nprec): b cannot be 0";
  if (a == "0")return "0";
  
  while (a.indexOf(".") != -1 || b.indexOf(".") != -1){
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
  if (remain != "0"){
    quot += ".";
    for (var currprec = 0; currprec < nprec+1; currprec++){
      if (remain == "0")break;
      smallDividend = remain + "0";
      while (smallDividend.length < b.length){
        smallDividend += "0";
        quot += "0";
      }
      for (var c = 1; le(bMultArr[c], smallDividend); c++){
        if (c+1 == bMultArr.length)bMultArr[c+1] = addr(bMultArr[c], b);
      }
      remain = subr(smallDividend, bMultArr[c-1]);
      quot += c-1;
    }
  }
  
  return roundr(sign + quot, nprec);
}

function powr(a, b, nprec){
  a = String(a); b = String(b);
  
  var sign = false;
  if (isNeg(b)){
    sign = true;
    b = b.replace("-", "");
  }
  
  var pow;
  if (isInt(b)){
    if (b == "2")pow = multr(a, a, nprec);
    if (isInt(a) || nprec == undefined)pow = powrn(a, b);
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
    a = a.replace("-", "");
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
    func1 = subr(multr(sqrt, sqrt, nprec+2), a);
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
  
  if (!isInt(a) || isNeg(a)){
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
    a = a.replace("-", "");
    sign = true;
  }
  
  if (a.indexOf(".") == -1){
    var exp = powr(er(nprec+1+(Number(a)-1)*(len(a)+1)), a, nprec+1);
  } else {
    var i = floorr(a);
    a = subr(a, i);
    if (gt(a, "0.5")){
      a = subr(a, 1);
      i = addr(i, 1);
    }
    
    var eprec = (Number(i)-1)*(len(i)+1);
    var exp = expsmall(a, nprec + len(powr(er(2+eprec), i, 2))+1);
    exp = multr(exp, powr(er(nprec+len(exp)+1+eprec), i, nprec+len(exp)+1));
  }
  
  if (sign)return divr(1, exp, nprec);
  else return roundr(exp, nprec);
}

// Taylor Series
function expsmall(a, nprec){
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

// Newton's method
function lnr(a, nprec){
  a = String(a);
  if (nprec == undefined)nprec = prec;
  
  if (isNeg(a))throw "Error: lnr(a, nprec): a cannot be negative";
  if (a == "0")throw "Error: lnr(a, nprec): a cannot be zero";
  
  var ln = checkE(Math.log(Number(a)));
  var func1, func2;
  for (var i = 1; true; i++){
    func1 = subr(divr(a, expr(ln, nprec+2), nprec+2), 1);
    if (isZero(func1, nprec+1))break;
    ln = addr(func1, ln);
  }
  
  return roundr(ln, nprec);
}

function floorr(a){
  a = String(a);
  a = trimZeros(a);
  
  var adot = a.indexOf(".");
  if (adot == -1)return a;
  
  a = a.substring(0, adot);
  
  if (isNeg(a)){
    a = a.replace("-", "");
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
  a = trimZeros(a);
  
  var adot = a.indexOf(".");
  if (adot == -1)return a;
  
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
  a = trimZeros(a);
  
  var adot = a.indexOf(".");
  if (adot == -1)return a;
  
  a = a.substring(0, adot);
  
  return a;
}

function negr(a){
  a = String(a);
  
  if (a == "0")return a;
  
  if (isNeg(a))return a.replace("-", "");
  else return "-" + a;
}

function modr(a, b){
  a = String(a); b = String(b);
  
  var sign = "";
  if (isNeg(a) ^ isNeg(b))sign = "-";
  
  a = a.replace("-", "");
  b = b.replace("-", "");
  
  a = trimZeros(a);
  b = trimZeros(b);
  
  if (b == "0")throw "Error: modr(a, b): b cannot be 0";
  if (a == "0")return "0";
  
  while (a.indexOf(".") != -1 || b.indexOf(".") != -1){
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
  return a.replace("-", "");
}

function roundr(a, nprec){
  a = String(a);
  a = trimZeros(a);
  
  var sign = "";
  if (isNeg(a)){
    a = a.replace("-", "");
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
          for (var d = adot-(i+1); d >= 1; d--)a += 0;
          break;
        }
      }
      if (i == -1){
        a = "1";
        for (var d = adot; d >= 1; d--)a += 0;
      }
    } else {
      a = a.substring(0, adot+nprec);
      for (var d = -nprec; d >= 1; d--)a += 0;
    }
  } else {
    if (adot == -1 || adot+nprec+1 >= alen)return sign + a;
    
    if (Number(a[adot+nprec+1]) >= 5){
      for (var i = adot+nprec; i >= 0; i--){
        if (a[i] == '.')continue;
        if (a[i] != '9'){
          a = a.substring(0, i) + (Number(a[i])+1);
          for (var d = adot-(i+1); d >= 1; d--)a += 0;
          break;
        }
      }
      if (i == -1){
        a = "1";
        for (var d = adot; d >= 1; d--)a += 0;
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
    a = a.replace("-", "");
    sign = !sign;
  }
  
  var pi = pir(nprec+1+len(divr(a, 5, 0)));
  var tPI = multr(2, pi);
  a = subr(a, multr(divr(a, tPI, 0), tPI));
  
  if (isNeg(a)){
    a = a.replace("-", "");
    sign = !sign;
  }
  
  var hPI = divr(pi, 2, nprec+2);
  var numhPIs = divr(a, hPI, 0);
  // a = subr(a, multr(numhPI, hPI));
  var sin;
  switch (numhPIs){
    case "0":
      sin = sinsmall(a, nprec+1);
      break;
    case "1":
      a = subr(a, hPI);
      sin = cossmall(a, nprec+1);
      break;
    case "2":
      a = subr(a, addr(hPI, hPI));
      sin = sinsmall(a, nprec+1);
      sign = !sign;
      break;
    case "3":
      a = subr(a, addr(hPI, pi));
      sin = cossmall(a, nprec+1);
      sign = !sign;
      break;
  }
  
  sin = roundr(sin, nprec);
  
  if (sign)sin = negr(sin);
  
  return sin;
}

function sinsmall(a, nprec){
  a = String(a);
  if (nprec == undefined)nprec = prec;
  
  var isInt = (a.indexOf(".") == -1);
  var frac1 = a;
  var frac2 = "1";
  var frac;
  var sin = a;
  var sign = true;
  var a2 = multr(a, a);
  for (var i = 3; true; i += 2, sign = !sign){
    if (isInt)frac1 = multr(frac1, a2);
    else frac1 = powrd(a, i, nprec+2);
    frac2 = multr(frac2, multr(i, i-1));
    frac = divr(frac1, frac2, nprec+2);
    if (isZero(frac, nprec+1))break;
    if (sign)sin = subr(sin, frac);
    else sin = addr(sin, frac);
  }
  
  return roundr(sin, nprec);
}

function cosr(a, nprec){
  a = String(a);
  if (nprec == undefined)nprec = prec;
  
  var sign = false;
  if (isNeg(a)){
    a = a.replace("-", "");
  }
  
  var pi = pir(nprec+1+len(divr(a, 5, 0)));
  var tPI = multr(2, pi);
  a = subr(a, multr(divr(a, tPI, 0), tPI));
  
  if (isNeg(a)){
    a = a.replace("-", "");
  }
  
  var hPI = divr(pi, 2, nprec+2);
  var numhPIs = divr(a, hPI, 0);
  // a = subr(a, multr(numhPI, hPI));
  var cos;
  switch (numhPIs){
    case "0":
      cos = cossmall(a, nprec+1);
      break;
    case "1":
      a = subr(a, hPI);
      cos = sinsmall(a, nprec+1);
      sign = !sign;
      break;
    case "2":
      a = subr(a, addr(hPI, hPI));
      cos = cossmall(a, nprec+1);
      sign = !sign;
      break;
    case "3":
      a = subr(a, addr(hPI, pi));
      cos = sinsmall(a, nprec+1);
      break;
  }
  
  cos = roundr(cos, nprec);
  
  if (sign)cos = negr(cos);
  
  return cos;
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
  var a2 = multr(a, a);
  for (var i = 2; true; i += 2, sign = !sign){
    if (isInt)frac1 = multr(frac1, a2);
    else frac1 = powrd(a, i, nprec+2);
    frac2 = multr(frac2, multr(i, i-1));
    frac = divr(frac1, frac2, nprec+2);
    if (isZero(frac, nprec+1))break;
    if (sign)cos = subr(cos, frac);
    else cos = addr(cos, frac);
  }
  
  return roundr(cos, nprec);
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
  
  var pi = pir(nprec+3);
  var hPI = divr(pi, 2, nprec);
  if (b == "0"){
    if (a == "0"){
      throw "Error: atan2r(a, b, nprec): a and b cannot both equal 0";
    } else if (isNeg(a)){
      return negr(hPI);
    } else {
      return hPI;
    }
  } else {
    var atan = atanr(divr(a, b, nprec+5), nprec+2);
    if (isNeg(b)){
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

// Taylor Series with Transform
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
function pir(nprec){
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
  
  var p0 = 1;
  var q0 = 0;
  var p1 = (a(0) == null)?0:a(0);
  var q1 = 1;
  var pn = p1;
  var qn = q1;
  var prod = (b(1) == null)?1:b(1);
  for (var n = 1; true; n++){
    if (a(n) == null || b(n) == null){n--; break;}
    if (b(n+1) != null)prod = multr(prod, b(n+1));
    pn = addr(multr(a(n), p1), multr(b(n), p0));
    qn = addr(multr(a(n), q1), multr(b(n), q0));
    if (qn == "0")throw "Error: genContFrac(a, b, nprec): qn can never equal 0";
    if (2*nlen(qn)-len(prod)-2 >= nprec)break;
    p0 = p1;
    q0 = q1;
    p1 = pn;
    q1 = qn;
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
  
  var p0 = 1;
  var q0 = 0;
  var p1 = (a(0) == null)?0:a(0);
  var q1 = 1;
  var pn = p1;
  var qn = q1;
  for (var n = 1; true; n++){
    if (a(n) == null){n--; break;}
    pn = addr(multr(a(n), p1), p0);
    qn = addr(multr(a(n), q1), q0);
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