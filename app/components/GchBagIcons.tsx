import React from 'react';

type BagIconProps = {
  filled?: boolean;
};

function BagIcon({
  filled = false,
  letter,
  title,
}: BagIconProps & { letter: 'F' | 'B'; title: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <title>{title}</title>
      {filled ? (
        <path
          d="M8.6 9.85c0-2.55 1.45-4.35 3.4-4.35s3.4 1.8 3.4 4.35H8.6Z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M8.6 10.1c0-2.55 1.45-4.35 3.4-4.35s3.4 1.8 3.4 4.35"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
      <rect
        x="4"
        y="9.35"
        width="16"
        height="10.9"
        rx="2.1"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <text
        x="12"
        y="17.45"
        textAnchor="middle"
        fill={filled ? '#ffffff' : 'currentColor'}
        fontFamily="Atkinson Hyperlegible Next, Arial, sans-serif"
        fontSize="8.5"
        fontWeight="700"
      >
        {letter}
      </text>
    </svg>
  );
}

export function GchBagFrontIcon({ filled }: BagIconProps) {
  return <BagIcon filled={filled} letter="F" title="Front" />;
}

export function GchBagBackIcon({ filled }: BagIconProps) {
  return <BagIcon filled={filled} letter="B" title="Back" />;
}
