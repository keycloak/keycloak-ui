import RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { PropsWithChildren, useEffect, useMemo } from "react";

import { createNamedContext } from "../utils/createNamedContext";
import useRequiredContext from "../utils/useRequiredContext";
import { useStoredState } from "../utils/useStoredState";
import { useRealm } from "./realm-context/RealmContext";
import { useRealms } from "./RealmsContext";

const MAX_REALMS = 4;

export const RecentRealmsContext = createNamedContext<string[] | undefined>(
  "RecentRealmsContext",
  undefined
);

export const RecentRealmsProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const { realms } = useRealms();
  const { realm } = useRealm();
  const [storedRealms, setStoredRealms] = useStoredState(
    localStorage,
    "recentRealms",
    [realm]
  );

  const recentRealms = useMemo(
    () => filterRealmNames(realms, storedRealms),
    [realms, storedRealms]
  );

  useEffect(() => {
    const newRealms = [...new Set([realm, ...recentRealms])];
    setStoredRealms(newRealms.slice(0, MAX_REALMS));
  }, [realm]);

  return (
    <RecentRealmsContext.Provider value={recentRealms}>
      {children}
    </RecentRealmsContext.Provider>
  );
};

export const useRecentRealms = () => useRequiredContext(RecentRealmsContext);

function filterRealmNames(realms: RealmRepresentation[], realmNames: string[]) {
  // If no realms have been set yet we can't filter out any non-existent realm names.
  if (realms.length === 0) {
    return realmNames;
  }

  // Only keep realm names that actually still exist.
  const exisingRealmNames = realms.map(({ realm }) => realm!);
  return realmNames.filter((realm) => exisingRealmNames.includes(realm));
}
