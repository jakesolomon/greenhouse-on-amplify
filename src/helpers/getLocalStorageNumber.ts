export const getLocalStorageNumber = (key: string): number | undefined => {
  const val = localStorage.getItem(key);
  return val ? parseInt(val, 10) : undefined;
}
