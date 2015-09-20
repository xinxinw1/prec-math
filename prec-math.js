/***** Perfectly Precise Math Library 5.0.0 *****/

/* require tools 4.1.5 */

(function (udf){
  ////// Import //////
  
  var nodep = $.nodep;
  var inf = Infinity;
  var num = Number;
  var str = String;
  
  var len = $.len_;
  var sli = $.sliStr;
  
  var err = $.err;
  
  ////// Real number functions //////
  
  //// Converters ////
  
  // real("35.35") -> N(false, "3535", -2)
  // real(35.35)
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
  
  //// Builders ////
  
  // N(true, "153453", -3) -> -153.453
  function N(neg, dat, exp){
    return {type: "num", neg: neg, exp: exp, data: dat};
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
  
  
  ////// R object exposure //////
  
  var R = {
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
