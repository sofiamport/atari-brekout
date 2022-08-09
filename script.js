var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var imagemMazzutti = document.getElementById("mazzutti");

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 3;
var dy = -3;
var ballRadius = 10; // tamanho da bola
var paddleHeight = 6; // altura da base
var paddleWidth = 98; // largura da base
var paddleX = (canvas.width - paddleWidth) / 2;
var brickRowCount = 3; // fileiras dos blocos
var brickColumnCount = 8; // colunas dos blocos
var brickWidth = 80; // tamanho dos blocos
var brickHeight = 20; // tamanho dos blocos
var brickPadding = 10; // tamanho dos blocos
var brickOffsetTop = 90; // posição dos blocos referente ao topo 
var brickOffsetLeft = 60; // posição dos blocos referente ao lado
var score = 0; // pontuação
var lives = 3; // indica a quantidade de vidas
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {  
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}

function drawBall() {    // desenho da bola
    ctx.drawImage(imagemMazzutti, x, y, 30, 30);
    ctx.beginPath(); // indica um novo path
    ctx.arc(x+16, y+18, ballRadius, 0, Math.PI *2); // forma o círculo
    ctx.fillStyle = "#ffffff00"
    ctx.fill();  // preenche o path usando o estilo atual
    ctx.closePath();
}

function drawPaddle() {  // forma da base 
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);  // cria um path para o retângulo na posição
    ctx.fillStyle = "#CD5C5C"; 
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);   
    ctx.clearRect(0, 0, canvas.width, canvas.height); // limpa todos os pixels de um retângulo definido na posição, apagando conteúdo anterior
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fill();
    drawBricks();  // desenho dos tijolos
    drawBall();  // desenho da bola
    drawPaddle();  // desenho da base
    collisionDetection();
    drawScore();
    drawLives();

    if (x + dx > canvas.width - ballRadius  || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) {
                document.getElementById("game-over").style.zIndex = 1;
                document.getElementById("game-over").style.opacity = 1;
                setTimeout(function(){
                    location.reload();
                },10*1000)
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    x += dx; // fazem a bola mexer 
    y += dy; // fazem a bola mexer 
    requestAnimationFrame(draw); // loop 
}

draw()

canvas.addEventListener("pointermove", function(e) {
    paddleX = e.x-400;  // alinhar cursor a base
})


function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX; 
                bricks[c][r].y = brickY; 

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#F08080";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        document.getElementById("win").style.zIndex = 1;
                        document.getElementById("win").style.opacity = 1;
                        setTimeout(function(){
                            location.reload();
                        },10*1000)
                    }
                }        
            }
        }
    }
}

function drawScore() {  // indica  apontuação
    ctx.font = "25px Monospace"; // tamanho e fonte da escrita
    ctx.fillStyle = "#FFF";
    ctx.fillText("Score: " + score, 16, 40);
}

function drawLives() {  // indica a quantidade de vidas
    ctx.font = "25px Monospace";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Lives: " + lives, canvas.width - 170, 40)

}