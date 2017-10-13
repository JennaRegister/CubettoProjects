function init(){
	//A grid is presented. The monkey/human/child must click on the sequence of tiles to get the bee to the star.


	var canvas = document.getElementById("canvas");
        var submit = document.getElementById('sub');
	var yellow_click=0;
	var blue_click =0;
	var red_click = 0;

        //set up the stage
        var stage = new createjs.Stage(canvas);
        stage.enableMouseOver();

        //our little bee friend who is going on an adventure
        var bee = new createjs.Bitmap("images/bee.png");
        bee.regX=50;
	bee.regY=50;
        //evil bomb
        var bomb = new createjs.Bitmap("images/bomb.png");
        bomb.scaleX=bomb.scaleY=1.1;
	var chosen = [];
	var before_animation_x =0;
	var before_animation_y=0;

        //the goal star
        var g = new createjs.Graphics();
        g.setStrokeStyle(1);
        g.beginStroke(createjs.Graphics.getRGB(0,0,0));
        g.beginFill(createjs.Graphics.getRGB(255,0,0));
        var star = new createjs.Shape(g);
        g.beginFill("magenta").drawPolyStar(100, 100, 50, 5, 0.6, -90);
        star.regX=star.regY=40;


	//Set up the grid. *took some code from here: http://maffelu.net/windows-store-app-create-a-basic-grid-game-using-easeljs/ */
	var squares = [];
	var DIM = 120;
        var NUM_TRIALS = 20;
        //their "keyboard" where the tiles live
        var keyboard = new createjs.Shape();
        keyboard.graphics.beginFill("white").drawRoundRect(10, 610, 580, 170,10);
        //set up the initial board (leftover from old code)
	var programs = [
			[['Gray','Gray','Gray','Gray','Gray'],
			['Gray','Gray','Gray','Gray','Gray'],
			['Gray','Gray','Gray','Gray','Gray'],
			['Gray','Gray','Gray','Gray','Gray'],
			['Gray','Gray','Gray','Gray','Gray']]




                ]


        /////////////////////////////////// HERE IS WHERE A LOT OF OUR FUNCTIONS LIVE ////////////////////////////////////////////////////

        //call next based on correct or not
         var collision_bool = function(obj1,obj2,bool){


                 if(if_collide(obj1,obj2)){
                         next(bool);}
                else{
			if(!(if_collide(bee,star))){
				next(false);
			}

                        stage.update();
                         }
         }

         var goalCheck = function(){
                 collision_bool(bee,star,true);
                 collision_bool(bee,bomb,false);
         }




	 var run_the_program = function(){
		 //var tween = make_tween(chosen[0][0],chosen[0][1],chosen[0][2],chosen[0][3],chosen[0][4],chosen[0][5],chosen[0][6]);

			 //var tween = tween.c(make_tween(chosen[i][0],chosen[i][1],chosen[i][2],chosen[i][3],chosen[i][4],chosen[i][5],chosen[i][6]));
			 //tweens.push(temp_tween);
			 var tween = createjs.Tween.get(chosen[0][1],{override:true})
			 .call(function(){stage.mouseEnabled=false;});

			 for(var i =0; i<chosen.length;i++){
				 var the_tile = chosen[i][0]
				 var tile_color = chosen[i][4]
				 var tile_x = chosen[i][5]


				 tween.to({rotation:chosen[i][6]},100)
				.wait(100)
				.to({x:chosen[i][2], y:chosen[i][3]},100)
				.wait(300)


		 }
		 chosen = [];
		 tween.call(function(){goalCheck()})



	 }
	 var make_tween = function(tile,object,x_val,y_val,color,x,rotation){



		 var tween = createjs.Tween.get(object,{override:true})
		 .call(function(){tile.mouseEnabled=false;})
		 .call(function(){tile.graphics.clear().setStrokeStyle(8).beginFill(color).beginStroke("black").drawRect(x,620,DIM,DIM).endFill();stage.update();})
		 .to({rotation:rotation},100)
		 .wait(100)
		 .to({x:x_val, y:y_val},100)
		 .wait(300)
		 .call(function(){goalCheck()})
		 .call(function(){
			 tile.graphics.clear().setStrokeStyle(4).beginFill(color).beginStroke("black").drawRect(x,620,DIM,DIM).endFill();
			 stage.update();this.mouseEnabled=true;
		 });

		 return tween;
	 }
         //create a programming tile
         var makeTile= function(color,dim,index,y){

                 //creates the clickable tile
                 var tile = new createjs.Shape();
                 var x = (DIM+20) * index + 40;
                 if(color!="green"){
                 tile.graphics.setStrokeStyle(4).beginFill(color).beginStroke("black").drawRect(x,y,dim,dim);}
                 //switch on the color to give its proper onclick function (red = right, blue = left, yellow = up)
                 switch(color){
			 //we want to hold on to the cumulative position of the bee in order to animate properly
                         case "green":
                         tile.graphics.setStrokeStyle(4).beginFill(color).beginStroke("black").drawCircle(x+dim/2,y+dim/2,dim/2);

                         tile.addEventListener("click",function(){tile.graphics.setStrokeStyle(8).beginFill(color).beginStroke("black").drawCircle(x+dim/2,y+dim/2,dim/2);
;
if(chosen.length>0){run_the_program();}
else{next(false);}
})
                         break

                         case "red":
                         tile.addEventListener("click", function(){
				 tile.graphics.clear().setStrokeStyle(8).beginFill("red").beginStroke("black").drawRect(x,620,DIM,DIM).endFill();
				 setTimeout(function(){tile.graphics.clear().setStrokeStyle(4).beginFill("red").beginStroke("black").drawRect(x,620,DIM,DIM).endFill();},200);




                                 if(before_animation_x <=430 ){
					 red_click +=1;
					 before_animation_x = before_animation_x + DIM;

					 chosen.push([tile,bee,before_animation_x,before_animation_y,color,x,90]);

					 //var tween = make_tween(tile,bee,bee.x+DIM,bee.y,color,x,90);

                         };


                         });
                         break;
                         case "yellow":




                         tile.addEventListener("click", function(){
				 tile.graphics.clear().setStrokeStyle(8).beginFill("yellow").beginStroke("black").drawRect(x,620,DIM,DIM).endFill();
				 setTimeout(function(){tile.graphics.clear().setStrokeStyle(4).beginFill("yellow").beginStroke("black").drawRect(x,620,DIM,DIM).endFill();},200);


                                 if(before_animation_y>=175 ){
					 yellow_click +=1;
					 before_animation_y = before_animation_y - DIM;


					 chosen.push([tile,bee,before_animation_x,before_animation_y,color,x,0]);
					 //var tween = make_tween(tile,bee,bee.x,bee.y-DIM,color,x,0);
                         	}

                        })


                         break;
                         case "blue":

                         tile.addEventListener("click", function(){
				 tile.graphics.clear().setStrokeStyle(8).beginFill("blue").beginStroke("black").drawRect(x,620,DIM,DIM).endFill();
				 setTimeout(function(){tile.graphics.clear().setStrokeStyle(4).beginFill("blue").beginStroke("black").drawRect(x,620,DIM,DIM).endFill();},200);


                                 if(before_animation_x >=180 ){
					 blue_click+=1;
					 before_animation_x = before_animation_x - DIM;

					 chosen.push([tile,bee,before_animation_x,before_animation_y,color,x,-90]);
					 //var tween = make_tween(tile,bee,bee.x-DIM,bee.y,color,x,-90);
                         }
		 })

                         break;


                 }


                 return tile;
         }
	function getRandomNumber(n1,n2)
	{
	    return Math.floor(Math.random() * n2 ) + n1;
	}

	function getRandomInd(arr) {
  		var random1 = Math.floor((Math.random() * (arr.length)));

   		return arr[random1];
	}

	function createArray(length) {
	    var arr = new Array(length || 0),
		i = length;

	    if (arguments.length > 1) {
		var args = Array.prototype.slice.call(arguments, 1);
		while(i--) arr[length-1 - i] = createArray.apply(this, args);
		}

    		return arr;
	}
	function create2dArray(d1, d2) {
    		var arr = new Array(d1), i, l;
    		for(i = 0, l = d2; i < l; i++) {
        		arr[i] = new Array(d1);
    		}
    		return arr;
	}
        function if_collide(object1, object2){
                //if bee.x within 50 of star.x
                distance_x = Math.abs((object1.x-70)-object2.x)
                distance_y= Math.abs((object1.y-55)-object2.y)



                if(distance_x <=60 && distance_y<=60){
                        console.log("COLLISION");
                        return true;

                }
                else{
                        return false;
                }


        }
	function generateGrid(program)
	{
            //makes and draws our grid
	    var square;
	    var rows = program[0].length;
	    var cols = program.length;



	    for (var y = 0; y < rows; y++)
	    {
		for (var x = 0; x < cols; x++)
		{

		    square = new createjs.Shape();
		    square.graphics.beginStroke('Black');
                    square.graphics.setStrokeStyle(4);
		    square.graphics.beginFill(program[y][x]);
		    square.graphics.drawRect(0, 0, DIM, DIM);
		    square.x = x * DIM;
		    square.y = y * DIM;
		    square.color=program[y][x];
		    //square.addEventListener("click",function(event){if(!event){event=window.event;}squareClick(event,program);}, false);
		    stage.addChild(square);

		    var id = square.x + "_" + square.y;
		    squares[id]=square;
		}
	    }

        ////////////////////////////////////////////////// END OF HELPER FUNCTIONS ///////////////////////////////////////////////////


        // populate the stage
	stage.addChild(star,bomb,bee,keyboard);
        var operators = ["red","blue","yellow","green"]
        var choices = [];
        for (var i=0;i<operators.length;i++){
                choices.push(makeTile(operators[i],DIM,i,620));
        }
        for(var c=0;c<choices.length;c++){
                stage.addChild(choices[c]);
        }

	//funky workaround to be able to access by target x,y and also index in the squares array. Clever, if I do say so myself.
        var x_rand = getRandomInd([0,1,3,4]);
        var y_rand = getRandomInd([0,1,2,3,4]);
	if (y_rand==4 & x_rand==2){
		y_rand=y_rand-getRandomInd([1,2]);
		x_rand=x_rand-getRandomInd([1,2]);

	}
        var bomb_possible_x = [0,1,3,4]
        var bomb_possible_y = [0,1,2,4]
        var i = bomb_possible_x.indexOf(x_rand);
        if(i != -1) {
	bomb_possible_x.splice(i, 1);
        }
        var j = bomb_possible_y.indexOf(y_rand);
        if(j != -1) {
	bomb_possible_y.splice(j, 1);
        }

        var bomb_x = getRandomInd(bomb_possible_x);
        var bomb_y = getRandomInd(bomb_possible_y);


        star.x=squares[String(DIM*(x_rand))+"_"+String(DIM*y_rand)].x;
        star.y=squares[String(DIM*(x_rand))+"_"+String(DIM*y_rand)].y;
	bee.x = squares[String(DIM*2)+"_"+String(DIM*4)].x+60;
	before_animation_x = squares[String(DIM*2)+"_"+String(DIM*4)].x+60;
	bee.y = squares[String(DIM*2)+"_"+String(DIM*4)].y+60;
	before_animation_y = squares[String(DIM*2)+"_"+String(DIM*4)].y+60;

        console.log("starting bee:",bee.x,bee.y);
        bomb.x=squares[String(DIM*bomb_x)+"_"+String(DIM*bomb_y)].x;
        bomb.y=squares[String(DIM*bomb_x)+"_"+String(DIM*bomb_y)].y;
	stage.update();

	}
	var next = function(correct){

                console.log("chosen:",chosen);
                //some kind of feedback here. either long timeout, or treat given for correct.
                if(!(correct)){
                        //TIMEOUT

                        stage.removeAllChildren();
                        canvas.style.backgroundColor="purple";
                        document.getElementById('wrong').play();
                        setTimeout(runThrough,2000);



                }
                if(correct){

                        //give pellet!

                        stage.removeAllChildren();
                        canvas.style.backgroundColor="green";
                        document.getElementById('correct').play();
                        setTimeout(runThrough,100);

                }

        }

	var runThrough = function(){
                stage.removeAllChildren();
		bee.rotation=0;
                canvas.style.backgroundColor="white";
                var start_box = new createjs.Shape();

                start_box.graphics.setStrokeStyle(10).beginFill("white").beginStroke("black").drawRect(200,530,200,200);
                stage.addChild(start_box);

                start_box.addEventListener("click",function(){
                //pop off the stimuli (programs) and keep presenting them until done
		if(NUM_TRIALS >= 1){



			stage.removeAllChildren();
			generateGrid(programs[0]);
			console.log("before:",before_animation_x,before_animation_y)
                        NUM_TRIALS = NUM_TRIALS -1;


		}
                else{
                        //finish();
			stage.removeAllChildren();
                }})
	};

        runThrough();


        function tickerHandler(event){
        stage.update(event);
	}

        //reload frames
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", tickerHandler);

}
