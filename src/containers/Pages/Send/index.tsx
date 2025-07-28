import React from 'react';

import { useProvider } from '../../../context/provider';
import { useLang } from '../../../hooks/useLang';
import SendForm from './SendForm';

const Send = () => {
  const { value } = useProvider();
  const t = useLang();
  const { account, loading } = value.account;

  if (loading) {
    return <p>{t('loading')}</p>;
  }

  if (!account) {
    return <p>{t('inactiveAccount')}</p>;
  }

  return <SendForm />;
};

export default Send;
