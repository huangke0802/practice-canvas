<template>
  <div class="hello">
    <div class="menu">
      <div @click="redraw">重新开始</div>
    </div>
    <canvas
      id="myCanvas"
      width="1600"
      height="1600"
      class="canvas"
      @mousemove="onMousemove"
      @mousedown="onMousedown"
      @click="onClickCanvas"
    ></canvas>
  </div>
</template>

<script>
const baseUnit = 100;
export default {
  data() {
    return {
      canvasWidth: 0,
      canvasHeight: 0,
      canvas: null,
      whiteChess: [],
      blackChess: [],
      context: null,
      chesser: "black"
    };
  },
  mounted() {
    const canvas = document.querySelector("#myCanvas");
    const context = canvas.getContext("2d");
    this.canvas = canvas;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.context = context;
    // 暂存状态
    context.save();
    //绘制棋盘
    this.drawDesk(context, 16);
  },

  methods: {
    //绘制横线
    drawHorizontalLine(context, y) {
      context.beginPath();
      context.strokeStyle = "#333";
      context.lineTo(0, y);
      context.lineTo(1600, y);
      context.stroke();
      context.closePath();
    },
    //绘制垂直线
    drawVerticalLine(context, x) {
      context.beginPath();
      context.lineTo(x, 0);
      context.lineTo(x, 1600);
      context.closePath();
      context.stroke();
    },
    //绘制棋盘
    drawDesk(context, num) {
      const { canvasWidth, canvasHeight } = this;
      context.beginPath();

      context.fillStyle = "antiquewhite";
      context.fillRect(0, 0, canvasWidth, canvasHeight);
      context.closePath();
      for (let i = 1; i < num; i++) {
        this.drawHorizontalLine(context, i * (canvasWidth / num));
        this.drawVerticalLine(context, i * (canvasHeight / num));
      }
    },
    //鼠标位置
    getMousePos(event) {
      const e = event || window.event;
      const scrollX =
        document.documentElement.scrollLeft || document.body.scrollLeft;
      const scrollY =
        document.documentElement.scrollTop || document.body.scrollTop;
      const x = e.pageX - scrollX || e.clientX - scrollX;
      const y = e.pageY - scrollY || e.clientY - scrollY;

      return { x: x, y: y };
    },
    //鼠标移动事件
    onMousemove(e) {
      // const { offsetLeft, offsetTop } = this.canvas;
      // const { x, y } = this.getMousePos(e);
      // console.log({ x: x - offsetLeft, y: y - offsetTop });
    },
    //鼠标点击事件
    onMousedown() {},
    //鼠标点击事件
    onClickCanvas(e) {
      const {
        context = {},
        canvas = {},
        chesser,
        blackChess,
        whiteChess
      } = this;
      const { x: offsetLeft, y: offsetTop } = canvas.getBoundingClientRect();

      const { x, y } = this.getMousePos(e);
      const chessX = x - offsetLeft;
      const chessY = y - offsetTop;
      const { x: _x, y: _y } = this.chessDownPosition(chessX, chessY);

      const isCheckblack = blackChess.findIndex(
        item => item.x === _x && item.y === _y
      );
      const isCheckWhite = whiteChess.findIndex(
        item => item.x === _x && item.y === _y
      );
      //不可重复点同一个棋子
      if (isCheckblack === -1 && isCheckWhite === -1) {
        this.drawChess(context, _x, _y, 45, chesser);

        if ("black" === chesser) {
          this.blackChess = [...blackChess, { x: _x, y: _y }];
          this.chesser = "white";
        } else {
          this.whiteChess = [...whiteChess, { x: _x, y: _y }];
          this.chesser = "black";
        }
      }

      this.checkWinner();
    },
    //点击棋格棋子应该落在的点
    chessDownPosition(chessX, chessY) {
      const _xStr = (chessX / 100).toFixed(0);
      const _yStr = (chessY / 100).toFixed(0);
      const _xNum = parseInt(_xStr),
        _yNum = parseInt(_yStr);
      const x = _xNum <= 0 ? 1 : _xNum > 15 ? 15 : _xNum;
      const y = _yNum <= 0 ? 1 : _yNum > 15 ? 15 : _yNum;
      return {
        x: x * baseUnit,
        y: y * baseUnit
      };
    },
    //绘制圆形
    drawChess(ctx, x, y, r = 45, color = "black") {
      ctx.beginPath();
      ctx.arc(x, y, 45, 0, 2 * Math.PI);
      ctx.strokeStyle = "#999";
      ctx.stroke();

      ctx.shadowColor = "#999";
      ctx.shadowOffsetX = 6;
      ctx.shadowBlur = 6;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    },
    //判断棋子是否赢了
    checkWinner() {
      const { whiteChess, blackChess, chesser } = this;
      const _wArr = whiteChess.sort((a, b) => a.x - b.x);
      console.log(_wArr);
    },
    //重新开始
    redraw() {
      this.chesser = "black";
      this.whiteChess = [];
      this.blackChess = [];
      this.drawDesk(this.context, 16);
    }
  }
};
</script>

<style scoped>
.hello {
  position: relative;
}
.menu {
  padding: 10px;
  background-color: #333;
  position: absolute;
  color: #fff;
  font-size: 12px;
}
</style>
