import { useMemo } from "react";

import { useWhoAmI } from "../context/whoami/WhoAmI";

export type ItemKey<T> = keyof T;

type SortProps<T> = {
  data: T[];
  key?: ItemKey<T>;
  dependencies?: [];
};

export default function useSort<T>({ data, key, dependencies }: SortProps<T>) {
  const { whoAmI } = useWhoAmI();
  useMemo(() => {
    data.sort((a, b) =>
      `${key ? a[key] : a}`.localeCompare(
        `${key ? b[key] : b}`,
        whoAmI.getLocale()
      )
    );
  }, dependencies || data);
  return data;
}
