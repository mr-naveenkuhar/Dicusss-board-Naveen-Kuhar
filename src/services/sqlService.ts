
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://localhost:5000/api';

export interface SQLQueryResponse {
  success: boolean;
  results?: any[];
  message?: string;
  error?: string;
}

export interface SchemaResponse {
  success: boolean;
  tables?: any[];
  message?: string;
  error?: string;
}

/**
 * Execute SQL query
 */
export const executeQuery = async (query: string): Promise<SQLQueryResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/execute-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || data.error || 'Error executing query');
    }
    
    return data;
  } catch (error) {
    console.error('SQL query error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error executing query',
    };
  }
};

/**
 * Get database schema information
 */
export const getDatabaseSchema = async (): Promise<SchemaResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/schema`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || data.error || 'Error retrieving schema');
    }
    
    return data;
  } catch (error) {
    console.error('Schema retrieval error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error retrieving schema',
    };
  }
};

/**
 * Test database connection
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-connection`);
    const data = await response.json();
    
    if (data.success) {
      toast({
        title: "Database Connection",
        description: "Connected to MySQL database successfully",
      });
      return true;
    } else {
      toast({
        title: "Database Connection Failed",
        description: data.message || "Could not connect to database",
        variant: "destructive",
      });
      return false;
    }
  } catch (error) {
    console.error('Connection test error:', error);
    toast({
      title: "Database Connection Failed",
      description: error instanceof Error ? error.message : "Could not connect to database server",
      variant: "destructive",
    });
    return false;
  }
};
