import '@testing-library/jest-dom/vitest'

class MockResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
;(global as any).ResizeObserver = MockResizeObserver

process.env.SLACK_WEBHOOK =
  'https://hooks.slack.com/services/TEST_SLACK_WEBHOOK'
