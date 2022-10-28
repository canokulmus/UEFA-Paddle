const cvs = document.getElementById("cvs");
const ctx = cvs.getContext("2d");
const speedDisplay = document.getElementById("speed");
const fps = 65;
let time = 180;
const timer = document.getElementById("timer");

let isGameStarted = false;

const convertSecondsToMinutes = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }
    return `${minutes}:${remainingSeconds}`;
}
timer.textContent = convertSecondsToMinutes(time);

const getTeams = async () => {
    let response = await fetch("teams.json");
    let teams = await response.json();
    return teams;
}

const drawRect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

const drawRectS = (x, y, w, h, color, lineWidth) => {

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, w, h);
}

const drawCircleF = (x, y, r, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

const drawCircleS = (x, y, r, w, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
}

const drawText = (text, x, y, color, size) => {
    ctx.fillStyle = color;
    ctx.font = `${size}px sans-serif`;
    ctx.fillText(text, x, y);
}

const user = {
    x: 20,
    y: cvs.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "#FFF",
    score: 0
}

const com = {
    x: cvs.width - 20 - 10,
    y: cvs.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "#FFF",
    score: 0
}

const ball = {
    x: cvs.width / 2,
    y: cvs.height / 2,
    radius: 13,
    color: "#e91e63",
    speed: 5,
    velocityX: 3,
    velocityY: 4,
    stop: true
}

const movePaddle = (e) => {

    let rect = cvs.getBoundingClientRect();
    user.y = e.clientY - rect.top - user.height / 2;
    ball.stop = false;

    //start timer when game starts
    if (!isGameStarted) {
        isGameStarted = true;
        setInterval(() => {
            if (time > 0) {
                time--;
                timer.textContent = convertSecondsToMinutes(time);
            } else {

            }
        }, 1000);
    }
}

cvs.addEventListener("mousemove", movePaddle);

const collision = (b, p) => {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    // return true if the ball and the paddle collide
    return (b.top < p.bottom && b.bottom > p.top && b.left < p.right && b.right > p.left);

}

const resetBall = () => {
    ball.x = cvs.width / 2;
    ball.y = cvs.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;

    ball.stop = true;
}

const update = () => {

    if (!ball.stop) {
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
    }

    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let comLvl = 0.1;
    com.y += (ball.y - (com.y + com.height / 2)) * comLvl;

    let player = (ball.x < cvs.width / 2) ? user : com;

    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < cvs.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.5;
    }

    if (ball.x > cvs.width) {
        user.score++;
        document.getElementById("user-score").textContent = user.score;
        resetBall();
    } else if (ball.x < 0) {
        com.score++;
        document.getElementById("computer-score").textContent = com.score;
        resetBall();
    }
    speedDisplay.textContent = ball.speed.toFixed(1);
}

const render = () => {
    drawRect(0, 0, cvs.width, cvs.height, "#232427");
    drawRect(cvs.width / 2 - 2, 0, 4, cvs.height, "#FFF");
    drawCircleF(cvs.width / 2, cvs.height / 2, 8, "#FFF");
    drawCircleS(cvs.width / 2, cvs.height / 2, 50, 4, "#FFF");
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawCircleF(ball.x, ball.y, ball.radius, ball.color);
    drawCircleS(0, 0, 20, 2, "whitesmoke");
    drawCircleS(cvs.width, 0 / 2, 20, 2, "whitesmoke");
    drawCircleS(0, cvs.height, 20, 2, "whitesmoke");
    drawCircleS(cvs.width, cvs.height, 20, 2, "whitesmoke");
    drawRectS(0, 0, cvs.width, cvs.height, "whitesmoke", 5);
}

const gameInterval = () => {

    setInterval(() => {

        if (time > 0) {
            update();
            render();
        } else {
            clearInterval(gameInterval);

            if (user.score > com.score) {
                timer.textContent = "You Win!";
            } else if (user.score < com.score) {
                timer.textContent = "You Lose!";
            } else {
                timer.textContent = "Draw!";
            }

            cvs.style.display = "none";
            document.querySelector(".speed").style.display = "none";
            document.querySelector(".backToTeams").style.display = "none";
            document.querySelector("#playAgain").style.display = "block";

        }

    }, 1000 / fps);
}



