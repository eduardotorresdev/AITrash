import React from "react";
import World from "./components/World";
import Slider from "./components/Slider";
import { animated, useSpring } from "react-spring";
import "./Space.scss";

function App() {
  const calc = (x, y) => [
    (x / window.innerWidth) * 100,
    (y / window.innerHeight) * 100,
  ];

  const [props, set] = useSpring(() => ({
    xy: [50, 50],
    config: { mass: 50, tension: 550, friction: 500 },
  }));

  return (
    <animated.div
      className="container"
      style={{
        backgroundPosition: props.xy.interpolate((x, y) => `${x}% ${y}%`),
      }}
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
    >
      <div className="title-bar">
        <div className="buttons"></div>
        <div className="buttons"></div>
      </div>
      <div className="space">
        <div className="toolbar">
          <Slider />
          <div className="btn-group">
            <h3>Arquitetura:</h3>
            <button className={`btn`}>Simples</button>
            <button className="btn blue">Modelos</button>
            <button className="btn green">Objetivos</button>
            <button className="btn purple">Utilidade</button>
          </div>
          <button className={`start`}>
            <span>Iniciar</span>
            <span>00:00</span>
          </button>
        </div>
        <World></World>
      </div>
    </animated.div>
  );
}

export default App;
