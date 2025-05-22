
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Code, Play, Database } from 'lucide-react';
import { testConnection } from '@/services/sqlService';

interface SQLQueryEditorProps {
  onExecuteQuery: (query: string) => void;
  isLoading: boolean;
}

const SQLQueryEditor: React.FC<SQLQueryEditorProps> = ({ onExecuteQuery, isLoading }) => {
  const [query, setQuery] = useState('SELECT * FROM posts LIMIT 10;');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Test connection on component mount
    const checkConnection = async () => {
      const connected = await testConnection();
      setIsConnected(connected);
    };
    
    checkConnection();
  }, []);
  
  const handleExecute = () => {
    if (!query.trim()) {
      toast({
        title: "Query Error",
        description: "Please enter a valid SQL query",
        variant: "destructive",
      });
      return;
    }
    
    // Add to history if not already the last query
    if (history.length === 0 || history[history.length - 1] !== query) {
      setHistory(prev => [...prev, query]);
      setHistoryIndex(history.length);
    }
    
    onExecuteQuery(query);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Execute query on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
    
    // Navigate history with up/down arrow keys
    if (e.key === 'ArrowUp' && e.ctrlKey) {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setQuery(history[newIndex]);
      }
    }
    
    if (e.key === 'ArrowDown' && e.ctrlKey) {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setQuery(history[newIndex]);
      }
    }
  };
  
  const basicQueries = [
    'SELECT * FROM posts ORDER BY createdAt DESC LIMIT 10;',
    'SELECT * FROM users LIMIT 10;',
  ];
  
  const advancedQueries = [
    'SELECT author.displayName, COUNT(*) as post_count FROM posts GROUP BY author.displayName;',
    'SELECT * FROM posts WHERE likes > 20;',
    'SELECT * FROM posts WHERE content LIKE "%React%";',
    'SELECT * FROM posts ORDER BY likes DESC LIMIT 5;'
  ];
  
  const systemQueries = [
    'SHOW TABLES;',
    'DESCRIBE posts;',
    'DESCRIBE users;',
    'SHOW COLUMNS FROM posts;',
  ];
  
  return (
    <div className="space-y-4">
      <div className="bg-black/50 rounded-lg p-4 relative">
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <div className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
            Ctrl+Enter to execute
          </div>
          <div className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
            Ctrl+↑↓ for history
          </div>
          <div className={`text-xs px-2 py-0.5 rounded ${isConnected ? 'bg-green-700 text-green-100' : isConnected === false ? 'bg-red-700 text-red-100' : 'bg-gray-700 text-gray-300'}`}>
            {isConnected ? 'Connected' : isConnected === false ? 'Disconnected' : 'Checking connection...'}
          </div>
        </div>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="font-mono h-48 text-sm bg-black text-white resize-y"
          placeholder="Enter SQL query..."
        />
        <div className="flex justify-between mt-2">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => setQuery(query => query.trim() + " LIMIT 10;")}
            >
              + LIMIT
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => setQuery(query => query.trim() + " ORDER BY createdAt DESC;")}
            >
              + ORDER BY
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => setQuery(query => query.trim() + " WHERE likes > 10;")}
            >
              + WHERE
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const connected = await testConnection();
                setIsConnected(connected);
              }}
            >
              <Database className="h-4 w-4 mr-2" /> Test Connection
            </Button>
          </div>
          <Button 
            size="sm" 
            className="bg-xBlue hover:bg-xBlue/80 px-4"
            onClick={handleExecute} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" /> Execute Query
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Code className="h-4 w-4 mr-1" /> Basic Queries
          </h3>
          <div className="space-y-2">
            {basicQueries.map((sampleQuery, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs w-full justify-start h-auto py-1 font-mono text-left"
                onClick={() => setQuery(sampleQuery)}
              >
                {sampleQuery}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Code className="h-4 w-4 mr-1" /> Advanced Queries
          </h3>
          <div className="space-y-2">
            {advancedQueries.map((sampleQuery, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs w-full justify-start h-auto py-1 font-mono text-left"
                onClick={() => setQuery(sampleQuery)}
              >
                {sampleQuery}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Code className="h-4 w-4 mr-1" /> System Queries
          </h3>
          <div className="space-y-2">
            {systemQueries.map((sampleQuery, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs w-full justify-start h-auto py-1 font-mono text-left"
                onClick={() => setQuery(sampleQuery)}
              >
                {sampleQuery}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Query History</h3>
          <div className="max-h-32 overflow-y-auto">
            {history.map((historyQuery, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-xs w-full justify-start h-auto py-1 font-mono text-left truncate"
                onClick={() => {
                  setQuery(historyQuery);
                  setHistoryIndex(index);
                }}
              >
                {historyQuery}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SQLQueryEditor;
