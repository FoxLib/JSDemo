screen()(2);

let arr = [ [], [] ];

for (let i = 0; i < 240; i++) {
    arr[0].push( new Float32Array(320) );
    arr[1].push( new Float32Array(320) );
}

let colors = [

    [0,     0,   0,  32],
    [128,   0,   0, 128],
    [192,   0, 192, 255],
    [255, 255, 255, 255]
];

let colortable = make_palette(colors);

function color(c) {
    return colortable[ parseInt(c < 0 ? 0 : (c > 255 ? 255 : c)) ];
}

function seed() {

    for (let i = 0; i < 3; i++) {
        arr[0][parseInt(Math.random()*240)][parseInt(Math.random()*320)] = 255;
    }
}

function xy(x, y) {

    if (x < 0) x = -x;
    if (y < 0) y = -y;
    if (x >= 320) x = 639 - x;
    if (y >= 240) y = 479 - y;
    return arr[0][y][x];
}

function update() {

    seed();

    const omega = 0.99;

    // Вычисление
    for (let i = 0; i < 240; i++)
    for (let j = 0; j < 320; j++) {

        let laplas;

        // Расчет лапласиана
        laplas  = xy(j-1, i+0);
        laplas += xy(j+1, i+0);
        laplas += xy(j+0, i-1);
        laplas += xy(j+0, i+1);

        // Дополнительная точность
        laplas += xy(j-1, i-1);
        laplas += xy(j+1, i+1);
        laplas += xy(j-1, i+1);
        laplas += xy(j+1, i-1);
        laplas = (laplas / 8.0);

        // Релаксация, чтобы волны успокаивались
        arr[1][i][j] = (laplas + omega*(arr[0][i][j] - arr[1][i][j])) * 0.999;
    }

    // Отрисовка
    for (let i = 0; i < 240; i++)
    for (let j = 0; j < 320; j++) {

        let a = arr[0][i][j];
        arr[0][i][j] = arr[1][i][j];
        arr[1][i][j] = a;

        pset(j, i, color(128 + arr[0][i][j]));
    }

    setTimeout(function() { update(); }, 10);
}

update();
