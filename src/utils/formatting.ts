/**
 * Formatting utilities for SpendSense HQ
 * Supports Indian Number System (Lakh/Crore with en-IN comma grouping) when currency is INR
 * Supports Western Number System (K/M with en-US comma grouping) when currency is USD
 */

export function formatCurrencyValue(
  value: number,
  currency: 'INR' | 'USD' = 'INR',
  compact: boolean = true
): { symbol: string; text: string; full: string } {
  const symbol = currency === 'INR' ? '₹' : '$';

  if (!compact) {
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(Math.round(value));
    return { symbol, text: formatted, full: `${symbol}${formatted}` };
  }

  if (currency === 'INR') {
    const absVal = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absVal >= 10000000) {
      // Crores
      const cr = (absVal / 10000000).toFixed(2);
      return { symbol, text: `${sign}${parseFloat(cr)} Cr`, full: `${symbol}${sign}${parseFloat(cr)} Cr` };
    }
    if (absVal >= 100000) {
      // Lakhs
      const lakh = (absVal / 100000).toFixed(1);
      return { symbol, text: `${sign}${parseFloat(lakh)} L`, full: `${symbol}${sign}${parseFloat(lakh)} L` };
    }
    if (absVal >= 1000) {
      // Thousands / K
      const k = (absVal / 1000).toFixed(1);
      return { symbol, text: `${sign}${parseFloat(k)} K`, full: `${symbol}${sign}${parseFloat(k)} K` };
    }
    return { symbol, text: `${sign}${Math.round(absVal)}`, full: `${symbol}${sign}${Math.round(absVal)}` };
  } else {
    // USD formatting (M / K)
    const absVal = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absVal >= 1000000) {
      const m = (absVal / 1000000).toFixed(2);
      return { symbol, text: `${sign}${parseFloat(m)}M`, full: `${symbol}${sign}${parseFloat(m)}M` };
    }
    if (absVal >= 1000) {
      const k = (absVal / 1000).toFixed(1);
      return { symbol, text: `${sign}${parseFloat(k)}K`, full: `${symbol}${sign}${parseFloat(k)}K` };
    }
    return { symbol, text: `${sign}${Math.round(absVal)}`, full: `${symbol}${sign}${Math.round(absVal)}` };
  }
}

export function formatMetricNumber(
  value: number,
  currency: 'INR' | 'USD' = 'INR',
  compact: boolean = true
): string {
  if (!compact) {
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  }

  const absVal = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (currency === 'INR') {
    if (absVal >= 10000000) {
      return `${sign}${(absVal / 10000000).toFixed(2)} Cr`;
    }
    if (absVal >= 100000) {
      return `${sign}${(absVal / 100000).toFixed(2)} L`;
    }
    if (absVal >= 1000) {
      return `${sign}${(absVal / 1000).toFixed(1)} K`;
    }
    return `${sign}${Math.round(absVal)}`;
  } else {
    if (absVal >= 1000000) {
      return `${sign}${(absVal / 1000000).toFixed(1)}M`;
    }
    if (absVal >= 1000) {
      return `${sign}${(absVal / 1000).toFixed(1)}K`;
    }
    return `${sign}${Math.round(absVal)}`;
  }
}

export function formatAxisCurrency(value: number, currency: 'INR' | 'USD' = 'INR'): string {
  const symbol = currency === 'INR' ? '₹' : '$';
  if (value === 0) return `${symbol}0`;

  if (currency === 'INR') {
    if (value >= 10000000) return `${symbol}${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `${symbol}${(value / 100000).toFixed(0)}L`;
    if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
    return `${symbol}${value}`;
  } else {
    if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
    return `${symbol}${value}`;
  }
}

export function formatAxisNumber(value: number, currency: 'INR' | 'USD' = 'INR'): string {
  if (value === 0) return '0';
  if (currency === 'INR') {
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return `${value}`;
  } else {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return `${value}`;
  }
}
