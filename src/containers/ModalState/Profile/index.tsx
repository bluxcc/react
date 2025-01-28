import React, { useContext } from 'react';

import { ProviderContext } from '../../../context/provider';

const Profile = () => {
  const context = useContext(ProviderContext);

  return (
    <div className="flex flex-col items-center justify-center h-40">
      <p className="text-lg font-medium">Connected to wallet</p>
      <p className="text-sm text-gray-600">{context?.value.user.wallet?.address}</p>
    </div>
  );
};

export default Profile;
