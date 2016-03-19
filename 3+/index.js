(function () {
    var video = document.querySelector('.camera__video'),
        canvas = document.querySelector('.camera__canvas');

    var getVideoStream = function (callback) {
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true},
                function (stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.onloadedmetadata = function (e) {
                        video.play();
                        callback();
                    };
                },
                function (err) {
                    console.log("The following error occured: " + err.name);
                }
            );
        } else {
            console.log("getUserMedia not supported");
        }
    };

    var captureFrame = function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvas.getContext('2d').drawImage(video, 0, 0);
    };

    getVideoStream(function () {
        captureFrame();
        setInterval(captureFrame, 1); // максимальная частота обновления
    });
})();

var changeFilter = function (name) {
    var filters = {
        invert: 'invert(1)',
        grayscale: 'grayscale(1)',
        threshold: 'grayscale(1) contrast(256)'
    };
    document.querySelector('.camera__canvas').style.cssText = "-webkit-filter: " + filters[name] + ";";
};