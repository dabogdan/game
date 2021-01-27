/*

The Game Project 5 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

var game_score;
var flagpole;
var lives;
var died;

var isJumping; //added virable to make jumping smooth


function startGame(){

    gameChar_x = width/2;
    gameChar_y = floorPos_y;

    // Variable to control the background scrolling.
    scrollPos = 0;

    // Variable to store the real position of the gameChar in the game
    // world. Needed for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;

    // Initialise arrays of scenery objects.

    trees_x = [
        130, 
        300, 
        600, 
        900
    ];

    collectables = [
        {
            x_pos: 400, 
            y_pos: floorPos_y-70, 
            size: 30,
            isFound: false
        },
        {
            x_pos: 900, 
            y_pos: floorPos_y-100, 
            size: 30,
            isFound: false
        },
        {
            x_pos: 120, 
            y_pos: floorPos_y-50, 
            size: 30,
            isFound: false
        }
    ];

    canyons = [
        {x_pos: -100, width: 100}, 
        {x_pos: 800, width: 80},
        {x_pos: 950, width: 80},
        {x_pos: 150, width: 100}
    ];

    mountains = [
        {x_pos: -100, y_pos: floorPos_y, size: 150}, 
        {x_pos: -50, y_pos: floorPos_y, size: 250},
        {x_pos: 500, y_pos: floorPos_y, size: 150}, 
        {x_pos: 550, y_pos: floorPos_y, size: 250},
        {x_pos: 1200, y_pos: floorPos_y, size: 150}, 
        {x_pos: 1250, y_pos: floorPos_y, size: 250}
    ];

    clouds = [
        {x_pos: -200, y_pos: 200, size: 80},
        {x_pos: 100, y_pos: 170, size: 80},
        {x_pos: 400, y_pos: 200, size: 80},
        {x_pos: 800, y_pos: 170, size: 80},
        {x_pos: 1100, y_pos: 200, size: 80}
    ];

    game_score = 0;

    flagpole = {isReached: false, x_pos: 1500};
    
    died = false;
}

function setup()
{
	createCanvas(windowWidth, windowHeight);
	floorPos_y = height * 3/4;
   
    lives = 3;
        
    startGame();

}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
    

    
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    fill(255);
    
    fill(181,101,29);
//    triangle(0, floorPos_y+50, 10, floorPos_y+40, 20,floorPos_y+50);
    rect(0, floorPos_y+50, width, height/4); // draw some soil
    
    
    
    
    
    

    push();
    translate(scrollPos, 0);
    
	// Draw clouds.
    drawClouds();
	// Draw mountains.
    drawMountains();
	// Draw trees.
    drawTrees();

	// Draw canyons.
    for (var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

	// Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
    {
        if (!collectables[i].isFound){
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        } 
    } 
    
    renderFlagpole();
    
    if(flagpole.isReached == false){
        checkFlagpole();
    }
    
    if(!died){
        checkPlayerDie();
    }
    
//    attempt to make a night
//    var opacity = map(0,10, 1, 0.2)
//    fill('rgba(0,0,0,.4)');
//    rect(-scrollPos,0,width+scrollPos,height);
    
    //touch screen buttons
    fill(0);
    ellipse(gameChar_world_x-48, floorPos_y + 70, 45);
    ellipse(gameChar_world_x+48, floorPos_y + 70, 45);
    
    fill(255);
    triangle (gameChar_world_x-50, floorPos_y + 80, gameChar_world_x-60, floorPos_y + 70, gameChar_world_x-50, floorPos_y + 60); //left
    triangle (gameChar_world_x-40, floorPos_y + 80, gameChar_world_x-50, floorPos_y + 70, gameChar_world_x-40, floorPos_y + 60);
    triangle (gameChar_world_x+50, floorPos_y + 80, gameChar_world_x+60, floorPos_y + 70, gameChar_world_x+50, floorPos_y + 60); //right
    triangle (gameChar_world_x+40, floorPos_y + 80, gameChar_world_x+50, floorPos_y + 70, gameChar_world_x+40, floorPos_y + 60);
    
    pop();

    
        //return if flagpole.isReached and give a message
    if (flagpole.isReached){
        fill('rgba(0, 0, 0, 0.5)');
        rect(0,0,width,height);
        
        fill(255);
        textSize(50);
        text('LEVEL COMPLETE', width/2-220, height/2);
        textSize(20);
        text('Press space to continue', width/2-100, height/2+50);        
//        return;
    }
    
        //return if game is over and give a message
    if (lives < 1){
        fill('rgba(0, 0, 0, 0.5)');
        rect(0,0,width,height);
        
        fill(255);
        textSize(50);
        text('GAME OVER', width/2-170, height/2);
        textSize(20);
        text('Press space to continue', width/2-120, height/2+50);
        return;
    }
    

	// Draw game character.
	
	drawGameChar();
    
    //Draw the scores and lives
    fill(255);
    noStroke();
    textSize(15);
    text("SCORE: " + game_score, 30,30);
    //draw the lives
    text("LIVES: " + lives, 30,50);

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width/2 && isPlummeting == false)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width/2 && isPlummeting == false)
		{
			gameChar_x += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}
    
    //elegant way of jumping (need new variable isJumping)
    if (isJumping) {
        gameChar_y -= 15;
        // check if jump reaches -100 in order to cap at -100 and deactivate "space" button
        if (gameChar_y <= floorPos_y - 100) {
            isJumping = false;
        }   
    }

	// Logic to make the game character rise and fall.
    //gravity
    if (gameChar_y < floorPos_y){
        gameChar_y +=4;
        isFalling = true;
//for smooth jumping
//        check if reached floorPos_y in order to ground
        if (gameChar_y >= floorPos_y){
            gameChar_y = floorPos_y;
            isFalling = false;
        }
    } else {
        isFalling = false;
    }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    
    // if statements to control the animation of the character when
	// keys are pressed.
    if (keyCode == 37) {
        isLeft = true;
    }
    if (keyCode == 39) {
        isRight = true;
    }
    if(keyCode == 32 && gameChar_y == floorPos_y) {
        isJumping = true;
    }
    

}

function keyReleased()
{   
    	// if statements to control the animation of the character when
	// keys are released.
    if (keyCode == 37) {
        isLeft = false;
    }
    if (keyCode == 39) {
        isRight = false;
    }
//elegant jumping
    if(keyCode == 32) {
        isJumping = false;
    }
    
}

function touchStarted(event) {
  
    if (dist(event.clientX, event.clientY, width/2-48, floorPos_y + 70) < 45) {
        isLeft = true;
    }
    if (dist(event.clientX, event.clientY, width/2+48, floorPos_y + 70) < 45) {
        isRight = true;
    }
    return false;
}

function touchEnded(event){
    isLeft = false;
    isRight = false;
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
		//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,20); //head

        fill(15,108,65);
        rect(gameChar_x-5,gameChar_y-75,10,17); //hat
        rect(gameChar_x-10,gameChar_y-60,20,2); //hat
        rect(gameChar_x-7,gameChar_y-40,15,25); //body

        fill(235, 240, 165);
        rect(gameChar_x,gameChar_y-40,+15,6); //left arm
        rect(gameChar_x+10,gameChar_y-40,6,15); //left hand
        rect(gameChar_x-7,gameChar_y-40,-11,6); //right arm
        rect(gameChar_x-18,gameChar_y-40,6,-5); //right hand

        fill(0);
        rect(gameChar_x+3,gameChar_y-15,5,15); //left leg
        rect(gameChar_x-1,gameChar_y,9,3); //left foot
        rect(gameChar_x-7,gameChar_y-22,-5,10); //right leg
        rect(gameChar_x-7,gameChar_y-13,-9,3); //right foot

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,20); //head

        fill(15,108,65);
        rect(gameChar_x-5,gameChar_y-75,10,17); //hat
        rect(gameChar_x-10,gameChar_y-60,20,2); //hat
        rect(gameChar_x-7,gameChar_y-40,15,25); //body

        fill(235, 240, 165);
        rect(gameChar_x,gameChar_y-40,-15,6); //right arm
        rect(gameChar_x-15,gameChar_y-40,6,15); //right hand
        rect(gameChar_x+8,gameChar_y-40,+12,6); //left arm
        rect(gameChar_x+14,gameChar_y-40,6,-5); //left hand

        fill(0);
        rect(gameChar_x-7,gameChar_y-15,5,15); //left leg
        rect(gameChar_x-7,gameChar_y,9,3); //left foot
        rect(gameChar_x+8,gameChar_y-22,5,10); //right leg
        rect(gameChar_x+8,gameChar_y-13,9,3); //right foot

	}
	else if(isLeft)
	{
		// add your walking left code
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,20); //head

        fill(15,108,65);
        rect(gameChar_x-5,gameChar_y-75,10,17); //hat
        rect(gameChar_x-10,gameChar_y-60,20,2); //hat
        rect(gameChar_x-7,gameChar_y-40,15,25); //body

        fill(235, 240, 165);
        rect(gameChar_x+5,gameChar_y-40,-5,20); //left hand

        fill(0);
        rect(gameChar_x-7,gameChar_y-15,5,15); //left leg
        rect(gameChar_x-11,gameChar_y,9,3); //left foot
        rect(gameChar_x+3,gameChar_y-15,5,15); //right leg
        rect(gameChar_x-1,gameChar_y,9,3); //right foot

	}
	else if(isRight)
	{
		// add your walking right code
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,20); //head

        fill(15,108,65);
        rect(gameChar_x-5,gameChar_y-75,10,17); //hat
        rect(gameChar_x-10,gameChar_y-60,20,2); //hat
        rect(gameChar_x-7,gameChar_y-40,15,25); //body

        fill(235, 240, 165);
        rect(gameChar_x+1,gameChar_y-40,-5,20); //right hand

        fill(0);
        rect(gameChar_x-7,gameChar_y-15,5,15); //left leg
        rect(gameChar_x-7,gameChar_y,9,3); //left foot
        rect(gameChar_x+3,gameChar_y-15,5,15); //right leg
        rect(gameChar_x+3,gameChar_y,9,3); //right foot

	}
	else if(isFalling || isPlummeting || isJumping)
	{
		// add your jumping facing forwards code
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,20); //head
        rect(gameChar_x-10,gameChar_y-50,-5,20); //left hand
        rect(gameChar_x+10,gameChar_y-50,+5,20); //right hand

        fill(15,108,65);
        rect(gameChar_x-5,gameChar_y-75,10,17); //hat
        rect(gameChar_x-10,gameChar_y-60,20,2); //hat
        rect(gameChar_x-10,gameChar_y-40,20,25); //body

        fill(0);
        rect(gameChar_x-10,gameChar_y-25,5,15); //left leg
        rect(gameChar_x-14,gameChar_y-10,9,3); //left foot
        rect(gameChar_x+5,gameChar_y-25,5,15); //right leg
        rect(gameChar_x+5,gameChar_y-10,9,3); //right foot
	}
	else
	{
		// add your standing front facing code
        fill(235, 240, 165);
        ellipse(gameChar_x,gameChar_y-50,20); //head
        
        stroke(0);
        strokeWeight(.6);
        fill(255);
        ellipse(gameChar_x-5,gameChar_y-51,7); //left eye
        fill(0);
        ellipse(gameChar_x-5,gameChar_y-51,1); //apple of the left eye
        fill(255);
        ellipse(gameChar_x+5,gameChar_y-51,7); //right eye
        fill(0);
        ellipse(gameChar_x+5,gameChar_y-51,1); //apple of the right eye
        
        fill(250, 128, 114);
        ellipse(gameChar_x,gameChar_y-44,10,2); //mouth
        
        
        noStroke();
        fill(235, 240, 165);
        rect(gameChar_x-10,gameChar_y-40,-5,20); //left hand
        rect(gameChar_x+10,gameChar_y-40,+5,20); //right hand

        fill(15,108,65);
        rect(gameChar_x-5,gameChar_y-75,10,17); //hat
        rect(gameChar_x-10,gameChar_y-60,20,2); //hat
        rect(gameChar_x-10,gameChar_y-40,20,25); //body

        fill(0);
        rect(gameChar_x-10,gameChar_y-15,5,15); //left leg
        rect(gameChar_x-14,gameChar_y,9,3); //left foot
        rect(gameChar_x+5,gameChar_y-15,5,15); //right leg
        rect(gameChar_x+5,gameChar_y,9,3); //right foot
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds ()
{
     for (var i = 0; i < clouds.length; i++){
     //    	draw the cloud
        fill(255);
        ellipse(clouds[i].x_pos-40, clouds[i].y_pos, clouds[i].size+80, clouds[i].size-30);//lond ellipse below
        ellipse(clouds[i].x_pos-20, clouds[i].y_pos-40, clouds[i].size-20);//mid ellipse right
        ellipse(clouds[i].x_pos-72, clouds[i].y_pos-50, clouds[i].size+10);//big ellipse
        ellipse(clouds[i].x_pos+20, clouds[i].y_pos-15, clouds[i].size-25);//small elipse right
        ellipse(clouds[i].x_pos-94, clouds[i].y_pos-18, clouds[i].size-10);//small elipse left
    }
}

// Function to draw mountains objects.
function drawMountains ()
{
    for (var i = 0; i < mountains.length; i++){
        //  draw the mountain
        fill(190,190,190);//light grey
        triangle(mountains[i].x_pos, 
                 mountains[i].size,
                 mountains[i].x_pos+146,
                 mountains[i].y_pos,
                 mountains[i].x_pos,
                 mountains[i].y_pos);
        fill(100,100,100);//grey
        triangle(mountains[i].x_pos,
                 mountains[i].size,
                 mountains[i].x_pos-50,
                 mountains[i].y_pos,
                 mountains[i].x_pos,
                 mountains[i].y_pos)  
    }
}

// Function to draw trees objects.
function drawTrees () 
{
    for (var i = 0; i < trees_x.length; i++){
    //  draw the tree
        noStroke();
        fill(74, 43, 18); //brown
        rect(trees_x[i],floorPos_y-45,10,45); // tree trunk

        fill(21, 87, 47); //green
        triangle(trees_x[i]-25,floorPos_y-40,trees_x[i]+5,floorPos_y-90,trees_x[i]-35+70,floorPos_y-40); //lower branch
        triangle(trees_x[i]-25,floorPos_y-40-30,trees_x[i]+5,floorPos_y-90-30,trees_x[i]-35+70,floorPos_y-40-30); //middle branch
        triangle(trees_x[i]-25,floorPos_y-40-30-30,trees_x[i]+5,floorPos_y-90-30-30,trees_x[i]-35+70,floorPos_y-40-30-30);//higher branch
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{    
    //draw the canyon
    fill(102,102,153);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height);//borders of the canyon
    fill(255,215,0);
    rect(t_canyon.x_pos + 20, floorPos_y, t_canyon.width - 40, height);//yellow space for the character to fall within
    fill(100,155,255);
    rect(t_canyon.x_pos + 20, floorPos_y+140, t_canyon.width - 40, height);//water
    
    
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if  (
        (gameChar_world_x > t_canyon.x_pos + 30 && gameChar_y >= floorPos_y) && 
        (gameChar_world_x < t_canyon.x_pos + t_canyon.width - 30 && gameChar_y >= floorPos_y)
        )
    {
        isPlummeting = true;
    }
    if (isPlummeting){
        gameChar_y +=1;
        isLeft = false;
        isRight = false;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(242, 242, 48);
    ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size);
    fill(204, 219, 222)
    ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size-20)

    fill(0);
    textSize(12);
    text("$",t_collectable.x_pos-3,t_collectable.y_pos+4.5);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 40 || dist(gameChar_world_x ,gameChar_y-50, t_collectable.x_pos, t_collectable.y_pos) < 30){
        t_collectable.isFound = true;
        game_score +=1;
    }
}

function renderFlagpole (){
    push();
    
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250)
    
    if (flagpole.isReached){
        fill(255,0,255);
        noStroke();
        rect(flagpole.x_pos,floorPos_y - 250,50,50);
        noLoop();
    }
    
    if (!flagpole.isReached){
        fill(255,0,255);
        noStroke();
        rect(flagpole.x_pos,floorPos_y-50,50,50);
    }
    
    pop();
}

function checkFlagpole () {
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 15){
        flagpole.isReached = true;
    }
}

function checkPlayerDie () {
    if (gameChar_y >= floorPos_y + 140 && lives > 0){
        lives -= 1;
        died = true;
        startGame();
    }
}