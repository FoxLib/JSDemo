// Класс для рисования на canvas
class game {

    constructor() {

        this.el     = document.getElementById('viewport');
        this.ctx    = this.el.getContext('2d');
        this.width  = this.el.width;
        this.height = this.el.height;
        this.img    = this.ctx.getImageData(0, 0, this.el.width, this.el.height);
    }

    // Рисование пикселя на экране
    pset(x, y, k) {

        let p = 4*(j + i * this.width);
        this.img.data[p    ] =  (k >> 16) & 0xff;
        this.img.data[p + 1] =  (k >>  8) & 0xff;
        this.img.data[p + 2] =  (k      ) & 0xff;
        this.img.data[p + 3] = ((k >> 24) & 0xff) ^ 0xff;
    }

    // Обновление экрана
    flush() { this.ctx.putImageData(this.img, 0, 0); }
}
