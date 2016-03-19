(function () {
    var video = document.querySelector('.camera__video'),
        canvas = document.querySelector('.camera__canvas'),
        filter = document.querySelector('.controls__filter')
        ;

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

    var applyFilterToData = function (data) {
        var filters = {
            original: function (data) {return data},
            invert: function (data) {
                for (var i = 0; i < data.length; i += 4)
                {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                    data[i + 3] = 255;
                }
                return data;
            },
            grayscale: function (data) {
                for (var i = 0; i < data.length; i += 4)
                {
                    var r = data[i];
                    var g = data[i + 1];
                    var b = data[i + 2];
                    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    data[i] = data[i + 1] = data[i + 2] = v;
                    data[i + 3] = 255;
                }
                return data;
            },
            threshold: function (data) {
                for (var i = 0; i < data.length; i += 4)
                {
                    var r = data[i];
                    var g = data[i + 1];
                    var b = data[i + 2];
                    var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 128) ? 255 : 0;
                    data[i] = data[i + 1] = data[i + 2] = v;
                    data[i + 3] = 255;
                }
                return data;
            }
        };

        var filterName = filter.value;
        return filters[filterName](data);
    };

    var applyFilter = function () {
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        imageData.data = applyFilterToData(imageData.data);
        context.putImageData(imageData, 0, 0)
    };

    var captureFrame = function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        applyFilter();
    };

    getVideoStream(function () {
        captureFrame();
        setInterval(captureFrame, 16);
    });
})();
