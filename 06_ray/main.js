screen()(2);

let ray = new Ray();
let camera = ray.matIdentity();

// Заполнение сцены объектами
// Применение камеры
// Поиск точки пересечения

let plane = ray.getPlaneParam([-1,-1,3], [1,-1,3], [-1,-1,-1]);

let tm = (new Date()).getTime();

for (let y = 0; y < 240; y++)
for (let x = 0; x < 320; x++) {

    let d  = ray.getDir(x, y, camera);

    let r1 = ray.castSphere(d, {x:-3, y:0, z:5}, 2);
    let r2 = ray.castPlane(d, plane, 0);

    if (r1.cast) {
        pset(x, y, 0xffffff);
    }

    if (r2.cast) {
        pset(x, y, 0xc0ffc0);
    }
}

console.log((new Date()).getTime() - tm);
