var canvas = document.querySelector("canvas");
canvas.height= window.innerHeight- window.innerHeight/8;
canvas.width= window.innerWidth- window.innerWidth/8;
var image = document.querySelector("#flappybird");
var ctx =  canvas.getContext("2d");

const sprite = new Image();
sprite.src = "img/sprite.png";
sprite.height= 300;
sprite.width = 200;

console.log(canvas.className.split(" "))
const gravity=0.4;
var flapping = false;
var flapValue= -8;
var DEGREE= Math.PI/180;
var angle=0;


const startBtn = {
    x : canvas.width*6/13,
    y : 263,
    w : 83,
    h : 29
}

canvas.addEventListener("click", function(evt){
            let rect = canvas.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            // CHECK IF WE CLICK ON THE START BUTTON
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                document.location.reload(true);
            }
});

canvas.addEventListener("click",function(){
	flapping= true;
				console.log(angle);
				if ( angle>=0.45){
					angle+= 10* DEGREE;
				}else{
				angle += 38 * DEGREE;
				}
})


const gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : canvas.width/2 - 225/2,
    y : 90,
    
    draw: function(){
    	    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);   
    		ctx.font = "30px Teko";
            ctx.fillText(Math.floor(score.value/2), canvas.width/2+65, 186);
            ctx.strokeText(Math.floor(score.value/2), canvas.width/2+65, 186);
        
    }
    
}

const score={
	best: 0,
	value: 0,
	draw:function(){
		ctx.fillStyle="#FFF";
		ctx.strokeStyle="000";
		ctx.lineWidth = 2;
		ctx.font="60px Teko";
		ctx.fillText(Math.floor(this.value/2),canvas.width/2-9,50);
		ctx.strokeText(Math.floor(this.value/2),canvas.width/2-9,50);
	}
}




	
console.log(DEGREE)
function Bird(){

	this.animation=[
        {sX: 276, sY : 112},
        {sX: 276, sY : 139},
        {sX: 276, sY : 164},
        {sX: 276, sY : 139}
    ],

    this.frame=0;
    this.anim=0;
	this.x=100;
	this.y=150;
	this.dx=0;
	this.dy=0;
 	this.w=34;
    this.h=26;
    //bird animation
    this.incrementFrame = function(f){
    	if(this.anim==2){
    		this.anim=0;
    	}
    	if (f%10==0)
    	{
    		this.anim++;
    	}
    	this.frame++;
    }


	this.flap= function(){
		if(flapping==true){
			this.dy = flapValue;
		}
		flapping = false;
	}

	this.keyPress = function(){
		document.onkeydown = function(e){
			if(e.keyCode == 32){
				flapping= true;
				console.log(angle);
				if ( angle>=0.1){
					angle+= 10* DEGREE;
				}else{
				angle += 38 * DEGREE;
				}
			}
		}
		this.flap();
	}

	this.randomTimer=0;
	this.dxPipe= 4;
	this.pipes=[];

	this.randomizePipe= function(){
		if(this.randomTimer%100==0){

			this.randomTimer=0;
			let gap = 150;
			let tranche = (Math.random()*5) +1
			let i = (canvas.height - gap) / tranche
    		let j = (canvas.height - i - gap)
			this.pipes.push({
				xPipe: canvas.width-canvas.width/12,
				x: i,
				y: j
			});
		}
		this.randomTimer++;
	}

	this.drawPipes= function(){
		let top ={
        	sX : 554,
        	sY : 0
    	};
   		let bottom={
        	sX : 500,
        	sY : 0
    	}
    	let w = 53;
    	let h = 400;


    	for (i=0;i<this.pipes.length;i++)
    	{
    		let p = this.pipes[i];
    		p.xPipe -= this.dxPipe;
    		//TOP PIPE
	    	ctx.drawImage(sprite, top.sX, top.sY, w, h,p.xPipe,0, w, p.x);
	    	// BOTTOM PIPE
	    	ctx.drawImage(sprite, bottom.sX, bottom.sY, w, h,p.xPipe, canvas.height-p.y, w, p.y);
    	}

    	// DRAWING THE SCORE
    	score.draw();

	}

	this.updatePipes= function(){
		if(this.dxPipe==0){
			this.drawPipes();
		}else{
			this.randomizePipe();
			this.drawPipes();
		}

	}

	this.draw= function(){
		ctx.fillStyle="#70c5ce"
		ctx.fillRect(0,0,canvas.width, canvas.height);
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(-angle);
		ctx.translate(-this.x,-this.y);
		ctx.drawImage(sprite, this.animation[this.anim].sX, this.animation[this.anim].sY, this.w, this.h,this.x,this.y, this.w, this.h);
		ctx.restore();
	}


	this.update= function(){
		//checks if a key is pressed
		this.keyPress();
		this.incrementFrame(this.frame);

		if (angle<-0.2){
		angle -= 0.5 *DEGREE;
		}else{
		angle-= DEGREE;
		}
		this.y+=this.dy;
		this.draw();
	}


	this.death=function(){
		//CHECK IF BIRD IS ON GROUND
		if(this.y >= canvas.height - sprite.height + 220){
			// throw new Error("Dead");
			this.dy=0;
			flapValue=0;
			this.dxPipe=0;
			DEGREE=0;
			gameOver.draw();
		}else{
			this.dy+= gravity;
		}
		//CHECK IF BIRD IS ON PIPE
		let j=0;
		for(i=0;i<this.pipes.length;i++){
			let p=this.pipes[i];
			// console.log(this.y,canvas.height - p.y);
			if(this.x>Math.floor(p.xPipe)-3 && this.x<Math.floor(p.xPipe)+3 && (this.y < p.x +12|| this.y > canvas.height - p.y -15)){
				flapValue=0;
				this.dxPipe=0;
				DEGREE=0;
				gameOver.draw();
								// throw new Error("Dead");
			}else if (this.x>Math.floor(p.xPipe)-5 && this.x<Math.floor(p.xPipe)+5 && (this.y > p.x +12|| this.y < canvas.height - p.y -15)){	
				score.value+=1;
			}
		}
	}
}

var bird = new Bird();

function animate(){
	requestAnimationFrame(animate);
	bird.update();
	bird.updatePipes();
	bird.death();

}
animate();




