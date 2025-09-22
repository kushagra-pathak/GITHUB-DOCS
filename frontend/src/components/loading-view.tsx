
import React from "react";
import { Spinner } from "@/components/ui/spinner";

export const LoadingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-12">
      <Spinner size="lg" className="text-github-accent" />
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-medium text-github-text">Generating Blog</h3>
        <p className="text-sm text-github-muted">
          Analyzing repository and creating content...
        </p>
      </div>
    </div>
  );
};
