//global constants
let HORIZONTALSPACING = 390;
let VERTICALGAP = 75 * 3;
let PIPEMINIMUM = 50;
let HURDLEVELOCITY = -5;
let MAXHURDLES = 20;

//graphics elements
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let scoreLabel = document.querySelector('#score');
let usernameLabel = document.querySelector("#usernameLabel");

//continuously updated elements
let allHurdles = [];
let userProperties = {x: 100, y: 200, width: 75, height: 75, velocity: 0};
let gravity = -HURDLEVELOCITY*1.15;
let BOOST = 175;

//interator
let frame = 0;

//images and their properties
let backgroundImage = new Image();
backgroundImage.src = "https://image.freepik.com/vecteurs-libre/arriere-plan-decoratif-avec-champ-d-39-herbe_23-2147585970.jpg";

let userImage = new Image(userProperties.width, userProperties.height);
userImage.src = 'static/imgs/potato.png';

function begin(){
  document.querySelector("#GameAudio").volume = 0.25;
  //canvas location adjustments
  canvas.width = window.innerWidth*(.75);
  canvas.height = window.innerHeight*(.85);
  userProperties = {x: 100, y: 200, width: 70, height: 70, velocity: gravity};
  allHurdles = [];
  frame = 0;
  //start flappy potato
  animate();}

function animate(time){
  if((frame == 0) || (frame % (HORIZONTALSPACING) == 0)){
    allHurdles.push({x: canvas.width, y: 0, width: 40, height: PIPEMINIMUM + Math.floor(Math.random() * (canvas.width/2.25)) + 1, velocity: HURDLEVELOCITY});
    allHurdles.push({x: canvas.width, y: allHurdles[allHurdles.length - 1].height + VERTICALGAP, width:40, height: canvas.height - allHurdles[allHurdles.length - 1].y, velocity: HURDLEVELOCITY});}

  //used to set the score
  //document.querySelector('#score').innerHTML = "Score: " + frame;
  document.querySelector('#score').innerHTML = "Score: " + Math.floor((frame/(-HURDLEVELOCITY*MAXHURDLES)));

  //used to update the spacing after score update
  //canvas.style.left = (window.innerWidth - canvas.width - document.querySelector('#score').offsetWidth - 8) + "px";

  //used to update positions of all hurdles based on velocity
  for(let i = 0; i < allHurdles.length; i++){allHurdles[i].x += allHurdles[i].velocity;}

  //for data efficiency -- reduces total saved hurdles
  if(allHurdles.length > MAXHURDLES){allHurdles.shift();}

  //clears the screen and begins drawing user and hurdles
  context.clearRect(0, 0, canvas.width, canvas.height);

  //places backgound image into canvas
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  //preformes updates to all properties
  animateHurdles();

  userProperties.velocity += (gravity);

  userProperties.y += userProperties.velocity/-(HURDLEVELOCITY*3);

  animateUser();

  //updates the interator
  frame += -(HURDLEVELOCITY);

  //checks if any objects have collided and determines if loop should continue
  if(!collisionDetection()){
    window.requestAnimationFrame(animate);
  }else{saveData();}}

function saveData(){
  const url = "/game?username="+ usernameLabel.innerHTML + "&score=" + scoreLabel.innerHTML;
  const options = {method: "POST", credentials: "same-origin"}
  fetch(new Request(url, options))}

function animateHurdles(){
  for(let i = 0; i < allHurdles.length; i++){
      context.fillStyle = "#228B22";
      context.fillRect(allHurdles[i].x, allHurdles[i].y, allHurdles[i].width, allHurdles[i].height);}}

function animateUser(){
  context.drawImage(userImage, userProperties.x, userProperties.y, userProperties.width, userProperties.height);}

function collisionDetection(){
  //anchors used for hitbox detection
  let leftUserAnchor = userProperties.x;
  let rightUserAnchor = userProperties.x + userProperties.width;
  let topUserAnchor = userProperties.y;
  let bottomUserAnchor = userProperties.y + userProperties.height;
  //used to loop through all hurdles and verify that no collisions have occured
  for (let i = 0; i < allHurdles.length; i++){
    let isLeftCollision = (leftUserAnchor <= (allHurdles[i].x + allHurdles[i].width) && leftUserAnchor >= allHurdles[i].x);
    let isRightCollision = (rightUserAnchor >= allHurdles[i].x) && (rightUserAnchor <= (allHurdles[i].x + allHurdles[i].width));
    let isTopCollision = ((topUserAnchor <= (allHurdles[i].y + allHurdles[i].height)) && topUserAnchor >= allHurdles[i].y);
    let isBottomCollision = ((bottomUserAnchor >= allHurdles[i].y) && bottomUserAnchor <= (allHurdles[i].y + allHurdles[i].height));
    //returns true if collisions have occured
    if(isRightCollision && (isTopCollision || isBottomCollision)){return true;}
    if(isLeftCollision && (isTopCollision || isBottomCollision)){return true;}
    if(bottomUserAnchor > canvas.height){return true;}
    if(topUserAnchor < 0){return true;}}
  //returns false if collisions have not occured
  return false;}

  //used to update user properties
  document.addEventListener('keydown',(event)=>{
    if(event.key == " "){userProperties.velocity-=BOOST;}});

  function reload(){window.location.reload(true);}

  //used to adjust spacing between the canvas and sides
  window.addEventListener("resize", function(){
    if(window.innerWidth < canvas.width){alert("Your window is too small to play Flappy Potato")}
    else{canvas.width = window.innerWidth*(.75); canvas.height = window.innerHeight*(.85);}}, false);
