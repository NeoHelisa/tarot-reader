import React, { useEffect } from "react";

const FogEffect: React.FC = () => {
  useEffect(() => {
    const canvas = document.getElementById("canvas");

    class Fog {
      x: number;
      y: number;
      width: number;
      height: number;
      me: HTMLDivElement;
      direction: number;
      velocity: number;

      constructor(x: number, y: number, tamanho: { w: number; h: number }, direction: number, velocity: number) {
        this.x = x;
        this.y = y;
        this.width = tamanho.w;
        this.height = tamanho.h;
        this.me = document.createElement("div");
        this.direction = direction;
        this.velocity = velocity;
      }

      create() {
        this.me.style.width = this.width + "px";
        this.me.style.height = this.height + "px";
        this.me.style.backgroundColor = "#b3b8bb";
        this.me.style.position = "absolute";
        this.me.style.opacity = "0.5";
        this.me.style.filter = "blur(40px)";
        this.me.style.borderRadius = "120%";

        canvas?.appendChild(this.me);
      }

      animation() {
        this.me.style.left = this.x + "px";
        this.me.style.top = this.y + "px";

        if (this.direction === 0) {
          this.x -= this.velocity;
          if (this.x + this.width < 0) {
            this.x = (canvas?.clientWidth || 0) + this.width;
          }
        } else {
          this.x += this.velocity;
          if (this.x + this.width > (canvas?.clientWidth || 0)) {
            this.me.style.left = -this.width + "px";
          }
        }
      }
    }

    const array = [
      new Fog(200, 50, { w: 200, h: 200 }, 0, 0.5),
      new Fog(600, 80, { w: 100, h: 150 }, 0, 0.6),
      new Fog(70, 100, { w: 230, h: 210 }, 0, 0.7),
      new Fog(600, 20, { w: 40, h: 30 }, 0, 0.7),
      new Fog(300, 50, { w: 200, h: 200 }, 0, 0.8),
      new Fog(400, 70, { w: 70, h: 90 }, 0, 0.6),
      new Fog(10, 100, { w: 230, h: 210 }, 0, 0.7),
      new Fog(0, 20, { w: 100, h: 100 }, 0, 0.6),
    ];

    function createFogAnimation() {
      array.forEach((ele) => {
        ele.create();
        ele.animation();
      });
      requestAnimationFrame(createFogAnimation);
    }

    createFogAnimation();

    return () => {
      canvas?.replaceChildren(); // Cleanup
    };
  }, []);

  return <div id="canvas" className="canvas"></div>;
};

export default FogEffect;
