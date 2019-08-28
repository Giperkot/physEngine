/**
 * Created by Admin on 20.08.2017.
 */


(function () {
    let physManager = {};
    const ballsCount = 20;
    const timeInterval = 0.005;

    physManager.bounds  = [
        {a: 1, b: 0, c: 1 },
        {a: -1, b: 0, c: 1 },
        {a: 0, b: 1, c: 1 },
        {a: 0, b: -1, c: 1 }
    ];

    let newBounds = [];


    physManager.balls = [];


    //console.log(physManager.boundCrossPoints);
    // Ищем пересечения.
    //physManager.boundCrossPoints = fillBoundCrossPoints(physManager.bounds);

    physManager.rotateBounds = function (cos) {
        let sin = Math.sqrt(1 - cos * cos);
        for (let i = 0; i < physManager.bounds.length; i++) {
            newBounds[i] = {};
            newBounds[i].a = physManager.bounds[i].a * cos - physManager.bounds[i].b * sin;
            newBounds[i].b = physManager.bounds[i].a * sin + physManager.bounds[i].b * cos;
            newBounds[i].c = physManager.bounds[i].c;
        }
        // Ищем пересечения.
        physManager.boundCrossPoints = fillBoundCrossPoints(newBounds);
    };

    physManager.reAssignBounds = function () {
        //physManager.bounds = newBounds.splice(1);
        copyObject(newBounds, physManager.bounds);
    };

    function generateBalls (count) {
        for (let i = 0; i < count; i++) {
            let config = {
                x: Math.random() * 2 - 1,
                y: Math.random() * 2 - 1,
                z: 0,
                radius: 0.03,
                velocity: new Vector().initFromLength(Math.random(), Math.random() * Math.PI, 0),
                acceleration: new Vector(0, 9.8, 0),
                mass: 2,
                elasticity: 0.5
            };
            physManager.balls.push(new Ball(config));
        }
    }

    function fillBoundCrossPoints (bounds) {
        let result = [];
        for (let i = 0; i < bounds.length - 1; i++) {
            for (let j = i + 1; j < bounds.length; j++) {
                let x = (bounds[j].b * bounds[i].c - bounds[j].c * bounds[i].b) / (bounds[j].a * bounds[i].b - bounds[j].b * bounds[i].a);
                if (isNaN(x) || (""+x).indexOf("Infinity") != -1) {
                    continue;
                }
                let y = - (bounds[j].a * x + bounds[j].c) / bounds[j].b;
                result.push(new Point (x, y));
            }
        }
        return result;
    }


    physManager.rotateBounds(1);
    generateBalls(ballsCount);

    setInterval(function() {
        for (let i = 0; i < physManager.balls.length; i++) {
            for (let j = 0; j < newBounds.length; j++) {
                physManager.balls[i].strikeSolverWall(newBounds[j]);
            }

            /*if (i == physManager.balls.length - 1) {
                break;
            }*/

            for (let j = i + 1; j < physManager.balls.length; j++) {
                physManager.balls[i].strikeSolverBall(physManager.balls[j]);
            }

            physManager.balls[i].move(timeInterval);
        }

        requestAnimationFrame(function () {
            graphicsManager.drawBounds (newBounds, physManager.boundCrossPoints);
            graphicsManager.drawBalls(physManager.balls);
        })
    }, 30);

    // что и куда.
    function copyObject (obj1, obj2) {
        if (obj1 instanceof Array === true) {
            //obj2 = [];
            for (let i = 0; i < obj1.length; i++) {
                copyObject(obj1[i], obj2[i]);
            }
            return;
        }

        if (obj1 instanceof Object === true ) {
            //obj2 = {};
            for (let property in obj1) {
                obj2[property] = obj1[property];
            }
            return;
        }
    }



    window.physManager = physManager;
})();
