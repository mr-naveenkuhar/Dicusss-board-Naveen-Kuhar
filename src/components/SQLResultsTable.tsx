import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FileSpreadsheet, SortAsc, SortDesc } from 'lucide-react';

interface SQLResultsTableProps {
  results: Record<string, unknown>[];
  isLoading: boolean;
  error: string | null;
}

const SQLResultsTable: React.FC<SQLResultsTableProps> = ({ results, isLoading, error }) => {
  // Hooks at the top, always in the same order
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filter, setFilter] = useState("");

  // Safely derive headers
  const headers = React.useMemo(() => {
    if (!results || results.length === 0) {
      return [];
    }
    return Object.keys(results[0]);
  }, [results]);

  // Sort results based on sortConfig
  const sortedResults = React.useMemo(() => {
    if (!results) return [];
    if (!sortConfig) return results;

    return [...results].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return bValue > aValue ? 1 : -1;
      }
    });
  }, [results, sortConfig]);

  // Filter results by any column
  const filteredResults = React.useMemo(() => {
    if (!sortedResults || sortedResults.length === 0) {
      return [];
    }
    if (!filter) {
      return sortedResults;
    }
    return sortedResults.filter(row =>
      headers.some(header => {
        const value = row[header];
        return value && String(value).toLowerCase().includes(filter.toLowerCase());
      })
    );
  }, [sortedResults, filter, headers]);

  // Request sort on a specific column
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (header: string) => {
    if (!sortConfig || sortConfig.key !== header) {
      return null;
    }
    return sortConfig.direction === 'asc'
      ? <SortAsc className="inline h-3 w-3 ml-1" />
      : <SortDesc className="inline h-3 w-3 ml-1" />;
  };

  // Conditional UI states after all hooks
  if (isLoading) {
    return (
      <div className="bg-secondary/10 rounded-lg p-12 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-xBlue mb-4"></div>
          <p className="text-gray-400">Executing query...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
        <h3 className="text-red-400 font-medium mb-2">Error executing query</h3>
        <p className="text-sm text-gray-300">{error}</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-secondary/10 rounded-lg p-6 text-center">
        <p className="text-gray-400">No results found</p>
      </div>
    );
  }

  // Render final table
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <Input
            placeholder="Filter results..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-64 h-8 bg-black/30"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Save className="h-4 w-4 mr-1" /> Save View
          </Button>
          <Button size="sm" variant="outline">
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-gray-700 bg-secondary/10">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableCaption>
              {filteredResults.length} of {results.length} rows shown
              {filter && ` (filtered by "${filter}")`}
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-secondary/30 border-gray-700">
                {headers.map(header => (
                  <TableHead
                    key={header}
                    className="text-white cursor-pointer hover:bg-gray-700"
                    onClick={() => requestSort(header)}
                  >
                    {header} {getSortIcon(header)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-secondary/30 border-gray-700">
                  {headers.map(header => {
                    const cellValue = row[header];
                    let displayValue: string;

                    if (cellValue === null || cellValue === undefined) {
                      displayValue = 'NULL';
                    } else if (typeof cellValue === 'object') {
                      displayValue = JSON.stringify(cellValue);
                    } else if (typeof cellValue === 'boolean') {
                      displayValue = cellValue ? 'true' : 'false';
                    } else {
                      displayValue = String(cellValue);
                    }

                    return (
                      <TableCell
                        key={`${rowIndex}-${header}`}
                        className={`font-mono text-xs ${
                          cellValue === null ? 'text-gray-500 italic' : ''
                        }`}
                      >
                        {displayValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SQLResultsTable;