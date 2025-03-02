import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import React from 'react'

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: class {
    static register() {}
  },
  CategoryScale: class {},
  LinearScale: class {},
  BarElement: class {},
  Title: class {},
  Tooltip: class {},
  Legend: class {},
  ArcElement: class {},
  DoughnutController: class {}
}))

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Bar: function MockBar() {
    return React.createElement('canvas', { 'data-testid': 'bar-chart' })
  },
  Pie: function MockPie() {
    return React.createElement('canvas', { 'data-testid': 'pie-chart' })
  }
}))

// Cleanup after each test
afterEach(() => {
  cleanup()
})
