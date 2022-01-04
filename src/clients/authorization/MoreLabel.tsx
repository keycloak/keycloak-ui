import React from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@patternfly/react-core";

type MoreLabelProps = {
  array?: unknown[];
};

export const MoreLabel = ({ array }: MoreLabelProps) => {
  const { t } = useTranslation("clients");

  if ((array?.length || 0) <= 1) {
    return null;
  }
  return (
    <Label color="blue">
      {t("common:more", { count: (array.length || 1) - 1 })}
    </Label>
  );
};
