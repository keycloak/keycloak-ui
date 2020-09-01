import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Realm } from "../../models/Realm";

import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  Button
} from '@patternfly/react-core';

<<<<<<< HEAD
import style from "./realm-selector.module.css";
=======
import style from './realm-selector.module.css';
import { HttpClientContext } from '../../http-service/HttpClientContext';
import { KeycloakContext } from '../../auth/KeycloakContext';
>>>>>>> address PR feedback

export const RealmSelector = () => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const httpClient = useContext(HttpClientContext);
  const [realms, setRealms] = useState([] as Realm[]);
  const [currentRealm, setCurrentRealm] = useState("Master")


  const getRealms = async () => {
    return await httpClient?.doGet('/realms')
      .then((r) => r.data as Realm[]);
    }
  

  getRealms().then((result) => {
    setRealms(result !== undefined ? result: []);});

  const dropdownItems = realms.map((r) => (
    <DropdownItem component="a" href={ '/#/realms/' + r.id } key={r.id} onClick={() => setCurrentRealm(r.realm)}>
      {r.realm} 
    </DropdownItem>
  ));

  return (
    <Dropdown
      id="realm-select"
      className={style.dropdown}
      isOpen={open}
      toggle={
        <DropdownToggle
          id="realm-select-toggle"
          onToggle={() => setOpen(!open)}
          className={style.toggle}
        >
          {currentRealm}
        </DropdownToggle>
      }
      dropdownItems={[
        ...dropdownItems,
        <DropdownItem component="div" key="add">
          <Button onClick={() => history.push("/add-realm")}>Add Realm</Button>
        </DropdownItem>,
      ]}
    />
  );
};
