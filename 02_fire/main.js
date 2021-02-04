screen()(2);

let arr = [ [], [] ];

for (let i = 0; i < 240; i++) {
    arr[0].push( new Float32Array(320) );
    arr[1].push( new Float32Array(320) );
}


let colors = [

    [0,     0,   0,   0],
    [31,    0,   0, 128],
    [64,  255,   0,   0],
    [128, 255, 255,   0],
    [255, 255, 255, 255],
];

let colortable = make_palette(colors);

function seed() {

    for (let j = 0; j < 320; j++)
        arr[0][239][j] = Math.random() * 256;
}

function color(c) {
    return colortable[ parseInt(c < 0 ? 0 : (c > 255 ? 255 : c)) ];
}

function update() {

    seed();

    // Вычисление
    for (let i = 0; i < 239; i++)
    for (let j = 0; j < 320; j++) {

        let a =
            arr[0][i][j] +
            arr[0][i+1][(j + 319) % 320]+
            arr[0][i+1][(j + 1) % 320] +
            arr[0][i+1][j];

        a = (a / 4) * 0.99;

        arr[1][i][j] = a;
    }

    // Отрисовка
    for (let i = 0; i < 239; i++)
    for (let j = 0; j < 320; j++) {

        arr[0][i][j] = arr[1][i][j];
        pset(j, i, color(arr[0][i][j]));
    }

    setTimeout(function() { update(); }, 10);
}

update();
