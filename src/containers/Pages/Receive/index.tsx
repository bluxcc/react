import React from 'react';

import Button from '../../../components/Button';
import { useProvider } from '../../../context/provider';
import { LargeCopy } from '../../../assets/Icons';

const Receive = () => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const address = context.value.user.wallet?.address as string;

  return (
    <div className="bluxcc:flex bluxcc:w-full bluxcc:flex-col bluxcc:items-center bluxcc:justify-center bluxcc:text-center">
      <div
        className={`bluxcc:size-[208px] bluxcc:items-center bluxcc:p-2.5`}
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
        QR code
      </div>

      <div className="bluxcc:mt-4 bluxcc:space-y-2">
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
          <p className="bluxcc:max-w-[292px]">{address}</p>
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
