// mapErrorMessage.ts

type SupaShapeError = { message: string; status?: number }

function isSupaError(e: unknown): e is SupaShapeError {
  if (typeof e !== 'object' || e === null) return false
  const obj = e as Record<string, unknown>
  return (
    typeof obj.message === 'string' && (obj.status === undefined || typeof obj.status === 'number')
  )
}

// ✅ Supabase Storage용 에러 타입 (statusCode 포함)
type SupabaseHttpError = { message: string; statusCode: string | number }

function isSupaHttpError(e: unknown): e is SupabaseHttpError {
  if (typeof e !== 'object' || e === null) return false
  const obj = e as Record<string, unknown>
  return (
    typeof obj.message === 'string' &&
    (typeof obj.statusCode === 'number' || typeof obj.statusCode === 'string')
  )
}

const STATUS_MAP: Record<number, string> = {
  400: '잘못된 요청입니다. 잠시 후 다시 시도해 주세요.',
  401: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  403: '접근 권한이 없습니다.',
  404: '요청하신 리소스를 찾을 수 없습니다.',
  409: '이미 존재하는 데이터가 있어 요청을 완료할 수 없습니다.',
  422: '유효하지 않은 입력입니다. 필드를 다시 확인해 주세요.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  503: '서비스가 일시적으로 불가능합니다. 잠시 후 다시 시도해 주세요.',
}

/* ------------------------------------------------------------------ */
/* 메시지 매핑 함수                                                 */
/* ------------------------------------------------------------------ */
export function mapErrorMessage(err: unknown): string {
  // ① 네트워크 연결 오류 (fetch 또는 network 관련)
  if (err instanceof TypeError && /fetch|network/i.test(err.message)) {
    return '네트워크 연결이 불안정합니다. 인터넷 상태를 확인해 주세요.'
  }

  // ② Supabase Storage 오류 등 (statusCode 사용)
  if (isSupaHttpError(err)) {
    const _code = typeof err.statusCode === 'string' ? parseInt(err.statusCode, 10) : err.statusCode
    return STATUS_MAP[_code] ?? `오류가 발생했습니다. (code: ${_code})`
  }

  // ③ Supabase 계열 일반 오류
  if (isSupaError(err)) {
    if (err.status !== undefined) {
      return STATUS_MAP[err.status] ?? `오류가 발생했습니다. (code: ${err.status})`
    }
    return err.message
  }

  // ④ 커스텀 애플리케이션 오류 (예: 파일 업로드 크기 초과)
  if (err instanceof Error && 'code' in err) {
    const e = err as Error & { code?: string }
    if (e.code === 'UPLOAD_TOO_LARGE') return '파일 크기가 5 MB를 초과했습니다.'
  }

  // ⑤ 포괄 처리 (정의되지 않은 기타 오류)
  return '예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
}
