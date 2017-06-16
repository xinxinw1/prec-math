QUnit.test('Converters', function (assert){
  assert.true(R.zerop(R.zero()));
  assert.false(R.zerop(R.one()));
  
  assert.iso(R.numToArr(123), [1, 2, 3]);
  assert.iso(R.numToArr(-52310), [5, 2, 3, 1, 0]);
  
  assert.same(R.arrToNum([1, 2, 3]), 123);
  assert.same(R.arrToNum([5, 2, 3, 1, 0]), 52310);
  assert.same(R.arrToNum([]), 0);
  assert.same(R.arrToNum([1]), 1);
  
  assert.same(R.arrSecToNum([1, 2, 3, 6, 5, 0, 2, 1, 5, 0, 2], 0, 3), 123);
  assert.same(R.arrSecToNum([1, 2, 3, 6, 5, 0, 2, 1, 5, 0, 2], 3, 6), 650);
  assert.same(R.arrSecToNum([1, 2, 3, 6, 5, 0, 2, 1, 5, 0, 2], 5, 8), 21);
  
  assert.iso(R.arrGetSec([1, 2, 3, 6, 5, 0, 2, 1, 5, 0, 2], 0, 3), [1, 2, 3]);
  assert.iso(R.arrGetSec([1, 2, 3, 6, 5, 0, 2, 1, 5, 0, 2], 3, 6), [6, 5, 0]);
  assert.iso(R.arrGetSec([1, 2, 3, 6, 5, 0, 2, 1, 5, 0, 2], 5, 8), [2, 1]);
  assert.iso(R.arrGetSec([1, 0, 0, 0], 1, 4), []);
  
  assert.iso(R.strToArr("123"), [1, 2, 3]);
  assert.iso(R.strToArr("-2343.2053"), [2, 3, 4, 3, 2, 0, 5, 3]);
  assert.iso(R.strToArr("0"), [0]);
  assert.iso(R.strToArr("-000"), [0, 0, 0]);
  
  assert.same(R.arrToStr([1, 2, 3]), "123");
  assert.same(R.arrToStr([0, 1, 2, 0]), "0120");
  assert.same(R.arrToStr([]), "");
  
  assert.teststr(R.num(true, [2, 5, 3, 4], 3), "-2534000");
  assert.teststr(R.num(false, [1, 2, 3, 4, 3, 5], -3), "123.435");
  assert.teststr(R.num(false, [1, 2, 3, 4, 3, 5], -10), "0.0000123435");
  assert.teststr(R.num(true, [1, 2, 3, 4, 3, 5], -10), "-0.0000123435");
  assert.teststr(R.num(false, [], 0), "0");
  
  assert.testnum(R.trimr(R.num(true, [0, 0, 1, 5, 0, 0], 1)),
    true, [0, 0, 1, 5], 3);
  assert.testnum(R.trimr(R.num(true, [0, 0], 1)),
    false, [], 0);
  assert.testnum(R.triml(R.num(true, [0, 0, 1, 5, 0, 0], 1)), 
    true, [1, 5, 0, 0], 1);
  
  assert.testnum(R.mknum("35.35"), false, [3, 5, 3, 5], -2);
  assert.testnum(R.mknum("0.0001"), false, [1], -4);
  assert.testnum(R.mknum("-0.0001"), true, [1], -4);
  assert.testnum(R.mknum("0.000012"), false, [1, 2], -6);
  assert.testnum(R.mknum("-352534000"), true, [3, 5, 2, 5, 3, 4], 3);
  assert.testnum(R.mknum(""), false, [], 0);
  assert.testnum(R.mknum("0"), false, [], 0);
  assert.testnum(R.mknum("10000"), false, [1], 4);
  
  assert.testnum(R.mknumnull("325"), false, [3, 2, 5], 0);
  assert.same(R.mknumnull(null), null);
  
  assert.testnum(R.mknumint(1), false, [1], 0);
  assert.testnum(R.mknumint(0), false, [], 0);
  assert.testnum(R.mknumint(-1), true, [1], 0);
  assert.testnum(R.mknumint(9007199254740991), false, [9,0,0,7,1,9,9,2,5,4,7,4,0,9,9,1], 0);
  
  
  assert.testnum(R.real(23.53), false, [2,3,5,3], -2);
  assert.testnum(R.real(-23.53), true, [2,3,5,3], -2);
  assert.testnum(R.real(0.0001), false, [1], -4);
  assert.testnum(R.real("35.35"), false, [3,5,3,5], -2);
  assert.testnum(R.real(R.num(false, [3,5], 2)), false, [3,5], 2);
  assert.testnum(R.real("000.000340000"), false, [3,4], -5);
  assert.testnum(R.real(0), false, [], 0);
  assert.testnum(R.real("0"), false, [], 0);
  assert.testnum(R.real(0), false, [], 0);
  assert.testnum(R.real("-0"), false, [], 0);
  assert.testnum(R.real("0000"), false, [], 0);
  assert.testnum(R.real("0000.0000"), false, [], 0);
  assert.testnum(R.real("-0000.0000"), false, [], 0);
  assert.same(R.real(), false);
  assert.same(R.real(""), false);
  assert.same(R.real(".2343"), false);
  assert.same(R.real("aseewf"), false);
  assert.same(R.real("3..3532"), false);
  assert.same(R.real("--23432"), false);
  assert.same(R.real(true), false);
  
  assert.same(R.realint(23.53), false, 'testing realint');
  assert.same(R.realint(-23.53), false);
  assert.same(R.realint(0.0001), false);
  assert.same(R.realint("35.35"), false);
  assert.same(R.realint(253), 253);
  assert.same(R.realint("153"), 153);
  assert.same(R.realint(R.num(false, [3,5], 2)), 3500);
  assert.same(R.realint(R.num(false, [3,5], -2)), false);
  assert.same(R.realint(".2343"), false);
  assert.same(R.realint("aseewf"), false);
  assert.same(R.realint("3..3532"), false);
  assert.same(R.realint("--23432"), false);
  assert.same(R.realint(true), false);
  assert.same(R.realint(0), 0);
  assert.same(R.realint("0"), 0);
  assert.same(R.realint(0), 0);
  assert.same(R.realint("-0"), 0);
  assert.same(R.realint(), false);
  assert.same(R.realint(""), false);
  assert.same(R.realint(R.num(false, [], 0)), 0);
});

QUnit.assert.testarr = function (a, a1, a2){
  this.teststr(a[0], a1);
  this.teststr(a[1], a2);
};

QUnit.test('Int functions', function (assert){
  assert.iso(R.mergeBase([2, 53, 6, 40], 2), [2, 5, 3, 0, 6, 4, 0]);
  assert.iso(R.mergeBase([2], 2), [2]);
  assert.iso(R.mergeBase([12, 53, 6, 40], 2), [1, 2, 5, 3, 0, 6, 4, 0]);
  assert.iso(R.mergeBase([1, 0, 2], 2), [1, 0, 0, 0, 2]);
    
  assert.same(R.gtInt([1,0], [1,0]), false);
  assert.same(R.gtInt([1,1], [1,0]), true);
  
  assert.same(R.gtIntFrontAlign([1,0], [1,0]), false);
  assert.same(R.gtIntFrontAlign([1,1], [1,0]), true);
  assert.same(R.gtIntFrontAlign([2,3,6], [2,3,6,2]), false);
  assert.same(R.gtIntFrontAlign([2,3,6,2], [2,3,6]), true);
  
  assert.iso(R.addInt([5], [5]), [1,0]);
  assert.iso(R.addInt([4,3], [2,5,3,4,3]), [2,5,3,8,6]);
  assert.iso(R.addInt([2,5,7,3,2,8,4,2], [2]), [2,5,7,3,2,8,4,4]);
  
  assert.iso(R.addIntBase([2, 53, 6, 40], [4, 23, 5, 61], 100), [6, 76, 12, 1]);
  
  assert.iso(R.add1Int([1]), [2]);
  assert.iso(R.add1Int([9]), [1, 0]);
  assert.iso(R.add1Int([]), [1]);
  assert.iso(R.add1Int([9, 9, 9]), [1, 0, 0, 0]);
  assert.iso(R.add1Int([1, 9]), [2, 0]);
  
  assert.iso(R.subInt([5], [5]), []);
  assert.throws(function (){
    R.subInt([4,3], [2,5,3,4,3]);
  });
  assert.iso(R.subInt([2,5,7,3,2,8,4,2], [2]), [2,5,7,3,2,8,4,0]);
  assert.iso(R.subInt([4,5,3], [4,0,3]), [5,0]);
  
  assert.iso(R.mulLongBase10([1, 2], [3, 4]), [4, 0, 8]);
  assert.iso(R.mulLongBase10([1,5,2,5,2,6,3,2,1], [5,2,3]), [7,9,7,7,1,2,6,5,8,8,3]);
  assert.iso(R.mulLongBase10(R.strToArr("152526321062632617230"), R.strToArr("523520362435253")),
    R.strToArr("79850634883625191266731071807209190"));
  assert.iso(R.mulLongBase10(R.strToArr("9999999"), R.strToArr("9999999")),
    R.strToArr("99999980000001"));
  assert.iso(R.mulLongBase10(R.strToArr("99999990000000"), R.strToArr("99999990000000")),
    R.strToArr("9999998000000100000000000000"));
  
  assert.iso(R.mulLongBase107([1, 2], [3, 4]), [4, 0, 8]);
  assert.iso(R.mulLongBase107([1,5,2,5,2,6,3,2,1], [5,2,3]), [7,9,7,7,1,2,6,5,8,8,3]);
  assert.iso(R.mulLongBase107(R.strToArr("152526321062632617230"), R.strToArr("523520362435253")),
    R.strToArr("79850634883625191266731071807209190"));
  assert.iso(R.mulLongBase107(R.strToArr("9999999"), R.strToArr("9999999")),
    R.strToArr("99999980000001"));
  assert.iso(R.mulLongBase107(R.strToArr("99999990000000"), R.strToArr("99999990000000")),
    R.strToArr("9999998000000100000000000000"));
  
  assert.iso(R.mulKarat([1, 2], [3, 4]), [4, 0, 8]);
  assert.iso(R.mulKarat([1,5,2,5,2,6,3,2,1], [5,2,3]), [7,9,7,7,1,2,6,5,8,8,3]);
  assert.iso(R.mulKarat(R.strToArr("152526321062632617230"), R.strToArr("523520362435253")),
    R.strToArr("79850634883625191266731071807209190"));
  assert.iso(R.mulKarat(R.strToArr("9999999"), R.strToArr("9999999")),
    R.strToArr("99999980000001"));
  assert.iso(R.mulKarat(R.strToArr("99999990000000"), R.strToArr("99999990000000")),
    R.strToArr("9999998000000100000000000000"));
  assert.iso(R.mulKarat(R.strToArr("152526321062632617230"), R.strToArr("523520362435253")),
    R.strToArr("79850634883625191266731071807209190"));
  assert.iso(R.mulKarat(R.strToArr("152526321025353253"), R.strToArr("152526321025353253")),
    R.strToArr("23264278605529117811587213437682009"));
  
  var b = [5];
  var table = [[], b];
  assert.same(R.numTimesInto([1,5], b, table), 3);
  assert.same(R.numTimesInto([1,6], b, table), 3);
  assert.same(R.numTimesInto([1,4], b, table), 2);
  assert.same(R.numTimesInto([], b, table), 0);
  assert.same(R.numTimesInto([1], b, table), 0);
  assert.same(R.numTimesInto([5,0], b, table), 10);
  
  
  assert.testnum(R.divIntTrn([1], [3], 1), false, [3], -1);
  assert.testnum(R.divIntTrn([2], [3], 3), false, R.strToArr("666"), -3);
  assert.testnum(R.divIntTrn(R.strToArr("1234567"), [3], -3), false, R.strToArr("411"), 3);
  assert.teststr(R.divIntTrn(R.strToArr("1257328472933423523"), R.strToArr("63728579374218789798791"), 105), "0.000019729428857189810126491053645823100254222352609472729567398606981182936643587722121762339434204341034");
  assert.testnum(R.divIntTrn(R.strToArr("1"), R.strToArr("12348534")), false, R.strToArr("809812727"), -16);
  
  assert.leveliso(R.qarInt([1], [2]), [[], [1]], 2);
  assert.leveliso(R.qarInt([2], [2]), [[1], []], 2);
  
});

QUnit.test('Predicates', function (assert){
  assert.true(R.evenp(R.mknum("0")));
  assert.false(R.evenp(R.mknum("1")));
  assert.false(R.evenp(R.mknum("-1")));
  assert.true(R.evenp(R.mknum("2")));
  assert.true(R.evenp(R.mknum("40")));
  assert.false(R.evenp(R.mknum("25")));
  
  assert.false(R.oddp(R.mknum("0")));
  assert.true(R.oddp(R.mknum("1")));
  assert.true(R.oddp(R.mknum("-1")));
  assert.false(R.oddp(R.mknum("2")));
  assert.false(R.oddp(R.mknum("40")));
  assert.true(R.oddp(R.mknum("25")));
  
  assert.true(R.div5p(R.mknum("0")));
  assert.false(R.div5p(R.mknum("1")));
  assert.false(R.div5p(R.mknum("-1")));
  assert.true(R.div5p(R.mknum("5")));
  assert.true(R.div5p(R.mknum("40")));
  assert.true(R.div5p(R.mknum("25")));
  assert.true(R.div5p(R.mknum("-5")));
});
  

QUnit.test('Processing functions', function (assert){
  
  assert.same(R.cntr("0", "0000"), 4);
  assert.same(R.cntr("0", "10000"), 4);
  assert.same(R.cntr("0", ""), 0);
  assert.same(R.cntr("1", "0000"), 0);
  assert.same(R.cntl("0", "0000"), 4);
  assert.same(R.cntl("0", "00001"), 4);
  assert.same(R.cntl("0", ""), 0);
  assert.same(R.cntl("1", "0000"), 0);
  
  assert.testnum(R.left(R.num(false, [1,5], 0), 3), false, [1,5], -3);
  assert.testnum(R.left(R.num(false, [], 0), 3), false, [], 0);
  assert.testnum(R.right(R.num(false, [1,5], 0), 3), false, [1,5], 3);
  assert.testnum(R.right(R.num(false, [], 0), 3), false, [], 0);
  
  assert.testnum(R.matexp(R.num(true, [2,3], 3), R.num(false, [1], 5))[0], true, [2,3], 3);
  assert.testnum(R.matexp(R.num(true, [2,3], 3), R.num(false, [1], 5))[1], false, [1,0,0], 3);
  assert.testnum(R.matexp(R.num(false, [], 0), R.num(false, [2,3], 3))[0], false, [], 0);
  assert.testnum(R.matexp(R.num(false, [], 0), R.num(false, [2,3], 3))[1], false, [2,3,0,0,0], 0);
  assert.testnum(R.matexp(R.num(false, [], 0), R.num(false, [2,3], -3))[0], false, [], -3);
  assert.testnum(R.matexp(R.num(false, [], 0), R.num(false, [2,3], -3))[1], false, [2,3], -3);
  
  assert.same(R.siz(R.mknum("2534235")), 7);
  assert.same(R.siz(R.mknum("-100000")), 6);
  assert.same(R.siz(R.mknum("1")), 1);
  assert.same(R.siz(R.mknum("-0.1")), 0);
  assert.same(R.siz(R.mknum("0.01")), -1);
  assert.same(R.siz(R.mknum("0")), -Infinity);
  
  assert.same(R.fig(R.mknum("23432500")), 6);
  assert.same(R.fig(R.mknum("0.0001")), 1);
  assert.same(R.fig(R.mknum("100000")), 1);
  assert.same(R.fig(R.mknum("0")), 0);
  
  assert.testnum(R.chke(1928375932743297520384903285129038401328501), false, R.strToArr("19283759327432977"), 26);
  assert.testnum(R.chke(Infinity), false, R.strToArr("17976931348623157"), 292);
  
  assert.same(R.byzero(R.mknum("0.5")), false);
  assert.same(R.byzero(R.mknum("0.4999")), true);
  assert.same(R.byzero(R.mknum("0.00001"), 4), true);
  assert.same(R.byzero(R.mknum("0.00001"), 5), false);
  assert.same(R.byzero(R.mknum("2.32232"), 3), false);
});

QUnit.test('hash', function (assert){
  var num = R.mknum("18.238571293471295128461283561283461295719273412907352371");
  function a(p){
    return R.rnd(num, p);
  }
  var h = {};
  assert.teststr(R.hashp(a, 2, h), "18.24");
  assert.same(h.p, 2);
  assert.teststr(h.dat, "18.24");
  assert.teststr(R.hashp(a, 5, h), "18.23857");
  assert.same(h.p, 5);
  assert.teststr(h.dat, "18.23857");
  assert.teststr(R.hashp(a, 4, h), "18.2386");
  assert.same(h.p, 6);
  assert.teststr(h.dat, "18.238571");
  assert.teststr(R.hashp(a, 4, h), "18.2386");
  assert.same(h.p, 6);
  assert.teststr(h.dat, "18.238571");
  
  function bResume(p, o){
    if ($.udfp(o))o = {dat: R.mknum("0.4"), last: R.mknum("0.4")};
    while (R.declen(o.dat) < p){
      o.last = R.left(o.last, 1);
      o.dat = R.add(o.dat, o.last);
    }
    return o;
  }
  var mem = {};
  assert.teststr(R.hashr(bResume, 2, mem), "0.44");
  assert.same(mem.h.p, 2);
  assert.teststr(mem.h.dat, "0.44");
  assert.teststr(mem.o.dat, "0.44");
  assert.teststr(mem.o.last, "0.04");
  assert.teststr(R.hashr(bResume, 5, mem), "0.44444");
  assert.same(mem.h.p, 5);
  assert.teststr(mem.h.dat, "0.44444");
  assert.teststr(mem.o.dat, "0.44444");
  assert.teststr(mem.o.last, "0.00004");
  assert.teststr(R.hashr(bResume, 2, mem), "0.44");
  assert.same(mem.h.p, 5);
  assert.teststr(mem.h.dat, "0.44444");
  assert.teststr(mem.o.dat, "0.44444");
  assert.teststr(mem.o.last, "0.00004");
  
  function mkcResume(a){
    var start = R.left(a, 1);
    return function (p, o){
      if ($.udfp(o))o = {dat: start, last: start};
      while (R.declen(o.dat) < p){
        o.last = R.left(o.last, 1);
        o.dat = R.add(o.dat, o.last);
      }
      return o;
    };
  }
  var mem = {};
  assert.teststr(R.hasha(mkcResume, R.mknum("1"), 2, mem), "0.11");
  assert.teststr(R.hasha(mkcResume, R.mknum("2"), 2, mem), "0.22");
  assert.teststr(R.hasha(mkcResume, R.mknum("1"), 5, mem), "0.11111");
  assert.teststr(R.hasha(mkcResume, R.mknum("1"), 2, mem), "0.11");
  assert.teststr(R.hasha(mkcResume, R.mknum("2"), 5, mem), "0.22222");
  assert.teststr(R.hasha(mkcResume, R.mknum("2"), 4, mem), "0.2222");
  
  
  
  mem = {
    type: "hashp",
    p: 3,
    dat: R.mknum("2.435")
  };
  assert.true(R.mergehashp(mem, {
    type: "hashp",
    p: 5,
    dat: R.mknum("2.43523")
  }));
  assert.same(mem.p, 5);
  assert.teststr(mem.dat, "2.43523");
  
  assert.false(R.mergehashp(mem, {
    type: "hashp",
    p: 4,
    dat: R.mknum("2.4352")
  }));
  assert.same(mem.p, 5);
  assert.teststr(mem.dat, "2.43523");
  
  
  
  mem = {
    type: "hashr",
    o: {what: "yo"},
    h: {
      p: 3,
      dat: R.mknum("2.435")
    }
  };
  assert.true(R.mergehashr(mem, {
    type: "hashr",
    o: {what: "whoa"},
    h: {
      p: 5,
      dat: R.mknum("2.43523")
    }
  }));
  assert.same(mem.o.what, "whoa");
  assert.same(mem.h.p, 5);
  assert.teststr(mem.h.dat, "2.43523");
  
  assert.false(R.mergehashr(mem, {
    type: "hashr",
    o: {what: "yay"},
    h: {
      p: 2,
      dat: R.mknum("2.44")
    }
  }));
  assert.same(mem.o.what, "whoa");
  assert.same(mem.h.p, 5);
  assert.teststr(mem.h.dat, "2.43523");
  
  
  mem = {
    type: "hasha",
    "1|2|3": {
      o: {what: "yo"},
      h: {
        p: 3,
        dat: R.mknum("2.435")
      }
    }
  };
  assert.true(R.mergehasha(mem, {
    type: "hasha",
    "1|2|3": {
      o: {what: "whoa"},
      h: {
        p: 5,
        dat: R.mknum("2.43523")
      }
    }
  }));
  assert.same(mem["1|2|3"].o.what, "whoa");
  assert.same(mem["1|2|3"].h.p, 5);
  assert.teststr(mem["1|2|3"].h.dat, "2.43523");
  
  assert.true(R.mergehasha(mem, {
    type: "hasha",
    "1|2|3": {
      o: {what: "whoa"},
      h: {
        p: 2,
        dat: R.mknum("2.43")
      }
    },
    "2|3|4": {
      o: {what: "whoa"},
      h: {
        p: 5,
        dat: R.mknum("2.43523")
      }
    }
  }));
  assert.same(mem["1|2|3"].o.what, "whoa");
  assert.same(mem["1|2|3"].h.p, 5);
  assert.teststr(mem["1|2|3"].h.dat, "2.43523");
  assert.same(mem["2|3|4"].o.what, "whoa");
  assert.same(mem["2|3|4"].h.p, 5);
  assert.teststr(mem["2|3|4"].h.dat, "2.43523");
  
  assert.false(R.mergehasha(mem, {
    type: "hasha",
    "1|2|3": {
      o: {what: "whoa"},
      h: {
        p: 2,
        dat: R.mknum("2.43")
      }
    }
  }));
  assert.same(mem["1|2|3"].o.what, "whoa");
  assert.same(mem["1|2|3"].h.p, 5);
  assert.teststr(mem["1|2|3"].h.dat, "2.43523");
  assert.same(mem["2|3|4"].o.what, "whoa");
  assert.same(mem["2|3|4"].h.p, 5);
  assert.teststr(mem["2|3|4"].h.dat, "2.43523");
  
});

QUnit.test('Comparison functions', function (assert){
  assert.same(R.gt(R.mknum("1"), R.mknum("4")), false);
  assert.same(R.gt(R.mknum("30"), R.mknum("4")), true);
  assert.same(R.gt(R.mknum("30"), R.mknum("40")), false);
  assert.same(R.gt(R.mknum("-1"), R.mknum("4")), false);
  assert.same(R.gt(R.mknum("-1"), R.mknum("-2")), true);
  assert.same(R.gt(R.mknum("-10"), R.mknum("10")), false);
});

QUnit.test('Rounding functions', function (assert){
  assert.teststr(R.rnd(R.mknum("1253.3535"), 1), "1253.4");
  assert.teststr(R.rnd(R.mknum("1253.3535"), 2), "1253.35");
  assert.teststr(R.rnd(R.mknum("-1253.3535"), 2), "-1253.35");
  assert.teststr(R.rnd(R.mknum("-1253.3535"), 10), "-1253.3535");
  assert.teststr(R.rnd(R.mknum("-1253.3535"), -2), "-1300");
  assert.teststr(R.rnd(R.mknum("1253.3535"), -4), "0");
  assert.teststr(R.rnd(R.mknum("-9999.535248923")), "-10000");
  assert.teststr(R.rnd(R.mknum("-0.09")), "0");
  assert.teststr(R.rnd(R.mknum("0.09")), "0");
  
  assert.teststr(R.cei(R.mknum("1253.3535"), 1), "1253.4");
  assert.teststr(R.cei(R.mknum("1253.3535"), 2), "1253.36");
  assert.teststr(R.cei(R.mknum("-1253.3535"), 2), "-1253.35");
  assert.teststr(R.cei(R.mknum("-1253.3535"), 10), "-1253.3535");
  assert.teststr(R.cei(R.mknum("-1253.3535"), -2), "-1200");
  assert.teststr(R.cei(R.mknum("1253.3535"), -4), "10000");
  assert.teststr(R.cei(R.mknum("-9999.535248923")), "-9999");
  assert.teststr(R.cei(R.mknum("-0.09")), "0");
  assert.teststr(R.cei(R.mknum("0.09")), "1");
  
  assert.teststr(R.flr(R.mknum("1253.3535"), 1), "1253.3");
  assert.teststr(R.flr(R.mknum("1253.3535"), 2), "1253.35");
  assert.teststr(R.flr(R.mknum("-1253.3535"), 2), "-1253.36");
  assert.teststr(R.flr(R.mknum("-1253.3535"), 10), "-1253.3535");
  assert.teststr(R.flr(R.mknum("-1253.3535"), -2), "-1300");
  assert.teststr(R.flr(R.mknum("1253.3535"), -4), "0");
  assert.teststr(R.flr(R.mknum("-9999.535248923")), "-10000");
  assert.teststr(R.flr(R.mknum("-0.09")), "-1");
  assert.teststr(R.flr(R.mknum("0.09")), "0");
  
  assert.teststr(R.trn(R.mknum("1253.3535"), 1), "1253.3");
  assert.teststr(R.trn(R.mknum("1253.3535"), 2), "1253.35");
  assert.teststr(R.trn(R.mknum("-1253.3535"), 2), "-1253.35");
  assert.teststr(R.trn(R.mknum("-1253.3535"), 10), "-1253.3535");
  assert.teststr(R.trn(R.mknum("-1253.3535"), -2), "-1200");
  assert.teststr(R.trn(R.mknum("1253.3535"), -4), "0");
  assert.teststr(R.trn(R.mknum("-9999.535248923")), "-9999");
  assert.teststr(R.trn(R.mknum("-0.09")), "0");
  assert.teststr(R.trn(R.mknum("0.09")), "0");
  
  assert.teststr(R.dec(R.mknum("23.45215"), -1), "3.45215");
  assert.teststr(R.dec(R.mknum("23.45215"), 0), "0.45215");
  assert.teststr(R.dec(R.mknum("23.45215"), 1), "0.05215");
  assert.teststr(R.dec(R.mknum("-23.45215"), -1), "-3.45215");
  assert.teststr(R.dec(R.mknum("-23.45215"), 0), "-0.45215");
  assert.teststr(R.dec(R.mknum("-23.45215"), 1), "-0.05215");
  assert.teststr(R.dec(R.mknum("-0.09")), "-0.09");
  assert.teststr(R.dec(R.mknum("0.09")), "0.09");
});

QUnit.test('add', function (assert){
  assert.teststr(R.add(R.mknum("2.43"), R.mknum("5421.5342412523")), "5423.9642412523");
  assert.teststr(R.add(R.mknum("5"), R.mknum("5")), "10");
  assert.teststr(R.add(R.mknum("95"), R.mknum("5")), "100");
  assert.teststr(R.add(R.mknum("100"), R.mknum("0")), "100");
  assert.teststr(R.add(R.mknum("0"), R.mknum("0")), "0");
});

QUnit.test('sub', function (assert){
  assert.testnum(R.sub(R.mknum("5"), R.mknum("5")), false, [], 0);
  assert.teststr(R.sub(R.mknum("155"), R.mknum("135")), "20");
  assert.same(R.sub(R.mknum("-155"), R.mknum("155")), R.add(R.mknum("-155"), R.mknum("-155")), R.is);
  assert.teststr(R.sub(R.mknum("100"), R.mknum("0")), "100");
  assert.teststr(R.sub(R.mknum("0"), R.mknum("0")), "0");
});

QUnit.test('mul', function (assert){
  assert.teststr(R.mul(R.mknum("15"), R.mknum("8")), "120");
  assert.teststr(R.mul(R.mknum("32"), R.mknum("3125")), "100000");
  assert.teststr(R.mul(R.mknum("12573294723952903415"), R.mknum("23473284732827")), "295136527085097957155099210904205");
  assert.teststr(R.mul(R.mknum("-12573294723952903415"), R.mknum("-23473284732827")), "295136527085097957155099210904205");
  assert.teststr(R.mul(R.mknum("-12573294723952903415"), R.mknum("23473284732827")), "-295136527085097957155099210904205");
  assert.teststr(R.mul(R.mknum("2.537242358"), R.mknum("0.85579458930390839467312886387790109891646794492738965362080377611907512859133850419906645083142487716718296"), 104), "2.17135828172909011391644411782342680830561037361898426353765141077566626804624092477023226310621551584352");
});

QUnit.test('div', function (assert){
  assert.testnum(R.divInt([1], [3], 1), false, [3], -1);
  assert.testnum(R.divInt([2], [3], 3), false, R.strToArr("667"), -3);
  assert.teststr(R.divInt(R.strToArr("1257328472933423523"), R.strToArr("63728579374218789798791"), 105), "0.000019729428857189810126491053645823100254222352609472729567398606981182936643587722121762339434204341035");
  assert.testnum(R.divInt(R.strToArr("1"), R.strToArr("12348534")), false, R.strToArr("809812728"), -16);
  
  assert.testnum(R.div(R.mknum("1"), R.mknum("3"), 3), false, R.strToArr("333"), -3);
  assert.testnum(R.div(R.mknum("2"), R.mknum("3"), 3), false, R.strToArr("667"), -3);
  assert.testnum(R.div(R.mknum("5"), R.mknum("-9"), 3), true, R.strToArr("556"), -3);
  assert.testnum(R.div(R.mknum("-1531"), R.mknum("2534"), 10),
    true, R.strToArr("6041831097"), -10);
  assert.testnum(R.div(R.mknum("234.1283579328472893749275329"), R.mknum("28915723894729375347297"), 30),
    false, R.strToArr("8096921896"), -30);
  assert.testnum(R.div(R.mknum("2.1"), R.mknum("23"), 10), false, R.strToArr("913043478"), -10);
  assert.testnum(R.div(R.mknum("1"), R.mknum("12348534")), false, R.strToArr("809812728"), -16);
  
  assert.testnum(R.divTrn(R.mknum("1"), R.mknum("3"), 3), false, R.strToArr("333"), -3);
  assert.testnum(R.divTrn(R.mknum("2"), R.mknum("3"), 3), false, R.strToArr("666"), -3);
  assert.testnum(R.divTrn(R.mknum("5"), R.mknum("-9"), 3), true, R.strToArr("555"), -3);
  assert.testnum(R.divTrn(R.mknum("-1531"), R.mknum("2534"), 10), true, R.strToArr("6041831097"), -10);
  assert.testnum(R.divTrn(R.mknum("234.1283579328472893749275329"), R.mknum("28915723894729375347297"), 30), false, R.strToArr("8096921895"), -30);
  assert.testnum(R.divTrn(R.mknum("2.1"), R.mknum("23"), 10), false, R.strToArr("913043478"), -10);
  assert.testnum(R.divTrn(R.mknum("1"), R.mknum("12348534")), false, R.strToArr("809812727"), -16);
  
  assert.testnum(R.div(R.mknum("1"), R.mknum("1267650600228229401496703205376"), Infinity), false, R.strToArr("7888609052210118054117285652827862296732064351090230047702789306640625"), -100);
  assert.testnum(R.div(R.mknum("1"), R.mknum("10715086071862673209484250490600018105614048117055336074437503883703510511249361224931983788156958581275946729175531468251871452856923140435984577574698574803934567774824230985421074605062371141877954182153046474983581941267398767559165543946077062914571196477686542167660429831652624386837205668069376"), Infinity), false, R.strToArr("933263618503218878990089544723817169617091446371708024621714339795966910975775634454440327097881102359594989930324242624215487521354032394841520817203930756234410666138325150273995075985901831511100490796265113118240512514795933790805178271125415103810698378854426481119469814228660959222017662910442798456169448887147466528006328368452647429261829862165202793195289493607117850663668741065439805530718136320599844826041954101213229629869502194514609904214608668361244792952034826864617657926916047420065936389041737895822118365078045556628444273925387517127854796781556346403714877681766899855392069265439424008711973674701749862626690747296762535803929376233833981046927874558605253696441650390625"), -1000);
  assert.testnum(R.divInf(R.one(), R.mknum("8")), false, R.strToArr("125"), -3);
});



QUnit.test('exp', function (assert){
  assert.teststr(R.exp(R.mknum("0")), "1");
  assert.teststr(R.exp(R.mknum("0"), 100), "1");
  assert.teststr(R.exp(R.mknum("1"), 100), "2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274");
  assert.teststr(R.exp(R.mknum("0.12534835")), '1.1335432540909282');
  assert.teststr(R.exp(R.mknum("2")), "7.3890560989306502");
  assert.teststr(R.exp(R.mknum("0.53")), '1.6989323086185507');
  assert.teststr(R.exp(R.mknum("5.3")), "200.3368099747916848");
  assert.teststr(R.exp(R.mknum("2.17135828172909011391644411782342680830561037361898426353765141077566626804624092477023226310621551584352"), 100), "8.7701883407979709026775125583936064509778957787391287979739900755176035761133806818875931284372319441"); // from pow(2.3532435, 2.537242358, 100)
  
  assert.teststr(R.expTaylorFrac(R.mknum("0.1"), 20), "1.10517091807564762481");
  assert.teststr(R.expTaylorFrac(R.mknum("-0.1"), 20), "0.90483741803595957316");
  assert.teststr(R.expTaylorTerms(R.mknum("0.1"), 20), "1.10517091807564762481");
  assert.teststr(R.expTaylorTerms(R.mknum("-0.1"), 20), "0.90483741803595957316");
  assert.teststr(R.expTaylorFrac(R.mknum("0.53"), 20), "1.69893230861855065442");
  assert.teststr(R.expTaylorFrac(R.mknum("-0.53"), 20), "0.58860496967835519602");
  assert.teststr(R.expTaylorTerms(R.mknum("0.53"), 20), "1.69893230861855065442");
  assert.teststr(R.expTaylorTerms(R.mknum("-0.53"), 20), "0.58860496967835519602");
  
  assert.teststr(R.expInt(R.one(), 100), "2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274");
  assert.teststr(R.expInt(R.mknum("2"), 100), "7.3890560989306502272304274605750078131803155705518473240871278225225737960790577633843124850791217948");
  
  assert.teststr(R.expDec(R.mknum("0.1"), 20), "1.10517091807564762481");
  assert.teststr(R.expDec(R.mknum("-0.1"), 20), "0.90483741803595957316");
  assert.teststr(R.expDec(R.mknum("0.53"), 20), "1.69893230861855065442");
  assert.teststr(R.expDec(R.mknum("-0.53"), 20), "0.58860496967835519602");
  
  assert.teststr(R.expTaylorFrac(R.mknum("0.1"), 500), "1.10517091807564762481170782649024666822454719473751871879286328944096796674765430298914331897074865363291712048540124453615373471453157870200689029975745051975150048660183216133102493570280479345868504945256450571221126611637703262846270429655732360018511389770936002847694433727306588530530028111540078208889107054037124813874998328797630746706911870547864200337293212091627929861391097131362021818436129990643710574422144415090336036251289221394926835152035695503537436561443727574053783953183240083");
  assert.teststr(R.expTaylorTerms(R.mknum("0.1"), 500), "1.10517091807564762481170782649024666822454719473751871879286328944096796674765430298914331897074865363291712048540124453615373471453157870200689029975745051975150048660183216133102493570280479345868504945256450571221126611637703262846270429655732360018511389770936002847694433727306588530530028111540078208889107054037124813874998328797630746706911870547864200337293212091627929861391097131362021818436129990643710574422144415090336036251289221394926835152035695503537436561443727574053783953183240083");
  
  assert.teststr(R.exp(R.mknum("100"), 1000), "26881171418161354484126255515800135873611118.7737419224151916086152802870349095649141588710972198457108116708791905760686975977097618682335484596389298719660896291336261200293809572765340329622698656680169177435144518460651628044422377567622969602847319114021298622810400579115938787903849741733400849124328281268154544260518088286259665094004669090619135244386395838411220434628191542072368908540726073245730561211919565630615868379639874739811185209725965796237008321329464847653269380285480103308412219388842561480245057610685129366113230880948165241746989424478520665863648856479036080178867188847522963690465065747729657377847707421247014554913503979816713999567898699463721961995634290867481838821442565750518543054789681116550242583580009230134937203498426618070491974834160413887190537314406841438131922204711152588368517375853074654403136816129764308325697945634609481746807882713228985260563118171375934477444243089829584639851332224554243114654077016798345986195945916228387453855315213259712338883409818428581792029041848733525417363");
  assert.teststr(R.exp(R.mknum("200"), 1000), "722597376812574925817747704218930569735687442852731928403269789123221909361473891661561.9265890625705574684020431014294181771106771193682264809830772732788008779342526674730578072943721358766178069702350324220401483115192088442120622525378469924927288142198109355283902471114001448590550428532928500532818888965835140449022347705629407364770369022153799888245922895391403712478563813079673045531637047707823224623216639175634357229465937973295506878223485466664768863653189798239721704804374094358759404081948935274689817847243784299388715438063421376553145084172233334741265222288304854038033500341008185903307841796572148563463190520268101314937719847759843624518559897860177301044564580630068474517900564771294119234063801944785970321304991475490952968899694009148658486520131341098143763117762373361529493878619545027708722449705779714885331618926845846081735927743044625813518814240520218715515832088419199159886290588743752743768754239061705095133861834171298630559297751505817445098351055330560125774883602930495068524579993653665405114605496489592193943001635005869037582773504721");
  
  //assert.teststr(R.exp(R.mknum("1000"), 1000), "197007111401704699388887935224332312531693798532384578995280299138506385078244119347497807656302688993096381798752022693598298173054461289923262783660152825232320535169584566756192271567602788071422466826314006855168508653497941660316045367817938092905299728580132869945856470286534375900456564355589156220422320260518826112288638358372248724725214506150418881937494100871264232248436315760560377439930623959705844189509050047074217568.2267578083308102070668818911968536445918206584929433885943734416066833995904928281627706135987730904979566512246702227965470280600169740154332169201122794194769119334980240147712089576923975942544366215939426101781299421858554271852298015286303411058042095685866168239536053428580900735188184273075136717125183129388223688310255949141146674987544438726686065824907707203395789112200325628195551034220107289821072957315749621922062772097208051047568893649549635990627082681006282905378167473398226026683503867394140748723651685213836918959449223430784235236845739441584243587954299066012600261659499731698421457145591404996125748735216478753460770286790536874516266139332241069839703040428601632112116502213841686950545670248701380071441032343750405401957386931335544677621958020105544412369770364816719880440767885826225205714837919308162751003847937747780660406500888906026507822011773787608275388144051171789661172745695704116253913301985786486790337144905637775629384208464691039228043791642852265");
});

QUnit.test('Constants', function (assert){
  assert.teststr(R.e(100), "2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274");
  assert.teststr(R.e(1000), "2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274274663919320030599218174135966290435729003342952605956307381323286279434907632338298807531952510190115738341879307021540891499348841675092447614606680822648001684774118537423454424371075390777449920695517027618386062613313845830007520449338265602976067371132007093287091274437470472306969772093101416928368190255151086574637721112523897844250569536967707854499699679468644549059879316368892300987931277361782154249992295763514822082698951936680331825288693984964651058209392398294887933203625094431173012381970684161403970198376793206832823764648042953118023287825098194558153017567173613320698112509961818815930416903515988885193458072738667385894228792284998920868058257492796104841984443634632449684875602336248270419786232090021609902353043699418491463140934317381436405462531520961836908887070167683964243781405927145635490613031072085103837505101157477041718986106873969655212671546889570350354");
  assert.teststr(R.e(1000), "2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274274663919320030599218174135966290435729003342952605956307381323286279434907632338298807531952510190115738341879307021540891499348841675092447614606680822648001684774118537423454424371075390777449920695517027618386062613313845830007520449338265602976067371132007093287091274437470472306969772093101416928368190255151086574637721112523897844250569536967707854499699679468644549059879316368892300987931277361782154249992295763514822082698951936680331825288693984964651058209392398294887933203625094431173012381970684161403970198376793206832823764648042953118023287825098194558153017567173613320698112509961818815930416903515988885193458072738667385894228792284998920868058257492796104841984443634632449684875602336248270419786232090021609902353043699418491463140934317381436405462531520961836908887070167683964243781405927145635490613031072085103837505101157477041718986106873969655212671546889570350354");
  
  assert.teststr(R.phi(16), "1.6180339887498948");
  assert.teststr(R.phi(1000), "1.6180339887498948482045868343656381177203091798057628621354486227052604628189024497072072041893911374847540880753868917521266338622235369317931800607667263544333890865959395829056383226613199282902678806752087668925017116962070322210432162695486262963136144381497587012203408058879544547492461856953648644492410443207713449470495658467885098743394422125448770664780915884607499887124007652170575179788341662562494075890697040002812104276217711177780531531714101170466659914669798731761356006708748071013179523689427521948435305678300228785699782977834784587822891109762500302696156170025046433824377648610283831268330372429267526311653392473167111211588186385133162038400522216579128667529465490681131715993432359734949850904094762132229810172610705961164562990981629055520852479035240602017279974717534277759277862561943208275051312181562855122248093947123414517022373580577278616008688382952304592647878017889921990270776903895321968198615143780314997411069260886742962267575605231727775203536139362");
});

QUnit.test('Matrices', function (assert){
  var r;
  
  r = R.mkmat([[1, 2, 3], [4, 5, 6]]);
  assert.teststr(r[0][0], "1");
  assert.teststr(r[0][1], "2");
  assert.teststr(r[0][2], "3");
  assert.teststr(r[1][0], "4");
  assert.teststr(r[1][1], "5");
  assert.teststr(r[1][2], "6");
  
  assert.true(R.isMat(r, R.mkmat([[1, 2, 3], [4, 5, 6]])));
  assert.false(R.isMat(r, R.mkmat([[1, 2, 3], [4, 5, 7]])));
  assert.false(R.isMat(r, R.mkmat([[1, 2, 3], [4, 5]])));
  assert.false(R.isMat(r, R.mkmat([[1, 2], [4, 5, 6]])));
  assert.false(R.isMat(r, R.mkmat([[1, 2, 3], [4, 5, 6], [7, 8, 9]])));
  assert.false(R.isMat(r, R.mkmat([[1, 2, 3]])));
  
  assert.true(R.isMat([], []));
  assert.false(R.isMat(R.mkmat([[1]]), []));
  
  assert.same(R.idMat(0), [], R.isMat);
  assert.same(R.idMat(1), R.mkmat([[1]]), R.isMat);
  assert.same(R.idMat(2), R.mkmat([[1, 0], [0, 1]]), R.isMat);
  
  assert.same(R.mulMat(R.mkmat([[1, 2, 3], [4, 5, 6]]), R.mkmat([[1, 4], [2, 5], [3, 6]])),
    R.mkmat([[14, 32], [32, 77]]), R.isMat);
  
  assert.same(R.powMat(R.idMat(2), 20), R.idMat(2), R.isMat);
  assert.same(R.powMat(R.mkmat([[1, 1], [0, 1]]), 20), R.mkmat([[1, 20], [0, 1]]), R.isMat);
  assert.same(R.powMat(R.mkmat([[1, 1], [1, 0]]), 20), R.mkmat([[10946, 6765], [6765, 4181]]), R.isMat);
  
  assert.same(R.tostrMat(R.idMat(2)), "[1 0 | 0 1]");
  assert.same(R.tostrMat(R.mkmat([[1, 2, 3], [4, 5, 6]])), "[1 2 3 | 4 5 6]");
});

QUnit.test('acothCont', function (assert){
  // order here matters!!
  assert.teststr(R.acothCont(R.mknum("2"), 100), "0.5493061443340548456976226184612628523237452789113747258673471668187471466093044834368078774068660444");
  assert.teststr(R.acothCont(R.mknum("2"), 10), "0.5493061443");
  assert.teststr(R.acothCont(R.mknum("2"), 200), "0.54930614433405484569762261846126285232374527891137472586734716681874714660930448343680787740686604439398501453297893287118400211296525991052640093538363870530158138459169068358968684942218047995187129");
  
  assert.teststr(R.acothCont(R.mknum("2"), 500), "0.54930614433405484569762261846126285232374527891137472586734716681874714660930448343680787740686604439398501453297893287118400211296525991052640093538363870530158138459169068358968684942218047995187128515839795576057279595887533567352747008338779011110158512647344878034505326075282143406901815868664928889118349582739606590907451001505191181506112432637409911299554872624544822902673350442298254287422205950942854382374743353980654291470580108306059200070491275719597438444683992471511278657676648427");
  assert.teststr(R.acothCont(R.mknum("1534"), 1000), "0.0006518905747417013032575313522159590909907033602860539040704316429041115875045735965254604091640847912568293904734939676071693736973860286791278247127877425472067795593750293064298704009978203518318171835481193528006351712466326516623794276664567935060913524955141254872300773782088753228437890010323750436836964603749410145816616466284652860245373526985930591971631637951849422085497054308740238611023718201775362000923068289119828097639294520839137503681719496087344094115904980273266982643779843198758105312878912686407229841525859773553305654239643734252696892878747994118780691195170915738058077969116771586767564202662895023043604604094435079525574579966214709231236450843649767892901208432993974196121912407692489851828114539150106050319334721206968154626817432821407728223418940219639808927909145956455766221492616167189364292343256679259951878300339633007774818979468932177944259096243695112985497288169046073587532267270282828469397656364200452009210131937902242633693514951979843354754944");
  assert.teststr(R.acothCont(R.mknum("1534"), 251), "0.00065189057474170130325753135221595909099070336028605390407043164290411158750457359652546040916408479125682939047349396760716937369738602867912782471278774254720677955937502930642987040099782035183181718354811935280063517124663265166237942766645679351");
  assert.teststr(R.acothCont(R.mknum("1534"), 10), "0.0006518906");
  assert.teststr(R.acothCont(R.mknum("1534"), 500), "0.00065189057474170130325753135221595909099070336028605390407043164290411158750457359652546040916408479125682939047349396760716937369738602867912782471278774254720677955937502930642987040099782035183181718354811935280063517124663265166237942766645679350609135249551412548723007737820887532284378900103237504368369646037494101458166164662846528602453735269859305919716316379518494220854970543087402386110237182017753620009230682891198280976392945208391375036817194960873440941159049802732669826437798432");
  assert.teststr(R.acothCont(R.mknum("1534"), 1000), "0.0006518905747417013032575313522159590909907033602860539040704316429041115875045735965254604091640847912568293904734939676071693736973860286791278247127877425472067795593750293064298704009978203518318171835481193528006351712466326516623794276664567935060913524955141254872300773782088753228437890010323750436836964603749410145816616466284652860245373526985930591971631637951849422085497054308740238611023718201775362000923068289119828097639294520839137503681719496087344094115904980273266982643779843198758105312878912686407229841525859773553305654239643734252696892878747994118780691195170915738058077969116771586767564202662895023043604604094435079525574579966214709231236450843649767892901208432993974196121912407692489851828114539150106050319334721206968154626817432821407728223418940219639808927909145956455766221492616167189364292343256679259951878300339633007774818979468932177944259096243695112985497288169046073587532267270282828469397656364200452009210131937902242633693514951979843354754944");
});

QUnit.test('ln constants', function (assert){
  assert.teststr(R.ln2(100), "0.6931471805599453094172321214581765680755001343602552541206800094933936219696947156058633269964186875");
  assert.teststr(R.ln2(1000), "0.6931471805599453094172321214581765680755001343602552541206800094933936219696947156058633269964186875420014810205706857336855202357581305570326707516350759619307275708283714351903070386238916734711233501153644979552391204751726815749320651555247341395258829504530070953263666426541042391578149520437404303855008019441706416715186447128399681717845469570262716310645461502572074024816377733896385506952606683411372738737229289564935470257626520988596932019650585547647033067936544325476327449512504060694381471046899465062201677204245245296126879465461931651746813926725041038025462596568691441928716082938031727143677826548775664850856740776484514644399404614226031930967354025744460703080960850474866385231381816767514386674766478908814371419854942315199735488037516586127535291661000710535582498794147295092931138971559982056543928717000721808576102523688921324497138932037843935308877482597017155910708823683627589842589185353024363421436706118923678919237231467232172053401649256872747782344535348");
  assert.teststr(R.ln2(10), "0.6931471806");
  
  assert.teststr(R.ln5(100), "1.6094379124341003746007593332261876395256013542685177219126478914741789877076577646301338780931796108");
  assert.teststr(R.ln5(1000), "1.6094379124341003746007593332261876395256013542685177219126478914741789877076577646301338780931796107999663030217155628997240052293246761996336166174637057275521796374971832456534928562023415250572701551936008797773897256881935407127661547312218095279485212928213580597225676722852872404615894481783646713286739984246377595931894238439343534510509750544541947405013659870878673832131305729720406594853838387236627538765455627181615116599309152432073649116778639006758725857787663915838368239504254879562394840310019826971174909937414984809576210169110143788624033543215127231257345884615597872919808865706840200665998444726999732176811865176012202029784081090196475266997650689206589789133815717162072277745597705343203877874968293753611338009467640483302850021747748797080071434656163598970412589013376415240170058885987349484877879710543141783202014530620906157887906715981251674990414341721220369447000926855937597854921189617864328758768483220583559619967913166965093233885315853989823709854314631");
  assert.teststr(R.ln5(10), "1.6094379124");
  
  
  assert.teststr(R.ln2and5(100)[0], "0.6931471805599453094172321214581765680755001343602552541206800094933936219696947156058633269964186875");
  assert.teststr(R.ln2and5(1000)[0], "0.6931471805599453094172321214581765680755001343602552541206800094933936219696947156058633269964186875420014810205706857336855202357581305570326707516350759619307275708283714351903070386238916734711233501153644979552391204751726815749320651555247341395258829504530070953263666426541042391578149520437404303855008019441706416715186447128399681717845469570262716310645461502572074024816377733896385506952606683411372738737229289564935470257626520988596932019650585547647033067936544325476327449512504060694381471046899465062201677204245245296126879465461931651746813926725041038025462596568691441928716082938031727143677826548775664850856740776484514644399404614226031930967354025744460703080960850474866385231381816767514386674766478908814371419854942315199735488037516586127535291661000710535582498794147295092931138971559982056543928717000721808576102523688921324497138932037843935308877482597017155910708823683627589842589185353024363421436706118923678919237231467232172053401649256872747782344535348");
  assert.teststr(R.ln2and5(10)[0], "0.6931471806");
  
  assert.teststr(R.ln2and5(100)[1], "1.6094379124341003746007593332261876395256013542685177219126478914741789877076577646301338780931796108");
  assert.teststr(R.ln2and5(1000)[1], "1.6094379124341003746007593332261876395256013542685177219126478914741789877076577646301338780931796107999663030217155628997240052293246761996336166174637057275521796374971832456534928562023415250572701551936008797773897256881935407127661547312218095279485212928213580597225676722852872404615894481783646713286739984246377595931894238439343534510509750544541947405013659870878673832131305729720406594853838387236627538765455627181615116599309152432073649116778639006758725857787663915838368239504254879562394840310019826971174909937414984809576210169110143788624033543215127231257345884615597872919808865706840200665998444726999732176811865176012202029784081090196475266997650689206589789133815717162072277745597705343203877874968293753611338009467640483302850021747748797080071434656163598970412589013376415240170058885987349484877879710543141783202014530620906157887906715981251674990414341721220369447000926855937597854921189617864328758768483220583559619967913166965093233885315853989823709854314631");
  assert.teststr(R.ln2and5(10)[1], "1.6094379124");
  
  
  assert.teststr(R.ln10(100), "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983");
  assert.teststr(R.ln10(1000), "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849979");
  assert.teststr(R.ln10(10), "2.302585093");
});

QUnit.test('ln', function (assert){
  assert.testnum(R.lnReduce(R.mknum("0.00002534"))[0], false, R.strToArr("1267"), -3);
  assert.testnum(R.lnReduce(R.mknum("0.00002534"))[1], true, R.strToArr("4"), 0);
  assert.testnum(R.lnReduce(R.mknum("0.00002534"))[2], true, R.strToArr("5"), 0);
  assert.testnum(R.lnReduce(R.mknum("15342"))[0], false, R.strToArr("7671"), -4);
  assert.testnum(R.lnReduce(R.mknum("15342"))[1], false, R.strToArr("5"), 0);
  assert.testnum(R.lnReduce(R.mknum("15342"))[2], false, R.strToArr("4"), 0);
  
  assert.teststr(R.lnTaylor(R.mknum("0.1535"), 100), "-1.8740547119548852078727439182287769070330964155183114915353873998476180836431252458133343233036025138");
  assert.teststr(R.lnTaylor(R.mknum("0.92534"), 100), "-0.0775940414385536990214988528840119212271835869604118472786460077727807835150266587847523211055521824");
  assert.teststr(R.lnTaylor(R.mknum("1.02534"), 100), "0.0250242649047354363878917564035902369489598630115714174198295900319760741323417519035193936050608806");
  
  assert.teststr(R.ln(R.mknum("2.3523")), "0.8553935729228489");
  assert.teststr(R.ln(R.mknum("152"), 20), "5.02388052084627638826");
  
  assert.teststr(R.ln(R.mknum("53221251234"), 1002), "24.697723612817104242636212702688059958075170746228267768852849775467053234540185070354288464687853894973162528038978377464084586341055702148294013806648944794787434400208829312497895515626953652947900576013737672169954193877390709928980154252144316325977119003799931317522493259670315212944952578122791146023627726044881044484971068733980865542468854757136455921738018466078348751400948215471341052602264655293074546459790966490243836333314772747135399075319035381105735530882742219394498754117330055426288970576698350761066317682288543318514769499007875047029062231721642869870201960547750566677922272186287677544112773268894312690955465580683948254469231941392326865405967680806025295601825779207662541869845099541941999059789117839991068724246769365824026056169965201139234025966674310166146799267012090836308475140198633012427432846533205048404276144905932396935379304983066338106124405660824365450122977614171762788802771418239648315843207157337730362880810769592343188503972901556999165334343005012");
  
  assert.throws(function (){
    R.ln(R.mknum("0"));
  });
  assert.throws(function (){
    R.ln(R.mknum("-10"));
  });
  assert.teststr(R.ln(R.mknum("2.3532435"), 107), "0.85579458930390839467312886387790109891646794492738965362080377611907512859133850419906645083142487716718296");
});

QUnit.test('frac', function (assert){
  assert.teststr(R.fracResume(function (n){if (n == 0)return R.one(); return null;}, function (n){return null;}, 100).dat, "1");
  assert.same(R.fracResume(function (n){if (n == 0)return R.one(); return null;}, function (n){return null;}, 100).n, 0);
  assert.teststr(R.fracResume(function (n){if (n == 0)return R.one(); return null;}, function (n){return null;}, 100).p0, "1");
  assert.teststr(R.fracResume(function (n){if (n == 0)return R.one(); return null;}, function (n){return null;}, 100).q0, "0");
  assert.teststr(R.fracResume(function (n){if (n == 0)return R.one(); return null;}, function (n){return null;}, 100).p1, "1");
  assert.teststr(R.fracResume(function (n){if (n == 0)return R.one(); return null;}, function (n){return null;}, 100).q1, "1");
  assert.same(R.fracResume(function (n){if (n == 0)return R.one(); return null;}, function (n){return null;}, 100).bn1, null);
    
  var o = R.fracResume(function (n){return R.one();}, function (n){return R.one();}, 500);
  assert.teststr(o.dat, "1.6180339887498948482045868343656381177203091798057628621354486227052604628189024497072072041893911374847540880753868917521266338622235369317931800607667263544333890865959395829056383226613199282902678806752087668925017116962070322210432162695486262963136144381497587012203408058879544547492461856953648644492410443207713449470495658467885098743394422125448770664780915884607499887124007652170575179788341662562494075890697040002812104276217711177780531531714101170466659914669798731761356006708748071");
  assert.teststr(R.fracResume(function (n){return R.one();}, function (n){return R.one();}, 1000, o).dat, "1.6180339887498948482045868343656381177203091798057628621354486227052604628189024497072072041893911374847540880753868917521266338622235369317931800607667263544333890865959395829056383226613199282902678806752087668925017116962070322210432162695486262963136144381497587012203408058879544547492461856953648644492410443207713449470495658467885098743394422125448770664780915884607499887124007652170575179788341662562494075890697040002812104276217711177780531531714101170466659914669798731761356006708748071013179523689427521948435305678300228785699782977834784587822891109762500302696156170025046433824377648610283831268330372429267526311653392473167111211588186385133162038400522216579128667529465490681131715993432359734949850904094762132229810172610705961164562990981629055520852479035240602017279974717534277759277862561943208275051312181562855122248093947123414517022373580577278616008688382952304592647878017889921990270776903895321968198615143780314997411069260886742962267575605231727775203536139362");
});

QUnit.test('sfrac', function (assert){
  assert.teststr(R.sfracResume(function (n){if (n == 0)return R.one(); return null;}, 100).dat, "1");
  assert.same(R.sfracResume(function (n){if (n == 0)return R.one(); return null;}, 100).n, 0);
  assert.teststr(R.sfracResume(function (n){if (n == 0)return R.one(); return null;}, 100).p0, "1");
  assert.teststr(R.sfracResume(function (n){if (n == 0)return R.one(); return null;}, 100).q0, "0");
  assert.teststr(R.sfracResume(function (n){if (n == 0)return R.one(); return null;}, 100).p1, "1");
  assert.teststr(R.sfracResume(function (n){if (n == 0)return R.one(); return null;}, 100).q1, "1");
  
  //if (slow){
    var o = R.sfracResume(function (n){return R.one();}, 1000);
    assert.teststr(o.dat, "1.6180339887498948482045868343656381177203091798057628621354486227052604628189024497072072041893911374847540880753868917521266338622235369317931800607667263544333890865959395829056383226613199282902678806752087668925017116962070322210432162695486262963136144381497587012203408058879544547492461856953648644492410443207713449470495658467885098743394422125448770664780915884607499887124007652170575179788341662562494075890697040002812104276217711177780531531714101170466659914669798731761356006708748071013179523689427521948435305678300228785699782977834784587822891109762500302696156170025046433824377648610283831268330372429267526311653392473167111211588186385133162038400522216579128667529465490681131715993432359734949850904094762132229810172610705961164562990981629055520852479035240602017279974717534277759277862561943208275051312181562855122248093947123414517022373580577278616008688382952304592647878017889921990270776903895321968198615143780314997411069260886742962267575605231727775203536139362");
    assert.teststr(R.sfracResume(function (n){return R.one();}, 2000, o).dat, "1.61803398874989484820458683436563811772030917980576286213544862270526046281890244970720720418939113748475408807538689175212663386222353693179318006076672635443338908659593958290563832266131992829026788067520876689250171169620703222104321626954862629631361443814975870122034080588795445474924618569536486444924104432077134494704956584678850987433944221254487706647809158846074998871240076521705751797883416625624940758906970400028121042762177111777805315317141011704666599146697987317613560067087480710131795236894275219484353056783002287856997829778347845878228911097625003026961561700250464338243776486102838312683303724292675263116533924731671112115881863851331620384005222165791286675294654906811317159934323597349498509040947621322298101726107059611645629909816290555208524790352406020172799747175342777592778625619432082750513121815628551222480939471234145170223735805772786160086883829523045926478780178899219902707769038953219681986151437803149974110692608867429622675756052317277752035361393621076738937645560606059216589466759551900400555908950229530942312482355212212415444006470340565734797663972394949946584578873039623090375033993856210242369025138680414577995698122445747178034173126453220416397232134044449487302315417676893752103068737880344170093954409627955898678723209512426893557309704509595684401755519881921802064052905518934947592600734852282101088194644544222318891319294689622002301443770269923007803085261180754519288770502109684249362713592518760777884665836150238913493333122310533923213624319263728910670503399282265263556209029798642472759772565508615487543574826471814145127000602389016207773224499435308899909501680328112194320481964387675863314798571911397815397807476150772211750826945863932045652098969855567814106968372884058746103378105444390943683583581381131168993855576975484149144534150912954070050194775486163075422641729394680367319805861833918328599130396072014455950449779212076124785645916160837059498786006970189409886400764436170933417270919143365013716");
  //}
});

QUnit.test('cfrac', function (assert){
  assert.teststr(R.cfrac(R.one(), R.one(), 16), "1.6180339887498948");
  assert.teststr(R.cfrac(R.mknum("2"), R.mknum("5"), 16), "3.4494897427831781");
  assert.teststr(R.cfrac(R.mknum("6"), R.mknum("2"), 20), "6.31662479035539984911"); // sqrt(11)+3
  
});

QUnit.test('pow', function (assert){
  assert.teststr(R.pow(R.mknum("2"), R.mknum("10")), "1024");
  assert.teststr(R.pow(R.mknum("2"), R.mknum("1000")), "10715086071862673209484250490600018105614048117055336074437503883703510511249361224931983788156958581275946729175531468251871452856923140435984577574698574803934567774824230985421074605062371141877954182153046474983581941267398767559165543946077062914571196477686542167660429831652624386837205668069376");
  assert.teststr(R.pow(R.mknum("1.3"), R.mknum("20")), "190.04963774880799438801");
  assert.teststr(R.pow(R.mknum("1.3"), R.mknum("100")), "247933511096.5972533511072884734865136238774467874941149812189099406158699837975560158285662939982180192171594001");
  assert.teststr(R.pow(R.mknum("1.3"), R.mknum("100")), "247933511096.5972533511072884734865136238774467874941149812189099406158699837975560158285662939982180192171594001");
  assert.teststr(R.pow(R.mknum("1"), R.mknum("10000000")), "1");
  assert.teststr(R.pow(R.mknum("0"), R.mknum("10000000")), "0");
  assert.teststr(R.pow(R.mknum("-1"), R.mknum("10000000")), "1");
  assert.teststr(R.pow(R.mknum("-1"), R.mknum("10000001")), "-1");
  assert.teststr(R.pow(R.mknum("1000000000"), R.mknum("1")), "1000000000");
  assert.teststr(R.pow(R.mknum("1000000000"), R.mknum("0")), "1");
  assert.teststr(R.pow(R.mknum("1000000000"), R.mknum("-1")), "0.000000001");
  assert.teststr(R.pow(R.mknum("2.3532435"), R.mknum("2.537242358"), 100), "8.7701883407979709026775125583936064509778957787391287979739900755176035761133806818875931284372319441");
  assert.teststr(R.pow(R.mknum("0.23"), R.mknum("-25.35343"), 100), "15219088078819140.3165134308044587144163918505332140631656460848179015860237102396399277678337848449506431509688688937");
  assert.throws(function (){
    R.pow(R.mknum("-2.3"), R.mknum("5.3"));
  }, "pow of negative to rational should throw");
  assert.teststr(R.pow(R.mknum("1523435"), R.mknum("1.2"), 10), "26265683.9896258295");
  assert.teststr(R.pow(R.mknum("-3"), R.mknum("3")), "-27");
  assert.teststr(R.pow(R.mknum("-3.53"), R.mknum("3"), 16), "-43.986977");
  assert.teststr(R.pow(R.mknum("10"), R.mknum("100")), "10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
  assert.teststr(R.pow(R.mknum("10"), R.mknum("-100")), "0");
  assert.teststr(R.pow(R.mknum("1.1"), R.mknum("1")), "1.1");
  assert.teststr(R.pow(R.mknum("0.1"), R.mknum("1")), "0.1");
  assert.throws(function () {
    R.pow(R.mknum("0"), R.mknum("-1"));
  }, "pow of 0 to -1 should throw");
  
  assert.teststr(R.powExact(R.mknum("-3.53"), 3), "-43.986977");
  assert.teststr(R.powDec(R.mknum("-3.53"), 3, 16), "-43.986977");
});

QUnit.test('sqrt', function (assert){
  assert.teststr(R.sqrtAppr(R.mknum("10")), "3.1622776601683795");
  assert.teststr(R.sqrtAppr(R.mknum("1275237402859012830481205802934803298401295")), "1129264097923516300000");
  assert.teststr(R.sqrtAppr(R.mknum("0.00000000000000000001275237402859012830481205802934803298401295")), "0.00000000011292640979235163");
  assert.teststr(R.sqrtAppr(R.mknum("0")), "0");
  
  assert.teststr(R.isqrt(R.mknum("100")), "10");
  assert.teststr(R.isqrt(R.mknum("2")), "1");
  assert.teststr(R.isqrt(R.mknum("3")), "1");
  assert.teststr(R.isqrt(R.mknum("4")), "2");
  assert.teststr(R.isqrt(R.mknum("1239042309482035")), "35200032");
  assert.teststr(R.isqrt(R.mknum("91283742957197910298375192837491623471927349712935621934718923759173294712973497129374192653294192374187")), "9554252611125472555257700286242134760120111936267558");
  
  assert.teststr(R.sqrtShift(R.mknum("0.1523435"), 100), "0.3903120546434608903802367355929429779598358141804271514944606497939159961788439232252104932487567399");
  assert.teststr(R.sqrtShift(R.mknum("0.152343"), 100), "0.3903114141297945696037899748703824986345305952226122915185525884004437155610930459436919894252510004");
  assert.teststr(R.sqrtShift(R.mknum("152000000000000000000000"), 100), "389871773792.3585562735365279959840119701033560134996412796700002288032708984099742739484838415226211022615952563");

});

QUnit.test('sqrt slow', function (assert){
  var done = assert.async();
  assert.expect(5);
  assert.teststr(R.sqrtCont(R.mknum("2"), 1000), "1.4142135623730950488016887242096980785696718753769480731766797379907324784621070388503875343276415727350138462309122970249248360558507372126441214970999358314132226659275055927557999505011527820605714701095599716059702745345968620147285174186408891986095523292304843087143214508397626036279952514079896872533965463318088296406206152583523950547457502877599617298355752203375318570113543746034084988471603868999706990048150305440277903164542478230684929369186215805784631115966687130130156185689872372352885092648612494977154218334204285686060146824720771435854874155657069677653720226485447015858801620758474922657226002085584466521458398893944370926591800311388246468157082630100594858704003186480342194897278290641045072636881313739855256117322040245091227700226941127573627280495738108967504018369868368450725799364729060762996941380475654823728997180326802474420629269124859052181004459842150591120249441341728531478105803603371077309182869314710171111683916581726889419758716582152128229518488472");
  assert.teststr(R.sqrtCont(R.mknum("91283742957197910298375192837491623471927349712935621934718923759173294712973497129374192653294192374187"), 1000), "9554252611125472555257700286242134760120111936267558.8064234368662721736120096765581161986540928164207015528736857454499270947589581893228308808835154289280650636472502307035931396010343899364811805909249850702517363170530932233061570612662618566204802724618893572000226707809293644132249314468009782742078765892195821644491175681836980609238439534790813307836228650656745545797574721718215473066705190658633419124629547493662470669564755719022686347650779540691527099179154523320517739340957280630586682556489672690397917354583778783167435789989295771811850352456987473426381755523131702224907051625500242422819190244205605897485608814079301467670328832175000854922390077449604205705464630943317643047337310151350406308642230737543921327832375298265359243114833318230994653735472215293279733405416276034061944354215885988391654684884070674460220589503223319073792480717876619168356609856979778672066744475782151041399699500365884361106565313123020458528434760120338596681208021777801734491134871738575852562547615872326293870758293383580385171200147475");
  assert.teststr(R.sqrt(R.mknum("15923847.2395827349273489797"), 1000), "3990.4695512662084372684532692888461511879463995596482679858092851347076572063409212173106013946580859812379346401484577186422068740433683253564993535600436092784956272153385529713235086731523615751461276739468517013913330842802502914248752002610960643865091309319802030651158437718488046737790985875825450479465540190570651783075552123521176899014047951302857920153090899306635736591215095903618291976802362956672116429081718579708169434551734530153817193961024555460767983110890605283974994353522402547219293990747138963814624777633297384204888999899358657330751027172717992751819045569733467226620015083218121370827570529134072361302366297369464999802962210516900321843246176477824087451397553143008717433239921544507715234050329685148246783426533953415570181973806864545405393017717363004830206167680304545038999258562152992316780273644785859079870554041718410743076739393449390595492672782465201904622974167473870063025443249973567642359559234541613999088931026186145904639479912396393079422032860284");
  assert.testspd(function (){
    var s = R.sqrt(R.mknum("2"), 1000);
    setTimeout(function (){
      assert.teststr(s, "1.4142135623730950488016887242096980785696718753769480731766797379907324784621070388503875343276415727350138462309122970249248360558507372126441214970999358314132226659275055927557999505011527820605714701095599716059702745345968620147285174186408891986095523292304843087143214508397626036279952514079896872533965463318088296406206152583523950547457502877599617298355752203375318570113543746034084988471603868999706990048150305440277903164542478230684929369186215805784631115966687130130156185689872372352885092648612494977154218334204285686060146824720771435854874155657069677653720226485447015858801620758474922657226002085584466521458398893944370926591800311388246468157082630100594858704003186480342194897278290641045072636881313739855256117322040245091227700226941127573627280495738108967504018369868368450725799364729060762996941380475654823728997180326802474420629269124859052181004459842150591120249441341728531478105803603371077309182869314710171111683916581726889419758716582152128229518488472");
      done();
    });
  }, 600);
});

QUnit.test('sin and cos', function (assert){
  assert.teststr(R.cosTaylorFrac(R.mknum("0.0001"), 100), "0.9999999950000000041666666652777777780257936507660934744288954358397655768687562514034073318715030379");
  assert.teststr(R.cosTaylorFrac(R.mknum("0.00000001"), 1000), "0.9999999999999999500000000000000004166666666666666652777777777777777802579365079365079337522045855379188733398802843247287680261390578850896315993248863619233988042439277871722454904866413166939355233472936424713942006290747640965906212472380634648250342788835058803305387609822467935157405450489520812638006319473775922230384983956046980036386536288688483348500803015876650002928019003171619899385356005505511969842092432202252856220907009308849115367303953777999234832823460740014683060451211368616937426823057533176924106603213259425812310144118064408876293944573721282753966792482438831139880572145596213547796518669168449706176955856376702064834129090247781957380587002020939042382456861686530984643313890457855130485168373453141405980533370909430427650135298744203941159059221445472814886678803500557843487711894716371757162041296976381199372864410528662190002406266764750450857082811823521039204770439166169266581139234517922218136756408714197937915079618089058294264012089586217843842558383098");
  assert.teststr(R.cosTaylorFrac(R.mknum("0.00000000000000000000000000001112374928578932749287358263894712937589127349712893562947391223412035832904812903573209482035802347190238958290384129037529034810298352901384012"), 1000), "0.9999999999999999999999999999999999999999999999999999999999381311009134507132527051235791204086262904977341658532634874105284817129768004311249309958315752031904500439227290531756385436995098225692034811634285115463403647056111727584865964277140889074989267671540640447014897394444101290779453392049540993342749010365477472133591650319655833158756079934214432454957204902584790705254734925145134917284284069124430340098508893935037801978870056957871745083137318021861551423573419934316310824541089347253849756081110541311751539327591604123216893281684683591996799693946464750912017148487649541765665965824419106814936398881030394697938910015202724474966400376456400865088986640180095972354553478329543461852571872646238843532746629928219654845769915826636908084721858788786318759555386230763478338013866136794302193381961730913101526235481057292443106369481698622368592885825941560390256413099441366028224877504448282418674564081521320221317663647303404436533504293884509327719809138614548327575549569");
  
  assert.teststr(R.sinTaylorFrac(R.mknum("0.0001"), 100), "0.0000999999998333333334166666666468253968281525573189734648068141991753095217050243786415685722746764");
  assert.teststr(R.sinTaylorFrac(R.mknum("0.00000001"), 1000), "0.0000000099999999999999998333333333333333341666666666666666646825396825396825424382716049382716024330607663940997290389651500762611866075821102276128733966643435986728858611433319354174506047540362522582397714923802922500763514718785827438459900647418040081105946406898357197734571029635092143018438107067677212190318517572671768410404871590152991099311689623550610813944387789020465984148475952615102850215736853976821088921808914604650905271933725094480102618095447910376330780826242223062302517720763468158689002297566351844591295763740141670006987748619348679687073281451243802640140363240045366306475908124838724134894409479394734398358747460459399098630349986719472754818897377004684454670580853244665829187644390541393063306568074537752237935141499119223625202729574084760275057632087609026566106413739950174652198606927373910273863142746652141757213187234373749588539294983839845329060736216933727439291515830573871903617492625973418753897335584235771198049995124235529441076383851759791753933");
  assert.teststr(R.sinTaylorFrac(R.mknum("0.00000000000000000000000000001112374928578932749287358263894712937589127349712893562947391223412035832904812903573209482035802347190238958290384129037529034810298352901384012"), 1000), "0.0000000000000000000000000000111237492857893274928735826389471293758912734971289356294736828294130161375132705970678127086299512119116082640402688085138443554077525471525467695494471075802227772152061928497382020711823114193515621480157681149309134336697518475007213056231917775713581134563393122030068179299664855550480387480594057086595320392841899183797568065541930443223470426303073084330893528595564857013805374344976206610691831106170582791826821392709074447453493739046035287672487952068861472109100565313383443614895899704968953018375079081082949065087401975861223909646345657485730004701835486926074067776495981448067620327641456176601964736234861567935342597655353413911218603290094893303396299885075000726564935361149269986514352127770756278389662594381496183109768302519981824981244962896007184185670989529762429085495380972866877520597953960836778608196051718014083897977266717252501808775993018478061572363759539933127200396053860063698873564541268664133314493969625883679678960317991072");
  
  assert.teststr(R.sinTaylorFrac(R.mknum("-0.0001"), 100), "-0.0000999999998333333334166666666468253968281525573189734648068141991753095217050243786415685722746764");
  assert.teststr(R.sinTaylorFrac(R.mknum("-0.00000001"), 1000), "-0.0000000099999999999999998333333333333333341666666666666666646825396825396825424382716049382716024330607663940997290389651500762611866075821102276128733966643435986728858611433319354174506047540362522582397714923802922500763514718785827438459900647418040081105946406898357197734571029635092143018438107067677212190318517572671768410404871590152991099311689623550610813944387789020465984148475952615102850215736853976821088921808914604650905271933725094480102618095447910376330780826242223062302517720763468158689002297566351844591295763740141670006987748619348679687073281451243802640140363240045366306475908124838724134894409479394734398358747460459399098630349986719472754818897377004684454670580853244665829187644390541393063306568074537752237935141499119223625202729574084760275057632087609026566106413739950174652198606927373910273863142746652141757213187234373749588539294983839845329060736216933727439291515830573871903617492625973418753897335584235771198049995124235529441076383851759791753933");
  assert.teststr(R.sinTaylorFrac(R.mknum("-0.00000000000000000000000000001112374928578932749287358263894712937589127349712893562947391223412035832904812903573209482035802347190238958290384129037529034810298352901384012"), 1000), "-0.0000000000000000000000000000111237492857893274928735826389471293758912734971289356294736828294130161375132705970678127086299512119116082640402688085138443554077525471525467695494471075802227772152061928497382020711823114193515621480157681149309134336697518475007213056231917775713581134563393122030068179299664855550480387480594057086595320392841899183797568065541930443223470426303073084330893528595564857013805374344976206610691831106170582791826821392709074447453493739046035287672487952068861472109100565313383443614895899704968953018375079081082949065087401975861223909646345657485730004701835486926074067776495981448067620327641456176601964736234861567935342597655353413911218603290094893303396299885075000726564935361149269986514352127770756278389662594381496183109768302519981824981244962896007184185670989529762429085495380972866877520597953960836778608196051718014083897977266717252501808775993018478061572363759539933127200396053860063698873564541268664133314493969625883679678960317991072");
  
  assert.teststr(R.pi(500), "3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194913");
  assert.teststr(R.pi(10), "3.1415926536");
  
  
  assert.teststr(R.cos(R.mknum("1"), 100), "0.5403023058681397174009366074429766037323104206179222276700972553811003947744717645179518560871830893");
  assert.teststr(R.cos(R.pi(10), 100), "-0.9999999999999999999999479110094597687969892158233720539408573251651280359437666274743270482474047484");
  assert.teststr(R.cos(R.divInf(R.pi(10), R.mknum("2")), 100), "-0.0000000000051033807686783083602485357489192517389262995884863084848015495289420004465351372185297823");
  assert.teststr(R.cos(R.zero()), "1");
  
  
  assert.teststr(R.sin(R.mknum("1"), 100), "0.8414709848078965066525023216302989996225630607983710656727517099919104043912396689486397435430526959");
  assert.teststr(R.sin(R.pi(10), 100), "-0.0000000000102067615373566167204969385828622120367278596334165854961316082273852011179526148516666833");
  assert.teststr(R.sin(R.divInf(R.pi(10), R.mknum("2")), 100), "0.9999999999999999999999869777523649421992473038710535467508300889636819534758296716988057929188614409");
  assert.teststr(R.sin(R.zero()), "0");
  
  
  assert.teststr(R.cos(R.mknum("1"), 500), "0.54030230586813971740093660744297660373231042061792222767009725538110039477447176451795185608718308934357173116003008909786063376002166345640651226541731858471797116447447949423311792455139325433594351775670289259637573615432754964175449177511513122273010063135707823223677140151746899593667873067422762024507763744067587498161784272021645585111563296889057108124272933169868524714568949043423754330944230240935962395831824547281736640780712434336217481003220271297578822917644683598726994264913443918");
  
  assert.teststr(R.sin(R.mknum("1"), 500), "0.8414709848078965066525023216302989996225630607983710656727517099919104043912396689486397435430526958543490379079206742932591189209918988811934103277292124094807919558267666069999077640119784087827325663474848028702986561570179624553948935729246701270864862810533820305613772182038684496677616742662390133827533979567642555654779639897648243286902756964291206300583036515230312782552898532648513981934521359709559620621721148144417810576010756741366480550089167266058041400780623930703718779562612888");
});

QUnit.test('sinh and cosh', function (assert){
  //if (slow){
    assert.teststr(R.sinh(R.mknum("1"), 1000), "1.1752011936438014568823818505956008151557179813340958702295654130133075673043238956071174520896233918404195333275795323567852189019194572821368403528832484238229689806253026878572974193778037894530156457975748559863812033933000211943571349392767479287838086397780915943822887094379183712322502306432683489821868659007368597138765536487737915436208491950598400985696957504601707347646045559914877642254885845736315892502135438245978143162874775249565935186798861968577094170390099113872716177152780262453321951854415262402416103920761267624912645278798537338302365909296461050504645113473272056325166736580461403198178841883844076107237360882113435617758002908523909965114638588786393443563656929774154764067076723033758298863411337231625383837481234510640896452737791466885735172361927783511286706456658282762063511732883353212763583727558145625271856252146462467309096604070032301858607354735125956935484726149897351622346477886899320649971872128907279314186746429627514320350120547046155596810486684");
    assert.teststr(R.sinh(R.mknum("100"), 1000), "13440585709080677242063127757900067936805559.3868709612075958043076401435174547824570794169482300427512260206411162687187571120604194722328643942163955526665924350877344692290965854268595334714568446224531098705172977127699034008901904369616106929482703755868405853917271014043886335243881009013193699151285364346592890227864407745482829448021202160056962132517735891347535308817225867782212529183399706039519856504180518978561610509993267308149971826353540117811896382328544436410234974734837260654085827648504968490047773597409463284838334118134238147368800747657994057878663319423509776122684574969058503816025594373442747611917646639373118149129672071453476949859142548448155010827125171049725651032701616360135549654125971362303131101184307819437800335262644660794526106585397603576850366348309123714012543041491370332849016685801513504658626722244336631805763822361651600901696720201280960050000435054151134852774311078914262732740810424820875507160569006244685305270857093115027652425145066250491666499598887806911275695404459498606115824");
    assert.teststr(R.sinh(R.mknum("-1"), 1000), "-1.1752011936438014568823818505956008151557179813340958702295654130133075673043238956071174520896233918404195333275795323567852189019194572821368403528832484238229689806253026878572974193778037894530156457975748559863812033933000211943571349392767479287838086397780915943822887094379183712322502306432683489821868659007368597138765536487737915436208491950598400985696957504601707347646045559914877642254885845736315892502135438245978143162874775249565935186798861968577094170390099113872716177152780262453321951854415262402416103920761267624912645278798537338302365909296461050504645113473272056325166736580461403198178841883844076107237360882113435617758002908523909965114638588786393443563656929774154764067076723033758298863411337231625383837481234510640896452737791466885735172361927783511286706456658282762063511732883353212763583727558145625271856252146462467309096604070032301858607354735125956935484726149897351622346477886899320649971872128907279314186746429627514320350120547046155596810486684");
  //}
  
  assert.teststr(R.sinh(R.mknum("0"), 1000), "0");
  
  //if (slow){
    assert.teststr(R.cosh(R.mknum("1"), 1000), "1.543080634815243778477905620757061682601529112365863704737402214710769063049223698964264726435543035587046858604423527565032194694709586290763493942377347206915163348002640802905936410502949405798003365776259331944320950695849913689810374305484712739298456160390385817471453636004518736306827514348801202720574972705524471670706447103271142282939448411677273102139632958667273012282626140985721545916204252245393925858443919947513438073496947531997103252105563773110237447415896076544365271514820766882403983029983472989334741090132143132702403505302675135568259874176174834189364977445993156876926443643192056748598256208635430068596947194165121242519511511476391513307991956423117373004966376833835519775173920738314521712547385622644735482990465971815138854618307659137175762374291420093234792599302659284027273653753643301932643788234420741842756223931667846700828483233543022966235448217376111323219923809388405430479915760371371042211323170859782184329029528935859255361953466562539129275986367");
    assert.teststr(R.cosh(R.mknum("100"), 1000), "13440585709080677242063127757900067936805559.386870961207595804307640143517454782457079454148989802959585650238074307349940485649342396000684065422534319299497194045891650800284371849674499490813021045563807872997154133295259403552047319800686267336461535815289276889312956507205245265996873272020714997304291692156165403265368054077683564598346693056217311186865994706368512581096567429015637935732636720621070470773904665205425786964660743166121338337242567842511193900092041124303440555064284265432639174033759299019728401327566608127489676281392709437818867682052660798498553705552630405618261387846445987443947137428690976593006078187389640578383190836323704970875615101556695116850911981775618778874094939038299340066370975424711148239570141069713686823578195727596586824876281031034017096609771772411937916321978225551950069005156114974451009388542767651993412327295788084511116251194802521056268311722479962466993201091532190711052179973336760749350801055366068092508882311335980143017014700922067238381093062167051633363738923491930154");
    assert.teststr(R.cosh(R.mknum("-1"), 1000), "1.543080634815243778477905620757061682601529112365863704737402214710769063049223698964264726435543035587046858604423527565032194694709586290763493942377347206915163348002640802905936410502949405798003365776259331944320950695849913689810374305484712739298456160390385817471453636004518736306827514348801202720574972705524471670706447103271142282939448411677273102139632958667273012282626140985721545916204252245393925858443919947513438073496947531997103252105563773110237447415896076544365271514820766882403983029983472989334741090132143132702403505302675135568259874176174834189364977445993156876926443643192056748598256208635430068596947194165121242519511511476391513307991956423117373004966376833835519775173920738314521712547385622644735482990465971815138854618307659137175762374291420093234792599302659284027273653753643301932643788234420741842756223931667846700828483233543022966235448217376111323219923809388405430479915760371371042211323170859782184329029528935859255361953466562539129275986367");
  //}
  
  assert.teststr(R.cosh(R.mknum("0"), 1000), "1");
  
  
});

QUnit.test('atan and acot', function (assert){
  
  assert.teststr(R.atan(R.mknum("1"), 10), "0.7853981634");
  assert.teststr(R.atan(R.mknum("0.001"), 1000), "0.0009999996666668666665238096349205440116209345542680130914310481876454723406695622912734749014084020132116492147102870209112992719336589404762114217767007553710342939219748638341393494079766388072890942777440997947348105420974134174363319807076047332164625425797759680362616939709149416983715972207798883250289477008919054940964469797563520049201783733321561704147942311124536246981595235414656483663017271630836828486061336896821091272711396835198755374553175233154369405056319963383805473979074524228293761478198928012163540741466752404157063936821616136540658766951451090568990170061227187910346436843335045874534343292066296966884034562793366334738643021810900834166719221864199593709225587910163414928925180281985464337632449650476928626603432337909470313480622630821420422129301117131833503156172003089364354294440896776742103394467730309196795840111804369216048953117858675430154509788606924090927942366192927129011920609547733095697147277993338529676826678516847264760433926626052818034552947");
  assert.teststr(R.atan(R.mknum("100"), 100), "1.5607966601082313810249815754304718935372153471431762708595328779574516499390457193345707674843844436");
  assert.teststr(R.atan(R.mknum("-25"), 200), "-1.53081763967160657781774384201037603850156565249582942248316454859703303532102212563098272453799003694508597915738163033974082929399549828074057449526982238784933272843720626200082240984803433023092171");
  assert.teststr(R.atan(R.mknum("1.234287352471234729747327419273534"), 100), "0.8898763371378507663463201010794468348533933447582607231448300558305326709754315155211238411348987926");
  assert.teststr(R.atan(R.zero(), 10000), "0");
  
  assert.teststr(R.acot(R.mknum("1"), 10), "0.7853981634");
  
  //if (wpi){
    assert.teststr(R.acot(R.mknum("0.001"), 1000), "1.5697963271282297525647978820048308980869637651332848973960412479662627308024349370227439377696501319778623940419308663026356230328416321753864682822875398033541077574289943967186404729034978386579018879366613880382319125221404106994570596019279962213563617408819542062689654693531917551052585273498569739684743554569021819466640135016582750409375038106141390095908710341619566085625325499345051074384148014720991969473704124033765818390347568690393984997758724580593467354372443661072334216935985221420874605334004355203266566233265223719528889574077688581973193929134430375314771753312865150436679223159505589851783460846862559746904913483074819558868699182695223932984013526062655660252172858384454295170855380363124339982539641148591220247253117464684065743269377361043469827625997541532246978436803119207912380247072315834799163328957446000459145014938211319977715479819807366476948576099738812427063325085950850214643877204771678673240821481795570759225834177617185800249205456429926728047548048");
  //}
  
  assert.teststr(R.acot(R.mknum("100"), 100), "0.0099996666866652382063401162092795485613693525443766396279394181964565532040587799794466451866740904");
  assert.teststr(R.acot(R.mknum("-25"), 200), "-0.03997868712329004141357784962937540359701904719172348800430774755687516782208237368303468813306849704598806409925952298380609301077979283512210520879441817087580932291376299855195741246344014723426927");
  assert.teststr(R.acot(R.mknum("1.234287352471234729747327419273534"), 100), "0.6809199896570458528850015905603046072451913549292921873426422403233755321676729837928935715361597414");
  
  //if (wpi){
    assert.teststr(R.acot(R.zero(), 1000), "1.5707963267948966192313216916397514420985846996875529104874722961539082031431044993140174126710585339910740432566411533235469223047752911158626797040642405587251420513509692605527798223114744774651909822144054878329667230642378241168933915826356009545728242834617301743052271633241066968036301245706368622935033031577940874407604604814146270458576821839462951800056652652744102332606920734759707558047165286351828797959765460930586909663058965525592740372311899813747836759428763624456139690915059745649168366812203283215430106974731976123685953510899304718513852696085881465883761923374092338347025660002840635726317804138928856713788948045868185893607342204506124767150732747926855253961398446294617710099780560645109804320172090799068148873856549802593536056749999991864890249755298658664080481592975122297276734541513212611541266723425176309655940855050015689193764432937666041907103085888345736517991267452143777343655797814319411768937968759788909288902660856134033065009639383055979546082100995");
  //}
  
  assert.teststr(R.atan2(R.one(), R.one(), 100), "0.785398163397448309615660845819875721049292349843776455243736148076954101571552249657008706335529267");
  assert.teststr(R.atan2(R.neg(R.one()), R.one(), 100), "-0.785398163397448309615660845819875721049292349843776455243736148076954101571552249657008706335529267");
  assert.teststr(R.atan2(R.one(), R.neg(R.one()), 100), "2.356194490192344928846982537459627163147877049531329365731208444230862304714656748971026119006587801");
  assert.teststr(R.atan2(R.neg(R.one()), R.neg(R.one()), 100), "-2.356194490192344928846982537459627163147877049531329365731208444230862304714656748971026119006587801");
  
  assert.throws(function (){
    R.atan2(R.zero(), R.zero(), 100);
  });
  assert.teststr(R.atan2(R.zero(), R.one(), 100), "0");
  assert.teststr(R.atan2(R.zero(), R.neg(R.one()), 100), "3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117068");
  assert.teststr(R.atan2(R.one(), R.zero(), 100), "1.570796326794896619231321691639751442098584699687552910487472296153908203143104499314017412671058534");
  assert.teststr(R.atan2(R.neg(R.one()), R.zero(), 100), "-1.570796326794896619231321691639751442098584699687552910487472296153908203143104499314017412671058534");
  
  assert.teststr(R.atan2(R.mknum("0.001"), R.one(), 100), "0.000999999666666866666523809634920544011620934554268013091431048187645472340669562291273474901408402");
  assert.teststr(R.atan2(R.mknum("-0.001"), R.one(), 100), "-0.000999999666666866666523809634920544011620934554268013091431048187645472340669562291273474901408402");
  assert.teststr(R.atan2(R.mknum("0.001"), R.neg(R.one()), 100), "3.140592653923126371796119573644582340185548464820837807883513544120170933945539436336761350440708666");
  assert.teststr(R.atan2(R.mknum("-0.001"), R.neg(R.one()), 100), "-3.140592653923126371796119573644582340185548464820837807883513544120170933945539436336761350440708666");
  assert.teststr(R.atan2(R.one(), R.mknum("0.001"), 100), "1.569796327128229752564797882004830898086963765133284897396041247966262730802434937022743937769650132");
  assert.teststr(R.atan2(R.one(), R.mknum("-0.001"), 100), "1.571796326461563485897845501274671986110205634241820923578903344341553675483774061605290887572466936");
  assert.teststr(R.atan2(R.neg(R.one()), R.mknum("0.001"), 100), "-1.569796327128229752564797882004830898086963765133284897396041247966262730802434937022743937769650132");
  assert.teststr(R.atan2(R.neg(R.one()), R.mknum("-0.001"), 100), "-1.571796326461563485897845501274671986110205634241820923578903344341553675483774061605290887572466936");
});

QUnit.test('fact and bin', function (assert){
  assert.teststr(R.fact(R.mknum("0")), "1");
  assert.teststr(R.fact(R.mknum("1")), "1");
  assert.teststr(R.fact(R.mknum("10")), "3628800");
  assert.teststr(R.fact(R.mknum("100")), "93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000");
  assert.throws(function (){
    R.fact(R.mknum("-1"));
  });
  
  assert.teststr(R.bin(R.mknum("3"), R.mknum("1")), "3");
  assert.teststr(R.bin(R.mknum("25"), R.mknum("10")), "3268760");
  assert.teststr(R.bin(R.mknum("250"), R.mknum("125")), "91208366928185711600087718663295946582847985411225264672245111235434562752");
  assert.throws(function (){
    R.bin(R.mknum("3"), R.mknum("4"));
  });
  assert.throws(function (){
    R.bin(R.mknum("-1"), R.mknum("4"));
  });
  assert.throws(function (){
    R.bin(R.mknum("3"), R.mknum("-1"));
  });
});

QUnit.test('agm', function (assert){
  assert.teststr(R.agm(R.mknum("2"), R.mknum("3"), 16), "2.4746804362363045");
});



QUnit.test('qar', function (assert){
  assert.testarr(R.qar(R.mknum("1"), R.mknum("2")), "0", "1");
  assert.testarr(R.qar(R.mknum("1"), R.mknum("-2")), "0", "1");
  assert.testarr(R.qar(R.mknum("-1"), R.mknum("2")), "-1", "1");
  assert.testarr(R.qar(R.mknum("-1"), R.mknum("-2")), "1", "1");
  assert.testarr(R.qar(R.mknum("2"), R.mknum("2")), "1", "0");
  assert.testarr(R.qar(R.mknum("2"), R.mknum("-2")), "-1", "0");
  assert.testarr(R.qar(R.mknum("-2"), R.mknum("2")), "-1", "0");
  assert.testarr(R.qar(R.mknum("-2"), R.mknum("-2")), "1", "0");
  assert.testarr(R.qar(R.mknum("13"), R.mknum("5")), "2", "3");
  assert.testarr(R.qar(R.mknum("13"), R.mknum("-5")), "-2", "3");
  assert.testarr(R.qar(R.mknum("-13"), R.mknum("5")), "-3", "2");
  assert.testarr(R.qar(R.mknum("-13"), R.mknum("-5")), "3", "2");
  assert.testarr(R.qar(R.mknum("13.3"), R.mknum("3.5")), "3", "2.8");
  assert.testarr(R.qar(R.mknum("13.3"), R.mknum("-3.5")), "-3", "2.8");
  assert.testarr(R.qar(R.mknum("-13.3"), R.mknum("3.5")), "-4", "0.7");
  assert.testarr(R.qar(R.mknum("-13.3"), R.mknum("-3.5")), "4", "0.7");
  assert.testarr(R.qar(R.mknum("0"), R.mknum("3.5")), "0", "0");
  assert.testarr(R.qar(R.mknum("0"), R.mknum("-3.5")), "0", "0");
  assert.throws(function (){
    R.qar(R.mknum("3.5"), R.mknum("0"));
  });
  assert.throws(function (){
    R.qar(R.mknum("-3.5"), R.mknum("0"));
  });
});


QUnit.test('mod', function (assert){
  assert.teststr(R.mod(R.mknum("1"), R.mknum("1")), "0");
  assert.teststr(R.mod(R.mknum("0"), R.mknum("1")), "0");
  assert.teststr(R.mod(R.mknum("7"), R.mknum("3")), "1");
  assert.teststr(R.mod(R.mknum("20"), R.mknum("15")), "5");
  assert.teststr(R.mod(R.mknum("432"), R.mknum("76")), "52");
  assert.teststr(R.mod(R.mknum("744"), R.mknum("264")), "216");
  assert.teststr(R.mod(R.mknum("264"), R.mknum("216")), "48");
  assert.teststr(R.mod(R.mknum("216"), R.mknum("48")), "24");
  assert.teststr(R.mod(R.mknum("48"), R.mknum("24")), "0");
  assert.teststr(R.mod(R.mknum("-5"), R.mknum("2")), "1");
  
  assert.teststr(R.modPow(R.mknum("7"), R.mknum("723"), R.mknum("13")), "5");
  assert.teststr(R.modPow(R.mknum("56"), R.mknum("1"), R.mknum("13")), "4");
  assert.teststr(R.modPow(R.mknum("56"), R.mknum("1"), R.mknum("13")), "4");
  assert.teststr(R.modPow(R.mknum("23524"), R.mknum("152"), R.mknum("1234")), "452");
  assert.teststr(R.modPow(R.mknum("23524235242"), R.mknum("11273851274932754"), R.mknum("123428357274328")), "100174934273296");
});

QUnit.test('gcd', function (assert){
  assert.teststr(R.gcd(R.mknum("1"), R.mknum("1")), "1");
  
  assert.teststr(R.gcd(R.mknum("1"), R.mknum("0")), "1");
  assert.teststr(R.gcd(R.mknum("0"), R.mknum("1")), "1");
  assert.teststr(R.gcd(R.mknum("-1"), R.mknum("0")), "1");
  assert.teststr(R.gcd(R.mknum("0"), R.mknum("-1")), "1");
  
  assert.teststr(R.gcd(R.mknum("54"), R.mknum("24")), "6");
  assert.teststr(R.gcd(R.mknum("-54"), R.mknum("24")), "6");
  assert.teststr(R.gcd(R.mknum("54"), R.mknum("-24")), "6");
  assert.teststr(R.gcd(R.mknum("-54"), R.mknum("-24")), "6");
  
  assert.teststr(R.gcd(R.mknum("5.4"), R.mknum("2.4")), "0.6");
  assert.teststr(R.gcd(R.mknum("54"), R.mknum("2.4")), "1.2");
  assert.teststr(R.gcd(R.mknum("5.4"), R.mknum("24")), "0.6");
  
  assert.teststr(R.gcd(R.mknum("7"), R.mknum("3")), "1");
  assert.teststr(R.gcd(R.mknum("20"), R.mknum("15")), "5");
  assert.teststr(R.gcd(R.mknum("432"), R.mknum("76")), "4");
  assert.teststr(R.gcd(R.mknum("744"), R.mknum("264")), "24");
});

QUnit.assert.testarr3 = function (a, a1, a2, a3){
  this.teststr(a[0], a1);
  this.teststr(a[1], a2);
  this.teststr(a[2], a3);
};

QUnit.test('gcd2cert', function (assert){
  assert.testarr3(R.gcd2cert(R.mknum("1"), R.mknum("1")), "0", "1", "1");
  
  assert.testarr3(R.gcd2cert(R.mknum("1"), R.mknum("0")), "1", "0", "1");
  assert.testarr3(R.gcd2cert(R.mknum("0"), R.mknum("1")), "0", "1", "1");
  assert.testarr3(R.gcd2cert(R.mknum("-1"), R.mknum("0")), "-1", "0", "1");
  assert.testarr3(R.gcd2cert(R.mknum("0"), R.mknum("-1")), "0", "-1", "1");
  
  assert.testarr3(R.gcd2cert(R.mknum("54"), R.mknum("24")), "1", "-2", "6");
  assert.testarr3(R.gcd2cert(R.mknum("-54"), R.mknum("24")), "-1", "-2", "6");
  assert.testarr3(R.gcd2cert(R.mknum("54"), R.mknum("-24")), "1", "2", "6");
  assert.testarr3(R.gcd2cert(R.mknum("-54"), R.mknum("-24")), "-1", "2", "6");
  
  assert.testarr3(R.gcd2cert(R.mknum("5.4"), R.mknum("2.4")), "1", "-2", "0.6");
  assert.testarr3(R.gcd2cert(R.mknum("54"), R.mknum("2.4")), "1", "-22", "1.2");
  assert.testarr3(R.gcd2cert(R.mknum("5.4"), R.mknum("24")), "9", "-2", "0.6");
  
  assert.testarr3(R.gcd2cert(R.mknum("7"), R.mknum("3")), "1", "-2", "1");
  assert.testarr3(R.gcd2cert(R.mknum("20"), R.mknum("15")), "1", "-1", "5");
  assert.testarr3(R.gcd2cert(R.mknum("432"), R.mknum("76")), "3", "-17", "4");
  assert.testarr3(R.gcd2cert(R.mknum("744"), R.mknum("264")), "5", "-14", "24");
});

QUnit.test('fullSolveLinCon', function (assert){
  assert.testarr(R.fullSolveLinCon(R.mknum("5"), R.mknum("2"), R.mknum("7")), "6", "7");
  assert.testarr(R.fullSolveLinCon(R.mknum("1"), R.mknum("2"), R.mknum("7")), "2", "7");
  assert.same(R.fullSolveLinCon(R.mknum("3"), R.mknum("2"), R.mknum("6")), null);
  assert.testarr(R.fullSolveLinCon(R.mknum("3"), R.mknum("2"), R.mknum("7")), "3", "7");
  
  assert.testarr(R.fullSolveLinCon(R.mknum("-4"), R.mknum("2"), R.mknum("7")), "3", "7");
  assert.testarr(R.fullSolveLinCon(R.mknum("3"), R.mknum("9"), R.mknum("7")), "3", "7");
  assert.testarr(R.fullSolveLinCon(R.mknum("-4"), R.mknum("9"), R.mknum("7")), "3", "7");
  
  // class examples
  assert.testarr(R.fullSolveLinCon(R.mknum("2"), R.mknum("3"), R.mknum("5")), "4", "5");
  assert.testarr(R.fullSolveLinCon(R.mknum("884"), R.mknum("130"), R.mknum("273")), "2", "21");
  assert.testarr(R.fullSolveLinCon(R.mknum("5"), R.mknum("39"), R.mknum("168")), "75", "168");
  assert.testarr(R.fullSolveLinCon(R.mknum("20"), R.mknum("11"), R.mknum("27")), "10", "27");
  assert.testarr(R.fullSolveLinCon(R.mknum("99"), R.mknum("45"), R.mknum("120")), "15", "40");
  assert.testarr(R.fullSolveLinCon(R.mknum("2016"), R.mknum("3360"), R.mknum("4242")), "69", "101");
  assert.same(R.fullSolveLinCon(R.mknum("2016"), R.mknum("2424"), R.mknum("4242")), null);
  assert.testarr(R.fullSolveLinCon(R.mknum("79"), R.mknum("22"), R.mknum("161")), "39", "161");
});

QUnit.test('solveLinCon', function (assert){
  assert.teststr(R.solveLinCon(R.mknum("5"), R.mknum("2"), R.mknum("7")), "6");
  assert.teststr(R.solveLinCon(R.mknum("1"), R.mknum("2"), R.mknum("7")), "2");
  assert.teststr(R.solveLinCon(R.mknum("3"), R.mknum("2"), R.mknum("6")), "-1");
});

QUnit.test('real2bin', function (assert){
  assert.same(R.real2bin(R.mknum("0")), [], $.iso);
  assert.same(R.real2bin(R.mknum("1")), [1], $.iso);
  assert.same(R.real2bin(R.mknum("2")), [0, 1], $.iso);
  assert.same(R.real2bin(R.mknum("3")), [1, 1], $.iso);
  assert.same(R.real2bin(R.mknum("4")), [0, 0, 1], $.iso);
  assert.same(R.real2bin(R.mknum("5")), [1, 0, 1], $.iso);
  assert.same(R.real2bin(R.mknum("6")), [0, 1, 1], $.iso);
  assert.same(R.real2bin(R.mknum("7")), [1, 1, 1], $.iso);
  assert.same(R.real2bin(R.mknum("8")), [0, 0, 0, 1], $.iso);
});

QUnit.assert.testFactorTwos = function (a, r, d){
  var ret = R.factorTwos(a);
  this.same(ret[0], r, "factorTwos(" + R.tostr(a) + ")[0] = " + r);
  this.teststr(ret[1], d, "factorTwos(" + R.tostr(a) + ")[1] = " + d);
};

QUnit.test('factorTwos', function (assert){
  assert.testFactorTwos(R.mknum("0"), 0, "0");
  assert.testFactorTwos(R.mknum("1"), 0, "1");
  assert.testFactorTwos(R.mknum("2"), 1, "1");
  assert.testFactorTwos(R.mknum("3"), 0, "3");
  assert.testFactorTwos(R.mknum("4"), 2, "1");
  assert.testFactorTwos(R.mknum("5"), 0, "5");
  assert.testFactorTwos(R.mknum("6"), 1, "3");
  assert.testFactorTwos(R.mknum("7"), 0, "7");
  assert.testFactorTwos(R.mknum("8"), 3, "1");
  assert.testFactorTwos(R.mknum("9"), 0, "9");
  assert.testFactorTwos(R.mknum("10"), 1, "5");
  assert.testFactorTwos(R.mknum("12"), 2, "3");
  assert.testFactorTwos(R.mknum("-1"), 0, "-1");
  assert.testFactorTwos(R.mknum("-2"), 1, "-1");
  assert.testFactorTwos(R.mknum("-4"), 2, "-1");
  assert.testFactorTwos(R.mknum("-3"), 0, "-3");
  assert.testFactorTwos(R.mknum("-6"), 1, "-3");
});

QUnit.test('isCoprime', function (assert){
  assert.true(R.isCoprime(R.mknum("2"), R.mknum("3")));
  assert.true(R.isCoprime(R.mknum("25"), R.mknum("92")));
  assert.false(R.isCoprime(R.mknum("12"), R.mknum("15")));
  assert.true(R.isCoprime(R.mknum("0"), R.mknum("1")));
  assert.false(R.isCoprime(R.mknum("-12"), R.mknum("15")));
  assert.true(R.isCoprime(R.mknum("20"), R.mknum("21")));
});

QUnit.test('isFermatPseudoprime', function (assert){
  var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  var pseudoprimes = {
    3: [91],
    4: [15, 85, 91],
    5: [4],
    6: [35],
    7: [6, 25],
    8: [9, 21, 45, 63, 65],
    9: [4, 8, 28, 52, 91],
    10: [9, 33, 91, 99]
  };
  
  for (var a = 2; a <= 10; a++){
    for (var n = 2; n <= 100; n++){
      if (R.isCoprime(R.real(n), R.real(a))){
        var b = R.isFermatPseudoprime(R.real(n), R.real(a));
        if ($.has(n, primes) || (pseudoprimes[a] !== undefined && $.has(n, pseudoprimes[a]))){
          assert.true(b, "isFermatPseudoprime(" + n + ", " + a + ") = true");
        } else {
          assert.false(b, "isFermatPseudoprime(" + n + ", " + a + ") = false");
        }
      }
    }
  }
});

QUnit.test('isMillerRabinPseudoprime', function (assert){
  var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  var pseudoprimes = {
    3: [],
    4: [],
    5: [],
    6: [],
    7: [25],
    8: [9, 65],
    9: [91],
    10: [9, 91]
  };
  
  for (var a = 2; a <= 10; a++){
    for (var n = 2; n <= 100; n++){
      if (R.isCoprime(R.real(n), R.real(a))){
        var b = R.isMillerRabinPseudoprime(R.real(n), R.real(a));
        if ($.has(n, primes) || (pseudoprimes[a] !== undefined && $.has(n, pseudoprimes[a]))){
          assert.true(b, "isMillerRabinPseudoprime(" + n + ", " + a + ") = true");
        } else {
          assert.false(b, "isMillerRabinPseudoprime(" + n + ", " + a + ") = false");
        }
      }
    }
  }
});

QUnit.test('randPowTen', function (assert){
  assert.testRandHash(100, 10000, 40, function (){return R.tonum(R.randPowTen(2));});
});

QUnit.test('randUpTo', function (assert){
  assert.testRandHash(100, 10000, 40, function (){return R.tonum(R.randUpTo(R.mknum("99")));});
  assert.testRandHash(64, 10000, 40, function (){return R.tonum(R.randUpTo(R.mknum("63")));});
});

QUnit.test("rand", function (assert){
  var randfn = function (min, max){
    return R.tonum(R.rand(R.real(min), R.real(max)));
  };
  assert.testRandHashRange(1000000, 1000010, 10000, 10, randfn);
});
