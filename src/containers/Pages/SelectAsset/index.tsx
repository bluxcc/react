import React, { useState, MouseEvent, ChangeEvent } from 'react';
import { useProvider } from '../../../context/provider';
import { Search } from '../../../assets/Icons';
import humanizeAmount from '../../../utils/humanizeAmount';

// Mock assets
const mockAssets = [
  { symbol: 'XLM', name: 'Stellar Lumens', amount: 0, logo: <Search /> },
  { symbol: 'USDC', name: 'USD Coin', amount: 10, logo: <Search /> },
  { symbol: 'BTC', name: 'Bitcoin', amount: 20, logo: <Search /> },
  { symbol: 'ETH', name: 'Ethereum', amount: 10, logo: <Search /> },
  { symbol: 'LSP', name: 'LumenSwap', amount: 770, logo: <Search /> },
];

const SelectAssets = () => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  // Filter assets based on search query
  const filteredAssets = mockAssets.filter(
    (asset) =>
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bluxcc-h-[348px]">
      {/* Search Field */}
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

      {/* Assets List */}
      <div className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0 bluxcc-mt-4 bluxcc-gap-2">
        {filteredAssets.map((asset, index) => (
          <div
            key={asset.symbol}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="bluxcc-flex bluxcc-cursor-pointer bluxcc-items-center bluxcc-justify-between bluxcc-px-4 bluxcc-py-3"
            style={{
              background:
                hoveredIndex === index ? appearance.bgField : 'transparent',
              color: appearance.textColor,
              borderBottomStyle: 'dashed',
              borderBottomWidth:
                index < filteredAssets.length - 1
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
                  {asset.name}
                </span>
                <span className="bluxcc-text-xs">{asset.symbol}</span>
              </div>
            </div>

            <span className="bluxcc-font-medium">
              {humanizeAmount(asset.amount)}
            </span>
          </div>
        ))}

        {filteredAssets.length === 0 && (
          <div
            style={{ color: appearance.textColor }}
            className="bluxcc-mt-2 bluxcc-text-center"
          >
            No assets found for `{searchQuery}`
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectAssets;
