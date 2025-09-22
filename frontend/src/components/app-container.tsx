import React, { useState } from "react";
import axios from "axios";
import { RepoForm } from "./repo-form";
import { BlogDisplay } from "./blog-display";
import { LoadingView } from "./loading-view";
import { ErrorMessage } from "./error-message";
import { Globe, Github, BookOpen, Menu, X } from "lucide-react";
import { GitDocsLogo } from "./GitDocsLogo";
import { motion, AnimatePresence } from "framer-motion";
import { Documentation } from "./documentation";

export const AppContainer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [blogContent, setBlogContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"main" | "docs">("main");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGenerateBlog = async (repoUrl: string) => {
    setLoading(true);
    setBlogContent(null);
    setError(null);

    try {
      const response = await axios.post("https://gitdocs-tw63.onrender.com/generate-blog", {
        repo_url: repoUrl,
      });
      
      if (response.data && response.data.blog) {
        setBlogContent(response.data.blog);
      } else {
        setError("Received an invalid response from the server");
      }
    } catch (err: any) {
      console.error("Error generating blog:", err);
      const errorMessage = err.response?.data?.error || 
        "Failed to connect to the backend server. Is it running at https://gitdocs-tw63.onrender.com?";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (view: "main" | "docs") => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if (activeView === "docs") {
      return <Documentation />;
    }

    return (
      <div className="max-w-5xl mx-auto space-y-10">
        <motion.div 
          className="bg-github-card/60 backdrop-blur-lg border border-github-border/40 rounded-2xl shadow-xl p-8 overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-github-accent/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-github-accent/20 p-2 rounded-lg">
                <Globe className="h-6 w-6 text-github-accent" />
              </div>
              <h2 className="text-xl font-semibold text-white">Generate Documentation from Repository</h2>
            </div>
            <RepoForm onSubmit={handleGenerateBlog} isLoading={loading} />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-github-card/60 backdrop-blur-lg border border-github-border/40 rounded-2xl shadow-xl overflow-hidden"
            >
              <LoadingView />
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ErrorMessage message={error} />
            </motion.div>
          ) : blogContent ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-github-card/60 backdrop-blur-lg border border-github-border/40 rounded-2xl shadow-xl p-8 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-github-accent/3 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <BlogDisplay content={blogContent} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-github-dark via-github-darker to-black">
      <header className="border-b border-github-border/40 bg-github-darker/90 backdrop-blur-md py-4 px-6 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GitDocsLogo className="h-8 w-8 text-github-accent drop-shadow-glow" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              <span className="text-github-accent">Git</span>Docs
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button 
              onClick={() => handleNavigation("main")} 
              className={`text-sm hover:text-github-accent transition-colors ${activeView === "main" ? "text-github-accent" : "text-github-muted"}`}
            >
              Generator
            </button>
            <button 
              onClick={() => handleNavigation("docs")} 
              className={`text-sm flex items-center gap-1 hover:text-github-accent transition-colors ${activeView === "docs" ? "text-github-accent" : "text-github-muted"}`}
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </button>
            <a 
              href="https://github.com/AnishMane/GitDocs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-github-muted text-sm hover:text-github-accent transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-github-muted hover:text-github-accent transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-github-darker/95 border-b border-github-border/40 backdrop-blur-md shadow-lg px-6 py-4 md:hidden z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => handleNavigation("main")} 
                  className={`text-sm py-2 px-3 rounded-md ${activeView === "main" ? "bg-github-accent/20 text-github-accent" : "text-github-muted hover:bg-github-highlight/30"}`}
                >
                  Generator
                </button>
                <button 
                  onClick={() => handleNavigation("docs")} 
                  className={`text-sm py-2 px-3 rounded-md flex items-center gap-2 ${activeView === "docs" ? "bg-github-accent/20 text-github-accent" : "text-github-muted hover:bg-github-highlight/30"}`}
                >
                  <BookOpen className="h-4 w-4" />
                  Documentation
                </button>
                <a 
                  href="https://github.com/AnishMane/GitDocs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm py-2 px-3 rounded-md flex items-center gap-2 text-github-muted hover:bg-github-highlight/30"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow py-12 px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-github-border/40 bg-github-darker/90 backdrop-blur-md py-6 px-6 shadow-inner">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between text-sm">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-github-muted/80 hover:text-github-muted transition-colors"
          >
            © {new Date().getFullYear()} GitDocs
          </motion.div>
          <motion.div 
            className="flex items-center gap-6 mt-3 sm:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a 
              href="https://github.com/AnishMane/GitDocs" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-github-muted/80 hover:text-github-accent transition-colors flex items-center gap-2 group"
            >
              <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>GitHub</span>
            </a>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};