import React from "react";
import { useTranslation } from "react-i18next";
import { Controller, UseFormMethods } from "react-hook-form";
import {
  ActionGroup,
  Button,
  Divider,
  FormGroup,
  Switch,
} from "@patternfly/react-core";

import { HelpItem } from "../../components/help-enabler/HelpItem";
import { TimeSelector } from "../../components/time-selector/TimeSelector";

type EventsType = "admin" | "user";

export const EventConfigForm = ({
  type,
  form,
}: {
  type: EventsType;
  form: UseFormMethods;
}) => {
  const { t } = useTranslation("realm-settings");
  const { control, watch } = form;

  const eventKey = type === "admin" ? "adminEventsEnabled" : "eventsEnabled";
  const eventsEnabled: boolean = watch(eventKey);

  const reset = () => {};

  return (
    <>
      <FormGroup
        hasNoPaddingTop
        label={t("saveEvents")}
        fieldId={eventKey}
        labelIcon={
          <HelpItem
            helpText={`realm-settings-help:save-${type}-events`}
            forLabel={t("saveEvents")}
            forID={eventKey}
          />
        }
      >
        <Controller
          name={eventKey}
          defaultValue={false}
          control={control}
          render={({ onChange, value }) => (
            <Switch
              data-testid={eventKey}
              id={eventKey}
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={value}
              onChange={onChange}
            />
          )}
        />
      </FormGroup>
      {eventsEnabled && (
        <>
          {type === "admin" && (
            <FormGroup
              hasNoPaddingTop
              label={t("includeRepresentation")}
              fieldId="includeRepresentation"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:includeRepresentation"
                  forLabel={t("includeRepresentation")}
                  forID="includeRepresentation"
                />
              }
            >
              <Controller
                name="adminEventsDetailsEnabled"
                defaultValue={false}
                control={control}
                render={({ onChange, value }) => (
                  <Switch
                    data-testid="includeRepresentation"
                    id="includeRepresentation"
                    label={t("common:on")}
                    labelOff={t("common:off")}
                    isChecked={value}
                    onChange={onChange}
                  />
                )}
              />
            </FormGroup>
          )}
          <FormGroup
            label={t("expiration")}
            fieldId="expiration"
            labelIcon={
              <HelpItem
                helpText="realm-settings-help:expiration"
                forLabel={t("expiration")}
                forID="expiration"
              />
            }
          >
            <Controller
              name="eventsExpiration"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <TimeSelector
                  value={value}
                  onChange={onChange}
                  units={["minutes", "hours", "days"]}
                />
              )}
            />
          </FormGroup>
        </>
      )}
      <ActionGroup>
        <Button
          variant="primary"
          type="submit"
          id={`save-${type}`}
          data-testid={`save-${type}`}
        >
          {t("common:save")}
        </Button>
        <Button variant="link" onClick={reset}>
          {t("common:revert")}
        </Button>
      </ActionGroup>
      <Divider />
      <FormGroup
        label={t("clearEvents")}
        fieldId="clearEvents"
        labelIcon={
          <HelpItem
            helpText="realm-settings-help:clearEvents"
            forLabel={t("clearEvents")}
            forID="clearEvents"
          />
        }
      >
        <Button variant="danger" id={`clear-${type}-events`}>
          {t("clearEvents")}
        </Button>
      </FormGroup>
    </>
  );
};
