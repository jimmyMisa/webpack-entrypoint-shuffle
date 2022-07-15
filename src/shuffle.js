import fs from "fs";
import path from "path";

function json_encode(data, pretty) {
	if (pretty) {
		return JSON.stringify(data, null, 2);
	}
	return JSON.stringify(data);
}

function json_decode(elt) {
	var r = null;
	try {
		r = JSON.parse(elt);
	} catch (e) {
		r = null;
	}
	return r;
}

function gf(d) {
	var fns = fs.readdirSync(d);

	var r = [];
	fns.forEach((file) => {
		r.push(file);
	});
	return r;
}

function fg(p) {
	var c = fs.readFileSync(p, { encoding: "utf8", flag: "r" });
	return c;
}
function fp(p, c) {
	fs.writeFileSync(p, c);
}

function sfl(a) {
	var randomIndex;
	var l = a.length - 1;
	for (var i = 0; i <= l; i++) {
		randomIndex = Math.floor(Math.random() * i);
		[a[i], a[randomIndex]] = [a[randomIndex], a[i]];
	}

	return a;
}

function rsfl(a, n) {
	for (var i = 0; i <= n; i++) {
		a = sfl(a);
	}
	return a;
}

function puid() {
	return Math.random().toString(36).substr(2, 10);
}

function ruid() {
	return `${puid()}${rsfl(puid().substr(0, 5).split(""), 5).join("")}`;
}

function rids(n) {
	var r = [];
	for (var i = 1; i <= n; i++) {
		r.push(ruid());
	}
	return r;
}

function rt(data, k, create) {
	var dk = k.split(".");
	var r = data;
	dk.map((key, index) => {
		if (!r) {
			return false;
		}
		var dr = r[key];
		if (create) {
			if (!dr) {
				dr = {};
				r[key] = dr;
			}
		}
		r = dr;
	});
	return r;
}

function st(data, k, value) {
	var sp = k.split(".");
	var dk = sp.pop();
	var k = sp.join(".");

	var parentDirectObject = null;
	if (k) {
		parentDirectObject = rt(data, k, true);
	} else {
		parentDirectObject = data;
	}

	if (parentDirectObject) {
		parentDirectObject[dk] = value;
	}
}

function oj(p) {
	var c = fg(p);
	var jd = json_decode(c);
	return jd;
}

function rne(p, m, d) {
	var jd = oj(p);
	var db = {};
	if (jd) {
		Object.keys(jd).map((k) => {
			var v = jd[k];

			if (v) {
				Object.keys(v).map((dk) => {
					var dv = v[dk];

					if (dv) {
						Object.keys(dv).map((ddk) => {
							var ddv = dv[ddk];
							if (ddv) {
								ddv.map((n, i) => {
									db[[k, dk, ddk, i].join(".")] = n;
								});
							}
						});
					}
				});
			}
		});
	}
	var umap = {};
	Object.keys(db).map((k) => {
		var v = db[k];
		umap[v] = true;
	});
	var n = Object.keys(umap).length;
	var ids = rids(n);
	var ni = 0;
	var rmp = {};
	Object.keys(db).map((k, i) => {
		var v = db[k];
		var nn = rmp[v];
		if (!nn) {
			var id = ids[ni];
			nn = rnf(id, v);
			ni = ni + 1;
		}
		rmp[v] = nn;
		st(jd, k, nn);
	});
	var md = oj(m);
	if (md) {
		Object.keys(md).map((k) => {
			var v = md[k];
			var nn = rmp[v];
			if (nn) {
				md[k] = nn;
			}
		});
	}
	Object.keys(rmp).map((ofn) => {
		var v = rmp[ofn];
		var a = `${d}${ofn}`;
		var b = `${d}${v}`;
		rns(a, b);
	});
	fp(p, json_encode(jd, true));
	fp(m, json_encode(md, true));
}

function rnf(nn, pn) {
	pn = pn.split("\\").join("/");
	var spp = pn.split("/");
	var fn = spp.pop();
	var sp = fn.split(".");
	var ext = sp.pop();

	pn = spp.join("/");
	nn = [nn, ext].join(".");
	var r = [pn, nn].join("/");
	return r;
}
function rns(a, b) {
	if (fs.existsSync(a)) {
		fs.renameSync(a, b);
	}
}

function fndf(d, ns) {
	var flso = fs.readdirSync(d);
	var fls = [];
	flso.forEach((fl) => {
		fls.push(fl);
	});
	var r = fls.filter((fl) => {
		var f = false;
		ns.map((n) => {
			if (fl == n) {
				f = true;
			}
		});
		if (f) {
			return true;
		}
		return false;
	});
	r = r.map((dr) => {
		return `${d}/${dr}`;
	});
	return r;
}

function hem(d) {
	return fndf(d, ["entrypoints.json", "manifest.json"]);
}

function rhem(d) {
	var g = [];
	var fn = fndf(d, ["entrypoints.json", "manifest.json"]);
	if (fn.length) {
		g.push(fn);
	}
	var fls = gf(d);
	fls.map((f) => {
		var p = `${d}/${f}`;
		if (fs.existsSync(p)) {
			var stats = fs.statSync(p);
			if(stats.isDirectory()){
				var dg = rhem(p)
				if(dg.length){
					dg.map((ddg) =>{
						g.push(ddg)
					})
				}
			}
		}
	});
	return g;
}


function rhemb(d){
	var build = `${d}/build`
	return rhem(build)
}

function mrne(d) {
	var ems = rhemb(d);
	ems.map((em) =>{
		var ip = -1
		var im = -1
		em.map((dem, i) =>{
			var dip = dem.indexOf("entrypoints.json")
			var dim = dem.indexOf("manifest.json")
			if(dip != -1){
				ip = i
			}
			if(dim != -1){
				im = i
			}
		})
		if(ip != -1 && im != -1){
			var p = em[ip]
			var m = em[im]
			rne(p,m,d)
		}
	})
	return ems
}

export { mrne };
