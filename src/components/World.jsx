import React from "react";
import socket from "../socket";

const World = React.memo(
  () => {
    socket.on("worldChanged", (value) => {
      console.log(JSON.parse(value));
    });
    return (
      <div className="world">
        <div className="lixeira"></div>
        <div className="lixeira2"></div>
      </div>
    );
  },
  () => false
);

export default World;
