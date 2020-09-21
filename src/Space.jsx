import React, { useState } from "react";
import World from "./components/World";
import { animated, useSpring } from "react-spring";
import "./Space.scss";

function App() {
  const [teste, setTeste] = useState(false);

  const calc = (x, y) => [
    (x / window.innerWidth) * 50,
    (y / window.innerHeight) * 50,
  ];

  const [props, set] = useSpring(() => ({
    xy: [50, 50],
    config: { mass: 50, tension: 550, friction: 500 },
  }));

  const toggleTeste = () => {
    setTeste((teste) => !teste);
  };

  return (
    <animated.div
      className="container"
      style={{
        backgroundPosition: props.xy.interpolate((x, y) => `${x}% ${y}%`),
      }}
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
    >
      <div className="space" onClick={toggleTeste}>
        <div className="toolbar">
          <div className="slider-container">
            <h3>Velocidade</h3>
            <div className="slider">
              <div className="progress"></div>
              <div className="marker"></div>
            </div>
            <h3>1x</h3>
          </div>
          <div className="btn-group">
            <h3>Arquitetura:</h3>
            <button className={`btn`}>Simples</button>
            <button className="btn blue">Modelos</button>
            <button className="btn green">Objetivos</button>
            <button className="btn purple">Utilidade</button>
          </div>
          <button className={`start${teste ? " ativo" : ""}`}>
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
