QUnit.assert.testnum = function (a, neg, dat, exp){
  this.same(a.neg, neg, 'testing neg of ' + $.dspSimp(a));
  this.iso(a.dat, dat, 'testing dat of ' + $.dspSimp(a));
  this.same(a.exp, exp, 'testing exp of ' + $.dspSimp(a));
};

QUnit.assert.teststr = function (a, x, m){
  if ($.udfp(m))m = 'testing tostr of ' + $.dspSimp(a);
  this.same(R.tostr(a), x, m);
};
