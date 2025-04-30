export function PageLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="border-c300 border-t-c700 h-12 w-12 animate-spin rounded-full border-4" />
      <span className="text-c400 ml-4 text-lg">로딩 중...</span>
    </div>
  )
}
