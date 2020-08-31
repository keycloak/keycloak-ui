import React from "react";
import { Nav, NavItem, NavList, PageSidebar } from "@patternfly/react-core";
import { RealmSelector } from "./components/realm-selector/RealmSelector";


export const PageNav: React.FunctionComponent = () => {
  const httpClient = useContext(HttpClientContext);
  const [realms, setRealms] = useState([] as Realm[]);

  const getRealms = async () => {
    return await httpClient?.doGet('/realms')
      .then((r) => r.data as Realm[]);
    }
  

  getRealms().then((result) => {
    setRealms(result !== undefined ? result: []);});

  return (
    <PageSidebar 
      nav={
        <Nav>
          <NavList>
            <RealmSelector realm="Master" realmList={["Photoz"]} />
            <NavItem id="default-link1" to="/default-link1" itemId={0}>
              Link 1
            </NavItem>
            <NavItem id="default-link2" to="/default-link2" itemId={1} isActive>
              Current link
            </NavItem>
            <NavItem id="default-link3" to="/default-link3" itemId={2}>
              Link 3
            </NavItem>
            <NavItem id="default-link4" to="/default-link4" itemId={3}>
              Link 4
            </NavItem>
          </NavList>
        </Nav>
      }
    />
  );
};
