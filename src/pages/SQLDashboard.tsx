import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Database, Edit, Table, Code, 
  Save, FileSpreadsheet, TableProperties, Filter, Search, LayoutDashboard, DatabaseZap
} from 'lucide-react';
import MainNavigation from '@/components/MainNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import SQLQueryEditor from '@/components/SQLQueryEditor';
import SQLResultsTable from '@/components/SQLResultsTable';
import DatabaseSchema from '@/components/DatabaseSchema';
import { executeQuery } from '@/services/sqlService';
import {
  Table as TableComponent,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryResult = Record<string, any>;

const SQLDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Only fetch posts if you want to show them as a default/fallback
  // Remove this if you want to show only SQL data
  // const { data: posts, isLoading } = useQuery({
  //   queryKey: ['posts'],
  //   queryFn: fetchPosts,
  // });

  const handleExecuteQuery = async (query: string) => {
    setIsQueryLoading(true);
    setQueryError(null);

    try {
      const response = await executeQuery(query);
      if (response.success && response.results) {
        setQueryResults(response.results);
      } else {
        setQueryError(response.message || "Unknown error executing query");
        setQueryResults([]);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setQueryError(errorMessage || "Unknown error executing query");
      setQueryResults([]);
    } finally {
      setIsQueryLoading(false);
    }
  };

  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
    const query = `SELECT * FROM ${tableName} LIMIT 10;`;
    handleExecuteQuery(query);
  };

  // Optional: implement search/filter for SQL results if needed
  // This example just re-queries the table
  const handleFilterTable = () => {
    if (selectedTable) {
      const query = `SELECT * FROM ${selectedTable} WHERE CONCAT_WS(' ', ${Object.keys(queryResults[0] || {}).join(', ')}) LIKE '%${searchTerm}%' LIMIT 10;`;
      handleExecuteQuery(query);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-xBackground text-white flex">
        <div className="w-64 border-r border-gray-700 h-screen sticky top-0">
          <MainNavigation />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access the SQL Dashboard</h1>
          <Button asChild className="bg-xBlue hover:bg-xBlue/80">
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <MainNavigation />
      <div className="container mt-4">
        <h1 className="mb-4 text-white">SQL Dashboard</h1>

        <div className="mb-4">
          <SQLQueryEditor 
            onExecuteQuery={handleExecuteQuery}
            isLoading={isQueryLoading}
          />
        </div>

        <div className="mb-4">
          <Tabs defaultValue="query" className="w-full">
            <TabsList className="grid w-full grid-cols-3 p-4">
              <TabsTrigger value="query" className="flex items-center">
                <Code className="mr-2 h-4 w-4" /> SQL Query Editor
              </TabsTrigger>
              <TabsTrigger value="tables" className="flex items-center">
                <Table className="mr-2 h-4 w-4" /> Data Explorer
              </TabsTrigger>
              <TabsTrigger value="schema" className="flex items-center">
                <Database className="mr-2 h-4 w-4" /> Database Schema
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="query" className="mt-0">
              <ResizablePanelGroup direction="vertical" className="min-h-[calc(100vh-150px)]">
                <ResizablePanel defaultSize={40} minSize={30}>
                  <div className="bg-secondary/20 rounded-lg p-4 m-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">SQL Query Editor</h2>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex items-center">
                          <LayoutDashboard className="h-4 w-4 mr-1" /> Saved Queries
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center">
                          <TableProperties className="h-4 w-4 mr-1" /> Query Templates
                        </Button>
                      </div>
                    </div>
                    
                    <SQLQueryEditor 
                      onExecuteQuery={handleExecuteQuery}
                      isLoading={isQueryLoading}
                    />
                    
                    <div className="mt-2 text-xs text-gray-400">
                      <p>Advanced features: Try queries like "SHOW TABLES", "DESCRIBE posts", or use WHERE/ORDER BY clauses</p>
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel>
                  <div className="bg-secondary/20 rounded-lg p-4 m-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Query Results</h2>
                      <div className="text-sm text-gray-400">
                        {queryResults.length > 0 && !queryError && (
                          <span>{queryResults.length} rows returned</span>
                        )}
                      </div>
                    </div>
                    <SQLResultsTable 
                      results={queryResults}
                      isLoading={isQueryLoading}
                      error={queryError}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </TabsContent>
            
            <TabsContent value="tables" className="mt-0">
              <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-150px)]">
                <ResizablePanel defaultSize={25} minSize={15}>
                  <div className="bg-secondary/20 rounded-lg p-4 m-4">
                    <h2 className="text-lg font-semibold mb-4">Database Tables</h2>
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-left"
                        onClick={() => handleSelectTable('posts')}
                      >
                        <TableProperties className="h-4 w-4 mr-2" />
                        posts
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-left"
                        onClick={() => handleSelectTable('users')}
                      >
                        <TableProperties className="h-4 w-4 mr-2" />
                        users
                      </Button>
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={75}>
                  <div className="bg-secondary/20 rounded-lg p-4 m-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">{selectedTable ? `${selectedTable} Data` : 'Select a table'}</h2>
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder="Search data..."
                          className="w-64 h-8 bg-black/30"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button size="sm" variant="outline" onClick={handleFilterTable}>
                          <Search className="h-4 w-4 mr-1" /> Search
                        </Button>
                        <Button size="sm" variant="outline">
                          <Filter className="h-4 w-4 mr-1" /> Filter
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-md border border-gray-700">
                      <TableComponent>
                        <TableCaption>A list of {selectedTable || 'tables'} in the database.</TableCaption>
                        <TableHeader>
                          <TableRow className="hover:bg-secondary/30 border-gray-700">
                            {queryResults[0] &&
                              Object.keys(queryResults[0]).map((header) => (
                                <TableHead key={header} className="text-white">{header}</TableHead>
                              ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queryResults.map((row, idx) => (
                            <TableRow key={row.id || idx} className="hover:bg-secondary/30 border-gray-700">
                              {Object.keys(row).map((header) => (
                                <TableCell key={header} className="font-mono">
                                  {typeof row[header] === 'object'
                                    ? JSON.stringify(row[header])
                                    : String(row[header])}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </TableComponent>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </TabsContent>
            
            <TabsContent value="schema" className="mt-0">
              <DatabaseSchema />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SQLDashboard;