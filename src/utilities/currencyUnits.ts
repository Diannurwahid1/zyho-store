const USD_DECIMALS_FACTOR = 100

export const usdDecimalToBaseUnits = (value: number): number => {
  return Math.round(value * USD_DECIMALS_FACTOR)
}

export const usdBaseUnitsToDecimal = (value: number): number => {
  return Number((value / USD_DECIMALS_FACTOR).toFixed(2))
}

export const normalizeStoredUSDToBaseUnits = (value: null | number | undefined): null | number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return null
  }

  if (Number.isInteger(value)) {
    return Math.round(value)
  }

  return usdDecimalToBaseUnits(value)
}
