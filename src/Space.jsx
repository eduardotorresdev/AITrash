import React, { useEffect, useRef, useState } from "react";
import World from "./components/World";
import Slider from "./components/Slider";
import { animated, useSpring } from "react-spring";
import socket from "./socket";
import "./Space.scss";
const electron = window.require("electron");
function App() {
  const [arquitetura, setArquitetura] = useState(null);
  const [iniciou, setIniciou] = useState(false);
  const cancelado = useRef(false);
  const [timer, setTimer] = useState({
    min: 0,
    sec: 0,
  });
  const [disabled, setDisabled] = useState(true);

  const calc = (x, y) => [
    (x / window.innerWidth) * 100,
    (y / window.innerHeight) * 100,
  ];

  const [props, set] = useSpring(() => ({
    xy: [50, 50],
    config: { mass: 50, tension: 550, friction: 500 },
  }));

  const alterarArquitetura = (tipo) => {
    setArquitetura((arquitetura) => {
      if (arquitetura === tipo) {
        socket.emit("newArchitecture", null);
        return null;
      }
      socket.emit("newArchitecture", tipo);
      return tipo;
    });
  };

  useEffect(() => {
    socket.on("cancelado", () => {
      cancelado.current = true;
    });
    socket.on("finalizado", () => {
      cancelado.current = true;
    });
  }, []);

  useEffect(() => {
    if (arquitetura === null) {
      setDisabled(true);
      return;
    }
    setDisabled(false);
    setIniciou((iniciou) => {
      if (iniciou) {
        setTimer({ min: 0, sec: 0 });
        return false;
      }
      return iniciou;
    });
  }, [arquitetura]);

  function pad(num, size) {
    var s = "0" + num;
    return s.substr(s.length - size);
  }

  useEffect(() => {
    if (iniciou === false) {
      return;
    }

    setInterval(() => {
      if (cancelado.current) {
        return;
      }

      setTimer((timer) => {
        let newTimer = { ...timer, sec: (timer.sec + 1) % 60 };
        if (newTimer.sec === 0) {
          newTimer.min = newTimer.min + 1;
        }
        return newTimer;
      });
    }, 1000);
  }, [iniciou]);

  const iniciar = () => {
    setIniciou((iniciou) => {
      if (iniciou === true) {
        socket.emit("cancelar");
        cancelar();
      }
      socket.emit("start");
      return true;
    });
  };

  const cancelar = () => {
    cancelado.current = true;
  };

  return (
    <animated.div
      className="container"
      style={{
        backgroundPosition: props.xy.interpolate((x, y) => `${x}% ${y}%`),
      }}
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
    >
      <div className="title-bar">
        <div
          className="buttons"
          onClick={() => {
            let window = electron.remote.getCurrentWindow();
            window.close();
          }}
        ></div>
        <div
          className="buttons"
          onClick={() => {
            let window = electron.remote.getCurrentWindow();
            window.minimize();
          }}
        ></div>
      </div>
      <div className="space">
        <div className="toolbar">
          <Slider />
          <div className="btn-group">
            <h3>Arquitetura:</h3>
            <button
              className={`btn${arquitetura === "simple" ? " ativo" : ""}`}
              onClick={() => alterarArquitetura("simple")}
            >
              Simples
            </button>
            <button
              className={`btn blue${arquitetura === "models" ? " ativo" : ""}`}
              onClick={() => alterarArquitetura("models")}
            >
              Modelos
            </button>
            <button
              className={`btn green${arquitetura === "goals" ? " ativo" : ""}`}
              onClick={() => alterarArquitetura("goals")}
            >
              Objetivos
            </button>
            <button
              className={`btn purple${
                arquitetura === "utility" ? " ativo" : ""
              }`}
              onClick={() => alterarArquitetura("utility")}
            >
              Utilidade
            </button>
          </div>
          <button
            className={`start${iniciou ? " ativo" : ""}${
              disabled ? " disabled" : ""
            }`}
            onClick={iniciar}
          >
            <span>Iniciar</span>
            <span>{pad(timer.min, 2) + ":" + pad(timer.sec, 2)}</span>
          </button>
        </div>
        <World></World>
      </div>
    </animated.div>
  );
}

export default App;
