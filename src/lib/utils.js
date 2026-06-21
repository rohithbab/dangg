export function formatRupees(paisa) {
  if (!paisa) return '₹0.00'
  return '₹' + (paisa / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatDate(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatPhone(phone) {
  if (!phone) return '—'
  const digits = phone.replace(/\D/g, '').slice(-10)
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  return phone
}

export function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export function shortId(uuid) {
  if (!uuid) return '—'
  return uuid.substring(0, 8).toUpperCase()
}
