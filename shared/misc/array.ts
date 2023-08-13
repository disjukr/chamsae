export function addArrayItem<T>(array: T[], target: T): boolean {
  if (array.includes(target)) return false;
  array.push(target);
  return true;
}

export function removeArrayItem<T>(array: T[], target: T): boolean {
  return findAndRemoveArrayItem(array, (item) => item === target);
}

export function findAndRemoveArrayItem<T>(
  array: T[],
  findFn: (item: T) => boolean,
): boolean {
  const idx = array.findIndex(findFn);
  if (idx < 0) return false;
  array.splice(idx, 1);
  return true;
}
