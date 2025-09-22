import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, ChevronDown, BookOpen, Terminal, Code, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export const Documentation: React.FC = () => {
  const [openSection, setOpenSection] = useState<string>("overview");
  const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({});

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [id]: true });
      toast({
        title: "Copied to clipboard",
        description: "Command has been copied to clipboard",
        className: "bg-green-500/10 border-green-500/20 text-green-500",
      });
      setTimeout(() => setCopyStatus({ ...copyStatus, [id]: false }), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const Section: React.FC<{
    id: string;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ id, title, icon, children }) => {
    const isOpen = openSection === id;
    
    return (
      <div className="border border-github-border/40 rounded-lg overflow-hidden mb-6">
        <button 
          className={`w-full flex items-center justify-between p-4 text-left bg-github-darker/60 hover:bg-github-darker/80 transition-colors ${isOpen ? 'border-b border-github-border/40' : ''}`}
          onClick={() => toggleSection(id)}
        >
          <div className="flex items-center gap-3">
            <div className="bg-github-accent/20 p-2 rounded-lg">
              {icon}
            </div>
            <h3 className="text-lg font-medium text-white">{title}</h3>
          </div>
          <ChevronDown className={`h-5 w-5 text-github-muted transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-github-card/60 p-6"
          >
            {children}
          </motion.div>
        )}
      </div>
    );
  };

  const CodeBlock: React.FC<{
    code: string;
    language?: string;
    id: string;
  }> = ({ code, language = "bash", id }) => {
    return (
      <div className="relative mt-4 mb-6">
        <div className="bg-github-darker/80 rounded-t-md py-2 px-4 text-xs text-github-muted border-b border-github-border/40 flex justify-between items-center">
          <span>{language}</span>
          <button
            onClick={() => handleCopy(code, id)}
            className="text-github-muted hover:text-github-accent transition-colors flex items-center gap-1"
          >
            {copyStatus[id] ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span>{copyStatus[id] ? "Copied!" : "Copy"}</span>
          </button>
        </div>
        <pre className="bg-github-darker/50 rounded-b-md p-4 overflow-x-auto text-sm text-github-text">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col items-start mb-12">
        <div className="flex gap-2 items-center mb-2">
          <div className="bg-github-accent/10 px-2 py-1 rounded-md">
            <span className="text-xs font-medium text-github-accent">v1.0.0</span>
          </div>
          <div className="flex gap-1">
            <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" className="h-5" />
            <img src="https://img.shields.io/badge/Python-3.8+-green.svg" alt="Python 3.8+" className="h-5" />
            <img src="https://img.shields.io/badge/Next.js-13+-000000.svg?logo=next.js&logoColor=white" alt="Next.js 13+" className="h-5" />
            <img src="https://img.shields.io/badge/Flask-2.0+-000000.svg?logo=flask&logoColor=white" alt="Flask 2.0+" className="h-5" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">GitDocs Documentation</h1>
        <p className="text-github-muted text-lg max-w-3xl">
          GitDocs transforms GitHub repositories into polished technical blog posts using AI. 
          This documentation will guide you through setting up and using the application.
        </p>
      </div>

      <Section id="overview" title="Overview" icon={<BookOpen className="h-5 w-5 text-github-accent" />}>
        <div className="prose prose-invert prose-github max-w-none">
          <h3 className="text-white font-medium text-xl mb-4">Features</h3>
          <ul className="space-y-2 text-github-muted">
            <li className="flex items-start gap-2">
              <span className="text-github-accent font-medium">One-Click Blog Generation:</span> 
              <span>Enter a GitHub repo URL, get a complete technical blog post</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-github-accent font-medium">Smart Repository Analysis:</span> 
              <span>Automatically detects tech stack, parses README, and extracts meaningful code snippets</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-github-accent font-medium">AI-Powered Content:</span> 
              <span>Leverages modern language models to create coherent, informative technical content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-github-accent font-medium">Clean NextJS Frontend:</span> 
              <span>Modern responsive interface built with NextJS and Tailwind CSS</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-github-accent font-medium">Local Fallback:</span> 
              <span>Continues to function even when AI services are unavailable</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section id="installation" title="Installation" icon={<Terminal className="h-5 w-5 text-github-accent" />}>
        <div className="prose prose-invert prose-github max-w-none">
          <h3 className="text-white font-medium text-xl mb-4">Prerequisites</h3>
          <ul className="mb-6 text-github-muted">
            <li>Python 3.8+</li>
            <li>Node.js 14+</li>
            <li>Git</li>
          </ul>

          <h3 className="text-white font-medium text-xl mb-4">Step 1: Clone the repository</h3>
          <CodeBlock 
            code={"git clone https://github.com/AnishMane/GitDocs.git\ncd GitDocs"} 
            id="clone-repo" 
          />

          <h3 className="text-white font-medium text-xl mb-4">Step 2: Set up the backend</h3>
          <CodeBlock 
            code={"cd backend\npython -m venv venv\nsource venv/bin/activate  # On Windows: venv\\Scripts\\activate\npip install -r requirements.txt"} 
            id="setup-backend" 
          />

          <h3 className="text-white font-medium text-xl mb-4">Step 3: Create a .env file</h3>
          <p className="text-github-muted mb-3">Create a <code className="bg-github-darker/50 px-2 py-0.5 rounded text-sm">.env</code> file in the backend directory with your OpenRouter API key:</p>
          <CodeBlock 
            code="OPENROUTER_API_KEY=your_api_key_here" 
            id="env-file" 
          />

          <h3 className="text-white font-medium text-xl mb-4">Step 4: Set up the frontend</h3>
          <CodeBlock 
            code={"cd ../frontend\nnpm install"} 
            id="setup-frontend" 
          />
        </div>
      </Section>

      <Section id="running" title="Running the Application" icon={<Code className="h-5 w-5 text-github-accent" />}>
        <div className="prose prose-invert prose-github max-w-none">
          <h3 className="text-white font-medium text-xl mb-4">Step 1: Start the backend server</h3>
          <CodeBlock 
            code={"cd backend\npython -u app.py" }
            id="run-backend" 
          />
          <p className="text-github-muted mb-6">The backend is available at <a href="https://gitdocs-tw63.onrender.com" target="_blank" rel="noopener noreferrer" className="text-github-accent hover:underline inline-flex items-center gap-1">https://gitdocs-tw63.onrender.com <ExternalLink className="h-3 w-3" /></a></p>

          <h3 className="text-white font-medium text-xl mb-4">Step 2: In a new terminal, start the frontend</h3>
          <CodeBlock 
            code={"cd frontend\nnpm run dev" }
            id="run-frontend" 
          />
          <p className="text-github-muted mb-3">The application will be available at <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="text-github-accent hover:underline inline-flex items-center gap-1">http://localhost:3000 <ExternalLink className="h-3 w-3" /></a></p>

          <div className="bg-github-darker/30 border border-github-border/40 rounded-lg p-4 mt-6">
            <p className="text-yellow-400 font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Important
            </p>
            <p className="mt-2 text-github-muted">
              Make sure both the backend and frontend servers are running simultaneously for the application to work properly.
            </p>
          </div>
        </div>
      </Section>

      <Section id="api" title="API Documentation" icon={<Package className="h-5 w-5 text-github-accent" />}>
        <div className="prose prose-invert prose-github max-w-none">
          <h3 className="text-white font-medium text-xl mb-4">Generate Blog</h3>
          <p className="text-github-muted mb-3">
            <code className="bg-github-darker/50 px-2 py-0.5 rounded text-sm">POST /generate-blog</code>
          </p>

          <h4 className="text-white font-medium mb-2">Request Body:</h4>
          <CodeBlock 
            code={'{\n  "repo_url": "https://github.com/AnishMane/GitDocs"\n}'} 
            language="json" 
            id="request-body" 
          />

          <h4 className="text-white font-medium mb-2">Response:</h4>
          <CodeBlock 
            code={'{\n  "blog": "# Generated Markdown Content..."\n}'} 
            language="json" 
            id="response-body" 
          />
        </div>
      </Section>

      <Section id="contributing" title="Contributing" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-github-accent" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>}>
        <div className="prose prose-invert prose-github max-w-none">
          <p className="text-github-muted mb-3">
            Contributions are welcome! Please feel free to submit a Pull Request.
          </p>

          <ol className="space-y-2 text-github-muted">
            <li>1. Fork the repository</li>
            <li>2. Create your feature branch (<code className="bg-github-darker/50 px-2 py-0.5 rounded text-sm">git checkout -b feature/amazing-feature</code>)</li>
            <li>3. Commit your changes (<code className="bg-github-darker/50 px-2 py-0.5 rounded text-sm">git commit -m 'Add some amazing feature'</code>)</li>
            <li>4. Push to the branch (<code className="bg-github-darker/50 px-2 py-0.5 rounded text-sm">git push origin feature/amazing-feature</code>)</li>
            <li>5. Open a Pull Request</li>
          </ol>

        </div>
      </Section>

      <div className="mt-12 flex justify-center">
        <Button 
          variant="outline" 
          size="lg" 
          className="border-github-border/50 hover:bg-github-highlight/50 hover:border-github-accent/50 transition-all duration-200 px-6 py-2 gap-2"
          onClick={() => window.open("https://github.com/AnishMane/GitDocs", "_blank")}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>View on GitHub</span>
        </Button>
      </div>
    </div>
  );
};