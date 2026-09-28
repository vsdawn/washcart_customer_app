import en from './en.json';

type Dictionary = typeof en;

let currentLocale = 'en';

export const t = (keyPath: string, params?: Record<string, string | number>): string => {
  const keys = keyPath.split('.');
  let current: any = en;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return keyPath; // fallback to key path if missing
    }
  }

  if (typeof current === 'string' && params) {
    let text = current;
    Object.keys(params).forEach(p => {
      text = text.replace(new RegExp(`{{${p}}}`, 'g'), String(params[p]));
    });
    return text;
  }

  return typeof current === 'string' ? current : keyPath;
};

export const setLocale = (locale: string) => {
  currentLocale = locale;
};

export const getLocale = () => currentLocale;

export default { t, setLocale, getLocale };
