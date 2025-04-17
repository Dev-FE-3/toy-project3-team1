import { useCallback, useEffect, useState } from 'react'
import { type Metric, onCLS, onINP, onLCP } from 'web-vitals'
import { reportWebVitals } from './reportWebVitals'

// 개발 환경에서만 사용
const isDevelopment = import.meta.env.DEV

interface MetricData {
  name: string
  value: number | null
  rating: '좋음' | '개선 필요' | '나쁨' | '측정 중'
  lastUpdated: string | null
  entries?: number
  elementInfo?: string
}

const METRICS = {
  LCP: {
    name: 'LCP (Largest Contentful Paint)',
    description: `가장 큰 콘텐츠(이미지/텍스트 블록)가 표시되는 시점 - 로드 완료까지 계속 업데이트`,
    threshold: { good: 2500, needsImprovement: 4000 },
    unit: 'ms',
    criteria: { good: '2500ms', needsImprovement: '4000ms' },
  },
  INP: {
    name: 'INP (Interaction to Next Paint)',
    description:
      '페이지의 전반적인 응답성 - 모든 사용자 상호작용(클릭, 탭, 키보드)에 대한 지연 시간 - 페이지 종료까지 계속 측정됨 ',
    threshold: { good: 200, needsImprovement: 500 },
    unit: 'ms',
    criteria: { good: '200ms', needsImprovement: '500ms' },
  },
  CLS: {
    name: 'CLS (Cumulative Layout Shift)',
    description:
      '페이지 로드 중 발생하는 레이아웃 이동 정도 - 시각적 안정성 측정 - 레이아웃 변경 시 누적 측정 ',
    threshold: { good: 0.1, needsImprovement: 0.25 },
    unit: '',
    criteria: { good: '0.100', needsImprovement: '0.250' },
  },
}

const WebVitalsMonitorContent = () => {
  const [metrics, setMetrics] = useState<Record<string, MetricData>>(() =>
    Object.keys(METRICS).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          name: key,
          value: null,
          rating: '측정 중',
          lastUpdated: null,
          entries: 0,
        },
      }),
      {},
    ),
  )

  const getRating = useCallback((name: string, value: number): '좋음' | '개선 필요' | '나쁨' => {
    const threshold = METRICS[name as keyof typeof METRICS].threshold
    if (value <= threshold.good) return '좋음'
    if (value <= threshold.needsImprovement) return '개선 필요'
    return '나쁨'
  }, [])

  const getElementInfo = useCallback((entry: PerformanceEntry | undefined): string => {
    if (!entry || !('element' in entry)) return ''
    const element = (entry as { element: HTMLElement | null }).element
    if (!element) return ''

    if (element instanceof HTMLImageElement) {
      return `이미지 ${element.src ? `(${element.src.split('/').pop()})` : ''}`
    }
    if (element instanceof HTMLVideoElement) {
      return '비디오 요소'
    }
    if (element instanceof HTMLElement) {
      const text = element.textContent?.slice(0, 20)
      return text
        ? `텍스트 "${text}${text.length > 20 ? '...' : ''}"`
        : element.tagName.toLowerCase()
    }
    return ''
  }, [])

  const handleMetric = useCallback(
    (metric: Metric) => {
      const now = new Date().toLocaleTimeString()
      let value = metric.value

      // 값 보정 및 유효성 검사
      if (metric.name === 'CLS') {
        value = Math.round(value * 1000) / 1000 // 소수점 3자리까지
        if (value < 0) value = 0 // 음수 방지
      } else {
        value = Math.max(0, Math.round(value)) // 음수 방지 및 반올림
      }

      setMetrics((prev) => {
        const currentMetric = prev[metric.name]
        const entries = (currentMetric.entries || 0) + 1

        // 각 메트릭별 특수 처리
        if (metric.name === 'LCP') {
          const elementInfo = getElementInfo(metric.entries[metric.entries.length - 1])
          // 이전 값이 더 크면 업데이트하지 않음
          if (currentMetric.value !== null && value < currentMetric.value) {
            return prev
          }
          return {
            ...prev,
            [metric.name]: {
              ...currentMetric,
              value,
              rating: getRating(metric.name, value),
              lastUpdated: now,
              entries,
              elementInfo: `측정된 최대 요소: ${elementInfo || '측정된 요소 없음'} (${value}ms)`,
            },
          }
        }

        if (metric.name === 'INP') {
          const newValue =
            currentMetric.value !== null ? Math.max(value, currentMetric.value) : value
          const interactionCount = metric.entries.length
          const currentInteraction = Math.round(value)

          return {
            ...prev,
            [metric.name]: {
              ...currentMetric,
              value: newValue,
              rating: getRating(metric.name, newValue),
              lastUpdated: now,
              entries: interactionCount,
              elementInfo: `현재 상호작용: ${currentInteraction}ms / 최대값: ${Math.round(newValue)}ms`,
            },
          }
        }

        if (metric.name === 'CLS') {
          // 미미한 변화는 무시
          if (currentMetric.value !== null && Math.abs(value - currentMetric.value) < 0.001) {
            return prev
          }
          return {
            ...prev,
            [metric.name]: {
              ...currentMetric,
              value,
              rating: getRating(metric.name, value),
              lastUpdated: now,
              entries: value > (currentMetric.value || 0) ? entries : currentMetric.entries,
              elementInfo: `누적 시프트: ${value.toFixed(3)} / 측정 횟수: ${entries}`,
            },
          }
        }

        return {
          ...prev,
          [metric.name]: {
            ...currentMetric,
            value,
            rating: getRating(metric.name, value),
            lastUpdated: now,
            entries,
          },
        }
      })
    },
    [getRating, getElementInfo],
  )

  useEffect(() => {
    // LCP는 모든 변경사항 보고
    onLCP(handleMetric, { reportAllChanges: true })

    // CLS는 의미있는 변화만 보고
    onCLS(handleMetric)

    // INP도 모든 상호작용 보고
    onINP(handleMetric, { reportAllChanges: true })
  }, [handleMetric])

  useEffect(() => {
    const handleWebVitals = (metric: Metric) => {
      // metric.name은 'CLS', 'LCP', 'INP' 중 하나입니다
      // metric.value는 실제 측정값입니다
      console.log(`[Web Vitals] ${metric.name}: ${metric.value}`)

      // 여기에 원하는 분석 도구로 데이터를 보내는 로직을 추가할 수 있습니다
      // 예: Google Analytics, Custom Analytics 등
    }

    reportWebVitals(handleWebVitals)
  }, [])

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case '좋음':
        return 'bg-green-100 text-green-800'
      case '개선 필요':
        return 'bg-yellow-100 text-yellow-800'
      case '나쁨':
        return 'bg-red-100 text-red-800'
      case '측정 중':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatValue = useCallback((value: number | null, metricName: string) => {
    if (value === null) return '측정 중...'
    if (metricName === 'CLS') return value.toFixed(3)
    return Math.round(value).toString()
  }, [])

  if (Object.keys(metrics).length === 0) {
    return (
      <div className="fixed bottom-4 left-4 z-50 rounded-lg bg-white p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <span>Web Vitals 측정 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md rounded-lg bg-white p-4 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold">Web Vitals 모니터링</h2>
      <div className="space-y-4">
        {Object.entries(metrics).map(([key, metric]) => {
          const metricInfo = METRICS[key as keyof typeof METRICS]
          return (
            <div key={key} className="rounded-lg border p-3">
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{metricInfo.name}</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${getRatingColor(metric.rating)}`}
                  >
                    {metric.rating}
                    {metric.name === 'INP' && ' (실시간)'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{metricInfo.description}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span>좋음: ≤{metricInfo.criteria.good}</span>
                  <span>•</span>
                  <span>개선 필요: ≤{metricInfo.criteria.needsImprovement}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>
                    측정값: {formatValue(metric.value, metric.name)}
                    {metric.value !== null ? metricInfo.unit : ''}
                  </span>
                  {metric.name === 'INP' && (
                    <span className="text-xs text-gray-500">
                      (상호작용 수: {metric.entries || 0})
                    </span>
                  )}
                  {metric.name === 'CLS' && (
                    <span className="text-xs text-gray-500">
                      (측정 횟수: {metric.entries || 0})
                    </span>
                  )}
                </div>
                {metric.elementInfo && (metric.name === 'LCP' || metric.name === 'INP') && (
                  <span className="text-xs text-gray-500">{metric.elementInfo}</span>
                )}
                {metric.lastUpdated && (
                  <span className="text-xs text-gray-500">최근 측정: {metric.lastUpdated}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const WebVitalsMonitor = () => {
  if (!isDevelopment) {
    return null
  }

  return <WebVitalsMonitorContent />
}

export default WebVitalsMonitor
