import RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import React, { useContext, useEffect, useState } from "react";
import { RecentUsed } from "../../components/realm-selector/recent-used";
import { useErrorHandler } from "react-error-boundary";
import { asyncStateFetch, useAdminClient } from "../auth/AdminClient";

type RealmContextType = {
  realm: string;
  setRealm: (realm: string) => void;
  realms: RealmRepresentation[];
};

export const RealmContext = React.createContext<RealmContextType>({
  realm: "",
  setRealm: () => {},
  realms: [],
});

type RealmContextProviderProps = { children: React.ReactNode };

export const RealmContextProvider = ({
  children,
}: RealmContextProviderProps) => {
  const [realm, setRealm] = useState("");
  const [realms, setRealms] = useState<RealmRepresentation[]>([]);
  const adminClient = useAdminClient();
  const errorHandler = useErrorHandler();
  const recentUsed = new RecentUsed();

  const set = (realm: string) => {
    recentUsed.setRecentUsed(realm);
    setRealm(realm);
  };

  useEffect(() => {
    return asyncStateFetch(
      () => adminClient.realms.find(),
      (realms) => {
        setRealms(realms);
      },
      errorHandler
    );
  }, []);

  const set = (realm: string) => {
    if (
      realms.length === 0 ||
      realms.findIndex((r) => r.realm == realm) !== -1
    ) {
      setRealm(realm);
      adminClient.setConfig({
        realmName: realm,
      });
    }
  };
  return (
    <RealmContext.Provider value={{ realm, setRealm: set, realms }}>
      {children}
    </RealmContext.Provider>
  );
};

export const useRealm = () => useContext(RealmContext);
