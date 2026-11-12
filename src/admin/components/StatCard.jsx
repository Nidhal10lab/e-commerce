export function StatCard({ title, value, icon: Icon, change, trend = 'up', color = 'navy' }) {
  const colorMap = {
    navy: {
      bg: 'bg-[#263D70]/10',
      icon: 'text-[#263D70]',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
    },
  }

  const currentTheme = colorMap[color] || colorMap.navy

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </h3>
          {change && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                  trend === 'up'
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-rose-700 bg-rose-50'
                }`}
              >
                {trend === 'up' ? '↑' : '↓'} {change}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${currentTheme.bg}`}>
          <Icon className={`w-7 h-7 ${currentTheme.icon}`} />
        </div>
      </div>
    </div>
  )
}

