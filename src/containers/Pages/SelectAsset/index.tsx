import React, { useState, MouseEvent, ChangeEvent } from 'react';

import { IAsset } from '../../../types';
import { Search } from '../../../assets/Icons';
import { useProvider } from '../../../context/provider';
import humanizeAmount from '../../../utils/humanizeAmount';

type SelectAssetsProps = {
  assets: IAsset[];
  setShowSelectAssetPage: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAsset: React.Dispatch<React.SetStateAction<IAsset | null>>;
};

const SelectAssets = ({
  assets,
  setSelectedAsset,
  setShowSelectAssetPage,
}: SelectAssetsProps) => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleSelectAsset = (asset: IAsset) => {
    setSelectedAsset(asset);
    setShowSelectAssetPage(false);
  };

  const onMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (!isFocused) {
      e.currentTarget.style.borderColor = appearance.accent;
      e.currentTarget.style.transition = 'border-color 0.35s ease-in-out';
    }
  };

  const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (!isFocused) {
      e.currentTarget.style.borderColor = appearance.borderColor;
    }
  };

  const getBorderAndRingColor = () => {
    if (isFocused) return appearance.accent;
    return appearance.borderColor;
  };

  if (context.value.account.loading) {
    return <div>Loading</div>;
  }

  return (
    <div className="bluxcc-h-[348px]">
      <div>
        <div
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="bluxcc-flex bluxcc-h-14 bluxcc-items-center bluxcc-gap-2 bluxcc-p-4"
          style={
            {
              background: appearance.bgField,
              borderWidth: appearance.includeBorders
                ? appearance.borderWidth
                : '1px',
              '--tw-ring-color': getBorderAndRingColor(),
              borderRadius: appearance.borderRadius,
              borderColor: getBorderAndRingColor(),
              color: appearance.textColor,
            } as React.CSSProperties
          }
        >
          <Search fill={appearance.textColor} />

          <input
            autoFocus
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="bluxcc-bg-transparent bluxcc-outline-none"
            style={{
              color: appearance.textColor,
            }}
          />
        </div>
      </div>

      <div className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0 bluxcc-mt-4 bluxcc-gap-2">
        {assets.map((asset, index) => (
          <div
            key={asset.assetType + asset.assetIssuer}
            onClick={() => {
              handleSelectAsset(asset);
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="bluxcc-flex bluxcc-cursor-pointer bluxcc-items-center bluxcc-justify-between bluxcc-px-4 bluxcc-py-3"
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
            <div className="bluxcc-flex bluxcc-items-center bluxcc-gap-[10px]">
              <span className="bluxcc-font-medium">{asset.logo}</span>
              <div className="bluxcc-flex bluxcc-flex-col">
                <span className="bluxcc-text-xs bluxcc-font-medium">
                  {asset.assetCode}
                </span>
                <span className="bluxcc-text-xs">{asset.assetCode}</span>
              </div>
            </div>

            <span className="bluxcc-font-medium">
              {humanizeAmount(asset.balance)}
            </span>
          </div>
        ))}

        {assets.length === 0 && (
          <div
            style={{ color: appearance.textColor }}
            className="bluxcc-mt-2 bluxcc-text-center"
          >
            No assets found
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectAssets;
