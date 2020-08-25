import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  Button,
} from "@patternfly/react-core";

import style from "./realm-selector.module.css";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
// import { NewRealmForm } from '../../forms/realm/NewRealmForm';

type RealmSelectorProps = {
  realm: string;
  realmList: string[];
};

export const RealmSelector = ({ realm, realmList }: RealmSelectorProps) => {
  const [open, setOpen] = useState(false);
  const dropdownItems = realmList.map((r) => (
    <DropdownItem component="a" href="/" key={r}>
      {r}
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
        <Router key="add">
          <DropdownItem>
            <Button component="a" href="/add-realm" variant="primary">
              Add Realm
            </Button>
          </DropdownItem>
        </Router>,
      ]}
    />
  );
};
