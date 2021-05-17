import React, { useState } from "react";
import {
  ActionGroup,
  Button,
  Divider,
  FormGroup,
  PageSection,
  Switch,
  Tab,
  Tabs,
  TabTitleText,
  Title,
  ToolbarItem,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { FormAccess } from "../components/form-access/FormAccess";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { Controller, useForm, UseFormMethods } from "react-hook-form";
import { TimeSelector } from "../components/time-selector/TimeSelector";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";

type EventsType = "admin" | "user";

const EventConfigForm = ({
  type,
  form,
}: {
  type: EventsType;
  form: UseFormMethods;
}) => {
  const { t } = useTranslation("realm-settings");
  const { control } = form;

  const reset = () => {};

  return (
    <>
      <FormGroup
        hasNoPaddingTop
        label={t("saveEvents")}
        fieldId="saveEvents"
        labelIcon={
          <HelpItem
            helpText={`realm-settings-help:save-${type}-events`}
            forLabel={t("saveEvents")}
            forID="saveEvents"
          />
        }
      >
        <Controller
          name="eventsEnabled"
          defaultValue={false}
          control={control}
          render={({ onChange, value }) => (
            <Switch
              data-testid="saveEvents"
              id="saveEvents"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={value}
              onChange={onChange}
            />
          )}
        />
      </FormGroup>
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

export const EventsTab = () => {
  const { t } = useTranslation("realm-settings");
  const form = useForm();
  const { handleSubmit, watch } = form;

  const [activeTab, setActiveTab] = useState("user");

  console.log(t("eventTypes"));
  const save = () => {};
  const eventsEnabled: boolean = watch("eventsEnabled");
  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(_, key) => setActiveTab(key as string)}
    >
      <Tab
        eventKey="user"
        title={<TabTitleText>{t("userEventsSettings")}</TabTitleText>}
        data-testid="rs-events-tab"
      >
        <PageSection>
          <Title headingLevel="h4" size="xl">
            {t("userEventsConfig")}
          </Title>
        </PageSection>
        <PageSection>
          <FormAccess
            role="manage-events"
            isHorizontal
            onSubmit={handleSubmit(save)}
          >
            <EventConfigForm type="user" form={form} />
          </FormAccess>
        </PageSection>
        {eventsEnabled && (
          <PageSection>
            <KeycloakDataTable
              ariaLabelKey="userEventsRegistered"
              loader={() => Promise.resolve(t("eventTypes"))}
              toolbarItem={
                <ToolbarItem>
                  <Button id="addTypes" onClick={() => {}}>
                    {t("addTypes")}
                  </Button>
                </ToolbarItem>
              }
              actions={[
                {
                  title: t("common:delete"),
                  onRowClick: () => {},
                },
              ]}
              columns={[
                {
                  name: "eventType",
                },
              ]}
            />
          </PageSection>
        )}
      </Tab>
      <Tab
        eventKey="admin"
        title={<TabTitleText>{t("adminEventsSettings")}</TabTitleText>}
        data-testid="rs-events-tab"
      >
        <PageSection>
          <Title headingLevel="h4" size="xl">
            {t("adminEventsConfig")}
          </Title>
        </PageSection>
        <PageSection>
          <FormAccess
            role="manage-events"
            isHorizontal
            onSubmit={handleSubmit(save)}
          >
            <EventConfigForm type="admin" form={form} />
          </FormAccess>
        </PageSection>
      </Tab>
    </Tabs>
  );
};
