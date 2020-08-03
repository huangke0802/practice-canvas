<template>
  <div class="wrap">
    <h1 class="title" id="title"></h1>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="mySvg" class="my_svg"></svg>
  </div>
</template>

<script>
export default {
  mounted() {
    const dataSource = "https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json";

    function draw(
      parent,
      node,
      { fillStyle = "rgba(0, 0, 0, 0.2)", textColor = "white" } = {}
    ) {
      const { x, y, r, children, data } = node;
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", fillStyle);
      circle.setAttribute("data-name", data.name);

      parent.appendChild(circle);

      if (children) {
        const group = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );
        group.setAttribute("data-name", data.name);
        for (let i = 0; i < children.length; i++) {
          draw(group, children[i], { fillStyle, textColor });
        }
        parent.appendChild(group);
      } else {
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("fill", textColor);
        text.setAttribute("font-family", "Arial");
        text.setAttribute("font-size", "1.5rem");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        const name = node.data.name;
        text.textContent = name;
        parent.appendChild(text);
      }
    }

    const titleEl = document.getElementById("title");

    function getTitle(target) {
      const name = target.getAttribute("data-name");
      if (target.parentNode && target.parentNode.nodeName === "g") {
        const parentName = target.parentNode.getAttribute("data-name");
        return `${parentName}-${name}`;
      }
      return name;
    }

    (async function() {
      const data = await (await fetch(dataSource)).json();

      const regions = d3
        .hierarchy(data)
        .sum(d => 1)
        .sort((a, b) => b.value - a.value);

      const pack = d3
        .pack()
        .size([1600, 1600])
        .padding(3);

      const root = pack(regions);

      const svgroot = document.querySelector("svg");

      let activeTarget = null;
      svgroot.addEventListener("mousemove", evt => {
        let target = evt.target;
        if (target.nodeName === "text") target = target.previousElementSibling;
        if (activeTarget !== target) {
          if (activeTarget)
            activeTarget.setAttribute("fill", "rgba(0, 0, 0, 0.2)");
        }
        target.setAttribute("fill", "rgba(0, 128, 0, 0.1)");
        activeTarget = target;
        titleEl.textContent = getTitle(target);
      });

      draw(svgroot, root);
    })();
  }
};
</script>


<style scoped>
.wrap {
  position: relative;
}
.title {
  position: absolute;
  left: 66%;
  top: 50px;
}
.my_svg {
  width: 2000px;
  height: 2000px;
}
</style>
