

function Point(x,y){
    this.x=x;
    this.y=y;
}

Point.prototype.rotate = function (xc, yc, angle) {
    var x=this.x; y=this.y;
    this.x=x*Math.cos(angle*Math.PI/180)-y*Math.sin(angle*Math.PI/180);
    this.y=x*Math.sin(angle*Math.PI/180)+y*Math.cos(angle*Math.PI/180);
};

Point.prototype.projection_X = function (xc, yc, angle) {
    var x=this.x; y=this.y;
    this.x=x*Math.cos(angle*Math.PI/180)-y*Math.sin(angle*Math.PI/180);
    this.y=x*Math.sin(angle*Math.PI/180)+y*Math.cos(angle*Math.PI/180);
};

Point.prototype.projection_Y = function (xc, yc, angle) {
    this.rotate(xc,yc,-angle);
    var y=this.y;
    this.y=y*Math.cos(angle*Math.PI/180);
    this.x=-y*Math.sin(angle*Math.PI/180);
};


function Vector (x, y) {
	this.x = x;
	this.y = y;
}

Vector.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.plus = function (vector) {
	if (!(vector instanceof Vector)) {
		console.log("тип должен быть Vector");
		return;
	}

    return new Vector (this.x + vector.x, this.y + vector.y);
};

Vector.prototype.plusSelf = function (vector) {
    if (!(vector instanceof Vector)) {
        console.log("тип должен быть Vector");
        return;
    }

    this.x = this.x + vector.x;
    this.y = this.y + vector.y;
};

Vector.prototype.minus = function (vector) {
    if (!(vector instanceof Vector)) {
        console.log("тип должен быть Vector");
        return;
    }

    return new Vector (this.x - vector.x, this.y - vector.y);
};

Vector.prototype.minusSelf = function (vector) {
	if (!(vector instanceof Vector)) {
		console.log("тип должен быть Vector");
		return;
	}
	
	this.x = this.x - vector.x;
	this.y = this.y - vector.y;
};

Vector.prototype.numberMultiply = function (num) {
    // Возможная утечка памяти...
    return new Vector(this.x * num, this.y * num);
};

Vector.prototype.numberMultiplySelf = function (num) {
    // Возможная утечка памяти...
    this.x = this.x * num;
    this.y = this.y * num;
};

Vector.prototype.scalarMultiply = function (vector) {
	if (!(vector instanceof Vector)) {
		console.log("тип должен быть Vector");
		return;
	}

    return this.x * vector.x + this.y * vector.y;
};

function Wall (a, b, c) {
	this.a = a;
	this.b = b;
	this.c = c;
}

Wall.prototype.rotate = function (angle) {
	
};

/*
* config
* x
* y
* mass
* elasticity
* velocityAngle
* velocity
* radius
*
*/

function Ball (config/*x, y, radius, velocity*/) {
	this.position = new Vector (config.x, config.y);
	this.invMass = 1 / config.mass;
	this.elasticity = config.elasticity;
	//velocityAngle = Math.random() * Math.PI;
	this.velocity = new Vector (config.velocity * Math.cos(config.velocityAngle), config.velocity * Math.sin(config.velocityAngle));
	this.radius = config.radius;
}

Ball.prototype.move = function (time) {
    this.position.plusSelf(this.velocity.numberMultiply(time));
};

Ball.prototype.strikeSolverWall = function (wall) {
	if ((wall.a * this.position.x + wall.b * this.position.y + wall.c >= this.radius) || (this.velocity.x * wall.a + this.velocity.y * wall.b > 0)) {
        return;
    }

    // Возможная двойная утечка...
    var projectionVelocity = new Vector (wall.a, wall.b);
    projectionVelocity.numberMultiplySelf(1 / projectionVelocity.length());

    var projectionLength = projectionVelocity.scalarMultiply(this.velocity);
    projectionVelocity = projectionVelocity.numberMultiply(2 * projectionLength);

    this.velocity.minusSelf(projectionVelocity);
};

Ball.prototype.strikeSolverBall = function (ball) {
	// Предусмотреть оптимизацию для того, чтобы не рассчитывать столкновение 2 раза.
	if (Math.sqrt((this.position.x - ball.position.x) * (this.position.x - ball.position.x) + (this.position.y - ball.position.y) * (this.position.y - ball.position.y))
        >= (this.radius + ball.radius) )  {
        return;
	}

    var normal = new Vector (ball.position.x - this.position.x, ball.position.y - this.position.y);
    normal.numberMultiplySelf(1 / normal.length());

    var relativeVelocity = this.velocity.minus(ball.velocity);

    //var impulsBefore = this.velocity.numberMultiply(1 / this.invMass).plus(ball.velocity.numberMultiply(1 / ball.invMass));
    var energyBefore = this.velocity.scalarMultiply(this.velocity) / 2 / this.invMass + ball.velocity.scalarMultiply(ball.velocity) / 2 / ball.invMass;

    this.velocity.minusSelf(normal.numberMultiply((1 + this.elasticity) * this.invMass * normal.scalarMultiply(relativeVelocity)
        / (this.invMass + ball.invMass)));

    normal.x = - normal.x;
    normal.y = - normal.y;

    relativeVelocity.x = - relativeVelocity.x;
    relativeVelocity.y = - relativeVelocity.y;

    ball.velocity.minusSelf(normal.numberMultiply((1 + ball.elasticity) * normal.scalarMultiply(relativeVelocity)
        / (this.invMass + ball.invMass) * ball.invMass));

    //var impulsAfter = this.velocity.numberMultiply(1 / this.invMass).plus(ball.velocity.numberMultiply(1 / ball.invMass));
    var energyAfter = this.velocity.scalarMultiply(this.velocity) / 2 / this.invMass + ball.velocity.scalarMultiply(ball.velocity) / 2 / ball.invMass;

    //console.log(impulsBefore.length() + "  " + impulsAfter.length());
    console.log(energyBefore + "  " + energyAfter);
};





