import React, { useState } from 'react';
import humanizeAmount from '../../../../utils/humanizeAmount';
import { IAsset } from '../../../../types';
import { useLang } from '../../../../hooks/useLang';
import { useProvider } from '../../../../context/provider';

type AssetsProps = {
  assets: IAsset[];
};

const Assets = ({ assets }: AssetsProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const t = useLang();
  const context = useProvider();
  const { appearance } = context.value.config;

  return (
    <div>
      {assets.map((asset, index) => (
        <div
          key={asset.assetType + asset.assetIssuer}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="bluxcc:flex bluxcc:cursor-pointer bluxcc:items-center bluxcc:justify-between bluxcc:px-4 bluxcc:py-3"
          style={{
            background:
              hoveredIndex === index ? appearance.bgField : 'transparent',
            color: appearance.textColor,
            borderBottomStyle: 'dashed',
            borderBottomWidth:
              index < assets.length - 1
                ? appearance.includeBorders
                  ? appearance.borderWidth
                  : '1px'
                : '0px',
            borderBottomColor: appearance.borderColor,
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <div className="bluxcc:flex bluxcc:items-center bluxcc:gap-[10px]">
            <span className="bluxcc:font-medium">{asset.logo}</span>
            <div className="bluxcc:flex bluxcc:flex-col">
              <span className="bluxcc:text-xs bluxcc:font-medium">
                {asset.assetCode}
              </span>
              <span className="bluxcc:text-xs">{asset.assetCode}</span>
            </div>
          </div>

          <span className="bluxcc:font-medium">
            {humanizeAmount(asset.balance)}
          </span>
        </div>
      ))}

      {assets.length === 0 && (
        <div
          style={{ color: appearance.textColor }}
          className="bluxcc:mt-2 bluxcc:text-center"
        >
          {t('noAssetsFound')}
        </div>
      )}
    </div>
  );
};

export default Assets;
