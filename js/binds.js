/**
 * Created by Lodbrok on 04.09.2017.
 */

(function () {
    var canvas;
    var onClick = false;
    var mouseOffsetX;
    var mouseOffsetY;
    var startVector;


    document.addEventListener("DOMContentLoaded", function (evt) {

        canvas = document.querySelector(".canvas");

        var clientRect = canvas.getBoundingClientRect();
        mouseOffsetX = clientRect.left;
        mouseOffsetY = clientRect.top;

        canvas.addEventListener("mousedown", function (e) {
            if (e.which != 1) {
                return;
            }

            var canvasX = e.pageX - mouseOffsetX;
            var canvasY = e.pageY - mouseOffsetY;

            startVector = new Vector(canvasX - graphicsManager.xCenter, canvasY - graphicsManager.yCenter);

            onClick = true;
        });

        canvas.addEventListener("mouseup", function (e) {
            /*var canvasX = e.pageX - mouseOffsetX;
            var canvasY = e.pageY - mouseOffsetY;*/

            physManager.reAssignBounds();

            onClick = false;
        });

        canvas.addEventListener("mousemove", function (e) {
            if (!onClick) {
                return;
            }

            var canvasX = e.pageX - mouseOffsetX;
            var canvasY = e.pageY - mouseOffsetY;

            var endVector = new Vector(canvasX - graphicsManager.xCenter, canvasY - graphicsManager.yCenter);
            var cos = endVector.scalarMultiply(startVector) / (startVector.length() * endVector.length());

            physManager.rotateBounds(cos);

            //startVector = endVector;
        });

    }, false);


})();
