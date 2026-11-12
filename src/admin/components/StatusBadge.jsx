export function StatusBadge({ status, type = 'order' }) {
  if (type === 'user') {
    const isBlocked = status === true || status === 'blocked' || status === 'Blocked'
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          isBlocked
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
            isBlocked ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
        />
        {isBlocked ? 'Blocked' : 'Active'}
      </span>
    )
  }

  if (type === 'stock') {
    const stock = Number(status)
    let label
    let style
    let dot

    if (stock <= 0) {
      label = 'Out of Stock'
      style = 'bg-rose-50 text-rose-700 border-rose-200'
      dot = 'bg-rose-500'
    } else if (stock < 15) {
      label = `Low Stock (${stock})`
      style = 'bg-amber-50 text-amber-700 border-amber-200'
      dot = 'bg-amber-500'
    } else {
      label = `In Stock (${stock})`
      style = 'bg-emerald-50 text-emerald-700 border-emerald-200'
      dot = 'bg-emerald-500'
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
      >
        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${dot}`} />
        {label}
      </span>
    )
  }

  // Default: order status
  const normalized = String(status || 'Confirmed').toLowerCase()
  const styles = {
    confirmed: {
      label: 'Confirmed',
      classes: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    processing: {
      label: 'Processing',
      classes: 'bg-purple-50 text-purple-700 border-purple-200',
      dot: 'bg-purple-500',
    },
    shipped: {
      label: 'Shipped',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    },
    delivered: {
      label: 'Delivered',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    cancelled: {
      label: 'Cancelled',
      classes: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
    },
  }

  const current = styles[normalized] || styles.confirmed

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.classes}`}
    >
      <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  )
}
