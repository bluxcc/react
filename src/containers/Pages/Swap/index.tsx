import React from 'react';
import { useProvider } from '../../../context/provider';
import Button from '../../../components/Button';
import hexToRgba from '../../../utils/hexToRgba';
import { ArrowDropDown, ArrowDropUp, SwapIcon } from '../../../assets/Icons';
import { StellarLogo } from '../../../assets/logos';
import getContrastColor from '../../../utils/getContrastColor';
import { useLang } from '../../../hooks/useLang';

const Swap = () => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const t = useLang();

  const AssetBox = () => {
    return (
      <div
        className="bluxcc:flex bluxcc:items-center bluxcc:gap-1 bluxcc:p-1"
        style={{
          backgroundColor: appearance.bgField,
          borderColor: appearance.borderColor,
          borderRadius: appearance.borderRadius,
          borderWidth: appearance.includeBorders
            ? appearance.borderWidth
            : '1px',
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

  return (
    <div className="bluxcc:flex bluxcc:w-full bluxcc:flex-col bluxcc:items-center bluxcc:text-center">
      <div
        className="bluxcc:relative bluxcc:mb-4 bluxcc:w-full bluxcc:p-4"
        style={{
          backgroundColor: appearance.bgField,
          borderColor: appearance.borderColor,
          borderRadius: appearance.borderRadius,
          borderWidth: appearance.includeBorders
            ? appearance.borderWidth
            : '1px',
        }}
      >
        <div className="bluxcc:flex bluxcc:justify-between bluxcc:text-sm">
          <span style={{ color: hexToRgba(appearance.textColor, 0.7) }}>
            From
          </span>
          <span className="bluxcc:cursor-pointer">
            345.00{' '}
            <span
              style={{ color: appearance.accent }}
              className="bluxcc:mr-2 bluxcc:inline-flex bluxcc:cursor-pointer"
            >
              {t('max')} <ArrowDropUp fill={appearance.accent} />
            </span>
          </span>
        </div>
        <div className="bluxcc:mt-2 bluxcc:flex bluxcc:items-center bluxcc:justify-between">
          <input
            id="bluxcc-input"
            type="number"
            defaultValue={233}
            className="bluxcc:w-full bluxcc:bg-transparent bluxcc:text-xl bluxcc:font-medium bluxcc:outline-none"
            style={{ color: appearance.textColor }}
          />
          <AssetBox />
        </div>
        <div
          className="bluxcc:mt-1 bluxcc:text-left bluxcc:text-xs"
          style={{ color: hexToRgba(appearance.textColor, 0.7) }}
        >
          ≈ $23.74 USD
        </div>
        {/* Swap Icon */}
        <div className="bluxcc:flex bluxcc:h-8 bluxcc:w-full bluxcc:items-center bluxcc:justify-center">
          <div
            className="bluxcc:absolute bluxcc:right-0 bluxcc:left-0"
            style={{
              borderTopWidth: appearance.includeBorders
                ? appearance.borderWidth
                : '1px',
              borderTopStyle: 'solid',
              borderTopColor: appearance.borderColor,
            }}
          />

          <div
            className="bluxcc:z-20 bluxcc:p-2"
            style={{
              backgroundColor: appearance.bgField,
              borderColor: appearance.borderColor,
              borderRadius: appearance.borderRadius,
              borderWidth: appearance.includeBorders
                ? appearance.borderWidth
                : '1px',
            }}
          >
            <SwapIcon fill={appearance.accent} />
          </div>
        </div>
        {/* To Input */}

        <div className="bluxcc:flex bluxcc:justify-between bluxcc:text-sm">
          <span style={{ color: hexToRgba(appearance.textColor, 0.7) }}>
            To
          </span>
        </div>
        <div className="bluxcc:mt-2 bluxcc:flex bluxcc:items-center bluxcc:justify-between">
          <input
            id="bluxcc-input"
            type="number"
            defaultValue={233}
            className="bluxcc:w-full bluxcc:bg-transparent bluxcc:text-xl bluxcc:font-medium bluxcc:outline-none"
            style={{ color: appearance.textColor }}
          />
          <AssetBox />
        </div>
      </div>

      {/* Price Impact */}
      <div
        className="bluxcc:mb-2 bluxcc:flex bluxcc:w-full bluxcc:items-center bluxcc:justify-between bluxcc:px-4 bluxcc:py-2 bluxcc:text-sm"
        style={{
          backgroundColor: appearance.bgField,
          borderRadius: appearance.borderRadius,
          borderColor: appearance.borderColor,
          borderWidth: appearance.includeBorders
            ? appearance.borderWidth
            : '1px',
        }}
      >
        <span>Price Impact</span>
        <div
          className="bluxcc:flex bluxcc:items-center bluxcc:gap-1 bluxcc:px-2.5 bluxcc:py-2"
          style={{
            backgroundColor: appearance.bgField,
            borderRadius: appearance.borderRadius,
            borderColor: appearance.borderColor,
            borderWidth: appearance.includeBorders
              ? appearance.borderWidth
              : '1px',
          }}
        >
          <span style={{ color: appearance.accent }}>%0.2</span>
          <span
            className="bluxcc:h-2 bluxcc:w-2"
            style={{ backgroundColor: '#32D74B' }}
          ></span>
        </div>
      </div>
      <div
        className="bluxcc:ml-4 bluxcc:text-left bluxcc:text-xs"
        style={{ color: hexToRgba(appearance.textColor, 0.7) }}
      >
        The estimated effect of your swap on the market price.{' '}
        <span
          className="bluxcc:cursor-pointer bluxcc:rounded-full"
          style={{ color: appearance.accent }}
        >
          learn more
        </span>
      </div>

      {/* divider */}
      <div className="bluxcc:flex bluxcc:h-8 bluxcc:w-full bluxcc:items-center bluxcc:justify-center">
        <div
          className="bluxcc:absolute bluxcc:right-0 bluxcc:left-0"
          style={{
            borderTopWidth: appearance.includeBorders
              ? appearance.borderWidth
              : '1px',
            borderTopColor: appearance.borderColor,
          }}
        />
      </div>

      {/* Swap Button */}
      <Button size="large" state="enabled" variant="outline">
        Swap
      </Button>
    </div>
  );
};

export default Swap;
