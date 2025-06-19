import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import type { ChartConfig } from '../types'

interface ChartGeneratorProps {
  chartConfig: ChartConfig
  data: unknown[][]
  columns: string[]
}

export function ChartGenerator({
  chartConfig,
  data,
  columns,
}: ChartGeneratorProps) {
  // Transform raw data into chart-friendly format
  const transformData = () => {
    if (!data || data.length === 0) return []

    return data.map((row) => {
      const item: Record<string, unknown> = {}
      columns.forEach((col, index) => {
        item[col] = row[index]
      })
      return item
    })
  }

  const chartData = transformData()

  const getChartIcon = () => {
    switch (chartConfig.type) {
      case 'bar':
        return <BarChart3 className="h-5 w-5" />
      case 'line':
        return <LineChartIcon className="h-5 w-5" />
      case 'pie':
        return <PieChartIcon className="h-5 w-5" />
      case 'scatter':
        return <TrendingUp className="h-5 w-5" />
      case 'area':
        return <TrendingUp className="h-5 w-5" />
      default:
        return <BarChart3 className="h-5 w-5" />
    }
  }

  const getChartTypeLabel = () => {
    switch (chartConfig.type) {
      case 'bar':
        return 'Bar Chart'
      case 'line':
        return 'Line Chart'
      case 'pie':
        return 'Pie Chart'
      case 'scatter':
        return 'Scatter Plot'
      case 'area':
        return 'Area Chart'
      default:
        return 'Chart'
    }
  }

  const colors = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7300',
    '#8dd1e1',
    '#d084d0',
    '#87d068',
    '#ffc0cb',
    '#ffb347',
    '#dda0dd',
  ]

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="text-muted-foreground flex h-64 items-center justify-center">
          No data available for chart
        </div>
      )
    }

    const commonProps = {
      width: '100%',
      height: 300,
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    }

    switch (chartConfig.type) {
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={chartConfig.xAxis}
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {chartConfig.yAxis?.map((yField, index) => (
                <Bar
                  key={yField}
                  dataKey={yField}
                  fill={colors[index % colors.length]}
                  name={yField}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xAxis} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {chartConfig.yAxis?.map((yField, index) => (
                <Line
                  key={yField}
                  type="monotone"
                  dataKey={yField}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  name={yField}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xAxis} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {chartConfig.yAxis?.map((yField, index) => (
                <Area
                  key={yField}
                  type="monotone"
                  dataKey={yField}
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.6}
                  name={yField}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'pie': {
        const xKey = chartConfig.xAxis || columns[0] || 'key'
        const yKey = chartConfig.yAxis?.[0] || columns[1] || 'value'
        const pieData = chartData.slice(0, 10).map((item, index) => ({
          name: item[xKey],
          value: item[yKey],
          fill: colors[index % colors.length],
        }))

        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      }

      case 'scatter':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey={chartConfig.xAxis}
                name={chartConfig.xAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey={chartConfig.yAxis?.[0]}
                name={chartConfig.yAxis?.[0]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Data Points" data={chartData} fill={colors[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <div className="text-muted-foreground flex h-64 items-center justify-center">
            Unsupported chart type: {chartConfig.type}
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getChartIcon()}
              {chartConfig.title || getChartTypeLabel()}
            </CardTitle>
            <CardDescription>
              {chartConfig.description ||
                `Visualizing ${chartData.length} data points`}
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            {getChartTypeLabel()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">{renderChart()}</div>

        {chartData.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div>
                <span className="text-muted-foreground">Data Points:</span>
                <p className="font-medium">{chartData.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">X-Axis:</span>
                <p className="font-medium">{chartConfig.xAxis || 'Auto'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Y-Axis:</span>
                <p className="font-medium">
                  {chartConfig.yAxis?.join(', ') || 'Auto'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Chart Type:</span>
                <p className="font-medium">{getChartTypeLabel()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
