const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on'])

export const isMaintenanceModeEnabled = () => {
  const rawValue = process.env.MAINTENANCE_MODE?.trim().toLowerCase()

  return rawValue ? TRUE_VALUES.has(rawValue) : false
}
