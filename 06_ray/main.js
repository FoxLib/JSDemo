screen()(2);

let ray = new Ray();
let camera = ray.matIdentity();

// Заполнение сцены объектами
// Применение камеры
// Поиск точки пересечения

let scene = [];

scene.push( ray.getSphereParam([-2, 0, 4], 2) );
scene.push( ray.getPlaneParam([-2,-1,5], [2,-1,5], [-2,-1,-1], {color: 0x00c000}) );


let tm = (new Date()).getTime();

for (let y = 0; y < 240; y++)
for (let x = 0; x < 320; x++) {

    let d = ray.getDir(x, y, camera);

    let m = ray.intersectScene(d, scene);
    if (m) {
        pset(x, y, m.param.color);
    }
}

console.log((new Date()).getTime() - tm);
