import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseFormMethods } from "react-hook-form";
import moment from "moment";
import {
  ActionGroup,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  ExpandableSection,
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
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";

type AdvancedProps = {
  form: UseFormMethods;
  save: () => void;
  registeredNodes?: { [key: string]: string };
};

export const Advanced = ({
  form: { getValues, setValue, register },
  save,
  registeredNodes,
}: AdvancedProps) => {
  const { t } = useTranslation("clients");
  const revocationFieldName = "notBefore";
  const nodeReRegistrationTimeoutName = "nodeReRegistrationTimeout";
  const [timeoutValue, setTimeoutValue] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const times = [
    { label: t("common:times.seconds"), multiplier: 1 },
    { label: t("common:times.minutes"), multiplier: 60 },
    { label: t("common:times.hours"), multiplier: 3600 },
    { label: t("common:times.days"), multiplier: 86400 },
  ];

  const updateReregistrationTimeout = (
    timeout: number,
    times: number | undefined = multiplier
  ) => {
    setValue(nodeReRegistrationTimeoutName, timeout * times);
  };

  const setNotBefore = (time: number) => {
    setValue(revocationFieldName, time);
    save();
  };

  useEffect(() => {
    register(nodeReRegistrationTimeoutName);
    register(revocationFieldName);

    const timeout = getValues(nodeReRegistrationTimeoutName);
    const x = times.reduce(
      (value, time) =>
        timeout % time.multiplier === 0 && value < time.multiplier
          ? time.multiplier
          : value,
      0
    );
    if (timeout) {
      setMultiplier(x);
      setTimeoutValue(timeout / x);
    }
  }, [register, timeoutValue, multiplier]);

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
              <Split hasGutter>
                <SplitItem>
                  <TextInput
                    type="number"
                    id="kc-node-reregistration-timeout"
                    value={timeoutValue}
                    onChange={(value) => {
                      const timeOut = parseInt(value);
                      setTimeoutValue(timeOut);
                      updateReregistrationTimeout(timeOut);
                    }}
                  />
                </SplitItem>
                <SplitItem>
                  <Select
                    variant={SelectVariant.single}
                    aria-label="Select time"
                    onSelect={(_, value) => {
                      setMultiplier(value as number);
                      updateReregistrationTimeout(
                        timeoutValue,
                        value as number
                      );
                      setOpen(false);
                    }}
                    selections={[multiplier]}
                    onToggle={() => {
                      setOpen(!open);
                    }}
                    isOpen={open}
                  >
                    {times.map((time) => (
                      <SelectOption key={time.label} value={time.multiplier}>
                        {time.label}
                      </SelectOption>
                    ))}
                  </Select>
                </SplitItem>
                <SplitItem>
                  <Button variant={ButtonVariant.secondary} onClick={save}>
                    {t("common:save")}
                  </Button>
                </SplitItem>
              </Split>
            </FormGroup>
          </FormAccess>
        </CardBody>
        <CardBody>
          <ExpandableSection
            toggleText={t("registeredClusterNodes")}
            onToggle={() => setExpanded(!expanded)}
            isExpanded={expanded}
          >
            <KeycloakDataTable
              ariaLabelKey="registeredClusterNodes"
              loader={() =>
                Promise.resolve(
                  Object.entries(registeredNodes || {}).map((entry) => {
                    return { host: entry[0], registration: entry[1] };
                  })
                )
              }
              actions={[
                {
                  title: t("common:delete"),
                  onRowClick: () => {},
                },
              ]}
              columns={[
                {
                  name: "host",
                  displayKey: "clients:nodeHost",
                },
                {
                  name: "registration",
                  displayKey: "clients:lastRegistration",
                  cellFormatters: [
                    (value) =>
                      value
                        ? moment(parseInt(value.toString()) * 1000).format(
                            "LLL"
                          )
                        : "",
                  ],
                },
              ]}
            ></KeycloakDataTable>
          </ExpandableSection>
        </CardBody>
      </Card>
    </ScrollForm>
  );
};
