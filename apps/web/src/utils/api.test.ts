import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch } from './api';

// `fetch` のグローバルモックを作成
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('apiFetch utility', () => {
    beforeEach(() => {
        // テスト毎にモックをリセット
        mockFetch.mockReset();
    });

    it('should make an API call with default headers', async () => {
        // Mock successful response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: 'success' })
        });

        const result = await apiFetch('/test-endpoint');

        // URLが正しく構築されていること（環境変数 VITE_API_URL のフォールバック値が http://localhost:4000/api）
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/test-endpoint', expect.objectContaining({
            headers: expect.objectContaining({
                'Content-Type': 'application/json'
            })
        }));

        // JSONデータが返されること
        expect(result).toEqual({ data: 'success' });
    });

    it('should throw an error with API message if response is not ok', async () => {
        // Mock error response
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Invalid credentials' })
        });

        await expect(apiFetch('/login', { method: 'POST' })).rejects.toThrow('Invalid credentials');
    });

    it('should throw a fallback error message if no error explicitly returned', async () => {
        // Mock error response without specific error field
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({})
        });

        await expect(apiFetch('/resource')).rejects.toThrow('Request failed');
    });
});
