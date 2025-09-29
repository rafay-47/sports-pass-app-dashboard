/**
 * Base API service class with common functionality
 */
export class BaseApiService {
  protected baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    //console.log('BaseApiService - Token from localStorage:', token);
    //console.log('BaseApiService - localStorage available:', typeof window !== 'undefined');

    if (typeof window !== 'undefined') {
      //console.log('BaseApiService - localStorage keys:', Object.keys(localStorage));
      //console.log('BaseApiService - authToken value:', localStorage.getItem('authToken'));
    }

    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      //console.log('BaseApiService - Auth headers:', headers);
      return headers;
    }
    //console.log('BaseApiService - No token found, user may need to log in');
    return {};
  }

  /**
   * Generic GET request
   */
  protected async get<T>(endpoint: string): Promise<T> {
    try {
      console.log(`BaseApiService - Making GET request to: ${this.baseUrl}${endpoint}`);
      console.log(`BaseApiService - Auth headers:`, this.getAuthHeaders());
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });

      console.log(`BaseApiService - Response status: ${response.status}`);
      console.log(`BaseApiService - Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`BaseApiService - Error response body:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log(`BaseApiService - Raw response data:`, JSON.stringify(data, null, 2));
      
      // Handle API response format
      if (data.status === 'error') {
        throw new Error(data.message || 'API request failed');
      }
      
      const result = data.data || data;
      console.log(`BaseApiService - Processed result:`, JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error(`API GET error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Generic POST request
   */
  protected async post<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API POST error for ${endpoint}! status: ${response.status}, response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      // Handle API response format
      if (responseData.status === 'error') {
        throw new Error(responseData.message || 'API request failed');
      }
      
      return responseData.data || responseData;
    } catch (error) {
      console.error(`API POST error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Generic PUT request
   */
  protected async put<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      // Handle API response format
      if (responseData.status === 'error') {
        throw new Error(responseData.message || 'API request failed');
      }
      
      return responseData.data || responseData;
    } catch (error) {
      console.error(`API PUT error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Generic DELETE request
   */
  protected async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      // Handle API response format
      if (responseData.status === 'error') {
        throw new Error(responseData.message || 'API request failed');
      }
      
      return responseData.data || responseData;
    } catch (error) {
      console.error(`API DELETE error for ${endpoint}:`, error);
      throw error;
    }
  }
}
