(function ($hx_exports) { "use strict";
$hx_exports.core = $hx_exports.core || {};
var HxOverrides = function() { };
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
};
var IMap = function() { };
var haxe = {};
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
};
var verb = {};
verb.BoundingBox = $hx_exports.BoundingBox = function(pts) {
	this.dim = 3;
	this.initialized = false;
	this.dim = 3;
	this.min = null;
	this.max = null;
	if(pts != null) this.addRange(pts);
};
verb.BoundingBox.intervalsOverlap = function(a1,a2,b1,b2,tol) {
	if(tol == null) tol = -1;
	var tol1;
	if(tol < 0) tol1 = verb.BoundingBox.TOLERANCE; else tol1 = tol;
	var x1 = Math.min(a1,a2) - tol1;
	var x2 = Math.max(a1,a2) + tol1;
	var y1 = Math.min(b1,b2) - tol1;
	var y2 = Math.max(b1,b2) + tol1;
	return x1 >= y1 && x1 <= y2 || x2 >= y1 && x2 <= y2 || y1 >= x1 && y1 <= x2 || y2 >= x1 && y2 <= x2;
};
verb.BoundingBox.prototype = {
	fromPoint: function(pt) {
		var bb = new verb.BoundingBox(null);
		bb.add(pt);
		return bb;
	}
	,add: function(point) {
		if(!this.initialized) {
			this.dim = point.length;
			this.min = point.slice(0);
			this.max = point.slice(0);
			this.initialized = true;
			return this;
		}
		var i = 0;
		var l = this.dim;
		var _g = 0;
		while(_g < l) {
			var i1 = _g++;
			if(point[i1] > this.max[i1]) this.max[i1] = point[i1];
		}
		var _g1 = 0;
		while(_g1 < l) {
			var i2 = _g1++;
			if(point[i2] < this.min[i2]) this.min[i2] = point[i2];
		}
		return this;
	}
	,addRange: function(points) {
		var l = points.length;
		var _g = 0;
		while(_g < l) {
			var i = _g++;
			this.add(points[i]);
		}
		return this;
	}
	,contains: function(point,tol) {
		if(tol == null) tol = -1;
		if(!this.initialized) return false;
		return this.intersects(new verb.BoundingBox([point]),tol);
	}
	,intersects: function(bb,tol) {
		if(tol == null) tol = -1;
		if(!this.initialized || !bb.initialized) return false;
		var a1 = this.min;
		var a2 = this.max;
		var b1 = bb.min;
		var b2 = bb.max;
		var _g1 = 0;
		var _g = this.dim;
		while(_g1 < _g) {
			var i = _g1++;
			if(!verb.BoundingBox.intervalsOverlap(a1[i],a2[i],b1[i],b2[i],tol)) return false;
		}
		return true;
	}
	,clear: function() {
		this.initialized = false;
		return this;
	}
	,getLongestAxis: function() {
		var max = 0.0;
		var id = 0;
		var _g1 = 0;
		var _g = this.dim;
		while(_g1 < _g) {
			var i = _g1++;
			var l = this.getAxisLength(i);
			if(l > max) {
				max = l;
				id = i;
			}
		}
		return id;
	}
	,getAxisLength: function(i) {
		if(i < 0 || i > this.dim - 1) return 0.0;
		return Math.abs(this.min[i] - this.max[i]);
	}
	,intersect: function(bb,tol) {
		if(!this.initialized) return null;
		var a1 = this.min;
		var a2 = this.max;
		var b1 = bb.min;
		var b2 = bb.max;
		if(!this.intersects(bb,tol)) return null;
		var maxbb = [];
		var minbb = [];
		var _g1 = 0;
		var _g = this.dim;
		while(_g1 < _g) {
			var i = _g1++;
			maxbb.push(Math.min(a2[i],b2[i]));
			minbb.push(Math.max(a1[i],b1[i]));
		}
		return new verb.BoundingBox([minbb,maxbb]);
	}
};
verb.Init = function() { };
verb.Init.main = function() {
	console.log("verb 0.2.0");
};
verb.core = {};
verb.core.Analyze = $hx_exports.core.Analyze = function() { };
verb.core.Analyze.rational_curve_arc_length = function(curve,u,gaussDegIncrease) {
	if(gaussDegIncrease == null) gaussDegIncrease = 16;
	if(u == null) u = verb.core.Utils.last(curve.knots); else u = u;
	var crvs = verb.core.Modify.curve_bezier_decompose(curve);
	var i = 0;
	var cc = crvs[0];
	var sum = 0.0;
	while(i < crvs.length && cc.knots[0] + verb.core.Constants.EPSILON < u) {
		var param = Math.min(verb.core.Utils.last(cc.knots),u);
		sum += verb.core.Analyze.rational_bezier_curve_arc_length(cc,param,gaussDegIncrease);
		cc = crvs[++i];
	}
	return sum;
};
verb.core.Analyze.rational_bezier_curve_arc_length = function(curve,u,gaussDegIncrease) {
	if(gaussDegIncrease == null) gaussDegIncrease = 16;
	var u1;
	if(u == null) u1 = verb.core.Utils.last(curve.knots); else u1 = u;
	var z = (u1 - curve.knots[0]) / 2;
	var sum = 0.0;
	var gaussDeg = curve.degree + gaussDegIncrease;
	var cu;
	var tan;
	var _g = 0;
	while(_g < gaussDeg) {
		var i = _g++;
		cu = z * verb.core.Analyze.Tvalues[gaussDeg][i] + z + curve.knots[0];
		tan = verb.core.Eval.rational_curve_derivs(curve,cu,1);
		sum += verb.core.Analyze.Cvalues[gaussDeg][i] * verb.core.Vec.norm(tan[1]);
	}
	return z * sum;
};
verb.core.Binomial = function() { };
verb.core.Binomial.get = function(n,k) {
	if(k == 0.0) return 1.0;
	if(n == 0 || k > n) return 0.0;
	if(k > n - k) k = n - k;
	if(verb.core.Binomial.memo_exists(n,k)) return verb.core.Binomial.get_memo(n,k);
	var r = 1;
	var n_o = n;
	var _g1 = 1;
	var _g = k + 1;
	while(_g1 < _g) {
		var d = _g1++;
		if(verb.core.Binomial.memo_exists(n_o,d)) {
			n--;
			r = verb.core.Binomial.get_memo(n_o,d);
			continue;
		}
		r *= n--;
		r /= d;
		verb.core.Binomial.memoize(n_o,d,r);
	}
	return r;
};
verb.core.Binomial.get_no_memo = function(n,k) {
	if(k == 0) return 1;
	if(n == 0 || k > n) return 0;
	if(k > n - k) k = n - k;
	var r = 1;
	var n_o = n;
	var _g1 = 1;
	var _g = k + 1;
	while(_g1 < _g) {
		var d = _g1++;
		r *= n--;
		r /= d;
	}
	return r;
};
verb.core.Binomial.memo_exists = function(n,k) {
	return verb.core.Binomial.memo.exists(n) && verb.core.Binomial.memo.get(n).exists(k);
};
verb.core.Binomial.get_memo = function(n,k) {
	return verb.core.Binomial.memo.get(n).get(k);
};
verb.core.Binomial.memoize = function(n,k,val) {
	if(!verb.core.Binomial.memo.exists(n)) verb.core.Binomial.memo.set(n,new haxe.ds.IntMap());
	verb.core.Binomial.memo.get(n).set(k,val);
};
verb.core.Constants = $hx_exports.core.Constants = function() { };
verb.core.Eval = $hx_exports.core.Eval = function() { };
verb.core.Eval.rational_surface_derivs = function(surface,num_derivs,u,v) {
	var ders = verb.core.Eval.surface_derivs(surface,num_derivs,u,v);
	var Aders = verb.core.Eval.rational_2d(ders);
	var wders = verb.core.Eval.weight_2d(ders);
	var SKL = new Array();
	var dim = Aders[0][0].length;
	var _g1 = 0;
	var _g = num_derivs + 1;
	while(_g1 < _g) {
		var k = _g1++;
		SKL.push(new Array());
		var _g3 = 0;
		var _g2 = num_derivs - k + 1;
		while(_g3 < _g2) {
			var l = _g3++;
			var v1 = Aders[k][l];
			var _g5 = 1;
			var _g4 = l + 1;
			while(_g5 < _g4) {
				var j = _g5++;
				v1 = verb.core.Vec.sub(v1,verb.core.Vec.mul(verb.core.Binomial.get(l,j) * wders[0][j],SKL[k][l - j]));
			}
			var _g51 = 1;
			var _g41 = k + 1;
			while(_g51 < _g41) {
				var i = _g51++;
				v1 = verb.core.Vec.sub(v1,verb.core.Vec.mul(verb.core.Binomial.get(k,i) * wders[i][0],SKL[k - i][l]));
				var v2 = verb.core.Vec.zeros1d(dim);
				var _g7 = 1;
				var _g6 = l + 1;
				while(_g7 < _g6) {
					var j1 = _g7++;
					v2 = verb.core.Vec.add(v2,verb.core.Vec.mul(verb.core.Binomial.get(l,j1) * wders[i][j1],SKL[k - i][l - j1]));
				}
				v1 = verb.core.Vec.sub(v1,verb.core.Vec.mul(verb.core.Binomial.get(k,i),v2));
			}
			SKL[k].push(verb.core.Vec.mul(1 / wders[0][0],v1));
		}
	}
	return SKL;
};
verb.core.Eval.rational_surface_point = function(surface,u,v) {
	return verb.core.Eval.dehomogenize(verb.core.Eval.surface_point(surface,u,v));
};
verb.core.Eval.rational_curve_derivs = function(curve,u,num_derivs) {
	var ders = verb.core.Eval.curve_derivs(curve,u,num_derivs);
	var Aders = verb.core.Eval.rational_1d(ders);
	var wders = verb.core.Eval.weight_1d(ders);
	var k = 0;
	var i = 0;
	var CK = [];
	var _g1 = 0;
	var _g = num_derivs + 1;
	while(_g1 < _g) {
		var k1 = _g1++;
		var v = Aders[k1];
		var _g3 = 1;
		var _g2 = k1 + 1;
		while(_g3 < _g2) {
			var i1 = _g3++;
			v = verb.core.Vec.sub(v,verb.core.Vec.mul(verb.core.Binomial.get(k1,i1) * wders[i1],CK[k1 - i1]));
		}
		CK.push(verb.core.Vec.mul(1 / wders[0],v));
	}
	return CK;
};
verb.core.Eval.rational_curve_point = function(curve,u) {
	return verb.core.Eval.dehomogenize(verb.core.Eval.curve_point(curve,u));
};
verb.core.Eval.dehomogenize = function(homo_point) {
	var dim = homo_point.length;
	var point = [];
	var wt = homo_point[dim - 1];
	var l = homo_point.length - 1;
	var _g = 0;
	while(_g < l) {
		var i = _g++;
		point.push(homo_point[i] / wt);
	}
	return point;
};
verb.core.Eval.rational_1d = function(homo_points) {
	var dim = homo_points[0].length - 1;
	return homo_points.map(function(x) {
		return x.slice(0,dim);
	});
};
verb.core.Eval.rational_2d = function(homo_points) {
	return homo_points.map(verb.core.Eval.rational_1d);
};
verb.core.Eval.weight_1d = function(homo_points) {
	var dim = homo_points[0].length - 1;
	return homo_points.map(function(x) {
		return x[dim];
	});
};
verb.core.Eval.weight_2d = function(homo_points) {
	return homo_points.map(verb.core.Eval.weight_1d);
};
verb.core.Eval.dehomogenize_1d = function(homo_points) {
	return homo_points.map(verb.core.Eval.dehomogenize);
};
verb.core.Eval.dehomogenize_2d = function(homo_points) {
	return homo_points.map(verb.core.Eval.dehomogenize_1d);
};
verb.core.Eval.homogenize_1d = function(control_points,weights) {
	var rows = control_points.length;
	var dim = control_points[0].length;
	var homo_control_points = new Array();
	var wt = 0.0;
	var ref_pt = new Array();
	var _g = 0;
	while(_g < rows) {
		var i = _g++;
		var pt = [];
		ref_pt = control_points[i];
		wt = weights[i];
		var _g1 = 0;
		while(_g1 < dim) {
			var k = _g1++;
			pt.push(ref_pt[k] * wt);
		}
		pt.push(wt);
		homo_control_points.push(pt);
	}
	return homo_control_points;
};
verb.core.Eval.homogenize_2d = function(control_points,weights) {
	var rows = control_points.length;
	var homo_control_points = new Array();
	var _g = 0;
	while(_g < rows) {
		var i = _g++;
		homo_control_points.push(verb.core.Eval.homogenize_1d(control_points[i],weights[i]));
	}
	return homo_control_points;
};
verb.core.Eval.surface_derivs = function(surface,num_derivatives,u,v) {
	var n = surface.knotsU.length - surface.degreeU - 2;
	var m = surface.knotsV.length - surface.degreeV - 2;
	return verb.core.Eval.surface_derivs_given_n_m(n,m,surface,num_derivatives,u,v);
};
verb.core.Eval.surface_derivs_given_n_m = function(n,m,surface,num_derivatives,u,v) {
	var degree_u = surface.degreeU;
	var degree_v = surface.degreeV;
	var control_points = surface.controlPoints;
	var knots_u = surface.knotsU;
	var knots_v = surface.knotsV;
	if(!verb.core.Eval.are_valid_relations(degree_u,control_points.length,knots_u.length) || !verb.core.Eval.are_valid_relations(degree_v,control_points[0].length,knots_v.length)) throw "Invalid relations between control points, knot vector, and n";
	var dim = control_points[0][0].length;
	var du;
	if(num_derivatives < degree_u) du = num_derivatives; else du = degree_u;
	var dv;
	if(num_derivatives < degree_v) dv = num_derivatives; else dv = degree_v;
	var SKL = verb.core.Vec.zeros3d(du + 1,dv + 1,dim);
	var knot_span_index_u = verb.core.Eval.knot_span_given_n(n,degree_u,u,knots_u);
	var knot_span_index_v = verb.core.Eval.knot_span_given_n(m,degree_v,v,knots_v);
	var uders = verb.core.Eval.deriv_basis_functions_given_n_i(knot_span_index_u,u,degree_u,n,knots_u);
	var vders = verb.core.Eval.deriv_basis_functions_given_n_i(knot_span_index_v,v,degree_v,m,knots_v);
	var temp = verb.core.Vec.zeros2d(degree_v + 1,dim);
	var dd = 0;
	var _g1 = 0;
	var _g = du + 1;
	while(_g1 < _g) {
		var k = _g1++;
		var _g3 = 0;
		var _g2 = degree_v + 1;
		while(_g3 < _g2) {
			var s = _g3++;
			temp[s] = verb.core.Vec.zeros1d(dim);
			var _g5 = 0;
			var _g4 = degree_u + 1;
			while(_g5 < _g4) {
				var r = _g5++;
				temp[s] = verb.core.Vec.add(temp[s],verb.core.Vec.mul(uders[k][r],control_points[knot_span_index_u - degree_u + r][knot_span_index_v - degree_v + s]));
			}
		}
		var nk = num_derivatives - k;
		if(nk < dv) dd = nk; else dd = dv;
		var _g31 = 0;
		var _g21 = dd + 1;
		while(_g31 < _g21) {
			var l = _g31++;
			SKL[k][l] = verb.core.Vec.zeros1d(dim);
			var _g51 = 0;
			var _g41 = degree_v + 1;
			while(_g51 < _g41) {
				var s1 = _g51++;
				SKL[k][l] = verb.core.Vec.add(SKL[k][l],verb.core.Vec.mul(vders[l][s1],temp[s1]));
			}
		}
	}
	return SKL;
};
verb.core.Eval.surface_point = function(surface,u,v) {
	var n = surface.knotsU.length - surface.degreeU - 2;
	var m = surface.knotsV.length - surface.degreeV - 2;
	return verb.core.Eval.surface_point_given_n_m(n,m,surface,u,v);
};
verb.core.Eval.surface_point_given_n_m = function(n,m,surface,u,v) {
	var degree_u = surface.degreeU;
	var degree_v = surface.degreeV;
	var control_points = surface.controlPoints;
	var knots_u = surface.knotsU;
	var knots_v = surface.knotsV;
	if(!verb.core.Eval.are_valid_relations(degree_u,control_points.length,knots_u.length) || !verb.core.Eval.are_valid_relations(degree_v,control_points[0].length,knots_v.length)) throw "Invalid relations between control points, knot vector, and n";
	var dim = control_points[0][0].length;
	var knot_span_index_u = verb.core.Eval.knot_span_given_n(n,degree_u,u,knots_u);
	var knot_span_index_v = verb.core.Eval.knot_span_given_n(m,degree_v,v,knots_v);
	var u_basis_vals = verb.core.Eval.basis_functions_given_knot_span_index(knot_span_index_u,u,degree_u,knots_u);
	var v_basis_vals = verb.core.Eval.basis_functions_given_knot_span_index(knot_span_index_v,v,degree_v,knots_v);
	var uind = knot_span_index_u - degree_u;
	var vind = knot_span_index_v;
	var position = verb.core.Vec.zeros1d(dim);
	var temp = verb.core.Vec.zeros1d(dim);
	var _g1 = 0;
	var _g = degree_v + 1;
	while(_g1 < _g) {
		var l = _g1++;
		temp = verb.core.Vec.zeros1d(dim);
		vind = knot_span_index_v - degree_v + l;
		var _g3 = 0;
		var _g2 = degree_u + 1;
		while(_g3 < _g2) {
			var k = _g3++;
			temp = verb.core.Vec.add(temp,verb.core.Vec.mul(u_basis_vals[k],control_points[uind + k][vind]));
		}
		position = verb.core.Vec.add(position,verb.core.Vec.mul(v_basis_vals[l],temp));
	}
	return position;
};
verb.core.Eval.curve_derivs = function(crv,u,num_derivs) {
	var n = crv.knots.length - crv.degree - 2;
	return verb.core.Eval.curve_derivs_given_n(n,crv,u,num_derivs);
};
verb.core.Eval.curve_derivs_given_n = function(n,curve,u,num_derivatives) {
	var degree = curve.degree;
	var control_points = curve.controlPoints;
	var knots = curve.knots;
	if(!verb.core.Eval.are_valid_relations(degree,control_points.length,knots.length)) throw "Invalid relations between control points, knot vector, and n";
	var dim = control_points[0].length;
	var du;
	if(num_derivatives < degree) du = num_derivatives; else du = degree;
	var CK = verb.core.Vec.zeros2d(du + 1,dim);
	var knot_span_index = verb.core.Eval.knot_span_given_n(n,degree,u,knots);
	var nders = verb.core.Eval.deriv_basis_functions_given_n_i(knot_span_index,u,degree,du,knots);
	var k = 0;
	var j = 0;
	var _g1 = 0;
	var _g = du + 1;
	while(_g1 < _g) {
		var k1 = _g1++;
		var _g3 = 0;
		var _g2 = degree + 1;
		while(_g3 < _g2) {
			var j1 = _g3++;
			CK[k1] = verb.core.Vec.add(CK[k1],verb.core.Vec.mul(nders[k1][j1],control_points[knot_span_index - degree + j1]));
		}
	}
	return CK;
};
verb.core.Eval.curve_point = function(curve,u) {
	var n = curve.knots.length - curve.degree - 2;
	return verb.core.Eval.curve_point_given_n(n,curve,u);
};
verb.core.Eval.are_valid_relations = function(degree,num_control_points,knots_length) {
	return num_control_points + degree + 1 - knots_length == 0;
};
verb.core.Eval.curve_point_given_n = function(n,curve,u) {
	var degree = curve.degree;
	var control_points = curve.controlPoints;
	var knots = curve.knots;
	if(!verb.core.Eval.are_valid_relations(degree,control_points.length,knots.length)) {
		throw "Invalid relations between control points, knot Array, and n";
		return null;
	}
	var knot_span_index = verb.core.Eval.knot_span_given_n(n,degree,u,knots);
	var basis_values = verb.core.Eval.basis_functions_given_knot_span_index(knot_span_index,u,degree,knots);
	var position = verb.core.Vec.zeros1d(control_points[0].length);
	var _g1 = 0;
	var _g = degree + 1;
	while(_g1 < _g) {
		var j = _g1++;
		position = verb.core.Vec.add(position,verb.core.Vec.mul(basis_values[j],control_points[knot_span_index - degree + j]));
	}
	return position;
};
verb.core.Eval.deriv_basis_functions = function(u,degree,knots) {
	var knot_span_index = verb.core.Eval.knot_span(degree,u,knots);
	var m = knots.length - 1;
	var n = m - degree - 1;
	return verb.core.Eval.deriv_basis_functions_given_n_i(knot_span_index,u,degree,n,knots);
};
verb.core.Eval.deriv_basis_functions_given_n_i = function(knot_span_index,u,p,n,knots) {
	var ndu = verb.core.Vec.zeros2d(p + 1,p + 1);
	var left = verb.core.Vec.zeros1d(p + 1);
	var right = verb.core.Vec.zeros1d(p + 1);
	var saved = 0.0;
	var temp = 0.0;
	ndu[0][0] = 1.0;
	var _g1 = 1;
	var _g = p + 1;
	while(_g1 < _g) {
		var j = _g1++;
		left[j] = u - knots[knot_span_index + 1 - j];
		right[j] = knots[knot_span_index + j] - u;
		saved = 0.0;
		var _g2 = 0;
		while(_g2 < j) {
			var r = _g2++;
			ndu[j][r] = right[r + 1] + left[j - r];
			temp = ndu[r][j - 1] / ndu[j][r];
			ndu[r][j] = saved + right[r + 1] * temp;
			saved = left[j - r] * temp;
		}
		ndu[j][j] = saved;
	}
	var ders = verb.core.Vec.zeros2d(n + 1,p + 1);
	var a = verb.core.Vec.zeros2d(2,p + 1);
	var s1 = 0;
	var s2 = 1;
	var d = 0.0;
	var rk = 0;
	var pk = 0;
	var j1 = 0;
	var j2 = 0;
	var _g11 = 0;
	var _g3 = p + 1;
	while(_g11 < _g3) {
		var j3 = _g11++;
		ders[0][j3] = ndu[j3][p];
	}
	var _g12 = 0;
	var _g4 = p + 1;
	while(_g12 < _g4) {
		var r1 = _g12++;
		s1 = 0;
		s2 = 1;
		a[0][0] = 1.0;
		var _g31 = 1;
		var _g21 = n + 1;
		while(_g31 < _g21) {
			var k = _g31++;
			d = 0.0;
			rk = r1 - k;
			pk = p - k;
			if(r1 >= k) {
				a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
				d = a[s2][0] * ndu[rk][pk];
			}
			if(rk >= -1) j1 = 1; else j1 = -rk;
			if(r1 - 1 <= pk) j2 = k - 1; else j2 = p - r1;
			var _g5 = j1;
			var _g41 = j2 + 1;
			while(_g5 < _g41) {
				var j4 = _g5++;
				a[s2][j4] = (a[s1][j4] - a[s1][j4 - 1]) / ndu[pk + 1][rk + j4];
				d += a[s2][j4] * ndu[rk + j4][pk];
			}
			if(r1 <= pk) {
				a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r1];
				d += a[s2][k] * ndu[r1][pk];
			}
			ders[k][r1] = d;
			var temp1 = s1;
			s1 = s2;
			s2 = temp1;
		}
	}
	var acc = p;
	var _g13 = 1;
	var _g6 = n + 1;
	while(_g13 < _g6) {
		var k1 = _g13++;
		var _g32 = 0;
		var _g22 = p + 1;
		while(_g32 < _g22) {
			var j5 = _g32++;
			ders[k1][j5] *= acc;
		}
		acc *= p - k1;
	}
	return ders;
};
verb.core.Eval.basis_functions = function(u,degree,knots) {
	var knot_span_index = verb.core.Eval.knot_span(degree,u,knots);
	return verb.core.Eval.basis_functions_given_knot_span_index(knot_span_index,u,degree,knots);
};
verb.core.Eval.basis_functions_given_knot_span_index = function(knot_span_index,u,degree,knots) {
	var basis_functions = verb.core.Vec.zeros1d(degree + 1);
	var left = verb.core.Vec.zeros1d(degree + 1);
	var right = verb.core.Vec.zeros1d(degree + 1);
	var saved = 0;
	var temp = 0;
	basis_functions[0] = 1.0;
	var _g1 = 1;
	var _g = degree + 1;
	while(_g1 < _g) {
		var j = _g1++;
		left[j] = u - knots[knot_span_index + 1 - j];
		right[j] = knots[knot_span_index + j] - u;
		saved = 0.0;
		var _g2 = 0;
		while(_g2 < j) {
			var r = _g2++;
			temp = basis_functions[r] / (right[r + 1] + left[j - r]);
			basis_functions[r] = saved + right[r + 1] * temp;
			saved = left[j - r] * temp;
		}
		basis_functions[j] = saved;
	}
	return basis_functions;
};
verb.core.Eval.knot_span = function(degree,u,knots) {
	var m = knots.length - 1;
	var n = m - degree - 1;
	return verb.core.Eval.knot_span_given_n(n,degree,u,knots);
};
verb.core.Eval.knot_span_given_n = function(n,degree,u,knots) {
	if(u >= knots[n + 1]) return n;
	if(u < knots[degree]) return degree;
	var low = degree;
	var high = n + 1;
	var mid = Math.floor((low + high) / 2);
	while(u < knots[mid] || u >= knots[mid + 1]) {
		if(u < knots[mid]) high = mid; else low = mid;
		mid = Math.floor((low + high) / 2);
	}
	return mid;
};
verb.core.Intersect = $hx_exports.core.Intersect = function() { };
verb.core.Intersect.rays = function(a0,a,b0,b) {
	var dab = verb.core.Vec.dot(a,b);
	var dab0 = verb.core.Vec.dot(a,b0);
	var daa0 = verb.core.Vec.dot(a,a0);
	var dbb0 = verb.core.Vec.dot(b,b0);
	var dba0 = verb.core.Vec.dot(b,a0);
	var daa = verb.core.Vec.dot(a,a);
	var dbb = verb.core.Vec.dot(b,b);
	var div = daa * dbb - dab * dab;
	if(Math.abs(div) < verb.core.Constants.EPSILON) return null;
	var num = dab * (dab0 - daa0) - daa * (dbb0 - dba0);
	var w = num / div;
	var t = (dab0 - daa0 + w * dab) / daa;
	return [t,w];
};
verb.core.Make = $hx_exports.core.Make = function() { };
verb.core.Make.sweep1_surface = function(profile,rail) {
	var rail_start = verb.core.Eval.rational_curve_point(rail,0.0);
	var span = 1.0 / rail.controlPoints.length;
	var control_points = [];
	var weights = [];
	var rail_weights = verb.core.Eval.weight_1d(rail.controlPoints);
	var profile_weights = verb.core.Eval.weight_1d(profile.controlPoints);
	var profile_points = verb.core.Eval.dehomogenize_1d(profile.controlPoints);
	var _g1 = 0;
	var _g = rail.controlPoints.length;
	while(_g1 < _g) {
		var i = _g1++;
		var rail_point = verb.core.Eval.rational_curve_point(rail,i * span);
		var rail_offset = verb.core.Vec.sub(rail_point,rail_start);
		var row_control_points = [];
		var row_weights = [];
		var _g3 = 0;
		var _g2 = profile.controlPoints.length;
		while(_g3 < _g2) {
			var j = _g3++;
			row_control_points.push(verb.core.Vec.add(rail_offset,profile_points[j]));
			row_weights.push(profile_weights[j] * rail_weights[i]);
		}
		control_points.push(row_control_points);
		weights.push(row_weights);
	}
	return new verb.core.types.SurfaceData(rail.degree,profile.degree,rail.knots,profile.knots,verb.core.Eval.homogenize_2d(control_points,weights));
};
verb.core.Make.ellipse_arc = function(center,xaxis,yaxis,xradius,yradius,startAngle,endAngle) {
	if(endAngle < startAngle) endAngle = 2.0 * Math.PI + startAngle;
	var theta = endAngle - startAngle;
	var numArcs = 0;
	if(theta <= Math.PI / 2) numArcs = 1; else if(theta <= Math.PI) numArcs = 2; else if(theta <= 3 * Math.PI / 2) numArcs = 3; else numArcs = 4;
	var dtheta = theta / numArcs;
	var n = 2 * numArcs;
	var w1 = Math.cos(dtheta / 2);
	var P0 = verb.core.Vec.add(center,verb.core.Vec.add(verb.core.Vec.mul(xradius * Math.cos(startAngle),xaxis),verb.core.Vec.mul(yradius * Math.sin(startAngle),yaxis)));
	var T0 = verb.core.Vec.sub(verb.core.Vec.mul(Math.cos(startAngle),yaxis),verb.core.Vec.mul(Math.sin(startAngle),xaxis));
	var controlPoints = [];
	var knots = verb.core.Vec.zeros1d(2 * numArcs + 3);
	var index = 0;
	var angle = startAngle;
	var weights = verb.core.Vec.zeros1d(numArcs * 2);
	controlPoints[0] = P0;
	weights[0] = 1.0;
	var _g1 = 1;
	var _g = numArcs + 1;
	while(_g1 < _g) {
		var i = _g1++;
		angle += dtheta;
		var P2 = verb.core.Vec.add(center,verb.core.Vec.add(verb.core.Vec.mul(xradius * Math.cos(angle),xaxis),verb.core.Vec.mul(yradius * Math.sin(angle),yaxis)));
		weights[index + 2] = 1;
		controlPoints[index + 2] = P2;
		var T2 = verb.core.Vec.sub(verb.core.Vec.mul(Math.cos(angle),yaxis),verb.core.Vec.mul(Math.sin(angle),xaxis));
		var params = verb.core.Intersect.rays(P0,verb.core.Vec.mul(1 / verb.core.Vec.norm(T0),T0),P2,verb.core.Vec.mul(1 / verb.core.Vec.norm(T2),T2));
		var P1 = verb.core.Vec.add(P0,verb.core.Vec.mul(params[0],T0));
		weights[index + 1] = w1;
		controlPoints[index + 1] = P1;
		index += 2;
		if(i < numArcs) {
			P0 = P2;
			T0 = T2;
		}
	}
	var j = 2 * numArcs + 1;
	var _g2 = 0;
	while(_g2 < 3) {
		var i1 = _g2++;
		knots[i1] = 0.0;
		knots[i1 + j] = 1.0;
	}
	switch(numArcs) {
	case 2:
		knots[3] = knots[4] = 0.5;
		break;
	case 3:
		knots[3] = knots[4] = 0.333333333333333315;
		knots[5] = knots[6] = 0.66666666666666663;
		break;
	case 4:
		knots[3] = knots[4] = 0.25;
		knots[5] = knots[6] = 0.5;
		knots[7] = knots[8] = 0.75;
		break;
	}
	return new verb.core.types.CurveData(2,knots,verb.core.Eval.homogenize_1d(controlPoints,weights));
};
verb.core.Make.arc = function(center,xaxis,yaxis,radius,start_angle,end_angle) {
	return verb.core.Make.ellipse_arc(center,xaxis,yaxis,radius,radius,start_angle,end_angle);
};
verb.core.Make.polyline_curve = function(pts) {
	var knots = [0.0,0.0];
	var lsum = 0.0;
	var _g1 = 0;
	var _g = pts.length - 1;
	while(_g1 < _g) {
		var i = _g1++;
		lsum += verb.core.Vec.dist(pts[i],pts[i + 1]);
		knots.push(lsum);
	}
	knots.push(lsum);
	knots = verb.core.Vec.mul(1 / lsum,knots);
	var weights;
	var _g2 = [];
	var _g21 = 0;
	var _g11 = pts.length;
	while(_g21 < _g11) {
		var i1 = _g21++;
		_g2.push(1.0);
	}
	weights = _g2;
	return new verb.core.types.CurveData(1,knots,verb.core.Eval.homogenize_1d(pts.slice(0),weights));
};
verb.core.Make.extruded_surface = function(axis,length,profile) {
	var control_points = [[],[],[]];
	var weights = [[],[],[]];
	var prof_control_points = verb.core.Eval.dehomogenize_1d(profile.controlPoints);
	var prof_weights = verb.core.Eval.weight_1d(profile.controlPoints);
	var translation = verb.core.Vec.mul(length,axis);
	var halfTranslation = verb.core.Vec.mul(0.5 * length,axis);
	var _g1 = 0;
	var _g = prof_control_points.length;
	while(_g1 < _g) {
		var j = _g1++;
		control_points[2][j] = prof_control_points[j];
		control_points[1][j] = verb.core.Vec.add(halfTranslation,prof_control_points[j]);
		control_points[0][j] = verb.core.Vec.add(translation,prof_control_points[j]);
		weights[0][j] = prof_weights[j];
		weights[1][j] = prof_weights[j];
		weights[2][j] = prof_weights[j];
	}
	return new verb.core.types.SurfaceData(2,profile.degree,[0,0,0,1,1,1],profile.knots,verb.core.Eval.homogenize_2d(control_points,weights));
};
verb.core.Make.cylinder_surface = function(axis,xaxis,base,height,radius) {
	var yaxis = verb.core.Vec.cross(axis,xaxis);
	var angle = 2.0 * Math.PI;
	var circ = verb.core.Make.arc(base,xaxis,yaxis,radius,0.0,2 * Math.PI);
	return verb.core.Make.extruded_surface(axis,height,circ);
};
verb.core.Make.revolved_surface = function(center,axis,theta,profile) {
	var prof_control_points = verb.core.Eval.dehomogenize_1d(profile.controlPoints);
	var prof_weights = verb.core.Eval.weight_1d(profile.controlPoints);
	var narcs;
	var knots_u;
	var control_points;
	var weights;
	if(theta <= Math.PI / 2) {
		narcs = 1;
		knots_u = verb.core.Vec.zeros1d(6 + 2 * (narcs - 1));
	} else if(theta <= Math.PI) {
		narcs = 2;
		knots_u = verb.core.Vec.zeros1d(6 + 2 * (narcs - 1));
		knots_u[3] = knots_u[4] = 0.5;
	} else if(theta <= 3 * Math.PI / 2) {
		narcs = 3;
		knots_u = verb.core.Vec.zeros1d(6 + 2 * (narcs - 1));
		knots_u[3] = knots_u[4] = 0.333333333333333315;
		knots_u[5] = knots_u[6] = 0.66666666666666663;
	} else {
		narcs = 4;
		knots_u = verb.core.Vec.zeros1d(6 + 2 * (narcs - 1));
		knots_u[3] = knots_u[4] = 0.25;
		knots_u[5] = knots_u[6] = 0.5;
		knots_u[7] = knots_u[8] = 0.75;
	}
	var dtheta = theta / narcs;
	var j = 3 + 2 * (narcs - 1);
	var _g = 0;
	while(_g < 3) {
		var i = _g++;
		knots_u[i] = 0.0;
		knots_u[j + i] = 1.0;
	}
	var n = 2 * narcs;
	var wm = Math.cos(dtheta / 2.0);
	var angle = 0.0;
	var sines = verb.core.Vec.zeros1d(narcs + 1);
	var cosines = verb.core.Vec.zeros1d(narcs + 1);
	var control_points1 = verb.core.Vec.zeros3d(2 * narcs + 1,prof_control_points.length,3);
	var weights1 = verb.core.Vec.zeros2d(2 * narcs + 1,prof_control_points.length);
	var _g1 = 1;
	var _g2 = narcs + 1;
	while(_g1 < _g2) {
		var i1 = _g1++;
		angle += dtheta;
		cosines[i1] = Math.cos(angle);
		sines[i1] = Math.sin(angle);
	}
	var _g11 = 0;
	var _g3 = prof_control_points.length;
	while(_g11 < _g3) {
		var j1 = _g11++;
		var O = verb.core.Trig.closest_point_on_ray(prof_control_points[j1],center,axis);
		var X = verb.core.Vec.sub(prof_control_points[j1],O);
		var r = verb.core.Vec.norm(X);
		var Y = verb.core.Vec.cross(axis,X);
		if(r > verb.core.Constants.EPSILON) {
			X = verb.core.Vec.mul(1 / r,X);
			Y = verb.core.Vec.mul(1 / r,Y);
		}
		control_points1[0][j1] = prof_control_points[j1];
		var P0 = prof_control_points[j1];
		weights1[0][j1] = prof_weights[j1];
		var T0 = Y;
		var index = 0;
		var angle1 = 0.0;
		var _g31 = 1;
		var _g21 = narcs + 1;
		while(_g31 < _g21) {
			var i2 = _g31++;
			var P2;
			if(r == 0) P2 = O; else P2 = verb.core.Vec.add(O,verb.core.Vec.add(verb.core.Vec.mul(r * cosines[i2],X),verb.core.Vec.mul(r * sines[i2],Y)));
			control_points1[index + 2][j1] = P2;
			weights1[index + 2][j1] = prof_weights[j1];
			var T2 = verb.core.Vec.sub(verb.core.Vec.mul(cosines[i2],Y),verb.core.Vec.mul(sines[i2],X));
			if(r == 0) control_points1[index + 1][j1] = O; else {
				var params = verb.core.Intersect.rays(P0,verb.core.Vec.mul(1 / verb.core.Vec.norm(T0),T0),P2,verb.core.Vec.mul(1 / verb.core.Vec.norm(T2),T2));
				var P1 = verb.core.Vec.add(P0,verb.core.Vec.mul(params[0],T0));
				control_points1[index + 1][j1] = P1;
			}
			weights1[index + 1][j1] = wm * prof_weights[j1];
			index += 2;
			if(i2 < narcs) {
				P0 = P2;
				T0 = T2;
			}
		}
	}
	return new verb.core.types.SurfaceData(2,profile.degree,knots_u,profile.knots,verb.core.Eval.homogenize_2d(control_points1,weights1));
};
verb.core.Make.sphere_surface = function(center,axis,xaxis,radius) {
	var arc = verb.core.Make.arc(center,verb.core.Vec.mul(-1.0,axis),xaxis,radius,0.0,Math.PI);
	return verb.core.Make.revolved_surface(center,axis,2 * Math.PI,arc);
};
verb.core.Make.cone_surface = function(axis,xaxis,base,height,radius) {
	var angle = 2 * Math.PI;
	var prof_degree = 1;
	var prof_ctrl_pts = [verb.core.Vec.add(base,verb.core.Vec.mul(height,axis)),verb.core.Vec.add(base,verb.core.Vec.mul(radius,xaxis))];
	var prof_knots = [0.0,0.0,1.0,1.0];
	var prof_weights = [1.0,1.0];
	var prof = new verb.core.types.CurveData(prof_degree,prof_knots,verb.core.Eval.homogenize_1d(prof_ctrl_pts,prof_weights));
	return verb.core.Make.revolved_surface(base,axis,angle,prof);
};
verb.core.Make.rational_interp_curve = function(points,degree,start_tangent,end_tangent) {
	if(degree == null) degree = 3;
	if(points.length < degree + 1) throw "You need to supply at least degree + 1 points!";
	var us = [0.0];
	var _g1 = 1;
	var _g = points.length;
	while(_g1 < _g) {
		var i = _g1++;
		var chord = verb.core.Vec.norm(verb.core.Vec.sub(points[i],points[i - 1]));
		var last = us[us.length - 1];
		us.push(last + chord);
	}
	var max = us[us.length - 1];
	var _g11 = 0;
	var _g2 = us.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		us[i1] = us[i1] / max;
	}
	var knotsStart = verb.core.Vec.rep(degree + 1,0.0);
	var hasTangents = start_tangent != null && end_tangent != null;
	var start;
	if(hasTangents) start = 0; else start = 1;
	var end;
	if(hasTangents) end = us.length - degree + 1; else end = us.length - degree;
	var _g3 = start;
	while(_g3 < end) {
		var i2 = _g3++;
		var weightSums = 0.0;
		var _g12 = 0;
		while(_g12 < degree) {
			var j = _g12++;
			weightSums += us[i2 + j];
		}
		knotsStart.push(1 / degree * weightSums);
	}
	var knots = knotsStart.concat(verb.core.Vec.rep(degree + 1,1.0));
	var A = [];
	var n;
	if(hasTangents) n = points.length + 1; else n = points.length - 1;
	var lst;
	if(hasTangents) lst = 1; else lst = 0;
	var ld;
	if(hasTangents) ld = points.length - (degree - 1); else ld = points.length - (degree + 1);
	var _g4 = 0;
	while(_g4 < us.length) {
		var u = us[_g4];
		++_g4;
		var span = verb.core.Eval.knot_span_given_n(n,degree,u,knots);
		var basisFuncs = verb.core.Eval.basis_functions_given_knot_span_index(span,u,degree,knots);
		var ls = span - degree;
		var rowstart = verb.core.Vec.zeros1d(ls);
		var rowend = verb.core.Vec.zeros1d(ld - ls);
		A.push(rowstart.concat(basisFuncs).concat(rowend));
	}
	if(hasTangents) {
		var ln = A[0].length - 2;
		var tanRow0 = [-1.0,1.0].concat(verb.core.Vec.zeros1d(ln));
		var tanRow1 = verb.core.Vec.zeros1d(ln).concat([-1.0,1.0]);
		verb.core.Utils.spliceAndInsert(A,1,0,tanRow0);
		verb.core.Utils.spliceAndInsert(A,A.length - 1,0,tanRow1);
	}
	var dim = points[0].length;
	var xs = [];
	var mult1 = (1 - knots[knots.length - degree - 2]) / degree;
	var mult0 = knots[degree + 1] / degree;
	var _g5 = 0;
	while(_g5 < dim) {
		var i3 = [_g5++];
		var b;
		if(!hasTangents) b = points.map((function(i3) {
			return function(x) {
				return x[i3[0]];
			};
		})(i3)); else {
			b = [points[0][i3[0]]];
			b.push(mult0 * start_tangent[i3[0]]);
			var _g21 = 1;
			var _g13 = points.length - 1;
			while(_g21 < _g13) {
				var j1 = _g21++;
				b.push(points[j1][i3[0]]);
			}
			b.push(mult1 * end_tangent[i3[0]]);
			b.push(verb.core.Utils.last(points)[i3[0]]);
		}
		var x1 = verb.core.Mat.solve(A,b);
		xs.push(x1);
	}
	var controlPts = verb.core.Vec.transpose(xs);
	var weights = verb.core.Vec.rep(controlPts.length,1.0);
	return new verb.core.types.CurveData(degree,knots,verb.core.Eval.homogenize_1d(controlPts,weights));
};
verb.core.LUDecomp = function(lu,p) {
	this.LU = lu;
	this.P = p;
};
verb.core.Mat = $hx_exports.core.Mat = function() { };
verb.core.Mat.solve = function(A,b) {
	return verb.core.Mat.LUsolve(verb.core.Mat.LU(A),b);
};
verb.core.Mat.LUsolve = function(LUP,b) {
	var i;
	var j;
	var LU = LUP.LU;
	var n = LU.length;
	var x = b.slice();
	var P = LUP.P;
	var Pi;
	var LUi;
	var LUii;
	var tmp;
	i = n - 1;
	while(i != -1) {
		x[i] = b[i];
		--i;
	}
	i = 0;
	while(i < n) {
		Pi = P[i];
		if(P[i] != i) {
			tmp = x[i];
			x[i] = x[Pi];
			x[Pi] = tmp;
		}
		LUi = LU[i];
		j = 0;
		while(j < i) {
			x[i] -= x[j] * LUi[j];
			++j;
		}
		++i;
	}
	i = n - 1;
	while(i >= 0) {
		LUi = LU[i];
		j = i + 1;
		while(j < n) {
			x[i] -= x[j] * LUi[j];
			++j;
		}
		x[i] /= LUi[i];
		--i;
	}
	return x;
};
verb.core.Mat.LU = function(A) {
	var abs = Math.abs;
	var i;
	var j;
	var k;
	var absAjk;
	var Akk;
	var Ak;
	var Pk;
	var Ai;
	var max;
	var _g = [];
	var _g2 = 0;
	var _g1 = A.length;
	while(_g2 < _g1) {
		var i1 = _g2++;
		_g.push(A[i1].slice());
	}
	A = _g;
	var n = A.length;
	var n1 = n - 1;
	var P = new Array();
	k = 0;
	while(k < n) {
		Pk = k;
		Ak = A[k];
		max = Math.abs(Ak[k]);
		j = k + 1;
		while(j < n) {
			absAjk = Math.abs(A[j][k]);
			if(max < absAjk) {
				max = absAjk;
				Pk = j;
			}
			++j;
		}
		P[k] = Pk;
		if(Pk != k) {
			A[k] = A[Pk];
			A[Pk] = Ak;
			Ak = A[k];
		}
		Akk = Ak[k];
		i = k + 1;
		while(i < n) {
			A[i][k] /= Akk;
			++i;
		}
		i = k + 1;
		while(i < n) {
			Ai = A[i];
			j = k + 1;
			while(j < n1) {
				Ai[j] -= Ai[k] * Ak[j];
				++j;
				Ai[j] -= Ai[k] * Ak[j];
				++j;
			}
			if(j == n1) Ai[j] -= Ai[k] * Ak[j];
			++i;
		}
		++k;
	}
	return new verb.core.LUDecomp(A,P);
};
verb.core.Mesh = function() {
};
verb.core.KnotMultiplicity = $hx_exports.core.KnotMultiplicity = function(knot,mult) {
	this.knot = knot;
	this.mult = mult;
};
verb.core.KnotMultiplicity.prototype = {
	inc: function() {
		this.mult++;
	}
};
verb.core.Modify = $hx_exports.core.Modify = function() { };
verb.core.Modify.surface_knot_refine = function(surface,knots_to_insert,useV) {
	var newPts = [];
	var knots;
	var degree;
	var ctrlPts;
	if(!useV) {
		ctrlPts = verb.core.Vec.transpose(surface.controlPoints);
		knots = surface.knotsU;
		degree = surface.degreeU;
	} else {
		ctrlPts = surface.controlPoints;
		knots = surface.knotsV;
		degree = surface.degreeV;
	}
	var c = null;
	var _g = 0;
	while(_g < ctrlPts.length) {
		var cptrow = ctrlPts[_g];
		++_g;
		c = verb.core.Modify.curve_knot_refine(new verb.core.types.CurveData(degree,knots,cptrow),knots_to_insert);
		newPts.push(c.controlPoints);
	}
	var newknots = c.knots;
	if(!useV) {
		newPts = verb.core.Vec.transpose(newPts);
		return new verb.core.types.SurfaceData(surface.degreeU,surface.degreeV,newknots,surface.knotsV.slice(),newPts);
	} else return new verb.core.types.SurfaceData(surface.degreeU,surface.degreeV,surface.knotsU.slice(),newknots,newPts);
};
verb.core.Modify.surface_split = function(surface,u,useV) {
	if(useV == null) useV = false;
	var knots;
	var degree;
	var control_points;
	if(!useV) {
		control_points = verb.core.Vec.transpose(surface.controlPoints);
		knots = surface.knotsU;
		degree = surface.degreeU;
	} else {
		control_points = surface.controlPoints;
		knots = surface.knotsV;
		degree = surface.degreeV;
	}
	var knots_to_insert;
	var _g = [];
	var _g2 = 0;
	var _g1 = degree + 1;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(u);
	}
	knots_to_insert = _g;
	var newpts0 = new Array();
	var newpts1 = new Array();
	var s = verb.core.Eval.knot_span(degree,u,knots);
	var res = null;
	var _g11 = 0;
	while(_g11 < control_points.length) {
		var cps = control_points[_g11];
		++_g11;
		res = verb.core.Modify.curve_knot_refine(new verb.core.types.CurveData(degree,knots,cps),knots_to_insert);
		newpts0.push(res.controlPoints.slice(0,s + 1));
		newpts1.push(res.controlPoints.slice(s + 1));
	}
	var knots0 = res.knots.slice(0,s + degree + 2);
	var knots1 = res.knots.slice(s + 1);
	if(!useV) {
		newpts0 = verb.core.Vec.transpose(newpts0);
		newpts1 = verb.core.Vec.transpose(newpts1);
		return [new verb.core.types.SurfaceData(degree,surface.degreeV,knots0,surface.knotsV.slice(),newpts0),new verb.core.types.SurfaceData(degree,surface.degreeV,knots1,surface.knotsV.slice(),newpts1)];
	}
	return [new verb.core.types.SurfaceData(surface.degreeU,degree,surface.knotsU.slice(),knots0,newpts0),new verb.core.types.SurfaceData(surface.degreeU,degree,surface.knotsU.slice(),knots1,newpts1)];
};
verb.core.Modify.curve_bezier_decompose = function(curve) {
	var degree = curve.degree;
	var control_points = curve.controlPoints;
	var knots = curve.knots;
	var knotmults = verb.core.Modify.knot_multiplicities(knots);
	var reqMult = degree + 1;
	var _g = 0;
	while(_g < knotmults.length) {
		var knotmult = knotmults[_g];
		++_g;
		if(knotmult.mult < reqMult) {
			var knotsInsert = verb.core.Vec.rep(reqMult - knotmult.mult,knotmult.knot);
			var res = verb.core.Modify.curve_knot_refine(new verb.core.types.CurveData(degree,knots,control_points),knotsInsert);
			knots = res.knots;
			control_points = res.controlPoints;
		}
	}
	var numCrvs = knots.length / reqMult - 1;
	var crvKnotLength = reqMult * 2;
	var crvs = [];
	var i = 0;
	while(i < control_points.length) {
		var kts = knots.slice(i,i + crvKnotLength);
		var pts = control_points.slice(i,i + reqMult);
		crvs.push(new verb.core.types.CurveData(degree,kts,pts));
		i += reqMult;
	}
	return crvs;
};
verb.core.Modify.knot_multiplicities = function(knots) {
	var mults = [new verb.core.KnotMultiplicity(knots[0],0)];
	var curr = mults[0];
	var _g = 0;
	while(_g < knots.length) {
		var knot = knots[_g];
		++_g;
		if(Math.abs(knot - curr.knot) > verb.core.Constants.EPSILON) {
			curr = new verb.core.KnotMultiplicity(knot,0);
			mults.push(curr);
		}
		curr.inc();
	}
	return mults;
};
verb.core.Modify.curve_split = function(curve,u) {
	var degree = curve.degree;
	var control_points = curve.controlPoints;
	var knots = curve.knots;
	var knots_to_insert;
	var _g = [];
	var _g2 = 0;
	var _g1 = degree + 1;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(u);
	}
	knots_to_insert = _g;
	var res = verb.core.Modify.curve_knot_refine(curve,knots_to_insert);
	var s = verb.core.Eval.knot_span(degree,u,knots);
	var knots0 = res.knots.slice(0,s + degree + 2);
	var knots1 = res.knots.slice(s + 1);
	var cpts0 = res.controlPoints.slice(0,s + 1);
	var cpts1 = res.controlPoints.slice(s + 1);
	return [new verb.core.types.CurveData(degree,knots0,cpts0),new verb.core.types.CurveData(degree,knots1,cpts1)];
};
verb.core.Modify.curve_knot_refine = function(curve,knots_to_insert) {
	var degree = curve.degree;
	var control_points = curve.controlPoints;
	var knots = curve.knots;
	var n = control_points.length - 1;
	var m = n + degree + 1;
	var r = knots_to_insert.length - 1;
	var a = verb.core.Eval.knot_span(degree,knots_to_insert[0],knots);
	var b = verb.core.Eval.knot_span(degree,knots_to_insert[r],knots);
	var control_points_post = new Array();
	var knots_post = new Array();
	var _g1 = 0;
	var _g = a - degree + 1;
	while(_g1 < _g) {
		var i = _g1++;
		control_points_post[i] = control_points[i];
	}
	var _g11 = b - 1;
	var _g2 = n + 1;
	while(_g11 < _g2) {
		var i1 = _g11++;
		control_points_post[i1 + r + 1] = control_points[i1];
	}
	var _g12 = 0;
	var _g3 = a + 1;
	while(_g12 < _g3) {
		var i2 = _g12++;
		knots_post[i2] = knots[i2];
	}
	var _g13 = b + degree;
	var _g4 = m + 1;
	while(_g13 < _g4) {
		var i3 = _g13++;
		knots_post[i3 + r + 1] = knots[i3];
	}
	var i4 = b + degree - 1;
	var k = b + degree + r;
	var j = r;
	while(j >= 0) {
		while(knots_to_insert[j] <= knots[i4] && i4 > a) {
			control_points_post[k - degree - 1] = control_points[i4 - degree - 1];
			knots_post[k] = knots[i4];
			k = k - 1;
			i4 = i4 - 1;
		}
		control_points_post[k - degree - 1] = control_points_post[k - degree];
		var _g14 = 1;
		var _g5 = degree + 1;
		while(_g14 < _g5) {
			var l = _g14++;
			var ind = k - degree + l;
			var alfa = knots_post[k + l] - knots_to_insert[j];
			if(Math.abs(alfa) < verb.core.Constants.EPSILON) control_points_post[ind - 1] = control_points_post[ind]; else {
				alfa = alfa / (knots_post[k + l] - knots[i4 - degree + l]);
				control_points_post[ind - 1] = verb.core.Vec.add(verb.core.Vec.mul(alfa,control_points_post[ind - 1]),verb.core.Vec.mul(1.0 - alfa,control_points_post[ind]));
			}
		}
		knots_post[k] = knots_to_insert[j];
		k = k - 1;
		j--;
	}
	return new verb.core.types.CurveData(degree,knots_post,control_points_post);
};
verb.core.Modify.curve_knot_insert = function(curve,u,r) {
	var degree = curve.degree;
	var control_points = curve.controlPoints;
	var knots = curve.knots;
	var s = 0;
	var num_pts = control_points.length;
	var k = verb.core.Eval.knot_span(degree,u,knots);
	var num_pts_post = num_pts + r;
	var control_points_temp = new Array();
	var knots_post = new Array();
	var control_points_post = new Array();
	var i = 0;
	var _g1 = 1;
	var _g = k + 1;
	while(_g1 < _g) {
		var i1 = _g1++;
		knots_post[i1] = knots[i1];
	}
	var _g11 = 1;
	var _g2 = r + 1;
	while(_g11 < _g2) {
		var i2 = _g11++;
		knots_post[k + i2] = u;
	}
	var _g12 = k + 1;
	var _g3 = knots.length;
	while(_g12 < _g3) {
		var i3 = _g12++;
		knots_post[i3 + r] = knots[i3];
	}
	var _g13 = 0;
	var _g4 = k - degree + 1;
	while(_g13 < _g4) {
		var i4 = _g13++;
		control_points_post[i4] = control_points[i4];
	}
	var _g5 = k - s;
	while(_g5 < num_pts) {
		var i5 = _g5++;
		control_points_post[i5 + r] = control_points[i5];
	}
	var _g14 = 0;
	var _g6 = degree - s + 1;
	while(_g14 < _g6) {
		var i6 = _g14++;
		control_points_temp[i6] = control_points[k - degree + i6];
	}
	var L = 0;
	var alpha = 0;
	var _g15 = 1;
	var _g7 = r + 1;
	while(_g15 < _g7) {
		var j = _g15++;
		L = k - degree + j;
		var _g31 = 0;
		var _g21 = degree - j - s + 1;
		while(_g31 < _g21) {
			var i7 = _g31++;
			alpha = (u - knots[L + i7]) / (knots[i7 + k + 1] - knots[L + i7]);
			control_points_temp[i7] = verb.core.Vec.add(verb.core.Vec.mul(alpha,control_points_temp[i7 + 1]),verb.core.Vec.mul(1.0 - alpha,control_points_temp[i7]));
		}
		control_points_post[L] = control_points_temp[0];
		control_points_post[k + r - j - s] = control_points_temp[degree - j - s];
	}
	var _g16 = L + 1;
	var _g8 = k - s;
	while(_g16 < _g8) {
		var i8 = _g16++;
		control_points_post[i8] = control_points_temp[i8 - L];
	}
	return new verb.core.types.CurveData(degree,knots_post,control_points_post);
};
verb.core.Tess = $hx_exports.core.Tess = function() { };
verb.core.Tess.rational_curve_regular_sample = function(curve,numSamples,includeU) {
	return verb.core.Tess.rational_curve_regular_sample_range(curve,curve.knots[0],verb.core.Utils.last(curve.knots),numSamples,includeU);
};
verb.core.Tess.rational_curve_regular_sample_range = function(curve,start,end,numSamples,includeU) {
	if(numSamples < 1) numSamples = 2;
	var p = [];
	var span = (end - start) / (numSamples - 1);
	var u = 0;
	var _g = 0;
	while(_g < numSamples) {
		var i = _g++;
		u = start + span * i;
		if(includeU) p.push([u].concat(verb.core.Eval.rational_curve_point(curve,u))); else p.push(verb.core.Eval.rational_curve_point(curve,u));
	}
	return p;
};
verb.core.Tess.rational_curve_adaptive_sample = function(curve,tol,includeU) {
	if(curve.degree == 1) {
		if(!includeU) return curve.controlPoints.map(verb.core.Eval.dehomogenize); else {
			var _g = [];
			var _g2 = 0;
			var _g1 = curve.controlPoints.length;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.push([curve.knots[i + 1]].concat(verb.core.Eval.dehomogenize(curve.controlPoints[i])));
			}
			return _g;
		}
	}
	return verb.core.Tess.rational_curve_adaptive_sample_range(curve,curve.knots[0],verb.core.Utils.last(curve.knots),tol,includeU);
};
verb.core.Tess.rational_curve_adaptive_sample_range = function(curve,start,end,tol,includeU) {
	var p1 = verb.core.Eval.rational_curve_point(curve,start);
	var p3 = verb.core.Eval.rational_curve_point(curve,end);
	var t = 0.5 + 0.2 * Math.random();
	var mid = start + (end - start) * t;
	var p2 = verb.core.Eval.rational_curve_point(curve,mid);
	var diff = verb.core.Vec.sub(p1,p3);
	var diff2 = verb.core.Vec.sub(p1,p2);
	if(verb.core.Vec.dot(diff,diff) < tol && verb.core.Vec.dot(diff2,diff2) > tol || !verb.core.Trig.three_points_are_flat(p1,p2,p3,tol)) {
		var exact_mid = start + (end - start) * 0.5;
		var left_pts = verb.core.Tess.rational_curve_adaptive_sample_range(curve,start,exact_mid,tol,includeU);
		var right_pts = verb.core.Tess.rational_curve_adaptive_sample_range(curve,exact_mid,end,tol,includeU);
		return left_pts.slice(0,-1).concat(right_pts);
	} else if(includeU) return [[start].concat(p1),[end].concat(p3)]; else return [p1,p3];
};
verb.core.Tess.tessellate_rational_surface_naive = function(surface,divs_u,divs_v) {
	if(divs_u < 1) divs_u = 1;
	if(divs_v < 1) divs_v = 1;
	var degree_u = surface.degreeU;
	var degreeV = surface.degreeV;
	var control_points = surface.controlPoints;
	var knotsU = surface.knotsU;
	var knotsV = surface.knotsV;
	var u_span = verb.core.Utils.last(knotsU) - knotsU[0];
	var v_span = verb.core.Utils.last(knotsV) - knotsV[0];
	var span_u = u_span / divs_u;
	var span_v = v_span / divs_v;
	var points = [];
	var uvs = [];
	var normals = [];
	var _g1 = 0;
	var _g = divs_u + 1;
	while(_g1 < _g) {
		var i = _g1++;
		var _g3 = 0;
		var _g2 = divs_v + 1;
		while(_g3 < _g2) {
			var j = _g3++;
			var pt_u = i * span_u;
			var pt_v = j * span_v;
			uvs.push([pt_u,pt_v]);
			var derivs = verb.core.Eval.rational_surface_derivs(surface,1,pt_u,pt_v);
			var pt = derivs[0][0];
			points.push(pt);
			var normal = verb.core.Vec.normalized(verb.core.Vec.cross(derivs[1][0],derivs[0][1]));
			normals.push(normal);
		}
	}
	var faces = [];
	var _g4 = 0;
	while(_g4 < divs_u) {
		var i1 = _g4++;
		var _g11 = 0;
		while(_g11 < divs_v) {
			var j1 = _g11++;
			var a_i = i1 * (divs_v + 1) + j1;
			var b_i = (i1 + 1) * (divs_v + 1) + j1;
			var c_i = b_i + 1;
			var d_i = a_i + 1;
			var abc = [a_i,b_i,c_i];
			var acd = [a_i,c_i,d_i];
			faces.push(abc);
			faces.push(acd);
		}
	}
	return new verb.core.types.MeshData(faces,points,normals,uvs);
};
verb.core.Tess.divide_rational_surface_adaptive = function(surface,options) {
	if(options == null) options = new verb.core.types.AdaptiveRefinementOptions();
	if(options.minDivsU != null) options.minDivsU = options.minDivsU; else options.minDivsU = 1;
	if(options.minDivsV != null) options.minDivsU = options.minDivsV; else options.minDivsU = 1;
	if(options.refine != null) options.refine = options.refine; else options.refine = true;
	var minU = (surface.controlPoints.length - 1) * 3;
	var minV = (surface.controlPoints[0].length - 1) * 3;
	var divsU;
	divsU = options.minDivsU > minU?options.minDivsU = options.minDivsU:options.minDivsU = minU;
	var divsV;
	divsV = options.minDivsV > minV?options.minDivsV = options.minDivsV:options.minDivsV = minV;
	var umax = verb.core.Utils.last(surface.knotsU);
	var umin = surface.knotsU[0];
	var vmax = verb.core.Utils.last(surface.knotsV);
	var vmin = surface.knotsV[0];
	var du = (umax - umin) / divsU;
	var dv = (vmax - vmin) / divsV;
	var divs = [];
	var pts = [];
	var _g1 = 0;
	var _g = divsV + 1;
	while(_g1 < _g) {
		var i = _g1++;
		var ptrow = [];
		var _g3 = 0;
		var _g2 = divsU + 1;
		while(_g3 < _g2) {
			var j = _g3++;
			var u = umin + du * j;
			var v = vmin + dv * i;
			var ds = verb.core.Eval.rational_surface_derivs(surface,1,u,v);
			var norm = verb.core.Vec.normalized(verb.core.Vec.cross(ds[0][1],ds[1][0]));
			ptrow.push(new verb.core.types.SurfacePoint(ds[0][0],norm,[u,v],-1,verb.core.Vec.isZero(norm)));
		}
		pts.push(ptrow);
	}
	var _g4 = 0;
	while(_g4 < divsV) {
		var i1 = _g4++;
		var _g11 = 0;
		while(_g11 < divsU) {
			var j1 = _g11++;
			var corners = [pts[divsV - i1 - 1][j1],pts[divsV - i1 - 1][j1 + 1],pts[divsV - i1][j1 + 1],pts[divsV - i1][j1]];
			divs.push(new verb.core.types.AdaptiveRefinementNode(surface,corners));
		}
	}
	if(!options.refine) return divs;
	var _g5 = 0;
	while(_g5 < divsV) {
		var i2 = _g5++;
		var _g12 = 0;
		while(_g12 < divsU) {
			var j2 = _g12++;
			var ci = i2 * divsU + j2;
			var n = verb.core.Tess.north(ci,i2,j2,divsU,divsV,divs);
			var e = verb.core.Tess.east(ci,i2,j2,divsU,divsV,divs);
			var s = verb.core.Tess.south(ci,i2,j2,divsU,divsV,divs);
			var w = verb.core.Tess.west(ci,i2,j2,divsU,divsV,divs);
			divs[ci].neighbors = [s,e,n,w];
			divs[ci].divide(options);
		}
	}
	return divs;
};
verb.core.Tess.north = function(index,i,j,divsU,divsV,divs) {
	if(i == 0) return null;
	return divs[index - divsU];
};
verb.core.Tess.south = function(index,i,j,divsU,divsV,divs) {
	if(i == divsV - 1) return null;
	return divs[index + divsU];
};
verb.core.Tess.east = function(index,i,j,divsU,divsV,divs) {
	if(j == divsU - 1) return null;
	return divs[index + 1];
};
verb.core.Tess.west = function(index,i,j,divsU,divsV,divs) {
	if(j == 0) return null;
	return divs[index - 1];
};
verb.core.Tess.triangulate_adaptive_refinement_node_tree = function(arrTree) {
	var mesh = verb.core.types.MeshData.empty();
	var _g = 0;
	while(_g < arrTree.length) {
		var x = arrTree[_g];
		++_g;
		x.triangulate(mesh);
	}
	return mesh;
};
verb.core.Tess.tessellate_rational_surface_adaptive = function(surface,options) {
	var arrTrees = verb.core.Tess.divide_rational_surface_adaptive(surface,options);
	return verb.core.Tess.triangulate_adaptive_refinement_node_tree(arrTrees);
};
verb.core.Trig = $hx_exports.core.Trig = function() { };
verb.core.Trig.dist_to_seg = function(a,b,c) {
	var acv = verb.core.Vec.sub(c,a);
	var acl = verb.core.Vec.norm(acv);
	var bma = verb.core.Vec.sub(b,a);
	if(acl < verb.core.Constants.TOLERANCE) return verb.core.Vec.norm(bma);
	var ac = verb.core.Vec.mul(1 / acl,acv);
	var p = verb.core.Vec.dot(bma,ac);
	var acd = verb.core.Vec.add(a,verb.core.Vec.mul(p,ac));
	return verb.core.Vec.dist(acd,b);
};
verb.core.Trig.closest_point_on_ray = function(pt,o,r) {
	var o2pt = verb.core.Vec.sub(pt,o);
	var do2ptr = verb.core.Vec.dot(o2pt,r);
	var proj = verb.core.Vec.add(o,verb.core.Vec.mul(do2ptr,r));
	return proj;
};
verb.core.Trig.dist_to_ray = function(pt,o,r) {
	var d = verb.core.Trig.closest_point_on_ray(pt,o,r);
	var dif = verb.core.Vec.sub(d,pt);
	return verb.core.Vec.norm(dif);
};
verb.core.Trig.three_points_are_flat = function(p1,p2,p3,tol) {
	var p2mp1 = verb.core.Vec.sub(p2,p1);
	var p3mp1 = verb.core.Vec.sub(p3,p1);
	var norm = verb.core.Vec.cross(p2mp1,p3mp1);
	var area = verb.core.Vec.dot(norm,norm);
	return area < tol;
};
verb.core.Utils = function() { };
verb.core.Utils.last = function(a) {
	return a[a.length - 1];
};
verb.core.Utils.spliceAndInsert = function(a,start,end,ele) {
	a.splice(start,end);
	a.splice(start,0,ele);
};
verb.core.Vec = $hx_exports.core.Vec = function() { };
verb.core.Vec.normalized = function(arr) {
	return verb.core.Vec.div(arr,verb.core.Vec.norm(arr));
};
verb.core.Vec.cross = function(u,v) {
	return [u[1] * v[2] - u[2] * v[1],u[2] * v[0] - u[0] * v[2],u[0] * v[1] - u[1] * v[0]];
};
verb.core.Vec.transpose = function(a) {
	if(a.length == 0) return [];
	var _g = [];
	var _g2 = 0;
	var _g1 = a[0].length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push((function($this) {
			var $r;
			var _g3 = [];
			{
				var _g5 = 0;
				var _g4 = a.length;
				while(_g5 < _g4) {
					var j = _g5++;
					_g3.push(a[j][i]);
				}
			}
			$r = _g3;
			return $r;
		}(this)));
	}
	return _g;
};
verb.core.Vec.dist = function(a,b) {
	return verb.core.Vec.norm(verb.core.Vec.sub(a,b));
};
verb.core.Vec.distSquared = function(a,b) {
	return verb.core.Vec.normSquared(verb.core.Vec.sub(a,b));
};
verb.core.Vec.sum = function(a) {
	return Lambda.fold(a,function(x,a1) {
		return a1 + x;
	},0);
};
verb.core.Vec.norm = function(a) {
	return Math.sqrt(verb.core.Vec.normSquared(a));
};
verb.core.Vec.normSquared = function(a) {
	return Lambda.fold(a,function(x,a1) {
		return a1 + x * x;
	},0);
};
verb.core.Vec.rep = function(num,ele) {
	var _g = [];
	var _g1 = 0;
	while(_g1 < num) {
		var i = _g1++;
		_g.push(ele);
	}
	return _g;
};
verb.core.Vec.zeros1d = function(rows) {
	var _g = [];
	var _g1 = 0;
	while(_g1 < rows) {
		var i = _g1++;
		_g.push(0.0);
	}
	return _g;
};
verb.core.Vec.zeros2d = function(rows,cols) {
	var _g = [];
	var _g1 = 0;
	while(_g1 < rows) {
		var i = _g1++;
		_g.push(verb.core.Vec.zeros1d(cols));
	}
	return _g;
};
verb.core.Vec.zeros3d = function(rows,cols,depth) {
	var _g = [];
	var _g1 = 0;
	while(_g1 < rows) {
		var i = _g1++;
		_g.push(verb.core.Vec.zeros2d(cols,depth));
	}
	return _g;
};
verb.core.Vec.dot = function(a,b) {
	var sum = 0;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		sum += a[i] * b[i];
	}
	return sum;
};
verb.core.Vec.add = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = a.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(a[i] + b[i]);
	}
	return _g;
};
verb.core.Vec.mul = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = b.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(a * b[i]);
	}
	return _g;
};
verb.core.Vec.div = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = a.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(a[i] / b);
	}
	return _g;
};
verb.core.Vec.sub = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = a.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(a[i] - b[i]);
	}
	return _g;
};
verb.core.Vec.isZero = function(vec) {
	var _g1 = 0;
	var _g = vec.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(Math.abs(vec[i]) > verb.core.Constants.TOLERANCE) return false;
	}
	return true;
};
verb.core.types = {};
verb.core.types.AdaptiveRefinementOptions = function() {
	this.minDivsV = 1;
	this.minDivsU = 1;
	this.refine = true;
	this.maxDepth = 10;
	this.minDepth = 0;
	this.normTol = 8.5e-2;
};
verb.core.types.AdaptiveRefinementNode = $hx_exports.core.AdaptiveRefinementNode = function(srf,corners,neighbors) {
	this.srf = srf;
	if(neighbors == null) this.neighbors = [null,null,null,null]; else this.neighbors = neighbors;
	this.corners = corners;
	if(this.corners == null) {
		var u0 = srf.knotsU[0];
		var u1 = verb.core.Utils.last(srf.knotsU);
		var v0 = srf.knotsV[0];
		var v1 = verb.core.Utils.last(srf.knotsV);
		this.corners = [verb.core.types.SurfacePoint.fromUv(u0,v0),verb.core.types.SurfacePoint.fromUv(u1,v0),verb.core.types.SurfacePoint.fromUv(u1,v1),verb.core.types.SurfacePoint.fromUv(u0,v1)];
	}
};
verb.core.types.AdaptiveRefinementNode.prototype = {
	isLeaf: function() {
		return this.children == null;
	}
	,center: function() {
		if(this.centerPoint != null) return this.centerPoint; else return this.evalSrf(this.u05,this.v05);
	}
	,evalCorners: function() {
		this.u05 = (this.corners[0].uv[0] + this.corners[2].uv[0]) / 2;
		this.v05 = (this.corners[0].uv[1] + this.corners[2].uv[1]) / 2;
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			if(this.corners[i].point == null) {
				var c = this.corners[i];
				this.evalSrf(c.uv[0],c.uv[1],c);
			}
		}
	}
	,evalSrf: function(u,v,srfPt) {
		var derivs = verb.core.Eval.rational_surface_derivs(this.srf,1,u,v);
		var pt = derivs[0][0];
		var norm = verb.core.Vec.cross(derivs[0][1],derivs[1][0]);
		var degen = verb.core.Vec.isZero(norm);
		if(!degen) norm = verb.core.Vec.normalized(norm);
		if(srfPt != null) {
			srfPt.degen = degen;
			srfPt.point = pt;
			srfPt.normal = norm;
			return srfPt;
		} else return new verb.core.types.SurfacePoint(pt,norm,[u,v],-1,degen);
	}
	,getEdgeCorners: function(edgeIndex) {
		if(this.isLeaf()) return [this.corners[edgeIndex]];
		if(this.horizontal) switch(edgeIndex) {
		case 0:
			return this.children[0].getEdgeCorners(0);
		case 1:
			return this.children[0].getEdgeCorners(1).concat(this.children[1].getEdgeCorners(1));
		case 2:
			return this.children[1].getEdgeCorners(2);
		case 3:
			return this.children[1].getEdgeCorners(3).concat(this.children[0].getEdgeCorners(3));
		}
		switch(edgeIndex) {
		case 0:
			return this.children[0].getEdgeCorners(0).concat(this.children[1].getEdgeCorners(0));
		case 1:
			return this.children[1].getEdgeCorners(1);
		case 2:
			return this.children[1].getEdgeCorners(2).concat(this.children[0].getEdgeCorners(2));
		case 3:
			return this.children[0].getEdgeCorners(3);
		}
		return null;
	}
	,getAllCorners: function(edgeIndex) {
		var baseArr = [this.corners[edgeIndex]];
		if(this.neighbors[edgeIndex] == null) return baseArr;
		var corners = this.neighbors[edgeIndex].getEdgeCorners((edgeIndex + 2) % 4);
		var funcIndex = edgeIndex % 2;
		var e = verb.core.Constants.EPSILON;
		var that = this;
		var rangeFuncMap = [function(c) {
			return c.uv[0] > that.corners[0].uv[0] + e && c.uv[0] < that.corners[2].uv[0] - e;
		},function(c1) {
			return c1.uv[1] > that.corners[0].uv[1] + e && c1.uv[1] < that.corners[2].uv[1] - e;
		}];
		var cornercopy = corners.filter(rangeFuncMap[funcIndex]);
		cornercopy.reverse();
		return baseArr.concat(cornercopy);
	}
	,midpoint: function(index) {
		if(this.midPoints == null) this.midPoints = [null,null,null,null];
		if(!(this.midPoints[index] == null)) return this.midPoints[index];
		switch(index) {
		case 0:
			this.midPoints[0] = this.evalSrf(this.u05,this.corners[0].uv[1]);
			break;
		case 1:
			this.midPoints[1] = this.evalSrf(this.corners[1].uv[0],this.v05);
			break;
		case 2:
			this.midPoints[2] = this.evalSrf(this.u05,this.corners[2].uv[1]);
			break;
		case 3:
			this.midPoints[3] = this.evalSrf(this.corners[0].uv[0],this.v05);
			break;
		}
		return this.midPoints[index];
	}
	,hasBadNormals: function() {
		return this.corners[0].degen || this.corners[1].degen || this.corners[2].degen || this.corners[3].degen;
	}
	,fixNormals: function() {
		var l = this.corners.length;
		var _g = 0;
		while(_g < l) {
			var i = _g++;
			var corn = this.corners[i];
			if(this.corners[i].degen) {
				var v1 = this.corners[(i + 1) % l];
				var v2 = this.corners[(i + 3) % l];
				if(v1.degen) this.corners[i].normal = v2.normal; else this.corners[i].normal = v1.normal;
			}
		}
	}
	,shouldDivide: function(options,currentDepth) {
		if(currentDepth < options.minDepth) return true;
		if(currentDepth >= options.maxDepth) return false;
		if(this.hasBadNormals()) {
			this.fixNormals();
			return false;
		}
		this.splitVert = verb.core.Vec.normSquared(verb.core.Vec.sub(this.corners[0].normal,this.corners[1].normal)) > options.normTol || verb.core.Vec.normSquared(verb.core.Vec.sub(this.corners[2].normal,this.corners[3].normal)) > options.normTol;
		this.splitHoriz = verb.core.Vec.normSquared(verb.core.Vec.sub(this.corners[1].normal,this.corners[2].normal)) > options.normTol || verb.core.Vec.normSquared(verb.core.Vec.sub(this.corners[3].normal,this.corners[0].normal)) > options.normTol;
		if(this.splitVert || this.splitHoriz) return true;
		var center = this.center();
		return verb.core.Vec.normSquared(verb.core.Vec.sub(center.normal,this.corners[0].normal)) > options.normTol || verb.core.Vec.normSquared(verb.core.Vec.sub(center.normal,this.corners[1].normal)) > options.normTol || verb.core.Vec.normSquared(verb.core.Vec.sub(center.normal,this.corners[2].normal)) > options.normTol || verb.core.Vec.normSquared(verb.core.Vec.sub(center.normal,this.corners[3].normal)) > options.normTol;
	}
	,divide: function(options) {
		if(options == null) options = new verb.core.types.AdaptiveRefinementOptions();
		if(options.normTol == null) options.normTol = 8.5e-2;
		if(options.minDepth == null) options.minDepth = 0;
		if(options.maxDepth == null) options.maxDepth = 10;
		this._divide(options,0,true);
	}
	,_divide: function(options,currentDepth,horiz) {
		this.evalCorners();
		if(!this.shouldDivide(options,currentDepth)) return;
		currentDepth++;
		if(this.splitVert && !this.splitHoriz) horiz = false; else if(!this.splitVert && this.splitHoriz) horiz = true;
		this.horizontal = horiz;
		if(this.horizontal) {
			var bott = [this.corners[0],this.corners[1],this.midpoint(1),this.midpoint(3)];
			var top = [this.midpoint(3),this.midpoint(1),this.corners[2],this.corners[3]];
			this.children = [new verb.core.types.AdaptiveRefinementNode(this.srf,bott),new verb.core.types.AdaptiveRefinementNode(this.srf,top)];
			this.children[0].neighbors = [this.neighbors[0],this.neighbors[1],this.children[1],this.neighbors[3]];
			this.children[1].neighbors = [this.children[0],this.neighbors[1],this.neighbors[2],this.neighbors[3]];
		} else {
			var left = [this.corners[0],this.midpoint(0),this.midpoint(2),this.corners[3]];
			var right = [this.midpoint(0),this.corners[1],this.corners[2],this.midpoint(2)];
			this.children = [new verb.core.types.AdaptiveRefinementNode(this.srf,left),new verb.core.types.AdaptiveRefinementNode(this.srf,right)];
			this.children[0].neighbors = [this.neighbors[0],this.children[1],this.neighbors[2],this.neighbors[3]];
			this.children[1].neighbors = [this.neighbors[0],this.neighbors[1],this.neighbors[2],this.children[0]];
		}
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child._divide(options,currentDepth,!horiz);
		}
	}
	,triangulate: function(mesh) {
		if(mesh == null) mesh = verb.core.types.MeshData.empty();
		if(this.isLeaf()) return this.triangulateLeaf(mesh);
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var x = _g1[_g];
			++_g;
			if(x == null) break;
			x.triangulate(mesh);
		}
		return mesh;
	}
	,triangulateLeaf: function(mesh) {
		var baseIndex = mesh.points.length;
		var uvs = [];
		var ids = [];
		var splitid = 0;
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			var edgeCorners = this.getAllCorners(i);
			if(edgeCorners.length == 2) splitid = i + 1;
			var _g2 = 0;
			var _g1 = edgeCorners.length;
			while(_g2 < _g1) {
				var j = _g2++;
				uvs.push(edgeCorners[j]);
			}
		}
		var _g3 = 0;
		while(_g3 < uvs.length) {
			var corner = uvs[_g3];
			++_g3;
			if(corner.id != -1) {
				ids.push(corner.id);
				continue;
			}
			mesh.uvs.push(corner.uv);
			mesh.points.push(corner.point);
			mesh.normals.push(corner.normal);
			corner.id = baseIndex;
			ids.push(baseIndex);
			baseIndex++;
		}
		if(uvs.length == 4) {
			mesh.faces.push([ids[0],ids[3],ids[1]]);
			mesh.faces.push([ids[3],ids[2],ids[1]]);
			return mesh;
		} else if(uvs.length == 5) {
			var il = ids.length;
			mesh.faces.push([ids[splitid],ids[(splitid + 1) % il],ids[(splitid + 2) % il]]);
			mesh.faces.push([ids[(splitid + 4) % il],ids[(splitid + 3) % il],ids[splitid]]);
			mesh.faces.push([ids[splitid],ids[(splitid + 2) % il],ids[(splitid + 3) % il]]);
			return mesh;
		}
		var center = this.center();
		mesh.uvs.push(center.uv);
		mesh.points.push(center.point);
		mesh.normals.push(center.normal);
		var centerIndex = mesh.points.length - 1;
		var i1 = 0;
		var j1 = uvs.length - 1;
		while(i1 < uvs.length) {
			mesh.faces.push([centerIndex,ids[j1],ids[i1]]);
			j1 = i1++;
		}
		return mesh;
	}
};
verb.core.types.CurveData = $hx_exports.core.CurveData = function(degree,knots,controlPoints) {
	this.degree = degree;
	this.controlPoints = controlPoints;
	this.knots = knots;
};
verb.core.types.MeshData = $hx_exports.core.MeshData = function(faces,vertices,normals,uvs) {
	this.faces = faces;
	this.points = vertices;
	this.normals = normals;
	this.uvs = uvs;
};
verb.core.types.MeshData.empty = function() {
	return new verb.core.types.MeshData([],[],[],[]);
};
verb.core.types.SurfaceData = $hx_exports.core.SurfaceData = function(degreeU,degreeV,knotsU,knotsV,controlPoints) {
	this.degreeU = degreeU;
	this.degreeV = degreeV;
	this.knotsU = knotsU;
	this.knotsV = knotsV;
	this.controlPoints = controlPoints;
};
verb.core.types.SurfacePoint = function(point,normal,uv,id,degen) {
	if(degen == null) degen = false;
	if(id == null) id = -1;
	this.uv = uv;
	this.point = point;
	this.normal = normal;
	this.id = id;
	this.degen = degen;
};
verb.core.types.SurfacePoint.fromUv = function(u,v) {
	return new verb.core.types.SurfacePoint(null,null,[u,v]);
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
verb.BoundingBox.TOLERANCE = 1e-4;
verb.core.Analyze.Tvalues = [[],[],[-0.5773502691896257645091487805019574556476,0.5773502691896257645091487805019574556476],[0,-0.7745966692414833770358530799564799221665,0.7745966692414833770358530799564799221665],[-0.3399810435848562648026657591032446872005,0.3399810435848562648026657591032446872005,-0.8611363115940525752239464888928095050957,0.8611363115940525752239464888928095050957],[0,-0.5384693101056830910363144207002088049672,0.5384693101056830910363144207002088049672,-0.9061798459386639927976268782993929651256,0.9061798459386639927976268782993929651256],[0.6612093864662645136613995950199053470064,-0.6612093864662645136613995950199053470064,-0.2386191860831969086305017216807119354186,0.2386191860831969086305017216807119354186,-0.9324695142031520278123015544939946091347,0.9324695142031520278123015544939946091347],[0,0.4058451513773971669066064120769614633473,-0.4058451513773971669066064120769614633473,-0.7415311855993944398638647732807884070741,0.7415311855993944398638647732807884070741,-0.9491079123427585245261896840478512624007,0.9491079123427585245261896840478512624007],[-0.1834346424956498049394761423601839806667,0.1834346424956498049394761423601839806667,-0.5255324099163289858177390491892463490419,0.5255324099163289858177390491892463490419,-0.7966664774136267395915539364758304368371,0.7966664774136267395915539364758304368371,-0.9602898564975362316835608685694729904282,0.9602898564975362316835608685694729904282],[0,-0.8360311073266357942994297880697348765441,0.8360311073266357942994297880697348765441,-0.9681602395076260898355762029036728700494,0.9681602395076260898355762029036728700494,-0.3242534234038089290385380146433366085719,0.3242534234038089290385380146433366085719,-0.6133714327005903973087020393414741847857,0.6133714327005903973087020393414741847857],[-0.1488743389816312108848260011297199846175,0.1488743389816312108848260011297199846175,-0.4333953941292471907992659431657841622000,0.4333953941292471907992659431657841622000,-0.6794095682990244062343273651148735757692,0.6794095682990244062343273651148735757692,-0.8650633666889845107320966884234930485275,0.8650633666889845107320966884234930485275,-0.9739065285171717200779640120844520534282,0.9739065285171717200779640120844520534282],[0,-0.2695431559523449723315319854008615246796,0.2695431559523449723315319854008615246796,-0.5190961292068118159257256694586095544802,0.5190961292068118159257256694586095544802,-0.7301520055740493240934162520311534580496,0.7301520055740493240934162520311534580496,-0.8870625997680952990751577693039272666316,0.8870625997680952990751577693039272666316,-0.9782286581460569928039380011228573907714,0.9782286581460569928039380011228573907714],[-0.1252334085114689154724413694638531299833,0.1252334085114689154724413694638531299833,-0.3678314989981801937526915366437175612563,0.3678314989981801937526915366437175612563,-0.5873179542866174472967024189405342803690,0.5873179542866174472967024189405342803690,-0.7699026741943046870368938332128180759849,0.7699026741943046870368938332128180759849,-0.9041172563704748566784658661190961925375,0.9041172563704748566784658661190961925375,-0.9815606342467192506905490901492808229601,0.9815606342467192506905490901492808229601],[0,-0.2304583159551347940655281210979888352115,0.2304583159551347940655281210979888352115,-0.4484927510364468528779128521276398678019,0.4484927510364468528779128521276398678019,-0.6423493394403402206439846069955156500716,0.6423493394403402206439846069955156500716,-0.8015780907333099127942064895828598903056,0.8015780907333099127942064895828598903056,-0.9175983992229779652065478365007195123904,0.9175983992229779652065478365007195123904,-0.9841830547185881494728294488071096110649,0.9841830547185881494728294488071096110649],[-0.1080549487073436620662446502198347476119,0.1080549487073436620662446502198347476119,-0.3191123689278897604356718241684754668342,0.3191123689278897604356718241684754668342,-0.5152486363581540919652907185511886623088,0.5152486363581540919652907185511886623088,-0.6872929048116854701480198030193341375384,0.6872929048116854701480198030193341375384,-0.8272013150697649931897947426503949610397,0.8272013150697649931897947426503949610397,-0.9284348836635735173363911393778742644770,0.9284348836635735173363911393778742644770,-0.9862838086968123388415972667040528016760,0.9862838086968123388415972667040528016760],[0,-0.2011940939974345223006283033945962078128,0.2011940939974345223006283033945962078128,-0.3941513470775633698972073709810454683627,0.3941513470775633698972073709810454683627,-0.5709721726085388475372267372539106412383,0.5709721726085388475372267372539106412383,-0.7244177313601700474161860546139380096308,0.7244177313601700474161860546139380096308,-0.8482065834104272162006483207742168513662,0.8482065834104272162006483207742168513662,-0.9372733924007059043077589477102094712439,0.9372733924007059043077589477102094712439,-0.9879925180204854284895657185866125811469,0.9879925180204854284895657185866125811469],[-0.0950125098376374401853193354249580631303,0.0950125098376374401853193354249580631303,-0.2816035507792589132304605014604961064860,0.2816035507792589132304605014604961064860,-0.4580167776572273863424194429835775735400,0.4580167776572273863424194429835775735400,-0.6178762444026437484466717640487910189918,0.6178762444026437484466717640487910189918,-0.7554044083550030338951011948474422683538,0.7554044083550030338951011948474422683538,-0.8656312023878317438804678977123931323873,0.8656312023878317438804678977123931323873,-0.9445750230732325760779884155346083450911,0.9445750230732325760779884155346083450911,-0.9894009349916499325961541734503326274262,0.9894009349916499325961541734503326274262],[0,-0.1784841814958478558506774936540655574754,0.1784841814958478558506774936540655574754,-0.3512317634538763152971855170953460050405,0.3512317634538763152971855170953460050405,-0.5126905370864769678862465686295518745829,0.5126905370864769678862465686295518745829,-0.6576711592166907658503022166430023351478,0.6576711592166907658503022166430023351478,-0.7815140038968014069252300555204760502239,0.7815140038968014069252300555204760502239,-0.8802391537269859021229556944881556926234,0.8802391537269859021229556944881556926234,-0.9506755217687677612227169578958030214433,0.9506755217687677612227169578958030214433,-0.9905754753144173356754340199406652765077,0.9905754753144173356754340199406652765077],[-0.0847750130417353012422618529357838117333,0.0847750130417353012422618529357838117333,-0.2518862256915055095889728548779112301628,0.2518862256915055095889728548779112301628,-0.4117511614628426460359317938330516370789,0.4117511614628426460359317938330516370789,-0.5597708310739475346078715485253291369276,0.5597708310739475346078715485253291369276,-0.6916870430603532078748910812888483894522,0.6916870430603532078748910812888483894522,-0.8037049589725231156824174550145907971032,0.8037049589725231156824174550145907971032,-0.8926024664975557392060605911271455154078,0.8926024664975557392060605911271455154078,-0.9558239495713977551811958929297763099728,0.9558239495713977551811958929297763099728,-0.9915651684209309467300160047061507702525,0.9915651684209309467300160047061507702525],[0,-0.1603586456402253758680961157407435495048,0.1603586456402253758680961157407435495048,-0.3165640999636298319901173288498449178922,0.3165640999636298319901173288498449178922,-0.4645707413759609457172671481041023679762,0.4645707413759609457172671481041023679762,-0.6005453046616810234696381649462392798683,0.6005453046616810234696381649462392798683,-0.7209661773352293786170958608237816296571,0.7209661773352293786170958608237816296571,-0.8227146565371428249789224867127139017745,0.8227146565371428249789224867127139017745,-0.9031559036148179016426609285323124878093,0.9031559036148179016426609285323124878093,-0.9602081521348300308527788406876515266150,0.9602081521348300308527788406876515266150,-0.9924068438435844031890176702532604935893,0.9924068438435844031890176702532604935893],[-0.0765265211334973337546404093988382110047,0.0765265211334973337546404093988382110047,-0.2277858511416450780804961953685746247430,0.2277858511416450780804961953685746247430,-0.3737060887154195606725481770249272373957,0.3737060887154195606725481770249272373957,-0.5108670019508270980043640509552509984254,0.5108670019508270980043640509552509984254,-0.6360536807265150254528366962262859367433,0.6360536807265150254528366962262859367433,-0.7463319064601507926143050703556415903107,0.7463319064601507926143050703556415903107,-0.8391169718222188233945290617015206853296,0.8391169718222188233945290617015206853296,-0.9122344282513259058677524412032981130491,0.9122344282513259058677524412032981130491,-0.9639719272779137912676661311972772219120,0.9639719272779137912676661311972772219120,-0.9931285991850949247861223884713202782226,0.9931285991850949247861223884713202782226],[0,-0.1455618541608950909370309823386863301163,0.1455618541608950909370309823386863301163,-0.2880213168024010966007925160646003199090,0.2880213168024010966007925160646003199090,-0.4243421202074387835736688885437880520964,0.4243421202074387835736688885437880520964,-0.5516188358872198070590187967243132866220,0.5516188358872198070590187967243132866220,-0.6671388041974123193059666699903391625970,0.6671388041974123193059666699903391625970,-0.7684399634756779086158778513062280348209,0.7684399634756779086158778513062280348209,-0.8533633645833172836472506385875676702761,0.8533633645833172836472506385875676702761,-0.9200993341504008287901871337149688941591,0.9200993341504008287901871337149688941591,-0.9672268385663062943166222149076951614246,0.9672268385663062943166222149076951614246,-0.9937521706203895002602420359379409291933,0.9937521706203895002602420359379409291933],[-0.0697392733197222212138417961186280818222,0.0697392733197222212138417961186280818222,-0.2078604266882212854788465339195457342156,0.2078604266882212854788465339195457342156,-0.3419358208920842251581474204273796195591,0.3419358208920842251581474204273796195591,-0.4693558379867570264063307109664063460953,0.4693558379867570264063307109664063460953,-0.5876404035069115929588769276386473488776,0.5876404035069115929588769276386473488776,-0.6944872631866827800506898357622567712673,0.6944872631866827800506898357622567712673,-0.7878168059792081620042779554083515213881,0.7878168059792081620042779554083515213881,-0.8658125777203001365364256370193787290847,0.8658125777203001365364256370193787290847,-0.9269567721871740005206929392590531966353,0.9269567721871740005206929392590531966353,-0.9700604978354287271239509867652687108059,0.9700604978354287271239509867652687108059,-0.9942945854823992920730314211612989803930,0.9942945854823992920730314211612989803930],[0,-0.1332568242984661109317426822417661370104,0.1332568242984661109317426822417661370104,-0.2641356809703449305338695382833096029790,0.2641356809703449305338695382833096029790,-0.3903010380302908314214888728806054585780,0.3903010380302908314214888728806054585780,-0.5095014778460075496897930478668464305448,0.5095014778460075496897930478668464305448,-0.6196098757636461563850973116495956533871,0.6196098757636461563850973116495956533871,-0.7186613631319501944616244837486188483299,0.7186613631319501944616244837486188483299,-0.8048884016188398921511184069967785579414,0.8048884016188398921511184069967785579414,-0.8767523582704416673781568859341456716389,0.8767523582704416673781568859341456716389,-0.9329710868260161023491969890384229782357,0.9329710868260161023491969890384229782357,-0.9725424712181152319560240768207773751816,0.9725424712181152319560240768207773751816,-0.9947693349975521235239257154455743605736,0.9947693349975521235239257154455743605736],[-0.0640568928626056260850430826247450385909,0.0640568928626056260850430826247450385909,-0.1911188674736163091586398207570696318404,0.1911188674736163091586398207570696318404,-0.3150426796961633743867932913198102407864,0.3150426796961633743867932913198102407864,-0.4337935076260451384870842319133497124524,0.4337935076260451384870842319133497124524,-0.5454214713888395356583756172183723700107,0.5454214713888395356583756172183723700107,-0.6480936519369755692524957869107476266696,0.6480936519369755692524957869107476266696,-0.7401241915785543642438281030999784255232,0.7401241915785543642438281030999784255232,-0.8200019859739029219539498726697452080761,0.8200019859739029219539498726697452080761,-0.8864155270044010342131543419821967550873,0.8864155270044010342131543419821967550873,-0.9382745520027327585236490017087214496548,0.9382745520027327585236490017087214496548,-0.9747285559713094981983919930081690617411,0.9747285559713094981983919930081690617411,-0.9951872199970213601799974097007368118745,0.9951872199970213601799974097007368118745]];
verb.core.Analyze.Cvalues = [[],[],[1.0,1.0],[0.8888888888888888888888888888888888888888,0.5555555555555555555555555555555555555555,0.5555555555555555555555555555555555555555],[0.6521451548625461426269360507780005927646,0.6521451548625461426269360507780005927646,0.3478548451374538573730639492219994072353,0.3478548451374538573730639492219994072353],[0.5688888888888888888888888888888888888888,0.4786286704993664680412915148356381929122,0.4786286704993664680412915148356381929122,0.2369268850561890875142640407199173626432,0.2369268850561890875142640407199173626432],[0.3607615730481386075698335138377161116615,0.3607615730481386075698335138377161116615,0.4679139345726910473898703439895509948116,0.4679139345726910473898703439895509948116,0.1713244923791703450402961421727328935268,0.1713244923791703450402961421727328935268],[0.4179591836734693877551020408163265306122,0.3818300505051189449503697754889751338783,0.3818300505051189449503697754889751338783,0.2797053914892766679014677714237795824869,0.2797053914892766679014677714237795824869,0.1294849661688696932706114326790820183285,0.1294849661688696932706114326790820183285],[0.3626837833783619829651504492771956121941,0.3626837833783619829651504492771956121941,0.3137066458778872873379622019866013132603,0.3137066458778872873379622019866013132603,0.2223810344533744705443559944262408844301,0.2223810344533744705443559944262408844301,0.1012285362903762591525313543099621901153,0.1012285362903762591525313543099621901153],[0.3302393550012597631645250692869740488788,0.1806481606948574040584720312429128095143,0.1806481606948574040584720312429128095143,0.0812743883615744119718921581105236506756,0.0812743883615744119718921581105236506756,0.3123470770400028400686304065844436655987,0.3123470770400028400686304065844436655987,0.2606106964029354623187428694186328497718,0.2606106964029354623187428694186328497718],[0.2955242247147528701738929946513383294210,0.2955242247147528701738929946513383294210,0.2692667193099963550912269215694693528597,0.2692667193099963550912269215694693528597,0.2190863625159820439955349342281631924587,0.2190863625159820439955349342281631924587,0.1494513491505805931457763396576973324025,0.1494513491505805931457763396576973324025,0.0666713443086881375935688098933317928578,0.0666713443086881375935688098933317928578],[0.2729250867779006307144835283363421891560,0.2628045445102466621806888698905091953727,0.2628045445102466621806888698905091953727,0.2331937645919904799185237048431751394317,0.2331937645919904799185237048431751394317,0.1862902109277342514260976414316558916912,0.1862902109277342514260976414316558916912,0.1255803694649046246346942992239401001976,0.1255803694649046246346942992239401001976,0.0556685671161736664827537204425485787285,0.0556685671161736664827537204425485787285],[0.2491470458134027850005624360429512108304,0.2491470458134027850005624360429512108304,0.2334925365383548087608498989248780562594,0.2334925365383548087608498989248780562594,0.2031674267230659217490644558097983765065,0.2031674267230659217490644558097983765065,0.1600783285433462263346525295433590718720,0.1600783285433462263346525295433590718720,0.1069393259953184309602547181939962242145,0.1069393259953184309602547181939962242145,0.0471753363865118271946159614850170603170,0.0471753363865118271946159614850170603170],[0.2325515532308739101945895152688359481566,0.2262831802628972384120901860397766184347,0.2262831802628972384120901860397766184347,0.2078160475368885023125232193060527633865,0.2078160475368885023125232193060527633865,0.1781459807619457382800466919960979955128,0.1781459807619457382800466919960979955128,0.1388735102197872384636017768688714676218,0.1388735102197872384636017768688714676218,0.0921214998377284479144217759537971209236,0.0921214998377284479144217759537971209236,0.0404840047653158795200215922009860600419,0.0404840047653158795200215922009860600419],[0.2152638534631577901958764433162600352749,0.2152638534631577901958764433162600352749,0.2051984637212956039659240656612180557103,0.2051984637212956039659240656612180557103,0.1855383974779378137417165901251570362489,0.1855383974779378137417165901251570362489,0.1572031671581935345696019386238421566056,0.1572031671581935345696019386238421566056,0.1215185706879031846894148090724766259566,0.1215185706879031846894148090724766259566,0.0801580871597602098056332770628543095836,0.0801580871597602098056332770628543095836,0.0351194603317518630318328761381917806197,0.0351194603317518630318328761381917806197],[0.2025782419255612728806201999675193148386,0.1984314853271115764561183264438393248186,0.1984314853271115764561183264438393248186,0.1861610000155622110268005618664228245062,0.1861610000155622110268005618664228245062,0.1662692058169939335532008604812088111309,0.1662692058169939335532008604812088111309,0.1395706779261543144478047945110283225208,0.1395706779261543144478047945110283225208,0.1071592204671719350118695466858693034155,0.1071592204671719350118695466858693034155,0.0703660474881081247092674164506673384667,0.0703660474881081247092674164506673384667,0.0307532419961172683546283935772044177217,0.0307532419961172683546283935772044177217],[0.1894506104550684962853967232082831051469,0.1894506104550684962853967232082831051469,0.1826034150449235888667636679692199393835,0.1826034150449235888667636679692199393835,0.1691565193950025381893120790303599622116,0.1691565193950025381893120790303599622116,0.1495959888165767320815017305474785489704,0.1495959888165767320815017305474785489704,0.1246289712555338720524762821920164201448,0.1246289712555338720524762821920164201448,0.0951585116824927848099251076022462263552,0.0951585116824927848099251076022462263552,0.0622535239386478928628438369943776942749,0.0622535239386478928628438369943776942749,0.0271524594117540948517805724560181035122,0.0271524594117540948517805724560181035122],[0.1794464703562065254582656442618856214487,0.1765627053669926463252709901131972391509,0.1765627053669926463252709901131972391509,0.1680041021564500445099706637883231550211,0.1680041021564500445099706637883231550211,0.1540457610768102880814315948019586119404,0.1540457610768102880814315948019586119404,0.1351363684685254732863199817023501973721,0.1351363684685254732863199817023501973721,0.1118838471934039710947883856263559267358,0.1118838471934039710947883856263559267358,0.0850361483171791808835353701910620738504,0.0850361483171791808835353701910620738504,0.0554595293739872011294401653582446605128,0.0554595293739872011294401653582446605128,0.0241483028685479319601100262875653246916,0.0241483028685479319601100262875653246916],[0.1691423829631435918406564701349866103341,0.1691423829631435918406564701349866103341,0.1642764837458327229860537764659275904123,0.1642764837458327229860537764659275904123,0.1546846751262652449254180038363747721932,0.1546846751262652449254180038363747721932,0.1406429146706506512047313037519472280955,0.1406429146706506512047313037519472280955,0.1225552067114784601845191268002015552281,0.1225552067114784601845191268002015552281,0.1009420441062871655628139849248346070628,0.1009420441062871655628139849248346070628,0.0764257302548890565291296776166365256053,0.0764257302548890565291296776166365256053,0.0497145488949697964533349462026386416808,0.0497145488949697964533349462026386416808,0.0216160135264833103133427102664524693876,0.0216160135264833103133427102664524693876],[0.1610544498487836959791636253209167350399,0.1589688433939543476499564394650472016787,0.1589688433939543476499564394650472016787,0.1527660420658596667788554008976629984610,0.1527660420658596667788554008976629984610,0.1426067021736066117757461094419029724756,0.1426067021736066117757461094419029724756,0.1287539625393362276755157848568771170558,0.1287539625393362276755157848568771170558,0.1115666455473339947160239016817659974813,0.1115666455473339947160239016817659974813,0.0914900216224499994644620941238396526609,0.0914900216224499994644620941238396526609,0.0690445427376412265807082580060130449618,0.0690445427376412265807082580060130449618,0.0448142267656996003328381574019942119517,0.0448142267656996003328381574019942119517,0.0194617882297264770363120414644384357529,0.0194617882297264770363120414644384357529],[0.1527533871307258506980843319550975934919,0.1527533871307258506980843319550975934919,0.1491729864726037467878287370019694366926,0.1491729864726037467878287370019694366926,0.1420961093183820513292983250671649330345,0.1420961093183820513292983250671649330345,0.1316886384491766268984944997481631349161,0.1316886384491766268984944997481631349161,0.1181945319615184173123773777113822870050,0.1181945319615184173123773777113822870050,0.1019301198172404350367501354803498761666,0.1019301198172404350367501354803498761666,0.0832767415767047487247581432220462061001,0.0832767415767047487247581432220462061001,0.0626720483341090635695065351870416063516,0.0626720483341090635695065351870416063516,0.0406014298003869413310399522749321098790,0.0406014298003869413310399522749321098790,0.0176140071391521183118619623518528163621,0.0176140071391521183118619623518528163621],[0.1460811336496904271919851476833711882448,0.1445244039899700590638271665537525436099,0.1445244039899700590638271665537525436099,0.1398873947910731547221334238675831108927,0.1398873947910731547221334238675831108927,0.1322689386333374617810525744967756043290,0.1322689386333374617810525744967756043290,0.1218314160537285341953671771257335983563,0.1218314160537285341953671771257335983563,0.1087972991671483776634745780701056420336,0.1087972991671483776634745780701056420336,0.0934444234560338615532897411139320884835,0.0934444234560338615532897411139320884835,0.0761001136283793020170516533001831792261,0.0761001136283793020170516533001831792261,0.0571344254268572082836358264724479574912,0.0571344254268572082836358264724479574912,0.0369537897708524937999506682993296661889,0.0369537897708524937999506682993296661889,0.0160172282577743333242246168584710152658,0.0160172282577743333242246168584710152658],[0.1392518728556319933754102483418099578739,0.1392518728556319933754102483418099578739,0.1365414983460151713525738312315173965863,0.1365414983460151713525738312315173965863,0.1311735047870623707329649925303074458757,0.1311735047870623707329649925303074458757,0.1232523768105124242855609861548144719594,0.1232523768105124242855609861548144719594,0.1129322960805392183934006074217843191142,0.1129322960805392183934006074217843191142,0.1004141444428809649320788378305362823508,0.1004141444428809649320788378305362823508,0.0859416062170677274144436813727028661891,0.0859416062170677274144436813727028661891,0.0697964684245204880949614189302176573987,0.0697964684245204880949614189302176573987,0.0522933351526832859403120512732112561121,0.0522933351526832859403120512732112561121,0.0337749015848141547933022468659129013491,0.0337749015848141547933022468659129013491,0.0146279952982722006849910980471854451902,0.0146279952982722006849910980471854451902],[0.1336545721861061753514571105458443385831,0.1324620394046966173716424647033169258050,0.1324620394046966173716424647033169258050,0.1289057221880821499785953393997936532597,0.1289057221880821499785953393997936532597,0.1230490843067295304675784006720096548158,0.1230490843067295304675784006720096548158,0.1149966402224113649416435129339613014914,0.1149966402224113649416435129339613014914,0.1048920914645414100740861850147438548584,0.1048920914645414100740861850147438548584,0.0929157660600351474770186173697646486034,0.0929157660600351474770186173697646486034,0.0792814117767189549228925247420432269137,0.0792814117767189549228925247420432269137,0.0642324214085258521271696151589109980391,0.0642324214085258521271696151589109980391,0.0480376717310846685716410716320339965612,0.0480376717310846685716410716320339965612,0.0309880058569794443106942196418845053837,0.0309880058569794443106942196418845053837,0.0134118594871417720813094934586150649766,0.0134118594871417720813094934586150649766],[0.1279381953467521569740561652246953718517,0.1279381953467521569740561652246953718517,0.1258374563468282961213753825111836887264,0.1258374563468282961213753825111836887264,0.1216704729278033912044631534762624256070,0.1216704729278033912044631534762624256070,0.1155056680537256013533444839067835598622,0.1155056680537256013533444839067835598622,0.1074442701159656347825773424466062227946,0.1074442701159656347825773424466062227946,0.0976186521041138882698806644642471544279,0.0976186521041138882698806644642471544279,0.0861901615319532759171852029837426671850,0.0861901615319532759171852029837426671850,0.0733464814110803057340336152531165181193,0.0733464814110803057340336152531165181193,0.0592985849154367807463677585001085845412,0.0592985849154367807463677585001085845412,0.0442774388174198061686027482113382288593,0.0442774388174198061686027482113382288593,0.0285313886289336631813078159518782864491,0.0285313886289336631813078159518782864491,0.0123412297999871995468056670700372915759,0.0123412297999871995468056670700372915759]];
verb.core.Binomial.memo = new haxe.ds.IntMap();
verb.core.Constants.TOLERANCE = 1e-6;
verb.core.Constants.EPSILON = 1e-10;
verb.Init.main();
})(typeof window != "undefined" ? window : exports);