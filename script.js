//Global Constants
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;

//Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4]
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var mistakes = 0;
var canClick = false;



function setPattern(num)
{
  if(num == 1)
    {
      pattern = [5, 2, 4, 3, 2, 1, 5, 4];
    }
  if(num == 2)
    {
      pattern = [1, 3, 4, 5, 2, 5, 2, 3];
    }
  if(num == 3)
    {
      pattern = [3, 4, 2, 1, 1, 4, 2, 3];
      for(let i=0; i< pattern.length; i++)
      {
        pattern[i] = Math.ceil(Math.random() * (5));
      }
    }
}

function startGame(){
  //initialize game variables
  mistakes = 0;
  progress = 0;
  gamePlaying = true;
  document.getElementById("mistakes").textContent = "Lives Left: " + (3 - mistakes)
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  canClick= false;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  setTimeout(setClick, Math.abs(delay-70));
}

function setClick()
{
  canClick=true;
}

function guess(btn){
  console.log("user guessed: " + btn);
  
  if(!gamePlaying)
    {
      return
    }
  
  if(!canClick){
    alert("You can't click while the clue is playing!");
    loseGame();
  }
  
  // add game logic here
  if(btn == pattern[guessCounter])
    {
      if(guessCounter == progress)
        {
          if(progress == pattern.length - 1)
            {
              winGame();
            }
          else
            {
              progress += 1;
              playClueSequence();
            }
        }
      else
        {
          guessCounter += 1
        }
    }
  else
    {
      mistakes += 1;
      document.getElementById("mistakes").textContent = "Lives Left: " + (3 - mistakes)
      if(mistakes == 3)
        {
          loseGame() 
        }
      else
        {
          playClueSequence()
        }
    }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("You won! Game Over.");
}


const freqMap = {
  1: 230,
  2: 321.59,
  3: 430,
  4: 550,
  5: 650
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)