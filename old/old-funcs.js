// long mult splitting numbers into arrays before calc
function multrLong2(a, b){
  if (b.length > a.length)return multrLong2(b, a);
  
  var aarr = [];
  for (var i = a.length; i > 0; i -= 7){
    aarr.unshift(a.substring(i-7, i));
  }
  a = aarr;
  
  var barr = [];
  for (var i = b.length; i > 0; i -= 7){
    barr.unshift(b.substring(i-7, i));
  }
  b = barr;
  
  var prod = "0";
  var curra, currb, curr, small, len, carry;
  for (var i = b.length-1; i >= 0; i--){
    currb = Number(b[i]);
    if (currb == 0)continue;
    curr = ""; carry = 0;
    for (var f = b.length-1-i; f >= 1; f--)curr += "0000000";
    for (var j = a.length-1; j >= 0; j--){
      curra = Number(a[j]);
      if (curra == 0){
        if (carry != 0){
          small = String(carry);
        } else {
          if (j != 0)curr = "0000000" + curr;
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
        if (j != 0){
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

// simple Karatsuba multiplication
function multrKarat(a, b){
  var alen = a.length;
  var blen = b.length;
  
  var m = Math.min(alen, blen);
  if (m <= 100)return multrLong(a, b);
  m = Math.ceil(m/2);
  
  // a = a1*10^m + a0
  var a1 = a.substring(0, alen-m);
  var a0 = trimInt(a.substring(alen-m, alen));
  // b = b1*10^m + b0
  var b1 = b.substring(0, blen-m);
  var b0 = trimInt(b.substring(blen-m, blen));
  
  var z2 = multrKarat(a1, b1);
  var z0 = multrKarat(a0, b0);
  var z1 = subr(subr(multrKarat(addr(a1, a0), addr(b1, b0)), z2), z0);
  
  return addr(addr(mDotRight(z2, 2*m), mDotRight(z1, m)), z0);
}

// not the most efficient roundr
function roundr(a, nprec){
  var sign = "";
  if (isNeg(a)){
    a = remNeg(a);
    sign = "-";
  }
  
  if (nprec == undefined || nprec == 0){
    if (isInt(a))return sign + a;
    var dec = decPos(a);
    var round = a.substring(0, dec);
    if (Number(a[dec+1]) >= 5)round = addOne(round);
    return (round == "0")?round:sign+round;
  }
  
  var pos = decPos(a)+nprec; // roundto + 1
  var nodec = remDec(a);
  if (pos >= nodec.length)return sign + a;
  if (pos <= -1)return "0";
  
  var round = nodec.substring(0, pos);
  if (round == "")round = "0";
  if (Number(nodec[pos]) >= 5)round = addOne(round);
  if (round == "0")return round;
  return sign + mDotLeft(round, nprec);
}

// naive procedural factorial
function factrProc(a){
  var prod = "1";
  for (var i = a; i > 1; i--){
    prod = multr(prod, String(i));
  }
  return prod;
}

// naive recursive factorial
function factrRec(a){
  if (a == 0)return "1";
  return multr(String(a), factrRec(a-1));
}

// continued fraction closure experiment
function makeFrac(funca, funcb){
  var aarr = [];
  var a = function (n){
    if (aarr[n] != undefined)return aarr[n];
    return aarr[n] = funca(n);
  }
  
  var barr = [];
  var b = function (n){
    if (barr[n] != undefined)return barr[n];
    return barr[n] = funcb(n);
  }
  
  var parr = [];
  parr[-1] = "1";
  parr[0] = a(0);
  var p = function (n){
    if (parr[n] != undefined)return parr[n];
    return parr[n] = addr(multr(a(n), p(n-1)), multr(b(n), p(n-2)));
  };
  
  var qarr = [];
  qarr[-1] = "0";
  qarr[0] = "1";
  var q = function (n){
    if (qarr[n] != undefined)return qarr[n];
    return qarr[n] = addr(multr(a(n), q(n-1)), multr(b(n), q(n-2)));
  };
  
  return [a, b, p, q, parr, qarr];
}

function genContFrac2(a, b, nprec){
  if (nprec == undefined)nprec = prec;
  var frac = makeFrac(a, b);
  a = frac[0]; b = frac[1];
  var p = frac[2]; var q = frac[3];
  
  var pn, qn;
  var prod = b(1);
  for (var n = 1; true; n++){
    prod = multr(prod, b(n+1));
    qn = q(n);
    if (qn == "0")throw "Error: genContFrac(a, b, nprec): qn can never equal 0";
    if (2*nlen(qn)-len(prod)-2 >= nprec)break;
  }
  pn = p(n);
  genContFrac.lastN = n;
  genContFrac.lastP = pn;
  genContFrac.lastQ = qn;
  
  return divr(pn, qn, nprec);
}

// genContFrac no nulls
function genContFrac(a, b, nprec){
  if (nprec == undefined)nprec = prec;
  
  var p0 = "1";
  var q0 = "0";
  var p1 = a(0);
  var q1 = "1";
  var an, bn, pn, qn;
  var bn1 = b(1);
  var prod = bn1;
  for (var n = 1; true; n++){
    an = a(n); bn = bn1;
    bn1 = b(n+1);
    prod = multr(prod, bn1);
    pn = addr(multr(an, p1), multr(bn, p0));
    qn = addr(multr(an, q1), multr(bn, q0));
    if (qn == "0")throw "Error: genContFrac(a, b, nprec): qn can never equal 0";
    if (2*nlen(qn)-len(prod)-2 >= nprec)break;
    p0 = p1; q0 = q1;
    p1 = pn; q1 = qn;
  }
  genContFrac.lastNums = [n, pn, qn];
  
  return divr(pn, qn, nprec);
}

// slower and less complete implementations of
// return isZero(subr(a, b), nprec);
function isDiffZero(a, b, nprec){
  if (a == b)return true;
  
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
  
  var dot = decPos(a);
  a = remDec(a); b = remDec(b);
  if (dot+nprec >= a.length)return false;
  if (dot+nprec < 0)return true;
  for (var i = 0; i < dot+nprec; i++){
    if (a[i] != b[i]){
      if (Number(b[i]) != Number(a[i])-1)return false;
      for (i = i+1; i < dot+nprec; i++){
        if (a[i] != '0' || b[i] != '9')return false;
      }
      return Number(a[i]) - Number(b[i]) < -5;
    }
  }
  return Number(a[i]) - Number(b[i]) < 5;
}

function isDiffZero2(a, b, nprec){
  if (a == b)return true;
  
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
  
  var dot = decPos(a);
  if (nprec < 0){
    if (dot+nprec < 0)return true;
    for (var i = 0; i < dot+nprec; i++){
      if (a[i] != b[i]){
        if (Number(b[i]) != Number(a[i])-1)return false;
        for (i = i+1; i < dot+nprec; i++){
          if (a[i] != '0' || b[i] != '9')return false;
        }
        var diff = Number(a[i]) - Number(b[i]);
        if (diff != -5)return diff < -5;
        for (i = i+1; i < a.length; i++){
          if (a[i] != b[i]){
            return Number(a[i]) < Number(b[i]);
          }
        }
        return false;
      }
    }
    var diff = Number(a[i]) - Number(b[i]);
    if (diff != 5)return diff < 5;
    for (i = i+1; i < a.length; i++){
      if (a[i] != b[i]){
        return Number(a[i]) < Number(b[i]);
      }
    }
    return false;
  } else {
    if (dot+nprec+1 >= a.length)return false;
    for (var i = 0; i < dot+nprec+1; i++){
      if (a[i] != b[i]){
        if (Number(b[i]) != Number(a[i])-1)return false;
        for (i = i+1; i < dot+nprec+1; i++){
          if (a[i] == '.')continue;
          if (a[i] != '0' || b[i] != '9')return false;
        }
        var diff = Number(a[i]) - Number(b[i]);
        if (diff != -5)return diff < -5;
        for (i = i+1; i < a.length; i++){
          if (a[i] != b[i]){
            return Number(a[i]) < Number(b[i]);
          }
        }
        return false;
      }
    }
    var diff = Number(a[i]) - Number(b[i]);
    if (diff != 5)return diff < 5;
    for (i = i+1; i < a.length; i++){
      if (a[i] != b[i]){
        return Number(a[i]) < Number(b[i]);
      }
    }
    return false;
  }
}

// slower algorithm
function sqrtrNewton2(a, nprec){
  var sqrt = checkE(Math.sqrt(Number(a)));
  if (sqrt == "0")return "0";
  var curr;
  while (true){
    curr = divr(addr(sqrt, divr(a, sqrt, nprec+2)), "2", Infinity);
    if (isDiffZero(curr, sqrt, nprec+1))break;
    sqrt = curr;
  }
  
  return roundr(curr, nprec);
}

// still too slow
function recirNewton(a, nprec){
  var div = checkE(1/Number(a));
  var add;
  while (true){
    add = multr(div, subr("1", multr(div, a, nprec+4)), nprec+2);
    if (isZero(add, nprec+1))break;
    div = addr(div, add);
  }
  
  return roundr(div, nprec);
}

// still too slow
// http://www.math.ust.hk/~machiang/education/enhancement/arithmetic_geometric.pdf
function pirAgm(nprec){
  var a0 = sqrtr("2", nprec);
  var b0 = "0";
  var pi0 = addr("2", a0);
  var an, bn, pin;
  var sqrt
  for (var i = 0; i < nprec+2; i++){
    sqrt = sqrtr(a0, nprec+4)
    an = divr(addr(sqrt, divr("1", sqrt, nprec+4)), "2", nprec+2);
    bn = multr(sqrt, divr(addr(b0, "1"), addr(b0, a0), nprec+4), nprec+2);
    pin = multr(multr(pi0, bn, nprec+4), divr(addr(an, "1"), addr(bn, "1"), nprec+4), nprec+2);
    a0 = an; b0 = bn; pi0 = pin;
  }
  return roundr(pin, nprec);
}

// transform of http://en.wikipedia.org/wiki/Gauss%27s_continued_fraction#Applications
// http://en.wikipedia.org/wiki/Continued_fraction#Regular_patterns_in_continued_fractions
function atanRecirCont(a, nprec){
  a = Number(a);
  var an = function (n){
    if (n == 0)return "0";
    return String(a*(2*n-1));
  }
  
  return simpContFrac(an, nprec);
}

// transform of http://en.wikipedia.org/wiki/Gauss%27s_continued_fraction#Applications
function atanhRecirCont(a, nprec){
  a = Number(a);
  var an = function (n){
    if (n == 0)return "0";
    return String(a*(2*n-1));
  }
  
  return negr(simpNegContFrac(an, nprec));
}

// An export model idea
function addRFunc(name, ref, args){
  RFuncs.push([name, ref, args]);
}

var RFuncs = [];
addRFunc("isValid", isValidr);
addRFunc("valid", validr);

addRFunc("canon", canonr);
addRFunc("trimNum", trimNum);
addRFunc("trimInt", trimInt);
addRFunc("trimDec", trimDec);
addRFunc("trimDecStart", trimDecStart);
addRFunc("trimDecEnd", trimDecEnd);

addRFunc("isInt", isInt, ["real"]);
addRFunc("isDec", isDec, ["real"]);
addRFunc("isNeg", isNeg, ["real"]);
addRFunc("isEven", isEven, ["real"]);
addRFunc("isDivFive", isDivFive, ["real"]);

addRFunc("padZeros", padZeros, ["real", "real"]);
addRFunc("isZero", isZero, ["real", "nprec"]);
addRFunc("isDiffZero", isDiffZero, ["real", "real", "nprec"]);

addRFunc("numToFloat", numToFloat, ["real"]);
addRFunc("floatToNum", floatToNum);

addRFunc("mDotLeft", mDotLeft, ["real", "num"]);
addRFunc("mDotRight", mDotRight, ["real", "num"]);

addRFunc("gt", gt, ["real", "real"]);
addRFunc("lt", lt, ["real", "real"]);
addRFunc("ge", ge, ["real", "real"]);
addRFunc("le", le, ["real", "real"]);

addRFunc("add", addr, ["real", "real", "nprec"]);
addRFunc("sub", subr, ["real", "real", "nprec"]);
addRFunc("mult", multr, ["real", "real", "nprec"]);
addRFunc("div", divr, ["real", "real", "nprec"]);

addRFunc("round", roundr, ["real", "nprec"]);
addRFunc("ceil", ceilr, ["real", "nprec"]);
addRFunc("floor", floorr, ["real", "nprec"]);
addRFunc("trunc", truncr, ["real", "nprec"]);

addRFunc("pow", powr, ["real", "real", "nprec"]);
addRFunc("fact", factr, ["real", "nprec"]);
addRFunc("bin", binr, ["real", "real", "nprec"]);
addRFunc("exp", expr, ["real", "nprec"]);
addRFunc("ln", lnr, ["real", "nprec"]);
addRFunc("sqrt", sqrtr, ["real", "nprec"]);
addRFunc("agm", agmr, ["real", "real", "nprec"]);
addRFunc("sin", sinr, ["real", "nprec"]);
addRFunc("cos", cosr, ["real", "nprec"]);

addRFunc("neg", negr, ["real"]);
addRFunc("abs", absr, ["real"]);

addRFunc("e", er, ["nprec"]);
addRFunc("phi", phir, ["nprec"]);
addRFunc("pi", pir, ["nprec"]);
addRFunc("ln2", ln2r, ["nprec"]);
addRFunc("ln5", ln5r, ["nprec"]);
addRFunc("ln10", ln10r, ["nprec"]);

addRFunc("quotAndRem", quotAndRem, ["real", "real"]);
addRFunc("multRange", multrRange, ["num", "num"]);
addRFunc("genContFrac", genContFrac, ["func", "func", "nprec"]);
addRFunc("simpContFrac", simpContFrac, ["func", "nprec"]);

function makeRObject(){
  var obj = {};
  var name, ref, params;
  for (var i = 0; i < RFuncs.length; i++){
    name = RFuncs[i][0]; ref = RFuncs[i][1]; params = RFuncs[i][2];
    if (params == undefined)obj[name] = ref;
    else obj[name] = makeRProcessor(name, ref, params);
  }
  return obj;
}

function makeRProcessor(name, ref, params){
  return function (){
    var arr = [];
    for (var i = 0; i < params.length; i++){
      if (params[i] == "nprec"){
        if (arguments[i] == undefined)continue;
        arr[i] = prepNum(arguments[i]);
      } else {
        if (arguments[i] == undefined)error("Error: " + name + ": Argument " + (i+1) + " is undefined");
        if (params[i] == "real"){
          arr[i] = prepr(arguments[i]);
        } else if (params[i] == "num"){
          arr[i] = prepNum(arguments[i]);
        } else if (params[i] == "func"){
          arr[i] = arguments[i];
          if (!$.isFunc(arr[i]))error("Error: " + name + ": Argument " + (i+1) + " is not a function");
        } else {
          error("Error: makeRProcessor: Unknown paramater name \"" + params[i] + "\"");
        }
      }
    }
    return ref.apply(this, arr);
  };
}

window.R = makeRObject();

/*function addCFunc(name, ref, args){
  CFuncs.push([name, ref, args]);
}

var CFuncs = [];
addCFunc("num", N);
addCFunc("getA", getA);
addCFunc("getB", getB);

addCFunc("add", add, ["comp", "comp", "nprec"]);
addCFunc("sub", sub, ["comp", "comp", "nprec"]);
addCFunc("mult", mult, ["comp", "comp", "nprec"]);
addCFunc("div", div, ["comp", "comp", "nprec"]);

addCFunc("round", round, ["comp", "nprec"]);
addCFunc("ceil", ceil, ["comp", "nprec"]);
addCFunc("floor", floor, ["comp", "nprec"]);
addCFunc("trunc", trunc, ["comp", "nprec"]);

addCFunc("exp", exp, ["comp", "nprec"]);
addCFunc("ln", ln, ["comp", "nprec"]);
addCFunc("pow", pow, ["comp", "comp", "nprec"]);
addCFunc("root", root, ["real", "comp", "nprec"]);
addCFunc("sqrt", sqrt, ["comp", "nprec"]);
addCFunc("cbrt", cbrt, ["comp", "nprec"]);
addCFunc("fact", fact, ["real", "nprec"]);
addCFunc("bin", bin, ["real", "real", "nprec"]);
addCFunc("agm", agm, ["real", "real", "nprec"]);
addCFunc("sin", sin, ["comp", "nprec"]);
addCFunc("cos", cos, ["comp", "nprec"]);
addCFunc("sinh", sinh, ["comp", "nprec"]);
addCFunc("cosh", cosh, ["comp", "nprec"]);

addCFunc("abs", abs, ["comp", "nprec"]);
addCFunc("arg", arg, ["comp", "nprec"]);
addCFunc("sgn", sgn, ["comp", "nprec"]);
addCFunc("re", re, ["comp"]);
addCFunc("im", im, ["comp"]);
addCFunc("conj", conj, ["comp"]);

addCFunc("pi", pi, ["nprec"]);
addCFunc("e", e, ["nprec"]);
addCFunc("phi", phi, ["nprec"]);
addCFunc("ln2", ln2, ["nprec"]);
addCFunc("ln5", ln5, ["nprec"]);
addCFunc("ln10", ln10, ["nprec"]);

function makeCObject(){
  var obj = {};
  var name, ref, params;
  for (var i = 0; i < CFuncs.length; i++){
    name = CFuncs[i][0]; ref = CFuncs[i][1]; params = CFuncs[i][2];
    if (params == undefined)obj[name] = ref;
    else obj[name] = makeCProcessor(name, ref, params);
  }
  return obj;
}

function makeCProcessor(name, ref, params){
  return function (){
    var arr = [];
    var curr;
    for (var i = 0; i < params.length; i++){
      curr = arguments[i];
      if (curr == undefined){
        if (params[i] == "nprec")continue;
        error("Error: " + name + ": Argument " + (i+1) + " is undefined");
      }
      switch (params[i]){
        case "nprec":
          if (isValid(curr)){
            curr = prep(curr);
            if (getB(curr) != "0")error("Error: " + name + ": nprec cannot be complex");
            if (isDec(getA(curr)))error("Error: " + name + ": nprec must be an integer");
            curr = Number(getA(curr));
          } else {
            curr = String(curr);
            validr(curr);
            if (isDec(curr))error("Error: " + name + ": nprec must be an integer");
            curr = Number(curr);
          }
          break;
        case "comp":
          curr = prep(curr); break;
        case "real":
          curr = prep(curr);
          if (getB(curr) != "0")error("Error: " + name + ": Argument " + (i+1) + " cannot be complex");
          break;
        case "num":
          if (isValid(curr)){
            curr = prep(curr);
            if (getB(curr) != "0")error("Error: " + name + ": Argument " + (i+1) + " cannot be complex");
            curr = Number(getA(curr));
          } else {
            validr(String(curr));
            curr = Number(curr);
          }
        default:
          error("Error: makeCProcessor: Unknown paramater name \"" + params[i] + "\"");
      }
      arr[i] = curr;
    }
    return ref.apply(this, arr);
  };
}

window.C = makeCObject();

function addRFunc(name, ref, args){
  RFuncs.push([name, ref, args]);
}

var RFuncs = [];
addRFunc("isValid", isValidr);
addRFunc("valid", validr);

addRFunc("canon", canonr);
addRFunc("trimNum", trimNum);
addRFunc("trimInt", trimInt);
addRFunc("trimDec", trimDec);
addRFunc("trimDecStart", trimDecStart);
addRFunc("trimDecEnd", trimDecEnd);

addRFunc("isInt", isInt, ["real"]);
addRFunc("isDec", isDec, ["real"]);
addRFunc("isNeg", isNeg, ["real"]);
addRFunc("isEven", isEven, ["real"]);
addRFunc("isDivFive", isDivFive, ["real"]);

addRFunc("padZeros", padZeros, ["real", "real"]);
addRFunc("isZero", isZero, ["real", "nprec"]);
addRFunc("isDiffZero", isDiffZero, ["real", "real", "nprec"]);

addRFunc("numToFloat", numToFloat, ["real"]);
addRFunc("floatToNum", floatToNum);

addRFunc("mDotLeft", mDotLeft, ["real", "num"]);
addRFunc("mDotRight", mDotRight, ["real", "num"]);

addRFunc("gt", gt, ["real", "real"]);
addRFunc("lt", lt, ["real", "real"]);
addRFunc("ge", ge, ["real", "real"]);
addRFunc("le", le, ["real", "real"]);

addRFunc("add", addr, ["real", "real", "nprec"]);
addRFunc("sub", subr, ["real", "real", "nprec"]);
addRFunc("mult", multr, ["real", "real", "nprec"]);
addRFunc("div", divr, ["real", "real", "nprec"]);

addRFunc("round", roundr, ["real", "nprec"]);
addRFunc("ceil", ceilr, ["real", "nprec"]);
addRFunc("floor", floorr, ["real", "nprec"]);
addRFunc("trunc", truncr, ["real", "nprec"]);

addRFunc("pow", powr, ["real", "real", "nprec"]);
addRFunc("fact", factr, ["real", "nprec"]);
addRFunc("bin", binr, ["real", "real", "nprec"]);
addRFunc("exp", expr, ["real", "nprec"]);
addRFunc("ln", lnr, ["real", "nprec"]);
addRFunc("sqrt", sqrtr, ["real", "nprec"]);
addRFunc("agm", agmr, ["real", "real", "nprec"]);
addRFunc("sin", sinr, ["real", "nprec"]);
addRFunc("cos", cosr, ["real", "nprec"]);

addRFunc("neg", negr, ["real"]);
addRFunc("abs", absr, ["real"]);

addRFunc("e", er, ["nprec"]);
addRFunc("phi", phir, ["nprec"]);
addRFunc("pi", pir, ["nprec"]);
addRFunc("ln2", ln2r, ["nprec"]);
addRFunc("ln5", ln5r, ["nprec"]);
addRFunc("ln10", ln10r, ["nprec"]);

addRFunc("quotAndRem", quotAndRem, ["real", "real"]);
addRFunc("multRange", multrRange, ["num", "num"]);
addRFunc("genContFrac", genContFrac, ["func", "func", "nprec"]);
addRFunc("simpContFrac", simpContFrac, ["func", "nprec"]);

function makeRObject(){
  var obj = {};
  var name, ref, params;
  for (var i = 0; i < RFuncs.length; i++){
    name = RFuncs[i][0]; ref = RFuncs[i][1]; params = RFuncs[i][2];
    if (params == undefined)obj[name] = ref;
    else obj[name] = makeRProcessor(name, ref, params);
  }
  return obj;
}

function makeRProcessor(name, ref, params){
  return function (){
    var arr = [];
    for (var i = 0; i < params.length; i++){
      if (params[i] == "nprec"){
        if (arguments[i] == undefined)continue;
        arr[i] = prepNum(arguments[i]);
      } else {
        if (arguments[i] == undefined)error("Error: " + name + ": Argument " + (i+1) + " is undefined");
        if (params[i] == "real"){
          arr[i] = prepr(arguments[i]);
        } else if (params[i] == "num"){
          arr[i] = prepNum(arguments[i]);
        } else if (params[i] == "func"){
          arr[i] = arguments[i];
          if (!$.isFunc(arr[i]))error("Error: " + name + ": Argument " + (i+1) + " is not a function");
        } else {
          error("Error: makeRProcessor: Unknown paramater name \"" + params[i] + "\"");
        }
      }
    }
    return ref.apply(this, arr);
  };
}

window.R = makeRObject();*/

/*
  if (param == "nprec"){
    return prepNum(arg);
  } else {
    if (arg == undefined)error("Error: " + name + ": Argument " + argnum + " is undefined");
    if (param == "real"){
      return prepr(arg);
    } else if (param == "num"){
      return prepNum(arg);
    } else if (param == "func"){
      if (!$.isFunc(arg))error("Error: " + name + ": Argument " + argnum + " is not a function");
      return arg;
    } else {
      error("Error: process: Unknown paramater name \"" + param + "\"");
    }
  }
}*/

// return genContFrac(a, function (n){return "-1";}, nprec);
simpNegContFrac.lastNums = [0, "0", "1"]; // [n, pn, qn]
function simpNegContFrac(a, nprec){
  if (nprec == undefined)nprec = prec;
  
  var p0 = "1";
  var q0 = "0";
  var p1 = a(0);
  if (p1 === null){
    simpNegContFrac.lastNums = [0, "0", "1"];
    return "0";
  }
  var q1 = "1";
  var pn = p1, qn = q1;
  var an;
  for (var n = 1; true; n++){
    an = a(n);
    if (an == null){n--; break;}
    pn = subr(multr(an, p1), p0);
    qn = subr(multr(an, q1), q0);
    if (qn == "0")error("Error: simpNegContFrac(a, b, nprec): qn can never equal 0");
    if (2*nlen(qn)-2 >= nprec)break;
    p0 = p1; q0 = q1;
    p1 = pn; q1 = qn;
  }
  simpNegContFrac.lastNums = [n, pn, qn];
  
  return divr(pn, qn, nprec);
}

// @param Number function (Number) a
// @param Number function (Number) b
// for use in cont-frac
genContFracNums.lastNums = [0, "0", "1"]; // [n, pn, qn]
function genContFracNums(a, b, nprec){
  if (nprec == undefined)nprec = prec;
  
  var p0 = "1";
  var q0 = "0";
  var p1 = String(a(0));
  if (p1 == "null"){
    genContFracNums.lastNums = [0, "0", "1"];
    return "0";
  }
  var q1 = "1";
  var pn = p1, qn = q1;
  var an, bn;
  var bn1 = String(b(1));
  if (bn1 == "null"){
    genContFracNums.lastNums = [0, p1, q1];
    return p1;
  }
  var prod = bn1;
  for (var n = 1; true; n++){
    an = String(a(n)); bn = bn1;
    if (an == "null" || bn == "null"){n--; break;}
    bn1 = String(b(n+1));
    if (bn1 != "null")prod = multr(prod, bn1);
    pn = addr(multr(an, p1), multr(bn, p0));
    qn = addr(multr(an, q1), multr(bn, q0));
    if (qn == "0")error("Error: genContFracNums(a, b, nprec): qn can never equal 0");
    if (2*nlen(qn)-len(prod)-2 >= nprec)break;
    p0 = p1; q0 = q1;
    p1 = pn; q1 = qn;
  }
  genContFracNums.lastNums = [n, pn, qn];
  
  return divr(pn, qn, nprec);
}

// prime sieve with strings
function primeSieve2(n){
  var nums = [];
  var sqrtn = isqrtr(n);
  for (var i = "2"; le(i, sqrtn); i = addOne(i)){
    if (nums[i] == undefined){
      for (var j = multr(i, i); le(j, n); j = addr(j, i)){
        nums[j] = false;
      }
    }
  }
  var primes = [];
  for (var i = "2"; le(i, n); i = addOne(i)){
    if (nums[i] == undefined)primes.push(i);
  }
  return primes;
}

// recursive frac
function frac(a, b, p){
  if (p === undef)p = prec;
  if (p == -Infinity)return "0";
  
  function finfrac(n, p1, q1){
    frac.nums = [n, p1, q1];
    return divr(p1, q1, p);
  }
  
  function frac2(n, bn, p1, p0, q1, q0, prod){
    if (q1 == "0")err(frac, "q1 can never equal 0");
    if (2*nlen(q1)-len(prod)-2 >= p)return finfrac(n-1, p1, q1);
    var an = a(n);
    if ($.inp(null, an, bn))return finfrac(n-1, p1, q1);
    var bn1 = b(n+1);
    return frac2(n+1, bn1, addr(multr(an, p1), multr(bn, p0)), p1,
                           addr(multr(an, q1), multr(bn, q0)), q1,
                           (bn1 !== null)?multr(prod, bn1):bn1);
  }
  
  var a0 = a(0);
  if (a0 === null)return finfrac(0, "0", "1");
  var b1 = b(1);
  if (b1 === null)return finfrac(0, a0, "1");
  return frac2(1, b1, a0, "1", "1", "0", b1);
}

function fracOld(a, b, p){
  if (p === undef)p = prec;
  if (p == -Infinity)return "0";
  
  var p0 = "1";
  var q0 = "0";
  var p1 = a(0);
  if (p1 === null){
    frac.nums = [0, "0", "1"];
    return "0";
  }
  var q1 = "1";
  var pn = p1, qn = q1;
  var an, bn;
  var bn1 = b(1);
  if (bn1 === null){
    frac.nums = [0, p1, q1];
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
    if (qn == "0")err(frac, "qn can never equal 0");
    if (2*nlen(qn)-len(prod)-2 >= p)break;
    p0 = p1; q0 = q1;
    p1 = pn; q1 = qn;
  }
  frac.nums = [n, pn, qn];
  
  return divr(pn, qn, p);
}

function sfrac(a, p){
  if (p === undef)p = prec;
  if (p == -Infinity)return "0";
  
  function finfrac(n, p1, q1){
    sfrac.nums = [n, p1, q1];
    return divr(p1, q1, p);
  }
  
  function frac2(n, p1, p0, q1, q0){
    if (q1 == "0")err(sfrac, "q1 can never equal 0");
    if (2*nlen(q1)-2 >= p)return finfrac(n-1, p1, q1);
    var an = a(n);
    if (an === null)return finfrac(n-1, p1, q1);
    return frac2(n+1, addr(multr(an, p1), p0), p1,
                      addr(multr(an, q1), q0), q1);
  }
  
  var a0 = a(0);
  if (a0 === null)return finfrac(0, "0", "1");
  return frac2(1, a0, "1", "1", "0");
}

function sfracOld(a, p){
  if (p === undef)p = prec;
  if (p == -Infinity)return "0";
  
  var p0 = "1";
  var q0 = "0";
  var p1 = a(0);
  if (p1 === null){
    sfrac.nums = [0, "0", "1"];
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
    if (qn == "0")err(sfrac, "qn can never equal 0");
    if (2*nlen(qn)-2 >= p)break;
    p0 = p1; q0 = q1;
    p1 = pn; q1 = qn;
  }
  sfrac.nums = [n, pn, qn];
  
  return divr(pn, qn, p);
}

function quotAndRem(a, b){
  if (b == "0")err(quotAndRem, "b cannot be 0");
  if (a == "0")return ["0", "0"];
  
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

function sin2(a, p){
  if (udefp(p))p = prec;
  if (p == -inf)return "0";
  
  var sign = false;
  if (negp(a)){
    a = abs(a);
    sign = !sign;
  }
  
  var intPart = Math.floor(num(a))/3;
  if (intPart < 1)intPart = 1;
  var dec = declen(a);
  if (dec <= 1)dec += 1;
  if (intPart*dec <= 75){
    var sin = sinFrac(a, p);
    return sign?neg(sin):sin;
  }
  
  var pii = pi(p+3+siz(a));
  var tpi = mul("2", pii); // 2*pii
  a = qar(a, tpi)[1];
  
  var hpi = div(pii, "2", p+2); // pii/2
  if (gt(a, hpi)){
    a = sub(a, pii);
    sign = !sign;
  }
  
  if (negp(a)){
    a = abs(a);
    sign = !sign;
  }
  
  var sn;
  var qpi = div(hpi, "2", p+2); // pi/4
  if (gt(a, qpi)){
    a = sub(a, hpi);
    sn = cosTerms(a, p);
  } else {
    sn = sinTerms(a, p);
  }
  
  return sign?neg(sn):sn;
}

function sin3(a, p){
  if (udefp(p))p = prec;
  if (p == -inf)return "0";
  
  var sign = false;
  if (negp(a)){
    a = abs(a);
    sign = !sign;
  }
  
  var pii = pi(p+3+siz(a));
  var tpi = mul("2", pii); // 2*pii
  a = qar(a, tpi)[1];
  
  if (gt(a, pii)){
    a = sub(a, pii);
    sign = !sign;
  }
  
  var hpi = div(pii, "2", p+2); // pii/2
  if (gt(a, hpi)){
    a = sub(pii, a);
  }
  
  var sn = "4";
  var qpi = div(hpi, "2", p+2); // pi/4
  if (gt(a, qpi)){
    a = sub(a, hpi);
    //sn = cosTerms(a, p);
  } else {
    //sn = sinTerms(a, p);
  }
  
  return sign?neg(sn):sn;
}

function sin5(a, p){
  if (udefp(p))p = prec;
  if (p == -inf)return "0";
  
  var sign = false;
  if (negp(a)){
    a = abs(a);
    sign = !sign;
  }
  
  var pii = pi(p+3+siz(a));
  var tpi = mul("2", pii); // 2*pii
  a = qar(a, tpi)[1];
  
  var hpi = div(pii, "2", p+2); // pii/2
  var arr = qar(a, hpi);
  a = arr[1];
  var nhpi = num(arr[0]);
  
  var qpi = div(hpi, "2", p+2); // pi/4
  if (gt(a, qpi)){
    a = sub(a, hpi);
    nhpi++;
  }
  
  var sn = "4";
  switch (nhpi){
    case 0:
      //sn = sinTerms(a, p);
      break;
    case 1:
      //sn = cosTerms(a, p);
      break;
    case 2:
      //sn = sinTerms(a, p);
      sign = !sign;
      break;
    case 3:
      //sn = cosTerms(a, p);
      sign = !sign;
      break;
  }
  
  return sign?neg(sn):sn;
}

function pad(a, b){
  var arr, aint, adec, bint, bdec;
  arr = intdec(a);
  aint = arr[0]; adec = arr[1];
  arr = intdec(b);
  bint = arr[0]; bdec = arr[1];
  
  a = nof("0", bint-aint) + a;
  b = nof("0", aint-bint) + b;
  
  if (adec == 0 && bdec != 0)a += ".";
  else if (bdec == 0)b += ".";
  a += nof("0", bdec-adec);
  b += nof("0", adec-bdec);
  
  return [a, b];
}

function pad(a, b){
  // list(aint, adec) = intdec(a)
  var dot, aint, adec, bint, bdec;
  dot = pos(".", a);
  if (dot == -1){aint = len(a); adec = 0;}
  else {aint = dot; adec = len(a)-1-dot;}
  dot = pos(".", b);
  if (dot == -1){bint = len(b); bdec = 0;}
  else {bint = dot; bdec = len(b)-1-dot;}
  
  a = nof("0", bint-aint) + a;
  b = nof("0", aint-bint) + b;
  
  if (adec == 0){
    if (bdec != 0)a += ".";
  } else if (bdec == 0)b += ".";
  a += nof("0", bdec-adec);
  b += nof("0", adec-bdec);
  
  return [a, b];
}


