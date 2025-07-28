import React from 'react';
import { useLang } from '../../../hooks/useLang';

const WrongNetwork = () => {
  const t = useLang();
  return (
    <div>
      <p>{t('wrongNetworkMessage')}</p>
    </div>
  );
};

export default WrongNetwork;
