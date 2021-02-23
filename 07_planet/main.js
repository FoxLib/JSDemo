screen()(2);

let o   = {x: 0, y: 0, z: 1.5};
let sun = normalize({x: 1, y: 0, z: -0.5});

const dt = 16;

for (let y = -120; y < 120; y++) 
for (let x = -160; x < 160; x++) {
	
	let c = {x: x / 100, y: y / 100, z: 1};
	// let cl = fbm(c.x * dt, c.y * dt);
	
	let m = sphere(c, o, 1);
	if (m > 0) {
		
		// Вычисление нормали
		c = normalize({
			x: c.x*m - o.x,
			y: c.y*m - o.y,
			z: c.z*m - o.z
		});
		
		let u = Math.atan2(c.x, c.z),
			v = Math.atan2(c.y, c.z);
		
		u = ((u - Math.trunc(u)) + 3.14) / 3.14;
		v = v - Math.trunc(v);
		m = fbm(dt*u, dt*v)*128 + 128;
		
		let cl = 0;
		let dl = c.x*sun.x + c.y*sun.y + c.z*sun.z;
		if (dl < 0) dl = 0;
		
		if (m < 128) {
			cl = 255;
		} else {
			cl = gray(2*(m-128));
		}
		cl = gray(u*255);
		pset(160 + x, 120 - y, cl);
	}	
}

function normalize(v) {
	
	let l = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
	return {
		x: v.x / l,
		y: v.y / l,
		z: v.z / l,
	};
}

// x->gray
function gray(x) {
		
	x = parseInt(x);
	if (x < 0) x = 0;
	else if (x > 255) x = 255;
	return x + x*256 + x*65536;
}

function rand(x, y) {
	
	let m = Math.sin(x*12.9898 + y*78.233) * 43758.545312;
	return m - Math.trunc(m);
}

function noise(x, y) {
	
	let ix = Math.trunc(x), 
	    iy = Math.trunc(y);
	let fx = x - ix, 
	    fy = y - iy;
	
	let a = rand(ix, iy),
		b = rand(ix + 1, iy),
		c = rand(ix, iy + 1),
		d = rand(ix + 1, iy + 1);
		
	let ux = fx*fx*(3 - 2*fx),
		uy = fy*fy*(3 - 2*fy);
		
	return a*(1-ux) + b*ux + (c-a)*uy*(1-ux) + (d-b)*ux*uy;
}

function fbm(x, y) {
	
	let val = 0, amp = 0.5, freq = 0;
	
	for (let i = 0; i <= 5; i++) {
		
		val += amp*noise(x, y);
		x *= 2;
		y *= 2;
		amp *= 0.5;	
	}
	
	return val;
}
 
function sphere(d, o, r) {
	
	let t = -1;
	
	let a = d.x*d.x + d.y*d.y + d.z*d.z;
	let b = -2*(d.x*o.x + d.y*o.y + d.z*o.z);
	let c = o.x*o.x + o.y*o.y + o.z*o.z - r*r;
	let det = b*b - 4*a*c;
	
	if (det >= 0) {
		
		det = Math.sqrt(det);
		let x1 = (-b - det) / (2*a),
			x2 = (-b + det) / (2*a);
			
 		if (x1 > 0 && x2 < 0) t = x1;
		if (x1 < 0 && x2 > 0) t = x2;
		if (x1 > 0 && x2 > 0) t = x1 < x2 ? x1 : x2;		
	}
	
	return t;
}