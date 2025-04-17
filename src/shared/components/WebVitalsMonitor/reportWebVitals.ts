import { type Metric, onCLS, onINP, onLCP } from 'web-vitals'

export const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Core Web Vitals만 측정
    onLCP(onPerfEntry) // Largest Contentful Paint
    onCLS(onPerfEntry) // Cumulative Layout Shift
    onINP(onPerfEntry) // Interaction to Next Paint
  }
}
