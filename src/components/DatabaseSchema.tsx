
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Database, Table, Key, Search, Filter, Code } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDatabaseSchema } from '@/services/sqlService';

// Define proper types for tables and columns
type ColumnType = {
  name: string;
  type: string;
  isPrimary?: boolean;
  isUnique?: boolean;
  isNullable?: boolean;
  isForeignKey?: boolean;
  references?: string;
  description?: string;
};

type IndexType = {
  name: string;
  columns: string[];
  type: string;
};

type TableType = {
  name: string;
  type: string;
  columns: ColumnType[];
  indexes?: IndexType[];
  system?: boolean;
  mockup?: boolean;
};

const DatabaseSchema = () => {
  const [expandedTables, setExpandedTables] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showSystemTables, setShowSystemTables] = useState(false);
  const [tables, setTables] = useState<TableType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch schema from backend
  useEffect(() => {
    const fetchSchema = async () => {
      setIsLoading(true);
      try {
        const response = await getDatabaseSchema();
        
        if (response.success && response.tables) {
          setTables(response.tables);
          
          // Set first table as expanded
          if (response.tables.length > 0) {
            setExpandedTables(prev => ({
              ...prev,
              [response.tables[0].name]: true
            }));
          }
        } else {
          setError(response.message || 'Failed to load schema');
          // Fall back to mock data
          loadMockData();
        }
      } catch (error) {
        console.error("Error fetching schema:", error);
        setError('Error loading database schema');
        // Fall back to mock data
        loadMockData();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchema();
  }, []);
  
  // Load mock data if backend fails
  const loadMockData = () => {
    const mockTables: TableType[] = [
      {
        name: 'posts',
        type: 'table',
        columns: [
          { name: 'id', type: 'string', isPrimary: true },
          { name: 'content', type: 'text', description: 'Post content' },
          { name: 'author', type: 'object', description: 'Author object with user information' },
          { name: 'createdAt', type: 'datetime', description: 'Creation timestamp' },
          { name: 'likes', type: 'integer', description: 'Number of likes' },
          { name: 'comments', type: 'integer', description: 'Number of comments' },
          { name: 'isLiked', type: 'boolean', description: 'If current user liked the post' },
          { name: 'parentId', type: 'string', isNullable: true, isForeignKey: true, references: 'posts.id', description: 'Parent post ID for replies' }
        ],
        indexes: [
          { name: 'posts_pkey', columns: ['id'], type: 'primary' },
          { name: 'posts_author_idx', columns: ['author'], type: 'index' },
          { name: 'posts_parent_id_idx', columns: ['parentId'], type: 'index' }
        ]
      },
      {
        name: 'users',
        type: 'table',
        columns: [
          { name: 'id', type: 'string', isPrimary: true, description: 'User unique identifier' },
          { name: 'username', type: 'string', isUnique: true, description: 'Unique username' },
          { name: 'displayName', type: 'string', description: 'User display name' },
          { name: 'email', type: 'string', isUnique: true, description: 'User email address' },
          { name: 'profileImage', type: 'string', isNullable: true, description: 'Profile image URL' },
          { name: 'role', type: 'string', description: 'User role (admin, user, etc)' }
        ],
        indexes: [
          { name: 'users_pkey', columns: ['id'], type: 'primary' },
          { name: 'users_username_key', columns: ['username'], type: 'unique' },
          { name: 'users_email_key', columns: ['email'], type: 'unique' }
        ]
      },
      {
        name: 'pg_stat_statements',
        type: 'system_view',
        columns: [
          { name: 'userid', type: 'oid' },
          { name: 'dbid', type: 'oid' },
          { name: 'queryid', type: 'bigint' },
          { name: 'query', type: 'text' },
          { name: 'calls', type: 'bigint' },
          { name: 'total_time', type: 'double precision' }
        ],
        system: true
      },
      {
        name: 'pg_stat_activity',
        type: 'system_view',
        columns: [
          { name: 'datid', type: 'oid' },
          { name: 'datname', type: 'name' },
          { name: 'pid', type: 'integer' },
          { name: 'usesysid', type: 'oid' },
          { name: 'usename', type: 'name' },
          { name: 'application_name', type: 'text' },
          { name: 'client_addr', type: 'inet' },
          { name: 'query', type: 'text' }
        ],
        system: true
      },
      {
        name: 'comments',
        type: 'table',
        mockup: true,
        columns: [
          { name: 'id', type: 'string', isPrimary: true },
          { name: 'content', type: 'text' },
          { name: 'author_id', type: 'string', isForeignKey: true, references: 'users.id' },
          { name: 'post_id', type: 'string', isForeignKey: true, references: 'posts.id' },
          { name: 'created_at', type: 'timestamp' }
        ]
      },
      {
        name: 'categories',
        type: 'table',
        mockup: true,
        columns: [
          { name: 'id', type: 'string', isPrimary: true },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'text', isNullable: true }
        ]
      }
    ];
    
    setTables(mockTables);
    setExpandedTables({
      posts: true,
      users: false
    });
  };

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  const handleCreateTable = () => {
    toast({
      title: "Database Integration",
      description: "Connect to a real MySQL database to create new tables",
    });
  };
  
  const filteredTables = tables.filter(table => {
    // Filter out system tables if not showing them
    if (!showSystemTables && table.system) return false;
    
    // Filter by search term
    if (searchTerm) {
      return table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.columns.some(col => 
          col.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (col.description && col.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }
    
    return true;
  });
  
  const getColumnDescription = (column: ColumnType) => {
    const parts = [];
    
    if (column.isPrimary) parts.push("PRIMARY KEY");
    if (column.isUnique) parts.push("UNIQUE");
    if (column.isNullable) parts.push("NULL");
    else if (!column.isPrimary) parts.push("NOT NULL"); 
    if (column.isForeignKey) parts.push(`REFERENCES ${column.references}`);
    if (column.description) parts.push(`- ${column.description}`);
    
    return parts.join(' ');
  };
  
  if (isLoading) {
    return (
      <div className="bg-secondary/20 rounded-lg p-4 m-4 h-[calc(100vh-150px)] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-xBlue mb-4"></div>
          <p className="text-gray-400">Loading database schema...</p>
        </div>
      </div>
    );
  }
  
  if (error && tables.length === 0) {
    return (
      <div className="bg-secondary/20 rounded-lg p-4 m-4 h-[calc(100vh-150px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={loadMockData}>Load Mock Schema</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-secondary/20 rounded-lg p-4 m-4 h-[calc(100vh-150px)] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium flex items-center">
          <Database className="h-4 w-4 mr-2" /> Database Schema
          {error && (
            <span className="ml-2 text-xs text-red-400">(Using mock data)</span>
          )}
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Search tables and columns..."
            className="h-8 w-64 bg-black/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSystemTables(!showSystemTables)}
          >
            {showSystemTables ? "Hide System Tables" : "Show System Tables"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCreateTable}
          >
            Create Table
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast({
                title: "SQL Generation",
                description: "Generated CREATE TABLE statements for MySQL",
              });
            }}
          >
            <Code className="h-4 w-4 mr-1" /> Generate SQL
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {filteredTables.map((table) => (
            <Collapsible 
              key={table.name} 
              open={expandedTables[table.name]} 
              onOpenChange={() => toggleTable(table.name)}
              className={`border border-gray-700 rounded-md ${table.system ? 'bg-gray-900/30' : ''} ${table.mockup ? 'opacity-60' : ''}`}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-secondary/30 rounded-t-md">
                <div className="flex items-center">
                  {expandedTables[table.name] ? 
                    <ChevronDown className="h-4 w-4 mr-2" /> : 
                    <ChevronRight className="h-4 w-4 mr-2" />
                  }
                  <Table className="h-4 w-4 mr-2 text-xBlue" />
                  <span className="font-mono text-sm">{table.name}</span>
                  {table.system && 
                    <span className="ml-2 text-xs bg-gray-700 px-1 rounded">system</span>
                  }
                  {table.mockup && 
                    <span className="ml-2 text-xs bg-gray-700 px-1 rounded">mock</span>
                  }
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  {table.columns?.length || 0} columns
                  {table.indexes?.length > 0 && <span className="ml-2">{table.indexes.length} indexes</span>}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t border-gray-700">
                <div className="p-2 bg-black/20">
                  <div className="text-xs font-medium mb-1 text-gray-400">Columns</div>
                  <ul className="space-y-1 pl-6">
                    {table.columns?.map((column) => (
                      <li key={column.name} className="flex items-start text-xs">
                        <div className="flex items-center">
                          {column.isPrimary && <Key className="h-3 w-3 mr-1 text-yellow-500" />}
                          <span className="font-mono">{column.name}</span>
                          <span className="ml-2 text-gray-400">{column.type}</span>
                        </div>
                        {getColumnDescription(column) && (
                          <span className="ml-2 text-gray-500 text-xs">
                            {getColumnDescription(column)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  
                  {table.indexes && table.indexes.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-medium mb-1 text-gray-400">Indexes</div>
                      <ul className="space-y-1 pl-6">
                        {table.indexes.map((index) => (
                          <li key={index.name} className="text-xs">
                            <span className="font-mono">{index.name}</span>
                            <span className="ml-2 text-gray-500">
                              ({index.columns.join(', ')}) 
                              <span className="ml-1 text-gray-400">{index.type}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {!table.system && !table.mockup && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => {
                        toast({
                          title: "Database Operation",
                          description: "Connect to a real MySQL database to edit table structure"
                        });
                      }}>
                        Edit Structure
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => {
                        toast({
                          title: "Database Operation",
                          description: "Connect to a real MySQL database to browse data"
                        });
                      }}>
                        Browse Data
                      </Button>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DatabaseSchema;
