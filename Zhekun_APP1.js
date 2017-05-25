var w; 
var chart = { }; 

var quantity = 70;
var xPosition=[]
var yPosition=[]
var circleSize=[]
var velocity
var direction
var ang
var xChange
var yChange
var minCircleSize = 30;
var maxCircleSize = 80;

function preload(){
  fontRobotto = loadFont('fonts/Roboto-Regular.ttf')
  fontLight = loadFont('fonts/Roboto-Light.ttf')
}

function setup() {
  createCanvas(375, 667);
  frameRate(50)

  //w = requestWeather('data/mit-tuesday.json');
  //w = requestWeather('data/mit-wednesday.json');
  //w = requestWeather('data/cambridge.json');
  //w = requestWeather('data/indianapolis.json');
  //w = requestWeather('data/alcatraz.json');
  w = requestWeather(42.378369, -71.1829495, '622f49954e0369b952c70fa43c64c52d');
  
  chart.left = 40;
  chart.right = width - chart.left;
  chart.top = 400;
  chart.bottom = 515;
  
  for(var i = 0; i < quantity; i++) {
    circleSize[i] = round(random(minCircleSize, maxCircleSize));
    xPosition[i] = random(0, width);
    yPosition[i] = random(0, height);
  }
  
}


function draw() {
  background(201,235,255);
  fill('white');
  noStroke();
  textAlign(CENTER);
  textSize(14);
  
  if (w.ready) {
    drawWind();
//    noLoop();

  } else {
    drawLabel("Loading...");
  }
}


function drawLabel(what) {
  textFont(fontRobotto);
  text(what, width/2, height - 36);
}


function drawWind() {

  fill(255,255,255,150);
  // the moving speed of circles is based on the wind speed
  velocity = float(nf(w.getWindSpeed(), 0, 1));
  direction = int(nf(w.getWindBearing(),0, 0));
  ang = radians(direction);
  // calculate the change of the x and y axis based on wind direction
  xChange = velocity*sin(ang);
  yChange = -velocity*cos(ang);
  smooth()
  
  for(var i = 0; i < xPosition.length; i++) {
    fill(255,random(100,255),random(100,255),150)
    ellipse(xPosition[i], yPosition[i], circleSize[i], circleSize[i]); 
    
    xPosition[i] += map(circleSize[i], minCircleSize, maxCircleSize, xChange-0.5, xChange+0.5);
    yPosition[i] += map(circleSize[i], minCircleSize, maxCircleSize, yChange-0.5, yChange+0.5);

    // reset circles after they go out of the frame based on its moving directions
    if ((xChange >= 0) && (yChange >=0)){
      if ((xPosition[i]>width+circleSize[i]/2) || (yPosition[i]>height+circleSize[i]/2)){
        if (random(0,1)>=0.5){
          (xPosition[i] = random(-80, 0)) && (yPosition[i] = random(-80,height))
        }else{
          (xPosition[i] = random(-80,width)) && (yPosition[i] = random(-80,0))
        }
      }
    }else if ((xChange < 0) && (yChange>=0)){ 
      if ((xPosition[i]<-circleSize[i]/2) || (yPosition[i]>height+circleSize[i]/2)){
        if (random(0,1)>=0.5){
          (xPosition[i] = random(0, width+80)) && (yPosition[i] = random(-80,0))
        }else{
          (xPosition[i] = random(width, width+80) && (yPosition[i] = random(-80, height)))
        }
      }
    }else if ((xChange >= 0) && (yChange < 0)){
      if ((xPosition[i]>width+circleSize[i]/2) || (yPosition[i]<-circleSize[i]/2)){
        if (random(0,1)>=0.5){
          (xPosition[i] = random(-80, width)) && (yPosition[i] = random(height,height+80))
        }else{
          (xPosition[i] = random(-80, 0)) && (yPosition[i] = random(0, height+80))
        }
      } 
    }else{
      if ((xPosition[i]<-circleSize[i]/2) || (yPosition[i]<-circleSize[i]/2)){
        if (random(0,1)>=0.5){
          (xPosition[i] = random(0, width+80)) && (yPosition[i] = random(height,height+80))
        }else{
          (xPosition[i] = random(width, width+80)) && (yPosition[i] = random(0, height+80))
        } 
      }
    } 
  }

  
  fill("white");
  drawLabel(w.getTime().hourMinuteLong());
  
  textSize(14);
  textFont(fontLight);
  text("N",width/2, 160);
  
  // Draw the wind direction and label the north direction
  push();
  strokeCap(ROUND);
  translate(width/2,height/3);
  stroke(255);
  fill(255,80)
  ellipse(0,0,100,100);
  
  noFill();
  stroke(255);
  strokeWeight(3);
  rotate(ang);
  line(0,-30,0,30);
  fill(255);
  line(0,-30,-30,-10)
  line(0,-30,30,-10)
  pop();

  drawWinds();
}

// show the hourly windspeed and direction
function drawWinds() {  
  var speeds = w.getWindSpeed('hourly');  // provides 48 hours (49 values)
  var times = w.getTime('hourly');
  var directions= w.getWindBearing('hourly');
  speeds = subset(speeds, 0, 24);  // use only the first 24 hours
  times = subset(times, 0, 24);
  directions = subset(directions, 0, 24);

  
  // Wind speeds and directions of all day in hours
  fill(255,80)
  stroke(255);
  noFill();
  strokeWeight(1);
  strokeCap(SQUARE);
  
  var minSpeed = min(speeds);
  var maxSpeed = max(speeds);

  var lowSpeed = roundDown(minSpeed);
  var highSpeed = roundUp(maxSpeed);
    
  var count = speeds.length;
  for (var i = 0; i < count; i++) {
    push();
    var newang = radians(directions[i]);
    var y = map(speeds[i], lowSpeed, highSpeed, 10, 50);
    if (i<12){
      var x = map(i, 0, 11 , chart.left, chart.right);
      translate(x,chart.bottom-25);
    } else if (i>=12) {
      var x = map(i, 12, 23, chart.left, chart.right);
      translate(x,chart.bottom+25);
    }
    stroke(255)
    rotate(newang);
    line(0, y/2, 0, -y/2);
    fill(255);
    ellipse(0,-y/2, 3, 3);
    pop();
  }
}