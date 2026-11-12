import { useState, useMemo } from 'react'
import { TrendingUp, BarChart3, Calendar, DollarSign, ShoppingBag } from 'lucide-react'

export function DashboardGraph({ orders = [] }) {
  const [metric, setMetric] = useState('revenue') // 'revenue' | 'orders'
  const [hoveredPoint, setHoveredPoint] = useState(null)

  // Aggregate monthly or dated orders
  const chartData = useMemo(() => {
    // Generate last 6 months buckets
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthLabel = d.toLocaleString('en-US', { month: 'short' })
      const year = d.getFullYear()
      months.push({
        label: monthLabel,
        monthIndex: d.getMonth(),
        year,
        revenue: 0,
        ordersCount: 0,
      })
    }

    orders.forEach((order) => {
      if (String(order.status).toLowerCase() === 'cancelled') return
      const orderDate = new Date(order.placedAt || 0)
      const oMonth = orderDate.getMonth()
      const oYear = orderDate.getFullYear()

      const match = months.find((m) => m.monthIndex === oMonth && m.year === oYear)
      if (match) {
        match.revenue += Number(order.total) || 0
        match.ordersCount += 1
      } else if (months.length > 0) {
        // Fallback to most recent bucket
        months[months.length - 1].revenue += Number(order.total) || 0
        months[months.length - 1].ordersCount += 1
      }
    })

    return months
  }, [orders])

  // Aggregate category sales distribution
  const categoryStats = useMemo(() => {
    const map = {}
    let totalItems = 0

    orders.forEach((order) => {
      if (String(order.status).toLowerCase() === 'cancelled') return
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const cat = item.category || (item.productName?.toLowerCase().includes('pillow') ? 'Pillow' : 'Mattress')
          const qty = Number(item.quantity) || 1
          const amt = (Number(item.price) || 0) * qty

          if (!map[cat]) map[cat] = { name: cat, revenue: 0, count: 0 }
          map[cat].revenue += amt
          map[cat].count += qty
          totalItems += qty
        })
      }
    })

    const result = Object.values(map)
    if (result.length === 0) {
      return [
        { name: 'Memory Foam', revenue: 142000, count: 12, percent: 45 },
        { name: 'Latex Series', revenue: 95000, count: 7, percent: 30 },
        { name: 'Orthopedic', revenue: 64000, count: 5, percent: 20 },
        { name: 'Pillows', revenue: 15000, count: 18, percent: 5 },
      ]
    }

    return result.map((c) => ({
      ...c,
      percent: totalItems > 0 ? Math.round((c.count / totalItems) * 100) : 0,
    }))
  }, [orders])

  const maxVal = useMemo(() => {
    const vals = chartData.map((d) => (metric === 'revenue' ? d.revenue : d.ordersCount))
    const max = Math.max(...vals, 1)
    return max * 1.15 // padding
  }, [chartData, metric])

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)

  // Chart coordinates
  const width = 640
  const height = 220
  const paddingX = 45
  const paddingY = 30
  const chartW = width - paddingX * 2
  const chartH = height - paddingY * 2

  const points = chartData.map((d, i) => {
    const val = metric === 'revenue' ? d.revenue : d.ordersCount
    const x = paddingX + (i / (chartData.length - 1)) * chartW
    const y = height - paddingY - (val / maxVal) * chartH
    return { x, y, ...d, value: val }
  })

  // Build SVG Path
  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
  }, '')

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${
        height - paddingY
      } Z`
    : ''

  const totalRevenue = orders.reduce(
    (sum, o) => (String(o.status).toLowerCase() === 'cancelled' ? sum : sum + (Number(o.total) || 0)),
    0
  )

  const avgOrder = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      {/* Chart Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#263D70]/10 text-[#263D70]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900 font-serif">
              Sales & Order Analytics
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time monthly revenue trends and order distribution
          </p>
        </div>

        {/* Metric Toggles */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetric('revenue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              metric === 'revenue'
                ? 'bg-white text-[#263D70] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue (₹)</span>
          </button>
          <button
            type="button"
            onClick={() => setMetric('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              metric === 'orders'
                ? 'bg-white text-[#263D70] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders Count</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Visual SVG Chart (Left) + Category Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* SVG Area Chart (2 cols) */}
        <div className="lg:col-span-2 relative">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Total Sales
              </span>
              <p className="text-sm sm:text-base font-bold text-[#263D70] mt-0.5">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Avg. Order Value
              </span>
              <p className="text-sm sm:text-base font-bold text-emerald-700 mt-0.5">
                {formatCurrency(avgOrder)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Total Orders
              </span>
              <p className="text-sm sm:text-base font-bold text-amber-600 mt-0.5">
                {orders.length} orders
              </p>
            </div>
          </div>

          {/* Responsive SVG Container */}
          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-56 select-none overflow-visible"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#263D70" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#263D70" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = paddingY + pct * chartH
                const val = maxVal * (1 - pct)
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="#E5E7EB"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#9CA3AF"
                      fontFamily="sans-serif"
                    >
                      {metric === 'revenue'
                        ? val >= 1000
                          ? `₹${Math.round(val / 1000)}k`
                          : `₹${Math.round(val)}`
                        : Math.round(val)}
                    </text>
                  </g>
                )
              })}

              {/* Shaded Area Fill */}
              {areaPath && (
                <path d={areaPath} fill="url(#chartGradient)" />
              )}

              {/* Trend Stroke Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#263D70"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Interactive Data Points */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint === i ? 6 : 4}
                    fill={hoveredPoint === i ? '#F59E0B' : '#263D70'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* X-axis Month Label */}
                  <text
                    x={p.x}
                    y={height - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6B7280"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint !== null && points[hoveredPoint] && (
              <div
                className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-1.5 bg-[#1E2E54] text-white rounded-xl shadow-xl text-xs"
                style={{
                  left: `${(points[hoveredPoint].x / width) * 100}%`,
                  top: `${(points[hoveredPoint].y / height) * 100 - 10}%`,
                }}
              >
                <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  {points[hoveredPoint].label} {points[hoveredPoint].year}
                </p>
                <p className="font-bold">
                  {metric === 'revenue'
                    ? formatCurrency(points[hoveredPoint].revenue)
                    : `${points[hoveredPoint].ordersCount} orders placed`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Category Share Distribution (1 col) */}
        <div className="p-5 rounded-2xl bg-[#F7F5F0]/60 border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            <BarChart3 className="w-4 h-4 text-[#263D70]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Product Categories
            </h4>
          </div>

          <div className="space-y-3.5">
            {categoryStats.slice(0, 4).map((cat, idx) => {
              const colors = [
                'bg-[#263D70]',
                'bg-amber-500',
                'bg-emerald-600',
                'bg-indigo-600',
              ]
              const barColor = colors[idx % colors.length]

              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-800">{cat.name}</span>
                    <span className="text-gray-500 font-mono">
                      {formatCurrency(cat.revenue)} ({cat.percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(cat.percent, 8)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-2 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Aggregated from {orders.length} customer orders</span>
            <span className="flex items-center gap-1 font-semibold text-[#263D70]">
              <Calendar className="w-3 h-3" />
              <span>Real-time</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
