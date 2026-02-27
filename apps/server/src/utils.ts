export const JWT_SECRET = process.env.JWT_SECRET || 'secret'

/**
 * BigInt を含む可能性のあるオブジェクトを JSON シリアライズ可能な形に変換する。
 * Prisma は id 等に BigInt を返すことがあるため、文字列に変換して渡す。
 */
export function serializeBigInt<T>(data: T): T {
    return JSON.parse(
        JSON.stringify(data, (_, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )
    )
}
