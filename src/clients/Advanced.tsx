import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UseFormMethods } from "react-hook-form";
import moment from "moment";
import {
  ActionGroup,
  Button,
  Card,
  CardBody,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Split,
  SplitItem,
  TextInput,
} from "@patternfly/react-core";

import { FormAccess } from "../components/form-access/FormAccess";
import { ScrollForm } from "../components/scroll-form/ScrollForm";
import { HelpItem } from "../components/help-enabler/HelpItem";

type AdvancedProps = {
  form: UseFormMethods;
  save: () => void;
};

export const Advanced = ({
  form: { getValues, setValue, register },
  save,
}: AdvancedProps) => {
  const { t } = useTranslation("clients");
  const revocationFieldName = "notBefore";

  const setNotBefore = (time: number) => {
    setValue(revocationFieldName, time);
    save();
  };

  useEffect(() => {
    register(revocationFieldName);
  }, [register]);

  const formatDate = () => {
    const date = getValues(revocationFieldName);
    if (date > 0) {
      return moment(date * 1000).format("LLL");
    } else {
      return t("none");
    }
  };

  return (
    <ScrollForm sections={[t("revocation"), t("clustering")]}>
      <Card>
        <CardBody>
          <FormAccess role="manage-clients" isHorizontal>
            <FormGroup label={t("notBefore")} fieldId="kc-not-before">
              <TextInput
                type="text"
                id="kc-not-before"
                name="notBefore"
                isReadOnly
                value={formatDate()}
              />
            </FormGroup>
            <ActionGroup>
              <Button
                variant="tertiary"
                onClick={() => setNotBefore(moment.now() / 1000)}
              >
                {t("setToNow")}
              </Button>
              <Button variant="tertiary" onClick={() => setNotBefore(0)}>
                {t("clear")}
              </Button>
              <Button variant="secondary">{t("push")}</Button>
            </ActionGroup>
          </FormAccess>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <FormAccess role="manage-clients" isHorizontal>
            <FormGroup
              label={t("nodeReRegistrationTimeout")}
              fieldId="kc-node-reregistration-timeout"
              labelIcon={
                <HelpItem
                  helpText="clients-help:nodeReRegistrationTimeout"
                  forLabel={t("nodeReRegistrationTimeout")}
                  forID="nodeReRegistrationTimeout"
                />
              }
            >
              <Split>
                <SplitItem>
                  <TextInput
                    type="number"
                    ref={register()}
                    id="kc-node-reregistration-timeout"
                    name="nodeReRegistrationTimeout"
                  />
                </SplitItem>
                <SplitItem>
                  <Select
                    variant={SelectVariant.single}
                    aria-label="Select time"
                    onSelect={() => {}}
                    onToggle={() => {}}
                  >
                    {[0].map((i) => (
                      <SelectOption key={i} value="test" />
                    ))}
                  </Select>
                </SplitItem>
              </Split>
            </FormGroup>
            <ActionGroup></ActionGroup>
          </FormAccess>
        </CardBody>
      </Card>
    </ScrollForm>
  );
};
