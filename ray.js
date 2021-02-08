/** Зависит от canvas.js */
class Ray {

    constructor() {

        this.width  = canvas.width  / canvas.factor;
        this.height = canvas.height / canvas.factor;
    }

    // Получить базовую матрицу камеры
    matIdentity() {

        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ];
    }

    // Применение вектора перемещения к камере 4x4
    camMove(camera, vecmov) {

        return this.mulmat(camera, [
            [1, 0, 0, vecmov[0]],
            [0, 1, 0, vecmov[1]],
            [0, 0, 1, vecmov[2]],
            [0, 0, 0, 1]
        ]);
    }

    // Умножение матриц
    mulmat(a, b) {

        let row_a = a.length,    row_b = b.length;
        let col_a = a[0].length, col_b = b[0].length;
        let c = [];

        if (col_a == row_b) {

            for (let i = 0; i < row_a; i++) {

                c[i] = [];
                for (let j = 0; j < col_b; j++) {

                    c[i][j] = 0;
                    for (let k = 0; k < col_a; k++)
                        c[i][j] += a[i][k] * b[k][j];
                }
            }

            return c;

        } else {
            throw "Matrixes non valid "+row_a+"x"+col_a + " * "+row_b+"x"+col_b;
        }
    }

    // Скалярное произведение векторов
    scalar(a, b) {

        let r = 0;
        for (let i = 0; i < a.length; i++) r += a[i]*b[i];
        return r;
    }

    // Получение параметров plane по трем точкам
    getPlaneParam(a, b, c) {

        let ABx = b[0] - a[0], ACx = c[0] - a[0],
            ABy = b[1] - a[1], ACy = c[1] - a[1],
            ABz = b[2] - a[2], ACz = c[2] - a[2];

        // Рассчитываем коэффициенты
        return {
            A1: (a[1]*ACz - a[2]*ACy),
            A2: (a[2]*ACx - a[0]*ACz),
            A3: (a[0]*ACy - a[1]*ACx),
            B1: (a[2]*ABy - a[1]*ABz),
            B2: (a[0]*ABz - a[2]*ABx),
            B3: (a[1]*ABx - a[0]*ABy),
            C1: (ABz*ACy - ABy*ACz),
            C2: (ABx*ACz - ABz*ACx),
            C3: (ABy*ACx - ABx*ACy),
            D1: (ACy*ABz - ABy*ACz),
            D2: (ABx*ACz - ACx*ABz),
            D3: (ACx*ABy - ABx*ACy),
            a: a,
            b: b,
            c: c
        };
    }

    // Преобразовать экранные координаты
    getDir(x, y, camera) {

        let w = this.width,
            h = this.height;

        return {x: x - w/2, y: h/2 - y, z: h};
    }

    // Пересечение луча (m) со сферой (o-origin, radius)
    castSphere(m, o, radius) {

        let r = {
            cast: 0
        };

        let a =    (m.x*m.x + m.y*m.y + m.z*m.z);
        let b = -2*(m.x*o.x + m.y*o.y + m.z*o.z);
        let c =    (o.x*o.x + o.y*o.y + o.z*o.z) - radius*radius;
        let d = b*b - 4*a*c;

        if (d >= 0) {

            d = Math.sqrt(d);

            // Найти корни квадратного уравнения и t
            let t = [0, (-b + d) / (2*a), (-b - d) / (2*a)];

            // Ближайшее пересечение линии
            if      (t[2] < 0 && t[1] > 0) t[0] = t[1];
            else if (t[1] < 0 && t[2] > 0) t[0] = t[2];
            else if (t[1] > 0 && t[2] > 0) t[0] = t[1] < t[2] ? t[1] : t[2];
            else t[0] = 0;

            r.cast = m.z * t[0];
        }

        return r;
    }

    // Найти точку пересечения с треугольником или плоскостью, p-параметр из getPlaneParam
    castPlane(d, p, tri) {

        let r = {
            cast: 0
        };

        let D = d.x*p.C1    + d.y*p.C2    + d.z*p.C3;
        let u = d.x*p.A1    + d.y*p.A2    + d.z*p.A3;
        let v = d.x*p.B1    + d.y*p.B2    + d.z*p.B3;
        let t = p.a[0]*p.D1 + p.a[1]*p.D2 + p.a[2]*p.D3;

        if (D != 0) {

            u /= D;
            v /= D;
            t /= D;

            // let [x, y, z] = [t*d.x, t*d.y, t*d.z];

            // Если tri=0, то вычисляет PLANE, если =1 то TRIANGLE
            if (t > 0 && u >= 0 && v >= 0 && (tri && (u + v <= 1) || !tri && (u <= 1 && v <= 1)))
                r.cast = t;
        }

        return r;
    }
}
