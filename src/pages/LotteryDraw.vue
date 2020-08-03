<!-- 抽奖页面 -->
<template>
  <div class="lottery_wrap">
    <LotteryDraw :width="canvasWidth" :winPrize="winPrizeID" @onStop="onStop" @onStart="onStart"/>
  </div>
</template>

<script>
import LotteryDraw from "@/components/turntable";
export default {
  components: { LotteryDraw },
  data() {
    return {
      canvasWidth: 100,
      winPrizeID: 1
    };
  },

  computed: {},

  mounted() {
    this.canvasWidth = this.getWinwidth();

    window.onresize = () => {
      this.canvasWidth = this.getWinwidth();
    };
  },

  methods: {
    getWinwidth() {
      let winWidth = 0;

      if (window.innerWidth) {
        winWidth = window.innerWidth;
      } else if (document.body && document.body.clientWidth) {
        winWidth = document.body.clientWidth;
      }

      return winWidth;
    },
    onStop() {
      console.log("stop");
    },
    onStart() {
      console.log("onStart");
    }
  }
};
</script>
<style lang='less' scoped>
.lottery_wrap {
  background: linear-gradient(
    180deg,
    rgba(158, 250, 255, 1) 0%,
    rgba(208, 155, 255, 1) 100%
  );
}
</style>