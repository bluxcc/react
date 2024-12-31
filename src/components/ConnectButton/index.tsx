import React, { useState } from 'react';
import ChooseWallet from '../../containers/ChooseWallet';
import shortenAddress from '../../utils/shortenAddress';

const ConnectButton = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-3 py-1.5 bg-[#0d1292] text-white whitespace-nowrap !rounded-lg"
      >
        {connectedWallet ? shortenAddress(connectedWallet, 4) : 'Connect wallet'}
      </button>
      <ChooseWallet isOpen={openModal} closeModal={handleCloseModal} />
    </>
  );
};

export default ConnectButton;
