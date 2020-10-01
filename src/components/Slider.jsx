import React, { useRef } from "react";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import clamp from "lodash/clamp";
import socket from "../socket";
import "./Slider.scss";

const Slider = () => {
  const speed = useRef(1);
  const [spring, setSpring] = useSpring(() => ({
    x: 0,
    number: 1,
    immediate: false,
    config: {
      mass: 1,
      tension: 400,
      friction: 40,
    },
  }));

  let current = spring.x.getValue();
  const bind = useDrag(({ movement: [mx], first }) => {
    if (first) {
      current = spring.x.getValue();
    }
    let speedValue = clamp(current + mx, 10, 150) / 10;
    setSpring({
      x: clamp(current + mx, 0, 150),
      number: speedValue,
    });
    speedValue = parseInt(speedValue);
    if (speedValue !== speed.current) {
      socket.emit("newSpeed", speedValue);
      speed.current = speedValue;
    }
  });

  return (
    <div className="slider-container">
      <h3>Velocidade</h3>
      <div className="slider">
        <animated.div
          className="progress"
          style={{ width: spring.x.interpolate((x) => `${x}px`) }}
        ></animated.div>
        <animated.div
          {...bind()}
          className="marker"
          style={{ left: spring.x.interpolate((x) => `${x}px`) }}
        ></animated.div>
      </div>
      <animated.h3>
        {spring.number.interpolate((val) => Math.floor(val) + "x")}
      </animated.h3>
    </div>
  );
};

export default Slider;
