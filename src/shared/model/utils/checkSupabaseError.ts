export function checkSupabaseError<T>(data: T, error: unknown, context?: string): T {
  if (error) {
    if (context) {
      console.error(`[${context}] Supabase 에러:`, error)
    } else {
      console.error('Supabase 에러:', error)
    }
    throw error
  }
  return data
}
