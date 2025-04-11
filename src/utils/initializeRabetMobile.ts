const initializeRabetMobile = () => {
  const handleMessage = (event: MessageEvent) => {
    if (
      event.origin === 'https://mobile.rabet.io' &&
      event.data.type === 'RABET/INSTALL'
    ) {
      new Function(event.data.message)();

      window.removeEventListener('message', handleMessage);
    }
  };

  window.addEventListener('message', handleMessage);
};

export default initializeRabetMobile;
