import React, { AnchorHTMLAttributes } from "react";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { IFormatter, IFormatterValueType } from "@patternfly/react-table";

export const FormattedLink = ({
  title,
  href,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" {...rest}>
      {title ? title : href}{" "}
      {href?.startsWith("http") && <ExternalLinkAltIcon />}
    </a>
  );
};

export const formattedLinkTableCell = (): IFormatter => (
  data?: IFormatterValueType
) => {
  return (data ? (
    <FormattedLink href={data.toString()} />
  ) : undefined) as object;
};
