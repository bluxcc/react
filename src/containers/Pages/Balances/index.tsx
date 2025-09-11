import React from 'react';
import { TokenIcon } from '../../../assets/Icons';
import TabBox from '../../../components/TabBox';
import Assets from './Assets';
import { IAsset } from '../../../types';

const Balances = () => {
  const mockAssets: IAsset[] = [
    {
      assetCode: 'XLM',
      assetIssuer: 'Stellar Foundation',
      assetType: 'native',
      balance: '1000.1234',
      logo: '🌟',
    },
    {
      assetCode: 'USDC',
      assetIssuer: 'Centre Consortium',
      assetType: 'credit_alphanum4',
      balance: '500.5',
      logo: '💵',
    },
  ];

  const tabsContent = [
    {
      label: 'Assets',
      icon: <TokenIcon />,
      content: <Assets assets={mockAssets} />,
    },
    {
      label: 'Tokens',
      icon: <TokenIcon />,

      content: 'token',
    },

    {
      label: 'NFTs',
      icon: <TokenIcon />,

      content: 'nfts',
    },
  ];

  return <TabBox tabs={tabsContent} />;
};

export default Balances;
