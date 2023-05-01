let foodY = 10;
let foodX  = 13;
const playBoard = document.querySelector(".play-board");

let snakeX = 20;
let snakeY = 10;

let velocityX = 0;
let velocityY = 0;

let snakeBody = [];

let gameOver = false;

let setIntervalId;

let scoreElement = document.getElementById("score");
let score = 0;
let highScoreElement = document.getElementById("high-score");
let highScore = 0;

const controls = document.querySelectorAll(".control-board i");

const handleGameOver = () => {
    //Clearing the time interval and reloading the page when game is over
    storeHighScore();
    clearInterval(setIntervalId);
    alert("To start the game again click ok");
    location.reload();
}

//to display high score till now
const storeHighScore = () => {
    //update high score if necessary
    if(score > highScore)
    highScore = score;

    localStorage.setItem("high-score", highScore);
}

//to change Position of food randomly
const changePosition = () => {
    //to generate random food position between 1-30
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

//to initialize play-board at the start of the game
const initGame = () => {
    scoreElement.textContent = "Score : " + score;
    highScore = localStorage.getItem("high-score");
    highScoreElement.textContent = "High Score : " + highScore;

    //check if game is over or not
    if(gameOver)  return handleGameOver(); 
    
    //creating food
    let htmlMarkup = `<div class = "food" style = "grid-area : ${foodY} / ${foodX}"> </div>`;

    //if snake hits food add this position to array
    if(snakeX === foodX && snakeY === foodY)
    {
        changePosition();
        snakeBody.push([foodX, foodY]);
        score++;
    }


    //snake is moving forward so prev position of head becomes current position of tail

    /* Note : Remember that we do not need to keep the position of food in array static.
    As the snake moves this position must also be updated. Actually we are never recording
    food position we are always recording snake position and when snake hits food we add
    this position to an array and each position of the snake body will be updated (even if
    snake doesn't hit food) because snake head is always changing so 1st value becomes 2nd,
    2nd value becomes 3rd and so on till array size and last element of array that gets
    deleted signifies the block that the snake just left. */

    //shifting values 1 forward in snakeBody array
    for(let i=snakeBody.length-1;i>0;i--)
    {
        snakeBody[i] = snakeBody[i-1];
    }


    //making current position of head to first element of array
    snakeBody[0] = [snakeX, snakeY];


    //update snake head position according to velocity
    snakeX += velocityX;
    snakeY += velocityY;

    //checking if new snake position is valid or not
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30)
    gameOver = true;


    //adding div for each position stored in the snakeBody array
    for(let i=0;i<snakeBody.length;i++)
    {
        htmlMarkup += `<div class = "snake" style = "grid-area : ${snakeBody[i][1]} / ${snakeBody[i][0]}"> </div>`;

        /* Checking if updated head of snake is equal to this new div. If so then the snake 
        collided with its own body. */

        if(i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1])
        gameOver = true;

    }

    //adding html to playboard
    playBoard.innerHTML = htmlMarkup;    
}

controls.forEach(arrow => {
    arrow.addEventListener("click", function(){
        //dataset is used to access data created by developer for their own use like data-key has been created

        //Note - key is user defined it can be data-xyz = "data_val" and can be accessed as dataset.xyz
        //eg. console.log(arrow.dataset.xyz);

        changeDirection(arrow.dataset);
    })
});

const changeDirection = (e) => {
    const key = e.key;
    if (key === "ArrowUp" && velocityY != 1)
    {
        velocityY = -1;
        velocityX = 0;
    }
    else if (key === "ArrowDown" && velocityY != -1)
    {
        velocityY = 1;
        velocityX = 0;
    }
    else if (key === "ArrowRight" && velocityX != -1)
    {
        velocityX = 1;
        velocityY = 0;
    }
    else if (key === "ArrowLeft" && velocityX != 1)
    {
        velocityX = -1;
        velocityY = 0;
    }
}



document.addEventListener("keydown", changeDirection);

setIntervalId = setInterval(initGame, 250);