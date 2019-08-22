/**
 * Created by Admin on 20.08.2017.
 */

(function () {
    "use strict";
    var graphicsManager = {};


    var canvas = document.createElement("canvas");
    canvas.className = "canvas";
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.id = 'canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    document.body.appendChild(canvas);
    var context = canvas.getContext("2d");
    var xCenter = window.innerWidth / 2;
    var yCenter = window.innerHeight /2;

    graphicsManager.xCenter = xCenter;
    graphicsManager.yCenter = yCenter;

    var distanceCoeff = 300;

    context.fillStyle = "#fff";

    graphicsManager.drawBounds = function (lines, points) {
        clearCanvas();
        context.beginPath();
        for (var i = 0; i < lines.length; i++) {
            var pointsOnLine = [];
            for (var j = 0; j < points.length; j++) {
                if (lines[i].a * points[j].x + lines[i].b * points[j].y + lines[i].c == 0) {
                    pointsOnLine.push(points[j]);
                }
            }

            if (pointsOnLine.length < 2) {
                continue;
            }

            //Рисование границ.
            drawLine(pointsOnLine[0].x, pointsOnLine[0].y, pointsOnLine[1].x, pointsOnLine[1].y);
        }
        //context.closePath();
        context.closePath();
    };

    graphicsManager.drawBalls = function (balls) {
        for (var i = 0; i < balls.length; i++) {

            drawBall(balls[i].position.x, balls[i].position.y, balls[i].radius);

        }
    };



    function clearCanvas() {
        context.fillStyle = "#fff";
        //context.beginPath();
        context.rect(0, 0, window.innerWidth, window.innerHeight);
        context.fill();
        //context.closePath();
    }

    function drawLine (x1, y1, x2, y2) {

        context.strokeStyle = "black";

        context.lineWidth = 2;


/*        context.moveTo(0,0);
        context.lineTo(500,500);*/
        context.moveTo(x1 * distanceCoeff + xCenter, y1 * distanceCoeff + yCenter);
        context.lineTo(x2 * distanceCoeff + xCenter, y2 * distanceCoeff + yCenter);


        context.stroke();

        //context.fill();
    }

    function drawBall (x, y, radius) {
        context.beginPath();
        context.arc(x * distanceCoeff + xCenter, y * distanceCoeff + yCenter, radius * distanceCoeff, 0, 2 * Math.PI);
        //context.arc(100, 100, 10, 0, 2 * Math.PI);
        context.stroke();
        //context.fill();
    }


    window.graphicsManager = graphicsManager;
})();
