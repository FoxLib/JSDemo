class mini3d {

    constructor() {

        this.width  = canvas.width  / canvas.factor;
        this.height = canvas.height / canvas.factor;
        this.size = this.width * this.height;
        this.zbuf = new Float32Array(this.size);

        // Расстояние допустимого Z
        this.mindist = 0.1;
        this.maxdist = 10000;
    }

    cls(cl) {

        for (let i = 0; i < this.size; i++) {

            this.zbuf[i] = this.maxdist;
            pset(i % this.width, parseInt(i / this.width), cl);
        }
    }

    // Нарисовать объект из треугольников
    draw(camera, vertex, faces) {

        let vtx = [];
        for (let v in vertex) {

            // Скопировать точку
            let vt = Object.assign({}, vertex[v]);

            // Матрица преобразований камеры
            vt.x += camera.x;
            vt.y += camera.y;
            vt.z += camera.z;

            vtx[v] = this.projection(vt);
            vtx[v].pt = {x: vt.x, y: vt.y, z: vt.z};
        }

        for (let f in faces) {

            let pts = [];
            let face = faces[f];

            for (let i = 0; i < 3; i++) {

                // -- проверка пересечения z-clip

                let uv = face[i + 3]; // Точка uv-маппинга
                let vt = Object.assign({}, vtx[ face[i] ]);

                [vt.u, vt.v] = uv;
                pts.push( vt );
            }

            this.triangle(pts);
        }
    }

    // Вычислить проекцию точки
    projection(a) {

        let [w, h] = [this.width, this.height];

        return {
            x: parseInt(w/2 + h*a.x/a.z),
            y: parseInt(h/2 - h*a.y/a.z)
        };
    }

    // Нарисовать треугольник на экране (в pts три точки)
    triangle(pts) {

        let [width, height] = [this.width, this.height];
        let [w2, h2] = [width>>1, height>>1];

        // Сокращение координат
        let Ax = pts[0].pt.x, Ay = pts[0].pt.y, Az = pts[0].pt.z,
            Bx = pts[1].pt.x, By = pts[1].pt.y, Bz = pts[1].pt.z,
            Cx = pts[2].pt.x, Cy = pts[2].pt.y, Cz = pts[2].pt.z;

        let u0 = pts[0].u; let u1 = pts[1].u - u0, u2 = pts[2].u - u0;
        let v0 = pts[0].v; let v1 = pts[1].v - v0, v2 = pts[2].v - u0;

        // Разность между точками
        let ABx = Bx - Ax, ACx = Cx - Ax,
            ABy = By - Ay, ACy = Cy - Ay,
            ABz = Bz - Az, ACz = Cz - Az;

        // Расчет матриц
        let A1 = ( Ay * ACz -  Az * ACy), A2 = ( Az * ACx -  Ax * ACz), A3 = ( Ax * ACy -  Ay * ACx);
        let B1 = ( Az * ABy -  Ay * ABz), B2 = ( Ax * ABz -  Az * ABx), B3 = ( Ay * ABx -  Ax * ABy);
        let C1 = (ABz * ACy - ABy * ACz), C2 = (ABx * ACz - ABz * ACx), C3 = (ABy * ACx - ABx * ACy);

        // Выстроить точки сверху вниз
        for (let i = 0; i < 3; i++)
        for (let j = i + 1; j < 3; j++) {
            if (pts[i].y > pts[j].y)
                [pts[i], pts[j]] = [pts[j], pts[i]];
        }

        // Стартовая точка
        let xa = 0;
        let [x0, y0] = [pts[0].x, pts[0].y, 0];
        let [x2, y2] = [pts[2].x, pts[2].y];
        let [dx, dy] = [x2 - x0, y2 - y0];

        // Вообще не рисовать треугольник
        if (y2 < 0) return;
        if (y2 == y0) return;

        // Рисование двух полутреугольников
        for (let i = 0; i < 2; i++) {

            let xb = 0;
            let [x1, y1] = [pts[i  ].x, pts[i  ].y];
            let [x2, y2] = [pts[i+1].x, pts[i+1].y];
            let [lx, ly] = [x2 - x1, y2 - y1];

            // Верхняя грань за верхней границей
            if (y1 < 0) {

                let h = (y2 < 0? y2 : 0) - y1;

                // Сдвиг линии по количеству приращений
                xa += h*dx; x0 += parseInt(xa / dy); xa %= dy;
                xb += h*lx; x1 += parseInt(xb / ly); xb %= ly;
                y1 = 0;
            }

            // Рисование конкретной линии
            for (let y = y1; y < y2 + i; y++) {

                // Линия за пределами экрана
                if (y >= height) break;

                // Минимум и максимум
                let ax = x0 < x1 ? x0 : x1;
                let bx = x0 < x1 ? x1 : x0;

                // Приращения здесь
                xa += dx; x0 += parseInt(xa / dy); xa %= dy;
                xb += lx; x1 += parseInt(xb / ly); xb %= ly;

                // Такая линия не видна
                if (bx < 0) continue;
                if (ax >= width) continue;

                // Коррекция, чтобы не выходил за пределы
                if (ax < 0) ax = 0;
                if (bx >= width) bx = width - 1;

                // Проекционный луч
                let Dx = ax - w2;
                let Dy = h2 - y;
                let Dz = height;
                let Pz = y*width + ax;

                // Расчет координат
                let a = Dx*A1 + Dy*A2 + Dz*A3,
                    b = Dx*B1 + Dy*B2 + Dz*B3,
                    D = Dx*C1 + Dy*C2 + Dz*C3;

                // Отрисовка горизонтальной линии
                for (let x = ax; x <= bx; x++) {

                    if (D != 0) {

                        let u_ = a / D,
                            v_ = b / D;

                        // Сначала рассчитать точку Z
                        let z = Az + ABz*u_ + ACz*v_;

                        // Рисовать данную точку, если она ближе
                        if (z < this.zbuf[Pz]) {

                            // Получение координаты текстуры
                            let u = u0 + u1*u_  + u2*v_;
                            let v = v0 + v1*u_  + v2*v_;

                            // Точки текстуры
                            u = 256*(parseInt(u*255) ^ parseInt(v*255));

                            // Рисование и запись в Z-буфер
                            pset(x, y, u);

                            this.zbuf[Pz] = z;
                        }
                    }

                    // Снижение количества вчислений
                    a += A1;
                    b += B1;
                    D += C1;

                    Pz++;
                }
            }
        }
    }
}
