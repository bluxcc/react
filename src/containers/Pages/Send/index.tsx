import React from 'react';

import { useProvider } from '../../../context/provider';
import SendForm from './SendForm';

const Send = () => {
  const { value } = useProvider();

  const { account, loading } = value.account;

  if (loading) {
    return <p>Loading</p>;
  }

  if (!account) {
    return <p>Account is inactive</p>;
  }

  return <SendForm />;
};

export default Send;
