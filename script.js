'use strict';

// general values
let activePlayer; // 1 , 2
let playerOne_socre;
let playerTwo_socre;
let draw_score;

// when each set has finished, symbol will change. (  x  ,  o   )
let symbol;

// 1 = player1    2 = player2 
let board;

// each player reaches 5 score wins!!
const game_victory = 5;

// player colores
const color = ['cyan', 'magenta'];

// fetching elements
const p1ScoreEl = document.querySelector('.score-sign-p1');
const p2ScoreEl = document.querySelector('.score-sign-p2');
const drawScoreEl = document.querySelector('.Draw-sign');
const cube = document.querySelectorAll('.cube');

const btnRecord = document.querySelector('.btn-svg-record');
const btnPlayPause = document.querySelector('.btn-svg-play-pause');

const recordListEl = document.querySelector('.record-list');
const btnNextPreviousContainerEL = document.querySelector('.btn-container');
const btnNextEl = document.querySelector('.btn-next');
const btnPreviousEl = document.querySelector('.btn-previous');






// //////monitoring//////
// //////////////////////
let record = false;
let boardRecord = [];
let lastTime = 0;
let playRecord = false;
/////////////////////////

function initial_game(){
  board = [0,0,0,0,0,0,0,0,0];
  activePlayer = 1;
  playerOne_socre = 0;
  playerTwo_socre = 0;
  draw_score = 0;
  symbol = 'x';

  // add Click event to cubes
  add_click_to_cube()

  // showing the game data
  show_info()
}

function show_info(){
  p1ScoreEl.textContent = playerOne_socre;
  p2ScoreEl.textContent = playerTwo_socre;
  drawScoreEl.textContent = draw_score;
}

function add_click_to_cube(){
  for(let i = 0 ; i < 9; i++){
    cube[i].addEventListener('click', function(){
    game_controler(cube[i].ariaLabel);
    });
  }}

////////////////START///////////////
///////////////////////////////
// recordBoard Function
// record game's data in a array
function recordBoardMovs( mov, player, movTime ){
  // untill end of the game winner is unknown!!!
  // this func just store the moves
  boardRecord[boardRecord.length -1].mov.push([`p${player}`, mov, `${movTime}s`])
  
}

function initiate_record(){
  boardRecord.push({
    result: '',
    gameTime: '',
    mov: [], //[[p1,c1,5],[p2,a2,6]] [[player, moves, time]]
    startTime: [
      String(new Date()),
      String(new Date()).split(' ').filter(item => item.includes(':'))
      .map(item => item.replaceAll(':',''))
    ]
  });

  // index[-1] index of last item in a array

  record = true
}

function finish_record(ended_game_result = null){
  record = false;
  // calculate whole time of the game 
  let Time = getTime()  - boardRecord[boardRecord.length -1].startTime[1];
  console.log('gameTime: '+ Time);
  boardRecord[boardRecord.length - 1].gameTime = Time;

  // if record stopped by game
  // we have result 
  if(ended_game_result !== null){
    boardRecord[boardRecord.length - 1].result = ended_game_result === 0 ? `${ended_game_result}` : `p${ended_game_result}`;
  }

  // adding a new record to the UI
  // value of each option is the index of a record in the array
  
  recordListEl.insertAdjacentHTML("afterbegin",`
  <option  value="${boardRecord.length - 1}">record ${boardRecord.length}</option>`);
}

// monitoring system      game system
// c  *   *   *           1   2   3
// b  *   *   *           4   5   6
// a  *   *   *           7   8   9
//    1   2   3
// MG = monitoringSystem to  gameSystem 
function movConvert(mov, MG = false) {
  if(MG === false){
    if(mov <= 3){
      return `c${mov}`;
    }else if(mov >= 7){
      return `a${mov - 6}`;
    }else{
      return `b${mov - 3}`;
    }
  }
  else{
  switch (mov) {
    case 'a1':
        return 7;
    case 'a2':
        return 8;
    case 'a3':
        return 9;
    case 'b1':
        return 4;
    case 'b2':
        return 5;
    case 'b3':
        return 6;
    case 'c1':
        return 1;
    case 'c2':
        return 2;
    case 'c3':
        return 3;
  }
}}

function getTime(){
  let time = String(new Date())
  .split(' ')
  .filter(item => item.includes(':')).map(item => item.replaceAll(':',''));
  return time;

  // 153105
  // 15 hr  / 31 min / 05 second
}


//////////////////////////////////////
//////////////////END////////////////////

// this function select player choices with number of cube
function displayCubeUI(cubeNum, activePlayer, symbol){
  document.querySelector(`.cube-${cubeNum}`).textContent = symbol;
  cube[cubeNum - 1].classList.add(`p${activePlayer}-cube-clicked`);
  cube[cubeNum - 1].classList.add('disabled-button');
}

function game_controler(cubeNum){
  
  displayCubeUI(cubeNum, activePlayer, symbol);

  board[cubeNum - 1] = activePlayer;

  // record
  if(record === true){
    let time = getTime();
    time = time - lastTime; // second
    recordBoardMovs(movConvert(cubeNum), activePlayer, time);
    lastTime = getTime();
  }

  game_condition();
  switch_player();
};

function end_game_turn(draw){
  if(draw === false){
    if(activePlayer === 1){
      playerOne_socre++;
      p1ScoreEl.textContent = playerOne_socre;
    }else{
      playerTwo_socre++;
      p2ScoreEl.textContent = playerTwo_socre;
    }


    if(record === true){
      finish_record(activePlayer);
      stop_record_animation()
    }
  }
  else{
    draw_score++;
    drawScoreEl.textContent = draw_score;

    if(record == true){
      finish_record(0);
      stop_record_animation()
    }
  }

  clearGameBoard()
  winWindow()
}

function clearGameBoard(){
  board = [0,0,0,0,0,0,0,0,0];
  for(let i = 0 ; i < 9; i++){
  document.querySelector(`.cube-${i+1}`).textContent = '';
  cube[i].classList.remove(`p1-cube-clicked`);
  cube[i].classList.remove(`p2-cube-clicked`);
  cube[i].classList.remove('disabled-button');
  }
}

function winWindow(){
  if(playerOne_socre === game_victory || playerTwo_socre === game_victory){
    document.querySelector('.win-window').style.display = 'block';
    document.querySelector('.win-window').style.backgroundColor = `${color[activePlayer - 1]}`;
    document.querySelector('.winner_player').textContent = activePlayer;

    document.querySelector('.body-wins').style.opacity = 0.5;
  }
}

function game_condition(){
  let draw = false;
    if(board[0]=== activePlayer && board[1]=== activePlayer && board[2]=== activePlayer){
      end_game_turn(draw);
    }else if(board[3]=== activePlayer && board[4]=== activePlayer && board[5]=== activePlayer){
      end_game_turn(draw);
    }else if(board[6]=== activePlayer && board[7]=== activePlayer && board[8]=== activePlayer){
      end_game_turn(draw);
    }else if(board[0]=== activePlayer && board[3]=== activePlayer && board[6]=== activePlayer){
      end_game_turn(draw);
    }else if(board[1]=== activePlayer && board[4]=== activePlayer && board[7]=== activePlayer){
      end_game_turn(draw);
    }else if(board[2]=== activePlayer && board[5]=== activePlayer && board[8]=== activePlayer){
      end_game_turn(draw);
    }else if(board[0]=== activePlayer && board[4]=== activePlayer && board[8]=== activePlayer){
      end_game_turn(draw);
    }else if(board[2]=== activePlayer && board[4]=== activePlayer && board[6]=== activePlayer){
      end_game_turn(draw);
    }
    if(!board.includes(0)){
      draw = true;
      end_game_turn(draw);
    }
}

function switch_player(){
  if(activePlayer === 1 ){ 
    activePlayer = 2;
    document.querySelector('.game-board').classList.remove('p1-active');
    document.querySelector('.game-board').classList.add('p2-active');
    symbol = 'o';
  }
  else{
    activePlayer = 1;
    document.querySelector('.game-board').classList.remove('p2-active');
    document.querySelector('.game-board').classList.add('p1-active');
    symbol = 'x';
  }
}

function stop_record_animation(){
  btnRecord.classList.toggle('btn-svg-record-animation');
}


// ////////////////////////
// /////monitoring////////
btnRecord.addEventListener('click', function(){
  if(playRecord === false){
    if(record === false){
      initiate_record()
      // lastTime var store each mov time, and its first time is start time of hte turn.
      lastTime = getTime()
    }else{
      finish_record();
    }
    stop_record_animation()
  }
});


/////////values
let redyMoves = [];
let currentRecordMov = 0;

function clearCube(cubeNum){
  document.querySelector(`.cube-${cubeNum}`).textContent = '';
  cube[cubeNum - 1].classList.remove(`p1-cube-clicked`);
  cube[cubeNum - 1].classList.remove(`p2-cube-clicked`);
  cube[cubeNum - 1].classList.remove('disabled-button');
}

// display Records by User Control
// [9, 1, 'x', 0]
function displayRecordUCUI(dir){
  
  // console.log(dir);
  // console.log(redyMoves.length);                        5 - 1
  if(currentRecordMov < redyMoves.length   && dir === 1){
    displayCubeUI(redyMoves[currentRecordMov][0], redyMoves[currentRecordMov][1], redyMoves[currentRecordMov][2]);

    currentRecordMov++;
  }
  else if(currentRecordMov > 0 && dir === -1) {
    currentRecordMov--;
    clearCube(redyMoves[currentRecordMov][0]);
  }
  console.log(currentRecordMov);
}

btnNextEl.addEventListener('click',() => displayRecordUCUI(1))
btnPreviousEl.addEventListener('click',() => displayRecordUCUI(-1))


btnPlayPause.addEventListener('click', function(){
  // selected option, the value is the exact index of the record in the array
  let index = recordListEl.value;
  if(index !== '-1' && !playRecord){
    btnNextPreviousContainerEL.style.display = 'block';
    

    playRecord = true;

    btnPlayPause.src === 'http://127.0.0.1:5500/src/play-icon.svg' ? btnPlayPause.src = 'http://127.0.0.1:5500/src/pause-icon.svg' : btnPlayPause.src = 'http://127.0.0.1:5500/src/play-icon.svg'  ;
    clearGameBoard();
    
    // ['p1', 'c3', '0s']
    let moves = boardRecord[index].mov;
    console.log('boardRecord(main array, all record) :', boardRecord);
    console.log('MOves of selected record :', moves);
    
    moves.forEach(element => {
      let mov = movConvert(element[1], true); // *converts to gameSystem 1,2,3,4
      let aply = Number(element[0].replace('p','')); // *return activeNumber 1,2
      aply === 1 ? symbol = 'x' : symbol = 'o'; // *set the symbol
      let movTime = Number(element[2].replace('s','')); // *each mov time

      redyMoves.push([mov, aply, symbol, movTime]);
      // displayCubeUI(mov, aply, symbol);
      // console.log('in');
    });


  }else if(playRecord){
    btnNextPreviousContainerEL.style.display = 'none';
    btnPlayPause.src === 'http://127.0.0.1:5500/src/play-icon.svg' ? btnPlayPause.src = 'http://127.0.0.1:5500/src/pause-icon.svg' : btnPlayPause.src = 'http://127.0.0.1:5500/src/play-icon.svg' ;
    clearGameBoard();
    playRecord = false;

    redyMoves = [];
    currentRecordMov = 0;
    // console.log('out');
  }
  
});
// ////////////////////////
// ///////////////////////


// main:
initial_game()

