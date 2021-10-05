import React, { Children, Fragment, FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  GridItem,
  GridProps,
  JumpLinks,
  JumpLinksItem,
  PageSection,
} from "@patternfly/react-core";

import { mainPageContentId } from "../../App";
import { ScrollPanel } from "./ScrollPanel";
import { FormPanel } from "./FormPanel";

import "./scroll-form.css";

type ScrollFormProps = GridProps & {
  sections: string[];
  borders?: boolean;
};

const spacesToHyphens = (string: string): string => {
  return string.replace(/\s+/g, "-");
};

export const ScrollForm: FunctionComponent<ScrollFormProps> = ({
  sections,
  borders = false,
  children,
  ...rest
}) => {
  const { t } = useTranslation("common");

  const nodes = Children.toArray(children);
  return (
    <Grid hasGutter {...rest}>
      <GridItem span={8}>
        {sections.map((cat, index) => (
          <Fragment key={cat}>
            {!borders && (
              <ScrollPanel scrollId={spacesToHyphens(cat)} title={cat}>
                {nodes[index]}
              </ScrollPanel>
            )}
            {borders && (
              <FormPanel
                scrollId={spacesToHyphens(cat)}
                title={cat}
                className="kc-form-panel__panel"
              >
                {nodes[index]}
              </FormPanel>
            )}
          </Fragment>
        ))}
      </GridItem>
      <GridItem span={4}>
        <PageSection className="kc-scroll-form--sticky">
          <JumpLinks
            isVertical
            // scrollableSelector has to point to the id of the element whose scrollTop changes
            // to scroll the entire main section, it has to be the pf-c-page__main
            scrollableSelector={`#${mainPageContentId}`}
            label={t("jumpToSection")}
            offset={100}
          >
            {sections.map((cat) => (
              // note that JumpLinks currently does not work with spaces in the href
              <JumpLinksItem
                key={cat}
                href={`#${spacesToHyphens(cat)}`}
                data-testid={`jump-link-${spacesToHyphens(cat.toLowerCase())}`}
              >
                {cat}
              </JumpLinksItem>
            ))}
          </JumpLinks>
        </PageSection>
      </GridItem>
    </Grid>
  );
};
