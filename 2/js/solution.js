(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;

    /**
     * Функция находит путь к выходу и возвращает найденный маршрут
     *
     * @param {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param {number} x координата точки старта по оси X
     * @param {number} y координата точки старта по оси Y
     * @returns {[number, number][]} маршрут к выходу представленный списоком пар координат
     */
    function solution(maze, x, y) {
        var dir = 0; // 0 - вниз, 1 - влево, 2 - вверх, 3 - вправо
        var result = [[x, y]];
        result.push([x, ++y]);

        while (y < maze.length - 1) {
            if (!check_pos(maze, x, y, dir+1)) {    // если справа свободно
                dir++;
                dir %= 4;
            }
            else if (check_pos(maze, x, y, dir)) {  // если справа и спереди стена
                dir += 3;
                dir %= 4;
                if (check_pos(maze, x, y, dir)) {   // если справа, спереди и слева стена
                    dir += 3;
                    dir %= 4;
                }
            }

            var bias = get_bias(maze, x, y, dir);
            x += bias[0];
            y += bias[1];
            result.push([x, y]);
        }
        return result;
    }

    // вычисляет смещение по координатам x,y после хода в заданном направлении
    function get_bias(maze, x, y, dir) {
        var bias_x = dir % 2 * (dir == 1 ? -1 : 1);
        var bias_y = (dir + 1) % 2 * (dir == 2 ? -1 : 1);
        return [bias_x, bias_y]
    }

    // проверяет, занята ли клетка с координатами [x, y]
    function check_pos(maze, x, y, dir) {
        var bias = get_bias(maze, x, y, dir);
        var bias_x = bias[0];
        var bias_y = bias[1];
        return maze[y + bias_y][x + bias_x] == -1;
    }

    root.maze.solution = solution;
})(this);
