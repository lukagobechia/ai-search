
import { ExchangeProgramQuery, ExchangeProgramResponse } from '../types/exchangeProgram';

class ExchangeProgramApiService {
  private baseUrl = 'http://localhost:3000';

  async searchPrograms(query: ExchangeProgramQuery): Promise<ExchangeProgramResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/exchange-programs/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }
}

export const exchangeProgramApi = new ExchangeProgramApiService();
