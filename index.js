//variable req for board
let board;
let boardWidth=360;
let boardHeight=640;
let context ;//used for drawing on the board

//bird
let birdWidth=34;
let birdHeight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;
let bird={
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray=[];//multiple pipe hai toh use store karenge isme
let pipeWidth=64;//widrh/height ratio=384/3072=1/8
let pipeHeight=512;
let pipeX=boardWidth;
let pipeY=0;
let topPipeImg;
let bottomPipeImage;


//game physics
let velocityX=-2 //pipe are moving left we aren't moving our flappy bird instead moving the pipe so it appears that bird is moving right
let velocityY=0; //bird jump speed
//when user click it will update the bird velocity
let gravity=0.3;

let gameOver=false;
let score=0;


window.onload=()=>{
    board=document.querySelector("#board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");

    //drawing flappy bird
    //context.fillStyle="green";
    //context.fillRect(bird.x,bird.y,bird.width,bird.height);
    birdImg=new Image();
    birdImg.src="./flappybird.png";
    birdImg.onload=()=>{ //onload nahi lagayenge toh phir woh bina load kiye hi ise run kr dega
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    topPipeImg=new Image();
    topPipeImg.src="./toppipe.png";

    bottomPipeImage=new Image();
    bottomPipeImage.src="./bottompipe.png";


    requestAnimationFrame(update);
    //for generating pipe every 1.5 second
    setInterval(placePipes,1500);
    document.addEventListener("keydown",moveBird);
}

function update(){
    //used for updating the frame for canvas
    //redraw the canvas over and over again it is the main loop
    requestAnimationFrame(update);//recursive
    if(gameOver)
    return ;
    context.clearRect(0,0,board.width,board.height);

    //har baar jab hum naya frame banayenge tb woh purana frame ko clear karna hoga taki woh frame stack up na ho jaye
    velocityY+=gravity;
    bird.y=Math.max(bird.y+velocityY,0);//limit the bird to the top of the canvas
    //har frame me jump kar raha 
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    //naye frame me bird banaya

    if(bird.y>board.height)
    gameOver=true;

    //pipes ko draw kiya 
    for(let i=0;i<pipeArray.length;i++){
        let pipe=pipeArray[i];
        //hum har frame me pipe ka x ko left shift kr rhe jisase wah piche aa jata h
        pipe.x+=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        if(!pipe.passed&&bird.x>pipe.x+pipe.width){
            score+=0.5;
            pipe.passed=true;
        }
        if(detectCollision(bird,pipe)){
            gameOver=true;
        }
    }
    //clear Pipe as by the time it will be very big
    while(pipeArray.length>0&&pipeArray[0].x<-pipeWidth){
        pipeArray.shift();
    }

    //score
    context.fillStyle="white";
    context.font="45px sans-serif"
    context.fillText(score,5,45);
    if(gameOver)
    context.fillText("GAME OVER",5,90);
    
}

function placePipes(){
    if(gameOver)
    return;
    //now we need to randomly placed pipes 
    //(0-1)*256
    //0-> -128 (pipeheight/4)
    //1-> -128-256 (3/4 pipH)
    let randomPipeY=pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
    let openingSpace=board.height/4;

    let topPipe={
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false //used for checking whether flappy bird has passed or not
    }

    pipeArray.push(topPipe);

    let bottomPipe={
        img : bottomPipeImage,
        x : pipeX,
        y : randomPipeY+pipeHeight+openingSpace,  
        width:pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);


}

function moveBird(e){
    if(e.code=="Space" || e.code=="ArrowUp" || e.code=="KeyX"){
        //jump
       
        velocityY=-6;

        if(gameOver){
            bird.y=birdY;
            score=0;
            pipeArray=[];
            gameOver=false;
        }
    }
    //reset the game
    
}

function detectCollision(a,b){ //bird,pipe
    return a.x<b.x+b.width&&
    a.x+a.width>b.x&&
    a.y<b.y+b.height&&
    a.y+a.height>b.y;
}