var Trex, Trexanimmation;
var ground, groundimage;
var invisibleGround;
var clouds, CloudsImage;
var cati,
  cactiImage1,
  cactiImage2,
  cactiImage3,
  cactiImage4,
  cactiImage5,
  cactiImage6;
var score = 0;
var play = 0;
var end = 1;
var gamestate = play;
var cloudsgroup;
var cactiGroup;
var trexcollided

var Gameover, GameoverImage;
var restart, restartImage;
var jump, die, checkpoint;
localStorage["High score"]=0

function preload() {
  Trexanimmation = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundimage = loadImage("ground2.png");
  CloudsImage = loadImage("cloud.png");
  cactiImage1 = loadImage("obstacle1.png");
  cactiImage2 = loadImage("obstacle2.png");
  cactiImage3 = loadImage("obstacle3.png");
  cactiImage4 = loadImage("obstacle4.png");
  cactiImage5 = loadImage("obstacle5.png");
  cactiImage6 = loadImage("obstacle6.png");
  GameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  trexcollided = loadImage("trex_collided.png")
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkpoint.mp3");
}
function setup() {
  createCanvas(600, 200);

  Trex = createSprite(30, 175, 45, 45);
  Trex.addAnimation("Trex", Trexanimmation);
  Trex.addAnimation("collide", trexcollided)

  Trex.scale = 0.5;

  ground = createSprite(300, 190, 600, 20);
  ground.addImage("floor", groundimage);
  invisibleGround = createSprite(300, 198, 600, 10);
  invisibleGround.visible = false;

  //group
  //cloudsGroup =  createGroup()
  //cactiGroup= createGroup()

  cloudsGroup = new Group();
  cactiGroup = new Group();

  //outer skin to Trex
  Trex.debug = false;
  //Trex.setCollider('rectangle',0,0,100,90)
  Trex.setCollider("circle", 0, 0, 50);

  //Trex.setCollider("circle",0,0,Trex.y/4)

  Gameover = createSprite(200, 100);
  Gameover.addImage("Over", GameoverImage);
  Gameover.scale = 0.5;

  restart = createSprite(200, 150);
  restart.addImage("restart", restartImage);
  restart.scale = 0.5;
}

function draw() {
  background("white");
  drawSprites();
  textSize(25);
  text("score: " + score, 400, 50);
  text("Highestscore:"+localStorage["High score"],100,50)

  if (gamestate === play) {
    restart.visible = false;
    Gameover.visible = false;
    score = score + Math.round(frameCount % 20 === 0);

    if (keyDown("space") && Trex.y >= 151) {
      Trex.velocityY = -8;
      jump.play();
    }
    Trex.velocityY = Trex.velocityY + 0.5;
    ground.velocityX = -(4+score/100)

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //calling my own functions
    createclouds();
    createobstacles();
    if (cactiGroup.isTouching(Trex)) {
      gamestate = end;
      die.play();
       Trex.changeAnimation("collide", trexcollided)
      //Trex.velocityY=-7
    }
    if (score > 0 && score % 50 === 0) {
      checkpoint.play();
    }
  } else if (gamestate === end) {
    Trex.velocityY = 0;
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    cactiGroup.setVelocityXEach(0);

    cactiGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    Gameover.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      restartGame();
    }
  }

  Trex.collide(invisibleGround);

  //console.log(Trex.y);
  //console.log(frameCount)
}

function createclouds() {
  if (frameCount % 60 === 0) {
    clouds = createSprite(500, 40, 60, 10);
    clouds.addImage("cloud", CloudsImage);
    clouds.scale = 0.45;
    clouds.velocityX = -(3+score/100)
    //console.log("cloudss created"+frameCount)
    clouds.y = Math.round(random(50, 130));
    Trex.depth = clouds.depth;
    Trex.depth += 1;
    console.log("trex depth is ", Trex.depth);
    console.log("cllouds depth is ", clouds.depth);
    //lifetime=distance/speed
    //cloudslifetime=500/3=166
    clouds.lifetime = 166;
    cloudsGroup.add(clouds);
  }
}
function createobstacles() {
  if (frameCount % 60 === 0) {
    cacti = createSprite(590, 170, 10, 60);
    cacti.velocityX = -(6+score/100)
  
    cacti.scale = 0.5;
    //lifetime=distance/speed
    //cactilifetime=590/3=196
    cacti.lifetime = 98;
    var number = Math.round(random(1, 6));
    switch (number) {
      case 1:
        cacti.addImage(cactiImage1);
        break;
      case 2:
        cacti.addImage(cactiImage2);
        break;
      case 3:
        cacti.addImage(cactiImage3);
        break;
      case 4:
        cacti.addImage(cactiImage4);
        break;
      case 5:
        cacti.addImage(cactiImage5);
        break;
      case 6:
        cacti.addImage(cactiImage6);
        break;
      default:
        break;
    }

    cactiGroup.add(cacti);
  }
}

function restartGame() {
  gamestate = play;
if(localStorage["High score"]<score){
  localStorage["High score"]=score
}

  score = 0;
  cactiGroup.destroyEach()
  cloudsGroup.destroyEach()
  Trex.changeAnimation("Trex", Trexanimmation);
}
