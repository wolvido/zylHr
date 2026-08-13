export const colors = {
  ink: '#0F172A',
  text: '#1E293B',
  muted: '#64748B',
  subtle: '#94A3B8',
  border: '#DCE3EE',
  borderStrong: '#CBD5E1',
  canvas: '#F5F7FB',
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAFC',
  blue: '#155EEF',
  blueDark: '#1849A9',
  blueSoft: '#EFF4FF',
  green: '#079455',
  greenSoft: '#ECFDF3',
  amber: '#DC6803',
  amberSoft: '#FFFAEB',
  red: '#D92D20',
  redSoft: '#FEF3F2',
  violet: '#6938EF',
  violetSoft: '#F4F3FF',
};

export const radii = { sm: 4, md: 6, lg: 10, xl: 14, full: 999 };

export const shadow = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

export const money = (cents: number) =>
  `₱${(cents / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const number = (value: number) => value.toLocaleString('en-PH');
