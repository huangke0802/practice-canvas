<!-- 抽奖转盘组件 -->
<template>
  <div class="turntable">
    <canvas ref="turn_canvas" :width="width" @click="onClickCanvas"></canvas>
    <div style="display:none;">
      <img :src="backgroundImg" :width="width" ref="backgroundImg">
      <img :src="backgroundBtn" :width="width *196 / 750 " ref="backgroundBtn">
    </div>
  </div>
</template>

<script>
//中间的点击按钮相对与转盘背景图的比例；
const rate = 196 / 750;

let timer = null, //延时器
  currentTime = 0, //表示动画开始到现在持续的时间
  totalTime = 0, //动画总时间
  finalValue = 0, //动画总时间内期望的位移总量，越大转得越快，因为总时间一定，只有加快速度才能在规定时间内到达期望位移
  startAngle = 0, //开始绘制时的起始角度
  isRunning = false; //转盘是否运行中，默认为false
export default {
  name: "LotteryDraw",
  props: {
    width: {
      type: Number,
      default: 10
    },
    backgroundImg: {
      type: String,
      default:
        "https://image.wyn88.com/wyn_activities/818/lotteryDraw/table.png"
    },
    backgroundBtn: {
      type: String,
      default:
        "https://image.wyn88.com/wyn_activities/818/lotteryDraw/draw_btn.png?version=2"
    },
    prizes: {
      type: Array,
      default() {
        return [2, 3, 4, 5, 6, 1];
      }
    },
    winPrize: {
      type: [Number, String],
      default: 3
    }
  },
  data() {
    return {
      canvas: null,
      context: null,
      count: 0
    };
  },

  computed: {},

  async mounted() {
    const { drawCanvasContent } = this;
    //获取canvas 2d上下文
    const canvas = this.$refs.turn_canvas;
    const context = canvas.getContext("2d");
    this.canvas = canvas;
    this.context = context;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerWidth;
    await drawCanvasContent();
  },

  methods: {
    /**
     * 加载图片的事件
     * image:图片对象
     */
    onLoadImg({ image = {} } = {}) {
      const { complete } = image;
      return new Promise((resolve, reject) => {
        if (complete) {
          resolve({ image, flag: true });
        } else {
          image.onload = () => {
            resolve({ image, flag: true });
          };
        }
      });
    },
    //绘制背景图和中间的按钮
    async drawImage() {
      const { backgroundImg, backgroundBtn } = this.$refs;
      const { canvas, context, onLoadImg } = this;
      const { width: cWidth, height: cHeight } = canvas;
      //清空画布
      context.clearRect(0, 0, cWidth, cHeight);
      //加载背景图
      const { flag: flag1, image: image1 } = await onLoadImg({
        image: backgroundImg
      });
      //加载按钮图片
      const { flag: flag2, image: image2 } = await onLoadImg({
        image: backgroundBtn
      });
      //绘制背景图到canvas
      flag1 && context.drawImage(image1, 0, 0, canvas.width, canvas.height);
      //绘制按钮到中央
      flag2 &&
        context.drawImage(
          image2,
          (cWidth - image2.width) / 2,
          (cHeight - image2.width) / 2,
          image2.width,
          image2.width
        );
    },
    //绘制指针
    async drawPointer(angle = 0) {
      const { canvas, context, backgroundBtn } = this;
      const { width, height } = canvas;
      const raduis = (width * rate) / 2;
      context.save();

      context.translate(width / 2, height / 2);
      context.scale(1, -1);
      context.beginPath();
      context.fillStyle = "#ffffff";
      context.strokeStyle = "white";
      context.shadowColor = "rgba(0,0,0,0.2)";
      context.shadowBlur = 6;
      const { PI, sin, cos } = Math;
      const angle1 = PI / 2 - PI / 20;
      const angle2 = PI / 20 + PI / 2;
      context.rotate(-angle);

      context.arc(0, 0, raduis, angle1, angle2);
      context.moveTo(cos(angle1) * raduis, sin(angle1) * raduis);
      context.lineTo(0, 1.4 * raduis);
      context.lineTo(cos(angle2) * raduis, sin(angle2) * raduis);
      context.closePath();
      this.context.fill();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.restore();
    },
    //判断点击是否在中央按钮区域
    onClickCanvas(e) {
      const { canvas, backgroundBtn, getMousePos, startDraw } = this;
      const { width, height } = canvas;
      const { x: offsetLeft, y: offsetTop } = canvas.getBoundingClientRect();
      const { x: _x, y: _y } = getMousePos(e);
      const x = _x - offsetLeft - width / 2;
      const y = _y - offsetTop - height / 2;
      //点击在按钮内触发转盘
      if ((width * rate) / 4 - Math.sqrt(x * x, y * y) > 0 && !isRunning) {
        startDraw();
      }
    },
    /**
     *  t: current time(当前时间)
     *  b: beginning value(初始值)
     *  c: change in value(变化总量)
     *  d: duration(持续时间)
     */
    easeOut(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    async rotation() {
      const {
        getRadianFromPrize,
        stopRotation,
        easeOut,
        rotation,
        drawCanvasContent
      } = this;

      const { PI } = Math;
      //获取到的中奖奖品对应的弧度
      const prizeRadian = getRadianFromPrize();
      currentTime += 30; //每帧增加30的运行时间
      if (currentTime >= totalTime) {
        //到达总时间后停止动画
        return stopRotation();
      }
      //缓动
      const currentAngle =
        finalValue - easeOut(currentTime, 0, finalValue, totalTime);

      //弧度随时间递增，但增速由快变慢
      startAngle += (currentAngle * PI) / 180;
      //根据startAngle的变化重新绘制转盘，以达到转动的效果
      await drawCanvasContent(-(currentAngle - prizeRadian));
      const p = new Promise(async (reslove, reject) => {
        timer = setTimeout(async () => {
          await rotation();
          reslove(true);
        }, 17);
      });
      return p;
    },
    //停止旋转
    stopRotation() {
      clearTimeout(timer);
      isRunning = false;
      this.$emit("onStop");
    },
    //开始绘画
    async startDraw() {
      const { PI, random } = Math;
      const { drawCanvasContent, rotation } = this;
      currentTime = 0;
      totalTime = random() * 500 + 9000;
      finalValue = 20 * PI;
      isRunning = true;
      this.$emit("onStart");
      await drawCanvasContent();
      await rotation();
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
    //根据奖品列表中对应的中奖奖品计算奖品的弧度
    getRadianFromPrize() {
      const { PI } = Math;
      const { winPrize, prizes } = this;
      const index = prizes.findIndex(x => x === winPrize);
      const len = prizes.length;
      const unitRadian = PI / len;

      if (index === -1) return 0;

      return (index * 2 + 1) * unitRadian;
    },
    //绘制canvas内容
    async drawCanvasContent(radian = 0) {
      const { drawImage, drawPointer } = this;
      await drawImage();
      await drawPointer(radian);
    }
  },
  watch: {
    async width(val) {
      if (!val) return;
      const { drawCanvasContent, context, canvas } = this;
      context.clearRect(0, 0, val, val);
      canvas.width = val;
      canvas.height = val;
      await drawCanvasContent();
    }
  }
};
</script>
<style lang='less' scoped>
.turntable {
  position: relative;
}
</style>