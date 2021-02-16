import React, { useState, useContext, ReactNode, createContext } from "react";
import {
  Divider,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Split,
  SplitItem,
  Switch,
} from "@patternfly/react-core";
import { Trans, useTranslation } from "react-i18next";
import { HelpIcon, ExternalLinkAltIcon } from "@patternfly/react-icons";

import "./help-header.css";

type HelpProps = {
  children: ReactNode;
};

type HelpContextProps = {
  enabled: boolean;
  toggleHelp: () => void;
};

export const HelpContext = createContext<HelpContextProps>({
  enabled: true,
  toggleHelp: () => {},
});

export const Help = ({ children }: HelpProps) => {
  const [enabled, setHelp] = useState(true);

  function toggleHelp() {
    setHelp((help) => !help);
  }
  return (
    <HelpContext.Provider value={{ enabled, toggleHelp }}>
      {children}
    </HelpContext.Provider>
  );
};

export const HelpHeader = () => {
  const [open, setOpen] = useState(false);
  const help = useContext(HelpContext);
  const { t } = useTranslation();

  const dropdownItems = [
    <DropdownItem key="link" id="link">
      <Split>
        <SplitItem isFilled>{t("documentation")}</SplitItem>
        <SplitItem>
          <ExternalLinkAltIcon />
        </SplitItem>
      </Split>
    </DropdownItem>,
    <Divider key="divide" />,
    <DropdownItem key="enable" id="enable">
      <Split>
        <SplitItem isFilled>{t("enableHelpMode")}</SplitItem>
        <SplitItem>
          <Switch
            id="enableHelp"
            aria-label="Help is enabled"
            isChecked={help.enabled}
            label=""
            className="keycloak_help-header-switch"
            onChange={() => help.toggleHelp()}
          />
        </SplitItem>
      </Split>
      <span className="keycloak_help-header-description">
        <Trans>
          This toggle will enable / disable part of the help info in the
          console. Includes any help text, links and popovers.
        </Trans>
      </span>
    </DropdownItem>,
  ];
  return (
    <Dropdown
      position="right"
      isPlain
      isOpen={open}
      toggle={
        <DropdownToggle
          toggleIndicator={null}
          onToggle={() => setOpen(!open)}
          aria-label="Help"
          id="help"
        >
          <HelpIcon />
        </DropdownToggle>
      }
      dropdownItems={dropdownItems}
    />
  );
};
