
import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = "Error",
  message 
}) => {
  return (
    <div className="flex items-start space-x-3 p-4 bg-github-highlight border border-red-500/30 rounded-md">
      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
      <div className="space-y-1">
        <h5 className="text-sm font-semibold text-red-400">{title}</h5>
        <p className="text-sm text-github-text">{message}</p>
      </div>
    </div>
  );
};
