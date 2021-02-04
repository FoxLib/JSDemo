let canvas = {
    element: null,
    context: null,
    width: null,
    height: null,
    img: null,
    factor: 1,
    refresh: 1,
    refresh_rate: 25,
    dos: [
        0x000000, 0x0000aa, 0x00aa00, 0x00aaaa, 0xaa0000, 0xaa00aa, 0xaa5500, 0xaaaaaa, // 0
        0x555555, 0x5555ff, 0x55ff55, 0x55ffff, 0xff5555, 0xff55ff, 0xffff55, 0xffffff, // 8
        0x000000, 0x141414, 0x202020, 0x2c2c2c, 0x383838, 0x454545, 0x515151, 0x616161, // 10
        0x717171, 0x828282, 0x929292, 0xa2a2a2, 0xb6b6b6, 0xcbcbcb, 0xe3e3e3, 0xffffff, // 18
        0x0000ff, 0x4100ff, 0x7d00ff, 0xbe00ff, 0xff00ff, 0xff00be, 0xff007d, 0xff0041, // 20
        0xff0000, 0xff4100, 0xff7d00, 0xffbe00, 0xffff00, 0xbeff00, 0x7dff00, 0x41ff00, // 28
        0x00ff00, 0x00ff41, 0x00ff7d, 0x00ffbe, 0x00ffff, 0x00beff, 0x007dff, 0x0041ff, // 30
        0x7d7dff, 0x9e7dff, 0xbe7dff, 0xdf7dff, 0xff7dff, 0xff7ddf, 0xff7dbe, 0xff7d9e, // 38
        0xff7d7d, 0xff9e7d, 0xffbe7d, 0xffdf7d, 0xffff7d, 0xdfff7d, 0xbeff7d, 0x9eff7d, // 40
        0x7dff7d, 0x7dff9e, 0x7dffbe, 0x7dffdf, 0x7dffff, 0x7ddfff, 0x7dbeff, 0x7d9eff, // 48
        0xb6b6ff, 0xc7b6ff, 0xdbb6ff, 0xebb6ff, 0xffb6ff, 0xffb6eb, 0xffb6db, 0xffb6c7, // 50
        0xffb6b6, 0xffc7b6, 0xffdbb6, 0xffebb6, 0xffffb6, 0xebffb6, 0xdbffb6, 0xc7ffb6, // 58
        0xb6ffb6, 0xb6ffc7, 0xb6ffdb, 0xb6ffeb, 0xb6ffff, 0xb6ebff, 0xb6dbff, 0xb6c7ff, // 60
        0x000071, 0x1c0071, 0x380071, 0x550071, 0x710071, 0x710055, 0x710038, 0x71001c, // 68
        0x710000, 0x711c00, 0x713800, 0x715500, 0x717100, 0x557100, 0x387100, 0x1c7100, // 70
        0x007100, 0x00711c, 0x007138, 0x007155, 0x007171, 0x005571, 0x003871, 0x001c71, // 78
        0x383871, 0x453871, 0x553871, 0x613871, 0x713871, 0x713861, 0x713855, 0x713845, // 80
        0x713838, 0x714538, 0x715538, 0x716138, 0x717138, 0x617138, 0x557138, 0x457138, // 88
        0x387138, 0x387145, 0x387155, 0x387161, 0x387171, 0x386171, 0x385571, 0x384571, // 90
        0x515171, 0x595171, 0x615171, 0x695171, 0x715171, 0x715169, 0x715161, 0x715159, // 98
        0x715151, 0x715951, 0x716151, 0x716951, 0x717151, 0x697151, 0x617151, 0x597151, // A0
        0x517151, 0x517159, 0x517161, 0x517169, 0x517171, 0x516971, 0x516171, 0x515971, // A8
        0x000041, 0x100041, 0x200041, 0x300041, 0x410041, 0x410030, 0x410020, 0x410010, // B0
        0x410000, 0x411000, 0x412000, 0x413000, 0x414100, 0x304100, 0x204100, 0x104100, // B8
        0x004100, 0x004110, 0x004120, 0x004130, 0x004141, 0x003041, 0x002041, 0x001041, // C0
        0x202041, 0x282041, 0x302041, 0x382041, 0x412041, 0x412038, 0x412030, 0x412028, // C8
        0x412020, 0x412820, 0x413020, 0x413820, 0x414120, 0x384120, 0x304120, 0x284120, // D0
        0x204120, 0x204128, 0x204130, 0x204138, 0x204141, 0x203841, 0x203041, 0x202841, // D8
        0x2c2c41, 0x302c41, 0x342c41, 0x3c2c41, 0x412c41, 0x412c3c, 0x412c34, 0x412c30, // E0
        0x412c2c, 0x41302c, 0x41342c, 0x413c2c, 0x41412c, 0x3c412c, 0x34412c, 0x30412c, // E8
        0x2c412c, 0x2c4130, 0x2c4134, 0x2c413c, 0x2c4141, 0x2c3c41, 0x2c3441, 0x2c3041, // F0
        0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000  // F8
    ]
};

// Создать текущую рабочую область
function screen() {
    
    let id = arguments.length == 0 ? "canvas" : arguments[0];
    let el = document.getElementById(id);
    
    canvas.element = el;
    canvas.context = el.getContext('2d');
    canvas.width   = el.width;
    canvas.height  = el.height;
    canvas.img     = canvas.context.getImageData(0, 0, el.width, el.height);
    
    refresh();
    
    // В случае необходимости использовать factor
    return function(e) { canvas.factor = e; }
}

// Выгрузить данные
function flush() { canvas.context.putImageData(canvas.img, 0, 0); }

// Цвет VGA ДОС
function dos(id) { return canvas.dos[id & 255]; }

// Наблюдатель изменений в картинке
function refresh() {
    
    if (canvas.refresh) flush();
    
    canvas.refresh = 0;
    setTimeout("refresh()", canvas.refresh_rate);
}

// -------------------------------------------------------
// ФУНКЦИИ РИСОВАНИЯ
// -------------------------------------------------------

// Нарисовать пиксель на экране
function pset(x, y, c) {

    x = Math.floor(x);
    y = Math.floor(y);
    f = canvas.factor;
    canvas.refresh = 1;

    for (let i = f*y; i < f*y + f; i++) 
    for (let j = f*x; j < f*x + f; j++) {
            
        if (j >= 0 && i >= 0 && j < canvas.width && i < canvas.height) {
            
            let p = 4*(j + i * canvas.width);
            canvas.img.data[p    ] =  (c >> 16) & 0xff;
            canvas.img.data[p + 1] =  (c >>  8) & 0xff;
            canvas.img.data[p + 2] =  (c      ) & 0xff;
            canvas.img.data[p + 3] = ((c >> 24) & 0xff) ^ 0xff;
        }
    } 
};

// Нарисовать блок на экране
function block(x1, y1, x2, y2, c) {

    for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
            pset(x, y, c);
        }
    }
};

// Нарисовать линию на экране
function line(x1, y1, x2, y2, c) {

    x1 = Math.floor(x1); y1 = Math.floor(y1);
    x2 = Math.floor(x2); y2 = Math.floor(y2);

    let deltax = Math.abs(x2 - x1);
    let deltay = Math.abs(y2 - y1);
    let signx  = x1 < x2 ? 1 : -1;
    let signy  = y1 < y2 ? 1 : -1;

    let error = deltax - deltay;
    let error2;

    pset(x2, y2, c);
    while (x1 !== x2 || y1 !== y2)
    {
        pset(x1, y1, c);
        error2 = error * 2;

        if (error2 > -deltay) {
            error -= deltay;
            x1 += signx;
        }

        if (error2 < deltax) {
            error += deltax;
            y1 += signy;
        }
    }
};

// Создать палитру из входящего массива
function make_palette(colors) {
    
    let colortable = [];

    for (let m = 0; m < colors.length - 1; m++) {

        let a = colors[m]; 
        let b = colors[m + 1];
            
        for (let i = a[0]; i <= b[0]; i++) {
            
            let t = (i - a[0]) / (b[0] - a[0]);
            let cr = parseInt(a[1]*(1 - t) + b[1]*t); 
            let cg = parseInt(a[2]*(1 - t) + b[2]*t); 
            let cb = parseInt(a[3]*(1 - t) + b[3]*t); 
            
            colortable[i] = cr*65536 + cg*256 + cb;
        }
    }
    
    return colortable;
}