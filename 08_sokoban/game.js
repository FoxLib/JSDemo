// Класс для рисования на canvas
class game {

    constructor() {

        this.el      = document.getElementById('viewport');
        this.ctx     = this.el.getContext('2d');
        this.width   = this.el.width;
        this.height  = this.el.height;
        this.sprite  = {};
        this.map     = [];
        this.info    = {};

        this.loading();
    }

    // Загрузка ресурсов
    loading() {

        let defs = {
            brick:   "img/brick.png",
            box:     "img/box.png",
            mariolf: "img/mariolf.png",
            mariort: "img/mariort.png",
            place:   "img/place.png",
            stone:   "img/stone.png",
        };

        this.image_loading = 0;

        // Просмотреть все спрайты и загрузить
        for (let n in defs) {

            // Увеличивается счетчик
            this.image_loading++;

            // Создается новое изображение
            let image = new Image();

            // Как только изображение загружено, уменьшим счетчик
            image.onload = function() { this.image_loading--; }.bind(this);

            // Запрос изображения
            image.src = defs[n];

            // Сохраним данные
            this.sprite[n] = image;
        }

        // Запуск игры
        this.start();
    }

    // Запуск игры
    start() {

        // Ожидать, пока не будет загружены все ресурсы
        if (this.image_loading) {

            // Вызвать `start` после 10 мс ожидания
            setTimeout(function() { this.start() }.bind(this), 10);
            return;
        }

        // Рисовать первый уровень
        this.setlevel(1);

        // Обработка нажатия на клавишу
        window.onkeydown = function(e) {

            let k = e.key;

            // Предыдущее положение игрока (px, py)
            let [dx, dy, movcnt, px, py] = [0, 0, 0, this.player.x, this.player.y];

            switch (k) {

                case 'ArrowLeft':  dx = -1; dy =  0; this.player.dir = 'lf'; break;
                case 'ArrowRight': dx =  1; dy =  0; this.player.dir = 'rt'; break;
                case 'ArrowUp':    dx =  0; dy = -1; break;
                case 'ArrowDown':  dx =  0; dy =  1; break;
                default: return;
            }

            // Есть возможность движения?
            if (movcnt = this.doMove(dx, dy)) {

                // Сдвинуть игрока с места
                this.player.x += dx;
                this.player.y += dy;
                this.info.steps++;

                // Прорисовать впереди movcnt тайлов
                for (let i = 0; i <= movcnt; i++)
                    this.drawTile(px + dx*i, py + dy*i);
            }

            this.updateStat();

        }.bind(this)
    }

    // Генерация уровня
    setlevel(n) {

        switch (n) {

            case 1:

                // 21x13
                this.map = [

                    ".....................",
                    ".....#####...........",
                    ".....#   #...........",
                    ".....#*  #...........",
                    "...###  *##..........",
                    "...#  * * #..........",
                    ".### # ## #...######.",
                    ".#   # ## #####  xx#.",
                    ".# *  *  @       xx#.",
                    ".##### ### # ##  xx#.",
                    ".....#     #########.",
                    ".....#######.........",
                    "....................."
                ];

                break;
        }

        // Информация об уровне
        this.info = {
            w: this.map[0].length,  // Кол-во символов в первой строке
            h: this.map.length,     // Количество строк,
            steps: 0,               // Кол-во шагов
        };

        this.info.ox = (this.width  - this.info.w*32) / 2;
        this.info.oy = (this.height - this.info.h*32) / 2;

        // Положение игрока
        this.player = {x: -1, y: -1, dir: 'lf'};

        // Превращение в двухмерный массив
        for (let i = 0; i < this.info.h; i++) this.map[i] = this.map[i].split("");

        // Поиск положения игрока
        for (let y = 0; y < this.info.h; y++)
        for (let x = 0; x < this.info.w; x++) {

            if (this.map[y][x] == '@') {
                this.player.x = x;
                this.player.y = y;
                this.map[y][x] = ' ';
            }

            this.drawTile(x, y);
        }

        // Пересчитать статистику
        this.updateStat();
    }

    // Проверка на возможность сдвинуться
    doMove(dx, dy) {

        // Текущее положение игрока
        let [px, py] = [this.player.x, this.player.y];

        // Проверить что впереди
        let b0 = this.map[py + dy][px + dx];

        // Если впереди стена, то двинуться нельзя
        if (b0 == '#') return 0;

        // Есть ящик, проверить возможности сдвинуть его
        if (b0 == '*' || b0 == '%') {

            let b1 = this.map[py + 2*dy][px + 2*dx];

            // Впереди ящика стена или другой ящик, нельзя двинуться
            if (['#','%','*'].includes(b1)) return 0;

            // Иначе сдвинуть ящик
            this.map[py +   dy][px +   dx] = (b0 == '%' ? 'x' : ' ');
            this.map[py + 2*dy][px + 2*dx] = (b1 == 'x' ? '%' : '*');

            return 2;
        }

        return 1;
    }

    // Обновление статистики
    updateStat() {

        let estimate = 0, install = 0;

        for (let i = 0; i < this.info.h; i++)
        for (let j = 0; j < this.info.w; j++) {

            switch (this.map[i][j]) {

                case 'x': estimate++; break;
                case '%': install++; break;
            }
        }

        let text = 'Осталось: ' + estimate + ', установлено: ' + install + ', шагов: ' + this.info.steps;
        if (estimate == 0) text = 'Вы прошли уровень';

        document.getElementById('stats').innerHTML = text;
    }

    // Рисовать спрайт
    draw(x, y, name) {
       this.ctx.drawImage(this.sprite[name], this.info.ox + 32*x, this.info.oy + 32*y);
    }

    // Нарисовать тайл из карты
    drawTile(x, y) {

        let t = this.map[y][x];

        // Для fillRect
        this.ctx.fillStyle = "#000";

        // Выбор картинки
        switch (t) {
            case '#': t = 'brick'; break;
            case '.': t = 'stone'; break; // Кирпичи
            case '*': t = 'box';   break; // Ящик
            case '%': t = 'box';   break; // Ящик на полу
            case 'x': t = 'place'; break;
            default:  t = '';
        }

        if (x == this.player.x && y == this.player.y) {
            this.draw(x, y, 'mario' + this.player.dir); // Игрок
        } else if (t) {
            this.draw(x, y, t); // Спрайт
        } else {
            this.ctx.fillRect(this.info.ox + 32*x, this.info.oy + 32*y, 32, 32); // Пустота
        }
    }
}
