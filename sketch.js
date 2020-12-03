var planeImg,plane;
var cloudImg,cloudGroup;
var enemy=null,bullet;
var bulletGroup;
var playerBullet,playerBulletGroup,reload=0;
var gameState=1
var score=0;
var name

function preload(){
    planeImg=loadImage("plane.png")
    cloudImg=loadImage("cloud.png")
}

function setup(){
    createCanvas(1200,500)

    plane=createSprite(200,250)
    plane.addImage("Plane",planeImg)
    plane.scale=0.5

    bulletGroup=new Group()
    cloudGroup=new Group()
    playerBulletGroup=new Group()

    form=new Form()

    database=firebase.database()
   // playerBulletGroup=new Group()
 }

function draw(){
    background("lightblue")

     //to get the name
     var getName=database.ref('name')
     getName.on("value",(data)=>{
         name=data.val()
     })

     fill("yellow")
     textSize(30)
     text(name,plane.x,plane.y-50)

    if(name===""){
        form.display()
    }

    else{
        form.hide()
    }

    plane.velocityX=6;
    
    //to set the camera position to planes position
    camera.position.x=plane.position.x+300

    //to move the plane up and down
    if(gameState===1){
        if(keyDown(UP_ARROW)){
            plane.y-=10;
        }

        if(keyDown(DOWN_ARROW)){
            plane.y+=10
        }
    
        if(reload>0){
            fill("yellow")
            textSize(30)
            text("reloading",plane.x,50);
        }

        //to display score and instruction
       

        fill("yellow")
        textSize(30)
        text("press space to shoot",camera.position.x-100,50)

        reload--;

        spawnClouds()
        spawnEnemies()
        shoot()
    }

    if(gameState===0){
        fill("red")
        textSize(40)
        text("GAME OVER",plane.x+200,250);
    }

    fill("yellow")
    textSize(30)
    text("score  "+score,camera.position.x-450,50)
    
    drawSprites()
}

function spawnClouds() {
    //to spawn clouds
    if (frameCount % 60 === 0) {
      var cloud = createSprite(plane.x+1100,random(70,450),40,10);
      cloud.addImage("clouds",cloudImg);
      cloud.scale = 0.3;
      cloud.velocityX = -6;
      
       //assign lifetime to the variable
      cloud.lifetime = 200;
      
      //adjust the depth
      cloud.depth = plane.depth;
      plane.depth = plane.depth+1;
      cloudGroup.add(cloud)
    }
    
  }

  function spawnEnemies(){
      // to spawn enemy plane
      //'enemy === undefined' is written to create the seocond plane after destroying 1st plane
    if(plane.x % 250===0 && enemy===null){
        enemy=createSprite(plane.x+600,250)
        enemy.addImage("PLANE",planeImg);
        enemy.scale=0.5;
        enemy.velocityX=6;
        enemy.velocityY=-5
    }

    //to make enemy to move up and down
    if(enemy!==null){
        if(enemy.y<1){
            enemy.velocityY=5;
        }
        if(enemy.y>470){
            enemy.velocityY=-5
        }

        //to create bullets
        if(frameCount % 80===0){
            bullet=createSprite(enemy.x,enemy.y,25,7)
            bullet.lifetime=200
            bullet.depth=plane.depth+1
            bulletGroup.add(bullet)
            bullet.velocityX=-3;
        }

        if(bullet!==undefined){
            if(plane.isTouching(bulletGroup)){
                endGame()
                bulletGroup.destroyEach()
            }
        }
    }
  }

  function shoot(){
      //to create player bullet
    
      if(keyDown("space") && reload<=0){
        playerBullet=createSprite(plane.x,plane.y,20,5)
        playerBullet.shapeColor="red";
        playerBullet.lifetime=200;
        playerBullet.velocityX=12;
        playerBulletGroup.add(playerBullet)
        reload=40
      }

      if(playerBulletGroup && enemy!==null && enemy.isTouching(playerBulletGroup)){
          enemy.velocityY=15
          score=score+100;
          enemy=null;
      }
  }

  function endGame(){
      // to end game
      bulletGroup.setLifetimeEach(-1);
      plane.velocityX=0;
      gameState=0;
      enemy.velocityY=0;
      cloudGroup.setVelocityXEach(6)
      cloudGroup.setLifetimeEach(-1)
  }

