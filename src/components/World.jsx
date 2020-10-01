import React, { Fragment, useEffect, useState } from "react";
import socket from "../socket";
import "./World.scss";

const World = React.memo(
  () => {
    const [data, setData] = useState({
      World: {
        trashes: Array.from(
          {
            length: 20,
          },
          () => Array(20).fill(null)
        ),
      },
    });

    const [cleaner, setCleaner] = useState({
      x: 10,
      y: 0,
    });

    const [purger, setPurger] = useState({
      x: 19,
      y: 0,
    });

    useEffect(() => {
      socket.on("worldChanged", (value) => {
        setData(JSON.parse(value));
      });
    }, []);

    useEffect(() => {
      socket.on("purgerChanged", (value) => {
        setPurger({
          x: JSON.parse(value).x,
          y: JSON.parse(value).y,
        });
      });
    }, []);

    useEffect(() => {
      if (data.Cleaner === undefined) {
        return;
      }
      setCleaner({
        x: data.Cleaner.x,
        y: data.Cleaner.y,
      });
    }, [data, setCleaner]);

    return (
      <div className="world">
        <div
          style={{
            left: `calc(32px * ${cleaner.x})`,
            top: `calc(32px * ${cleaner.y})`,
          }}
          className="cleaner"
        ></div>
        <div
          style={{
            left: `calc(32px * ${purger.x})`,
            top: `calc(32px * ${purger.y})`,
          }}
          className="purger"
        ></div>
        <div className="lixeira"></div>
        <div className="lixeira" style={{ left: "calc(32px * 19)" }}></div>
        <div className="incinerator"></div>
        <div className="recycle"></div>
        {data.World.trashes.map((linha, i) => {
          return linha.map((celula, j) => {
            if (celula === null) {
              return <Fragment key={i + j}></Fragment>;
            }
            return (
              <div
                key={i + j}
                className={celula === "O" ? "trashOrganic" : "trashRecyclable"}
                style={{
                  left: `calc(32px * ${j})`,
                  top: `calc(32px * ${i})`,
                }}
              ></div>
            );
          });
        })}
      </div>
    );
  },
  () => false
);

export default World;
