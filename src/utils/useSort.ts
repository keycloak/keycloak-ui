import { useMemo } from "react";

import { useWhoAmI } from "../context/whoami/WhoAmI";

export type ItemKey<T> = keyof T;

export default function useSort<T>(
  data: T[],
  key?: ItemKey<T>,
  dependencies?: []
) {
  useMemo(() => useLocalSort(key)(data), dependencies || data);
  return data;
}

export function useLocalSort<T>(key?: ItemKey<T>) {
  return (data: T[]) => data.sort(useLocalSortFunction(key));
}

export function useLocalSortFunction<T>(key?: ItemKey<T>) {
  const { whoAmI } = useWhoAmI();

  return (a: T, b: T) =>
    `${key ? a[key] : a}`.localeCompare(
      `${key ? b[key] : b}`,
      whoAmI.getLocale()
    );
}
