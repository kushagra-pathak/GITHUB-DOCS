import React from "react";

export const GitDocsLogo: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 512 512" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Document base */}
      <rect x="96" y="32" width="320" height="448" rx="24" fill="#252F3E" stroke="currentColor" strokeWidth="12"/>
      
      {/* Git branch structure */}
      <circle cx="256" cy="128" r="32" fill="currentColor"/>
      <circle cx="160" cy="224" r="32" fill="currentColor"/>
      <circle cx="352" cy="224" r="32" fill="currentColor"/>
      <circle cx="256" cy="320" r="32" fill="currentColor"/>
      
      {/* Branch lines */}
      <line x1="256" y1="160" x2="256" y2="288" stroke="currentColor" strokeWidth="12"/>
      <line x1="256" y1="160" x2="160" y2="224" stroke="currentColor" strokeWidth="12"/>
      <line x1="256" y1="160" x2="352" y2="224" stroke="currentColor" strokeWidth="12"/>
      
      {/* Document lines */}
      <line x1="180" y1="384" x2="332" y2="384" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      <line x1="180" y1="416" x2="280" y2="416" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
    </svg>
  );
};