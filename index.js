var chess = document.getElementsByClassName("chess")[0];
var title = document.getElementsByClassName("title")[0];
var context = chess.getContext("2d");
context.strokeStyle = "rgb(165,192,191)"

window.onload = function () {
  drawChessBoard();
}

//绘制棋盘
function drawChessBoard() {
  for (var i = 0; i < 15; i++) {
    //设置横线起始点的坐标
    context.moveTo(15, 15 + i * 30);
    //设置横线结束点的坐标
    context.lineTo(435, 15 + i * 30);
    //连线
    context.stroke();

    //设置竖线的起始点坐标
    context.moveTo(15 + i * 30, 15);
    //设置竖线的结束点坐标
    context.lineTo(15 + i * 30, 435);
    //连线
    context.stroke();
  }
}

//设置赢法数组
/* 赢法1
    0,0,0
    1,0,0
    2,0,0
    3,0,0
    4,0,0
*/
var wins = [];
for (var i = 0; i < 15; i++) {
  wins[i] = [];
  for (var j = 0; j < 15; j++) {
    wins[i][j] = []
  }
}

//赢法编号
var count = 0;
//统计横线赢法
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[j + k][i][count] = true;
    }
    count++;
  }
}

//统计竖线赢法
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i][j + k][count] = true;
    }
    count++;
  }
}

//统计正斜线赢法
for (var i = 0; i < 11; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j + k][count] = true;
    }
    count++;
  }
}

//统计反斜线赢法
for (var i = 0; i < 11; i++) {
  for (var j = 14; j > 3; j--) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j - k][count] = true;
    }
    count++;
  }
}

//定义二维数组标记棋盘上的每个坐标是否已经下了棋子
var chessboard = [];
for (var i = 0; i < 15; i++) {
  chessboard[i] = [];
  for (var j = 0; j < 15; j++) {
    chessboard[i][j] = 0;
  }
}

//下棋
var me = true; //标记人是否可以下棋
var over = false; //标记游戏是否结束
var myWin = [];//记录用户在赢法上的分值
var computerWin = [];//记录计算机在赢法上的分值
for (var i = 0; i < count; i++) {
  myWin[i] = 0;
  computerWin[i] = 0
}

chess.onclick = function (e) {
  //如果游戏结束不可以下棋
  if (over) {
    return;
  }

  //判断自己是否可以下棋
  if (!me) {
    return;
  }

  //获取x轴坐标
  var x = e.offsetX;
  //获取y轴坐标
  var y = e.offsetY;

  var i = Math.floor(x / 30)
  var j = Math.floor(y / 30)

  if (chessboard[i][j] == 0) {

    //下一个棋子
    oneStep(i, j, me);
    //标记已经落子
    chessboard[i][j] = 1;

    for (var k = 0; k < count; k++) {
      if (wins[i][j][k]) {
        myWin[k]++;
        if (myWin[k] == 5) {
          title.innerHTML = "恭喜小徐战胜AI~~~"
          over = true;
        }
      }
    }
  }


  if (!over) {
    me = !me;

    //计算机下棋
    computerAI()
  }
}

//计算机AI方法
function computerAI() {
  //空白子在用户所占用的赢法上的分值
  var myScore = [];
  //空白子在计算机所占用赢法上的分值
  var computerScore = [];

  for (var i = 0; i < 15; i++) {
    myScore[i] = [];
    computerScore[i] = [];

    for (var j = 0; j < 15; j++) {
      myScore[i][j] = 0;
      computerScore[i][j] = 0;
    }
  }

  //在空白地方上的最大分值
  var max = 0;
  var x = 0, y = 0;
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      //判断是否是空白子
      if (chessboard[i][j] == 0) {
        for (var k = 0; k < count; k++) {
          if (wins[i][j][k]) {
            if (myWin[k] == 1) {
              myScore[i][j] += 200;
            } else if (myWin[k] == 2) {
              myScore[i][j] += 3000;
            } else if (myWin[k] == 3) {
              myScore[i][j] += 10000;
            } else if (myWin[k] == 4) {
              myScore[i][j] += 20000;
            }

            if (computerWin[k] == 1) {
              computerScore[i][j] += 220;
            } else if (computerWin[k] == 2) {
              computerScore[i][j] += 3300;
            } else if (computerWin[k] == 3) {
              computerScore[i][j] += 11000;
            } else if (computerWin[k] == 4) {
              computerScore[i][j] += 22000;
            }
          }

        }

        if (myScore[i][j] > max) {
          max = myScore[i][j];
          x = i;
          y = j;
        } else if (myScore[i][j] == max) {
          if (computerScore[i][j] > max) {
            max = computerScore[i][j];
            x = i;
            y = j;
          }
        }

        if (computerScore[i][j] > max) {
          max = computerScore[i][j];
          x = i;
          y = j;
        } else if (computerScore[i][j] == max) {
          if (myScore[i][j] > max) {
            max = myScore[i][j];
            x = i;
            y = j;
          }
        }
      }
    }
  }

  oneStep(x,y,me);
  chessboard[x][y] =1;

  for(var k = 0;k<count;k++){
    if(wins[x][y][k]){
      computerWin[k]+=1;
      if(computerWin[k]==5){
        title.innerHTML="唉，差点点就击败AI了 😔"
        over = true;
      }
    }  
  }

  if(!over){
    me=!me;
  }
}

//落子方法
function oneStep(i, j, me) {
  context.beginPath();

  context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI)

  context.closePath();

  var color;
  if (me) {
    color = "black"
  } else {
    color = "#fefe"
  }
  context.fillStyle = color;
  context.fill();
}

//刷新
function rst(){
  window.location.reload();
}
