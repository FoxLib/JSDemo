screen()(3);

let o    = {x: 0, y: 0, z: 1.5};
let sun  = {x: 1, y: 1, z: -1};
let sunn = normalize(sun);
let rot  = 1;

const dt = 32, dc = 64;

function update() {

    cls(0);

    for (let i = 0; i < 255; i++)
        pset(320*rand(i,0), 200*rand(0,i), gray(i));

    for (let y = -100; y < 100; y++)
    for (let x = -160; x < 160; x++) {

        let c = {x: x/100, y: y/100, z: 1};

        let m  = sphere(c, o, 1);
        let cl = {r: 0, g: 0, b: 0};

        if (m > 0) {

            let cam = {x: c.x*m, y: c.y*m, z: c.z*m};

            // Вычисление нормали
            c = normalize({
                x: cam.x - o.x,
                y: cam.y - o.y,
                z: cam.z - o.z
            });

            let u = atan2(c.x, c.z),
                v = atan2(c.y, c.z);

            u += rot;

            u = u - Math.floor(u);
            v = v - Math.floor(v);
            m = parseInt(fbm(dt*u, dt*v) * 255);
            let cloud = parseInt(Math.pow(fbm(dc*u, dc*v), 4) * 255);

            // Directional light
            let dl = c.x*sunn.x + c.y*sunn.y + c.z*sunn.z;
            if (dl < 0) dl = 0;

            if (m < 132) {

                cl = {r: 0, g: 0, b: 192};

                let lno = normalize({x: sun.x - cam.x, y: sun.y - cam.y, z: sun.z - cam.z});
                    cam = normalize({x: -cam.x, y: -cam.y, z: -cam.z});

                // Вычисление коэффициента отраженного света lspe
                let refl = 2*(cam.x*c.x + cam.y*c.y + cam.z*c.z);
                let ref  = normalize({x: c.x*refl - cam.x, y: c.y*refl - cam.y, z: c.z*refl - cam.z});
                let lspe = ref.x*lno.x + ref.y*lno.y + ref.z*lno.z;

                lspe = lspe < 0 ? 0 : Math.pow(lspe, 11);

                // Умножение на Directional Light
                cl.r = cl.r*dl + 255*lspe;
                cl.g = cl.g*dl + 255*lspe;
                cl.b = cl.b*dl + 255*lspe;
            }
            else if (m > 138) {

                m  = 255*((m-138)/117);
                cl = {r: m, g: 64 + m, b: m};
            }

            if (cloud > 32) {

                cl.r += 2*cloud;
                cl.g += 2*cloud;
                cl.b += 2*cloud;
            }

            // Ограничение
            if (cl.r > 255) cl.r = 255;
            if (cl.g > 255) cl.g = 255;
            if (cl.b > 255) cl.b = 255;

            pset(160 + x, 100 - y, parseInt(cl.r)*65536 + parseInt(cl.g)*256 + parseInt(cl.b));
        }
    }

    rot += 0.0005;
    setTimeout(function() { update(); }, 25);
}

update();

// 0..1
function atan2(x, y) {

    return (Math.atan2(y, x) + Math.PI) / (2*Math.PI);
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
    return m - Math.floor(m);
}

function noise(x, y) {

    let ix = Math.floor(x),
        iy = Math.floor(y);
    let fx = x - ix,
        fy = y - iy;

    let a = rand(ix,     iy),
        b = rand(ix + 1, iy),
        c = rand(ix,     iy + 1),
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
