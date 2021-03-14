// Класс для рисования на canvas
class game {

    constructor() {

        // Вычисление размера экрана
        let win  = window, doc = document, docelem = doc.documentElement,
            body = doc.getElementsByTagName('body')[0],
            wx = win.innerWidth  || docelem.clientWidth || body.clientWidth,
            wy = win.innerHeight || docelem.clientHeight|| body.clientHeight;

        // Установить новый canvas size
        this.el     = document.getElementById('viewport');
        this.el.width  = wx;
        this.el.height = wy;

        this.ctx    = this.el.getContext('2d');
        this.width  = wx;
        this.height = wy;
        this.img    = this.ctx.getImageData(0, 0, wx, wy);

        // Первоначальные значения
        this.x0 = -0.75;
        this.y0 = 0;
        this.ms = 4 / wx;

        this.start();

        // Регистрация событий
        this.el.onclick = function(e) { this.click(e); }.bind(this);
        win.onkeydown   = function(e) { this.click(e); }.bind(this);
    }

    start() {

        this.palette();
        this.redraw();
    }

    // Генератор палитры
    palette() {

        let pal = [
            [0,     0,   0, 128],
            [128,   0, 255, 255],
            [255, 255, 255, 255],
        ];

        this.palbank = {};

        for (let i = 0; i < pal.length - 1; i++) {

            // Соседние цвета и расстрояние между ними
            let a = pal[i], b = pal[i + 1];
            let d = b[0] - a[0];

            // Вычисление интерполяции
            for (let j = a[0]; j < b[0]; j++) {

                let t = (j - a[0]) / d;
                let [r_, g_, b_] = [
                    Math.floor(a[1]*(1-t) + b[1]*t),
                    Math.floor(a[2]*(1-t) + b[2]*t),
                    Math.floor(a[3]*(1-t) + b[3]*t)
                ];

                this.palbank[j] = r_*65536 + g_*256 + b_;
            }
        }
    }

    // Перерисовать окно
    redraw() {

        let [w, h] = [this.width, this.height];
        let [w2, h2] = [w/2, h/2];

        let time = (new Date()).getTime();
        let iter = 0, cnt = 0;

        // Сам фрактал
        for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {

            let [ax, bx] = [x - w2, y - h2];

            ax = ax*this.ms + this.x0;
            bx = bx*this.ms + this.y0;

            let cl = this.mandel(ax, bx);
            this.pset(x, y, this.palbank[cl]);

            cnt++; iter += (1 + cl);
        }

        // Прицел
        for (let x = -5; x <= 5; x++) {
            this.pset(w2 + x, h2, 0xff0000);
            this.pset(w2, h2 + x, 0xff0000);
        }

        this.flush();

        let stop = (new Date()).getTime();
        this.stats({iter: iter, cnt: cnt, time: stop - time});
    }

    // Вычисление фрактала Мандельброта
    mandel(x, y) {

        let max = 255;
        let [cx, cy] = [x, y];
        for (let i = 0; i <= max; i++) {

            if (x*x + y*y > 4)
                return i;

            let x_ = x*x - y*y + cx;
            let y_ = 2*x*y     + cy;
            [x, y] = [x_, y_];
        }

        return max;
    }

    // Рисование пикселя на экране
    pset(x, y, k) {

        let p = 4*(x + y * this.width);
        this.img.data[p    ] =  (k >> 16) & 0xff;
        this.img.data[p + 1] =  (k >>  8) & 0xff;
        this.img.data[p + 2] =  (k      ) & 0xff;
        this.img.data[p + 3] = ((k >> 24) & 0xff) ^ 0xff;
    }

    // Обновление экрана
    flush() { this.ctx.putImageData(this.img, 0, 0); }

    // Вывод статистики
    stats(info) {

        let text =
            "size: " + this.ms + ", coord: {" +
            this.x0 + ", " + this.y0 + "}, iter: " +
            info.iter + ", pixels: " + info.cnt + ", time: " + info.time + " ms";

        this.ctx.font = "20px Monospace";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(text, 10, this.height - 6);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillText(text, 8, this.height - 8);
    }

    // Нажатие на область
    click(e) {

        if (e instanceof KeyboardEvent) {

            if (e.key == '+') this.ms /= 1.5;
            else if (e.key == '-') this.ms *= 1.5;

        } else if (e instanceof MouseEvent) {

            let xn = (event.offsetX - this.width  / 2),
                yn = (event.offsetY - this.height / 2);
            let bt = event.button;

            this.x0 += xn * this.ms;
            this.y0 += yn * this.ms;

            if (bt == 0) this.ms /= 1.5; else this.ms *= 1.5;
        }

        this.redraw();
    }
}
