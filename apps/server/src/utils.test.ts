import { describe, it, expect } from 'vitest';
import { serializeBigInt } from './utils.js';

describe('serializeBigInt', () => {
    it('should convert BigInt values to string within a flat object', () => {
        const input = {
            id: 1n,
            name: 'ChairSleep',
            createdAt: '2024-01-01'
        };

        const result = serializeBigInt(input);

        expect(result).toEqual({
            id: '1', // BigInt should become string
            name: 'ChairSleep',
            createdAt: '2024-01-01'
        });
        expect(typeof (result as any).id).toBe('string');
    });

    it('should convert nested BigInt values to string', () => {
        const input = {
            post: {
                id: 123n,
                metadata: {
                    viewCount: 456n,
                    likes: 10
                }
            }
        };

        const result = serializeBigInt(input);

        expect(result).toEqual({
            post: {
                id: '123',
                metadata: {
                    viewCount: '456',
                    likes: 10
                }
            }
        });
    });

    it('should handle arrays containing BigInt', () => {
        const input = [1n, 2n, 'string', 4];
        const result = serializeBigInt(input);

        expect(result).toEqual(['1', '2', 'string', 4]);
    });

    it('should return null or undefined as is', () => {
        expect(serializeBigInt(null)).toBeNull();
        expect(serializeBigInt(undefined)).toBeUndefined();
    });
});
