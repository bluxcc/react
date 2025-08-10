import React from 'react';
import getContrastColor from '../../../../utils/getContrastColor';
import { StellarLogo } from '../../../../assets/logos';
import { ArrowDropDown } from '../../../../assets/Icons';
import { useProvider } from '../../../../context/provider';

const AssetBox = ({ handleOpenAssets }: { handleOpenAssets: () => void }) => {
  const context = useProvider();
  const appearance = context.value.config.appearance;

  return (
    <div
      onClick={handleOpenAssets}
      className="bluxcc:flex bluxcc:cursor-pointer bluxcc:items-center bluxcc:gap-1 bluxcc:p-1"
      style={{
        backgroundColor: appearance.bgField,
        borderColor: appearance.borderColor,
        borderRadius: appearance.borderRadius,
        borderWidth: appearance.includeBorders ? appearance.borderWidth : '1px',
      }}
    >
      <div
        style={{
          backgroundColor: appearance.background,
          borderRadius: appearance.borderRadius,
          borderColor: appearance.borderColor,
          borderWidth: appearance.includeBorders
            ? appearance.borderWidth
            : '1px',
        }}
        className="bluxcc:flex bluxcc:size-10 bluxcc:shrink-0 bluxcc:items-center bluxcc:justify-center bluxcc:overflow-hidden bluxcc:transition-[border-radius] bluxcc:duration-300"
      >
        <StellarLogo fill={getContrastColor(appearance.bgField)} />
      </div>
      <span>XLM</span>
      <ArrowDropDown />
    </div>
  );
};

export default AssetBox;
