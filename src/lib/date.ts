/**
 * Asia/Dhaka Timezone formatting utilities for Bangladesh Healthcare
 */

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumerals(input: number | string): string {
  return String(input).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)] || digit);
}

export function formatDhakaDateTime(dateInput: Date | string = new Date(), language: 'bn' | 'en' = 'bn'): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  // Format in Asia/Dhaka timezone
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: language === 'bn' ? 'long' : 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const locale = language === 'bn' ? 'bn-BD' : 'en-US';
  const formatted = new Intl.DateTimeFormat(locale, options).format(date);

  return `${formatted} (BST / বাংলাদেশ সময়)`;
}

export function formatDhakaDateOnly(dateInput: Date | string = new Date(), language: 'bn' | 'en' = 'bn'): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: language === 'bn' ? 'long' : 'short',
    day: 'numeric',
  };

  const locale = language === 'bn' ? 'bn-BD' : 'en-US';
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function generateReportId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `DOC-BD-${year}-${randomSuffix}`;
}
