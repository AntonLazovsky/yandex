(function (root) {
    var map = root.maze.MAZE_Y;
    var path = root.maze.solution(map, 1, 0);

    var pos = 0;
    function print_result() {
        // удаление старого кадра
        var old_maze = document.getElementsByClassName('maze');
        if (old_maze.length > 0)
            old_maze[0].remove();

        // удаление побочного сегмента пути
        var temp_path = path.slice(0, pos);
        if (temp_path.length > 0) {
            var find_pos = index(temp_path.slice(0, temp_path.length - 1), temp_path[pos - 1]);
            if (find_pos != -1) {
                var diff = path.splice(find_pos, pos - find_pos - 1);
                pos -= diff.length;
            }
        }

        // отрисовка нового кадра
        document.querySelector('.outer').appendChild(
            root.maze.render(map, path.slice(0, pos), diff)
        );
        // проверка на прохождение лабиринта
        if (++pos > path.length)
            clearInterval(interval);
    }
    var interval = setInterval(print_result, 150);

})(this);

// поиск подмассива в массиве
function index(array, target) {
    target = target.toString();
    for (var i = 0; i < array.length; i++)
        if (array[i].toString() == target)
            return i;
    return -1;
}