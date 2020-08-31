import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Realm } from "../../models/Realm";

import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  Button
} from '@patternfly/react-core';

import style from "./realm-selector.module.css";

type RealmSelectorProps = {
  realm: string;
  realmList: Realm[];
};


export const RealmSelector = ({ realm, realmList }: RealmSelectorProps) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const dropdownItems = realmList.map((r) => (
    <DropdownItem component="a" href={ '/#/realms/' + r.id } key={r.id} onClick={() => history.push('/add-realm')}>
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
          {realm}
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
