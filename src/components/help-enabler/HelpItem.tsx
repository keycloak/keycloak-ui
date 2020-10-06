import React, { useContext } from "react";
import { Button, Popover } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import { HelpContext } from "./HelpHeader";

type HelpItemProps = {
  item: string;
  itemFor: string;
};

export const HelpItem = ({ item, itemFor }: HelpItemProps) => {
  const { t } = useTranslation();
  const { enabled } = useContext(HelpContext);
  return (
    <>
      {enabled && (
        // <Tooltip position="right" content={t(`help:${item}`)}>
        //   <span id={item} data-testid={item}> *** I don't know what data-testid was being used for ***
        //     <HelpIcon />
        //   </span>
        // </Tooltip>
        <Popover bodyContent={t(`help:${item}`)}>
          <button
            aria-label={t(`helpLabel`) + ' ' + item} // *** this should say "more help for the [field label]"
            onClick={(e) => e.preventDefault()}
            aria-describedby={itemFor} // this is the id of the input field that the help is for
            className="pf-c-form__group-label-help"
          >
            <HelpIcon noVerticalAlign />
          </button>
        </Popover>
      )}
    </>
  );
};
