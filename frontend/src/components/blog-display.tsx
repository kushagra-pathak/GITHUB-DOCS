import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check, FileText } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface BlogDisplayProps {
  content: string;
}

export const BlogDisplay: React.FC<BlogDisplayProps> = ({ content }) => {
  const [copyStatus, setCopyStatus] = React.useState<'idle' | 'copying' | 'copied'>('idle');

  const handleCopy = async () => {
    if (copyStatus === 'copying') return;
    
    setCopyStatus('copying');
    try {
      await navigator.clipboard.writeText(content);
      setCopyStatus('copied');
      toast({
        title: "Copied to clipboard",
        description: "Blog content has been copied to clipboard",
        className: "bg-green-500/10 border-green-500/20 text-green-500",
      });
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      setCopyStatus('idle');
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "autodev-blog.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Blog saved as autodev-blog.md",
      className: "bg-green-500/10 border-green-500/20 text-green-500",
    });
  };

  return (
    <motion.div 
      className="flex flex-col w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-github-accent/20 p-2 rounded-lg">
            <FileText className="h-6 w-6 text-github-accent" />
          </div>
          <h2 className="text-xl font-semibold text-white">Generated Blog</h2>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className={`flex-1 sm:flex-none items-center gap-2 border-github-border/50 
              hover:bg-github-highlight/50 transition-all duration-200 px-4 py-2
              ${copyStatus === 'copied' ? 'border-green-500/50 text-green-500 bg-green-500/10' : ''}`}
            disabled={copyStatus === 'copying'}
          >
            <AnimatePresence mode="wait">
              {copyStatus === 'copied' ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              ) : copyStatus === 'copying' ? (
                <motion.div
                  key="loading"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-github-muted/20 border-t-github-muted rounded-full"
                />
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="hidden sm:inline ml-1">
              {copyStatus === 'copied' ? 'Copied!' : 'Copy'}
            </span>
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none items-center gap-2 border-github-border/50 hover:bg-github-highlight/50 hover:border-github-accent/50 transition-all duration-200 px-4 py-2 group"
          >
            <Download className="h-4 w-4 group-hover:text-github-accent transition-colors" />
            <span className="hidden sm:inline ml-1 group-hover:text-github-accent transition-colors">Download</span>
          </Button>
        </div>
      </div>
      
      <motion.div 
        className="border border-github-border/40 rounded-xl overflow-hidden shadow-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}  
        transition={{ delay: 0.2 }}
      >
        <div className="bg-github-darker/80 border-b border-github-border/40 px-6 py-3 flex justify-between items-center">
          <div className="text-sm text-github-muted flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>autodev-blog.md</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/40" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
            <div className="w-3 h-3 rounded-full bg-green-500/40" />
          </div>
        </div>
        <div className="bg-github-highlight/20 p-6 overflow-auto scrollbar-github max-h-[60vh]">
          <MarkdownRenderer markdown={content} />
        </div>
      </motion.div>
    </motion.div>
  );
};