import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
      aria-label="JSK Car Body Shop"
    >
      <svg
        viewBox="0 0 320 56"
        role="img"
        aria-label="JSK CAR BODY SHOP"
        className="h-10 w-auto"
      >
        {/* Icon */}
        <g transform="translate(0 0)">
          <rect
            x="6"
            y="6"
            width="44"
            height="44"
            rx="14"
            fill="#e11d48"
            stroke="#1a1a1a"
            strokeWidth="3"
          />
          <text
            x="28"
            y="34"
            textAnchor="middle"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="18"
            fontWeight="900"
            fill="#ffffff"
          >
            JSK
          </text>
        </g>

        {/* Wordmark */}
        <text
          x="62"
          y="34"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="18"
          fontWeight="900"
          fill="#f0f0f0"
          letterSpacing="0.4"
        >
          JSK CAR BODY SHOP
        </text>

        {/* Accent underline */}
        <rect x="62" y="40" width="150" height="4" rx="2" fill="#e11d48" />
      </svg>
    </Link>
  );
}

