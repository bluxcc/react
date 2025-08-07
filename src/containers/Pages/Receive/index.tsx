import React from 'react';

import Button from '../../../components/Button';
import { useProvider } from '../../../context/provider';
import { LargeCopy } from '../../../assets/Icons';
import QRCode from '../../../components/QRCode';
import { SmallBlux } from '../../../assets/bluxLogo';
import hexToRgba from '../../../utils/hexToRgba';

const Receive = () => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const address = context.value.user.wallet?.address as string;

  return (
    <div className="bluxcc:flex bluxcc:w-full bluxcc:flex-col bluxcc:items-center bluxcc:justify-center bluxcc:text-center">
      <div
        className={`bluxcc:mt-4 bluxcc:flex bluxcc:size-[208px] bluxcc:items-center bluxcc:justify-center`}
        style={{
          position: 'relative',
          borderRadius: appearance.borderRadius,
          color: appearance.textColor,
          borderColor: appearance.borderColor,
          backgroundColor: appearance.bgField,
          borderWidth: appearance.includeBorders
            ? appearance.borderWidth
            : '1px',
        }}
      >
        <QRCode
          value="https://demo.blux.cc/"
          size={184}
          bgColor={appearance.bgField}
          fgColor={appearance.accent}
          level="Q"
        />
        <div
          className="bluxcc:z-20"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: appearance.background,
          }}
        >
          <SmallBlux fill={appearance.accent} background={appearance.bgField} />
        </div>
      </div>

      <div className="bluxcc:mt-4 bluxcc:space-y-2 bluxcc:font-medium">
        <p>Your Address</p>
        <div
          className="bluxcc:w-full bluxcc:px-3 bluxcc:py-2.5 bluxcc:whitespace-normal"
          style={{
            borderRadius: appearance.borderRadius,
            color: appearance.textColor,
            borderColor: appearance.borderColor,
            backgroundColor: appearance.bgField,
            borderWidth: appearance.includeBorders
              ? appearance.borderWidth
              : '1px',
          }}
        >
          <div
            className="bluxcc:w-[292px] bluxcc:text-sm bluxcc:break-all"
            style={{
              color: hexToRgba(appearance.textColor, 0.7),
            }}
          >
            {address}
          </div>
        </div>
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

      <Button
        size="large"
        state="enabled"
        variant="tonal"
        style={{
          color: appearance.accent,
        }}
        endIcon={<LargeCopy fill={appearance.accent} />}
      >
        Copy address
      </Button>
    </div>
  );
};

export default Receive;
