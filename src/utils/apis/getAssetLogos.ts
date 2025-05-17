import { Horizon } from '@stellar/stellar-sdk';
import { ASSET_SERVER } from '../../constants';

export interface IAssetImageDescription {
  logo: string;
  domain: string;
  trustline: number;
  asset_code: string;
  description: string;
  asset_issuer: string;
  is_verified: boolean;
}

const getAssetLogos = async (
  balanceLines: Horizon.HorizonApi.BalanceLine[],
) => {
  const assets = balanceLines.filter(
    (asset) =>
      asset.asset_type !== 'native' &&
      asset.asset_type !== 'liquidity_pool_shares',
  );
  const assetsJson = assets.map((asset) => ({
    asset_code: asset.asset_code,
    asset_issuer: asset.asset_issuer,
  }));

  await fetch(ASSET_SERVER, {
    mode: 'no-cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(assetsJson),
  }).then((res) => res.json());

  // const assetImages: AssetImage[] = assetImagesResult;

  return [];
};

export default getAssetLogos;
