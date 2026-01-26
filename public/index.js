const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;

const leftPaddle = {
	x: 0,
	y: canvas.height / 2 - paddleHeight / 2,
	width: paddleWidth,
	height: paddleHeight
};

const rightPaddle = {
	x: canvas.width - paddleWidth,
	y: canvas.height / 2 - paddleHeight / 2,
	width: paddleWidth,
	height: paddleHeight
};

const ball = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: 8,
	speed: 5,
	velocityX: 5,
	velocityY: 5
};

function drawRect(x, y, w, h) {
	ctx.fillStyle = "white";
	ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r) {
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
}

function drawNet() {
	for (let i = 0; i <= canvas.height; i += 15) {
		drawRect(canvas.width / 2 - 1, i, 2, 10);
	}
}

canvas.addEventListener("keydown", evt => {
	//Collision check for top or bottom
	if (leftPaddle.y < 0 || leftPaddle.y + leftPaddle.height > canvas.height) {
		return;
	}

	if (evt.key === "ArrowDown") {
		leftPaddle.y += (leftPaddle.height / 2) * 0.2;
	}

	if (evt.key === "ArrowUp") {
		leftPaddle.y -= (leftPaddle.height / 2) * 0.2;
	}
});

function resetBall() {
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.velocityX = -ball.velocityX;
	ball.speed = 5;
}

function update() {
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	// AI paddle movement
	//rightPaddle.y += (ball.y - (rightPaddle.y + rightPaddle.height / 2)) * 0.08;

	// Ball collision with top/bottom
	if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
		ball.velocityY = -ball.velocityY;
	}

	// Determine which paddle to check collision with
	let player = (ball.x < canvas.width / 2) ? leftPaddle : rightPaddle;

	// Ball collision with paddle
	if (
		ball.x - ball.radius < player.x + player.width &&
		ball.x + ball.radius > player.x &&
		ball.y + ball.radius > player.y &&
		ball.y - ball.radius < player.y + player.height
	) {
		// Where ball hit paddle
		let collidePoint = ball.y - (player.y + player.height / 2);
		collidePoint = collidePoint / (player.height / 2);

		// Angle in radians
		let angleRad = collidePoint * (Math.PI / 4);

		// Change ball direction
		let direction = (ball.x < canvas.width / 2) ? 1 : -1;
		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = ball.speed * Math.sin(angleRad);

		// Increase speed slightly
		ball.speed += 0.5;
	}

	// Score check
	if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
		resetBall();
	}
}

function render() {
	// Clear canvas
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw net
	drawNet();

	// Draw paddles
	drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
	drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

	drawCircle(ball.x, ball.y, ball.radius);
}

// Game loop
function game() {
	update();
	render();
}

setInterval(game, 1000 / 60);
