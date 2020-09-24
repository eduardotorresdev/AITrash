import React from "react";

const World = React.memo(
  () => {
    return <div className="world"></div>;
  },
  () => false
);

export default World;
