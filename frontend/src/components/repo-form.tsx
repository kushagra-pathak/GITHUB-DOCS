import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RepoFormProps {
  onSubmit: (repoUrl: string) => void;
  isLoading: boolean;
}

export const RepoForm: React.FC<RepoFormProps> = ({ onSubmit, isLoading }) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [validation, setValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: false, message: "" });

  useEffect(() => {
    validateUrl(repoUrl);
  }, [repoUrl]);

  const validateUrl = (url: string) => {
    if (!url.trim()) {
      setValidation({ isValid: false, message: "" });
      return;
    }

    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+$/;
    const isValid = githubRegex.test(url.trim());

    setValidation({
      isValid,
      message: isValid 
        ? "Valid GitHub repository URL" 
        : "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validation.isValid) {
      onSubmit(repoUrl.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="repo-url" className="text-sm font-medium text-github-text">
            GitHub Repository URL
          </label>
          <div className="relative">
            <Input
              id="repo-url"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className={`bg-github-highlight/50 border-github-border/50 text-github-text 
                focus:border-github-accent focus:ring-github-accent pr-10 transition-all duration-200
                ${validation.isValid ? 'border-green-500/50' : ''}
                ${!validation.isValid && repoUrl ? 'border-red-500/50' : ''}`}
              disabled={isLoading}
            />
            <AnimatePresence mode="wait">
              {repoUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {validation.isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            {validation.message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-sm ${
                  validation.isValid ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {validation.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Button
        type="submit"
        className={`w-full transition-all duration-200 ${
          validation.isValid
            ? 'bg-github-accent hover:bg-github-accent/90 text-white'
            : 'bg-github-muted/20 text-github-muted cursor-not-allowed'
        }`}
        disabled={isLoading || !validation.isValid}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full"
          />
        ) : (
          "Generate Blog"
        )}
      </Button>
    </form>
  );
};
