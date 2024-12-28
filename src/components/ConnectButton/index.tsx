import React from "react";
import "../../styles/index.css";

const ConnectButton = () => {
  const handleClick = () => {
    console.log("blux is initialized");
  };

  return (
    <button
      onClick={handleClick}
      className="!h-10 !w-28 bg-purple-400 text-white !rounded-lg"
    >
      Connect Wallet
    </button>
  );
};

export default ConnectButton;
