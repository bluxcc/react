import React from 'react';

const BluxLogo = ({ fill = 'black' }: { fill?: string }) => (
  <svg
    width="150"
    height="32"
    viewBox="0 0 150 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_84_13134)">
      <path
        d="M41.7486 0.558624H37.8855V25.7212H41.7486V0.558624Z"
        fill={fill}
      />
      <path d="M66.5053 27.5581H37.9539V31.5305H66.5053V27.5581Z" fill={fill} />
      <path
        d="M76.3978 0.546021H72.5347V25.6688H76.3978V0.546021Z"
        fill={fill}
      />
      <path
        d="M103.444 0.546021H99.5806V25.6688H103.444V0.546021Z"
        fill={fill}
      />
      <path d="M99.5805 27.5907H76.3992V31.4538H99.5805V27.5907Z" fill={fill} />
      <path
        d="M27.9599 0.546021H1.08423V4.40916H27.9599V0.546021Z"
        fill={fill}
      />
      <path
        d="M4.82359 12.6967V0.496552H0.960449V12.6967V14.0672V17.9303V27.5907V31.4538V31.4662H4.82359V31.4538H27.9627V27.5907H4.82359V17.9303H27.9627V14.0672H4.82359V12.6967Z"
        fill={fill}
      />
      <path d="M31.7456 4.46902H28.0215V14.1517H31.7456V4.46902Z" fill={fill} />
      <path d="M31.7456 17.8756H28.0215V27.5583H31.7456V17.8756Z" fill={fill} />
      <path
        d="M108.558 2.7334L120.393 14.5661L123.129 11.8376L111.291 -9.15527e-05L108.558 2.7334Z"
        fill={fill}
      />
      <path
        d="M125.991 20.1622L137.829 31.9999L140.557 29.2664L128.724 17.4337L125.991 20.1622Z"
        fill={fill}
      />
      <path
        d="M120.39 17.4292L108.556 29.2634L111.289 31.9968L123.124 20.1626L120.39 17.4292Z"
        fill={fill}
      />
      <path
        d="M125.991 11.8376L128.724 14.5711L140.557 2.7334L137.829 -9.15527e-05L125.991 11.8376Z"
        fill={fill}
      />
      <path
        d="M143.479 0.538667H144.318V2.83768H144.84V0.538667H145.679V0.0619812H143.479V0.538667Z"
        fill={fill}
      />
      <path
        d="M148.961 -9.15527e-05L147.641 1.72293L146.317 -9.15527e-05H146.24V2.83768H146.762V1.35052L147.613 2.49258H147.65L148.512 1.3381V2.83768H149.041V-9.15527e-05H148.961Z"
        fill={fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_84_13134">
        <rect
          width="148.08"
          height="32"
          fill="white"
          transform="translate(0.959717)"
        />
      </clipPath>
    </defs>
  </svg>
);
export default BluxLogo;

export const SmallBlux = ({
  fill = 'black',
  background = 'transparent',
}: {
  fill?: string;
  background?: string;
}) => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="52" height="52" fill={background} />
    <path d="M39.4391 8H8V12.4539H39.4391V8Z" fill={fill} />
    <path
      d="M12.4906 22.1818V8H8V22.1818V23.7749V28.2655V39.495V43.9856V44H12.4906V43.9856H39.3882V39.495H12.4906V28.2655H39.3882V23.7749H12.4906V22.1818Z"
      fill={fill}
    />
    <path d="M43.8933 12.4541H39.4395V23.7198H43.8933V12.4541Z" fill={fill} />
    <path d="M43.8933 28.1729H39.4395V39.4385H43.8933V28.1729Z" fill={fill} />
  </svg>
);
