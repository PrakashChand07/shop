interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: "h-8 w-8", text: "text-base", subtext: "text-xs" },
    md: { icon: "h-10 w-10", text: "text-lg", subtext: "text-xs" },
    lg: { icon: "h-12 w-12", text: "text-xl", subtext: "text-sm" },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Logo Icon */}
      <div className={`relative ${currentSize.icon} flex-shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Background Circle with Gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          
          {/* Main Circle */}
          <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />
          
          {/* Stylized "T" with accounting element */}
          <g fill="white">
            {/* Top horizontal bar of T */}
            <rect x="25" y="25" width="50" height="8" rx="2" />
            
            {/* Vertical bar of T */}
            <rect x="45" y="25" width="10" height="50" rx="2" />
            
            {/* Rupee symbol accent */}
            <path
              d="M 60 45 L 70 45 M 60 52 L 70 52 M 65 58 L 72 68"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Small dots for design accent */}
            <circle cx="32" cy="68" r="2.5" />
            <circle cx="42" cy="68" r="2.5" />
          </g>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-bold text-gray-900 leading-tight ${currentSize.text}`}>
            Anjum <span className="text-blue-600">Footwear</span>
          </div>
          <div className={`text-gray-500 leading-tight ${currentSize.subtext}`}>
            Accounting & Billing
          </div>
        </div>
      )}
    </div>
  );
}