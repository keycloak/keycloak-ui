import {
  ActionGroup,
  Button,
  Chip,
  ChipGroup,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Dropdown,
  DropdownToggle,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
  Tab,
  TabTitleText,
  TextInput,
  Tooltip,
} from "@patternfly/react-core";
import { CheckCircleIcon, WarningTriangleIcon } from "@patternfly/react-icons";
import { cellWidth, expandable } from "@patternfly/react-table";
import type EventRepresentation from "keycloak-admin/lib/defs/eventRepresentation";
import moment from "moment";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { KeycloakTabs } from "../components/keycloak-tabs/KeycloakTabs";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useFetch, useAdminClient } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import { AdminEvents } from "./AdminEvents";
import { useForm } from "react-hook-form";
import type { RealmEventsConfigRepresentation } from "keycloak-admin/lib/defs/realmEventsConfigRepresentation";
import "./events-section.css";

type UserEventSearchForm = {
  userId: string;
  eventTypes: string[];
  client: string;
  dateFrom: string;
  dateTo: string;
};

export const EventsSection = () => {
  const { t } = useTranslation("events");
  const adminClient = useAdminClient();
  const { realm } = useRealm();
  const [key, setKey] = useState(0);

  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedFormValues, setSelectedFormValues] =
    useState<UserEventSearchForm>();
  const [events, setEvents] = useState<RealmEventsConfigRepresentation>();
  const [chipsToDisplay, setChipsToDisplay] = useState<Record<string, any>>();

  const { getValues, register, reset, setValue } = useForm<UserEventSearchForm>(
    { shouldUnregister: false }
  );

  const [isDirty, setIsDirty] = useState(false);

  const refresh = () => {
    setKey(new Date().getTime());
    setSelectedEvents([]);
    setIsDirty(false);
    reset();
  };

  useFetch(
    () => adminClient.realms.getConfigEvents({ realm }),
    (events) => setEvents(events),
    []
  );

  const searchEvents = () => {
    setSearchDropdownOpen(false);
    setKey(new Date().getTime());
  };

  const loader = (first?: number, max?: number) => {
    const formValues = getValues();
    setSelectedFormValues(formValues);

    const params: { [key: string]: any } = {
      user: formValues?.userId,
      type: formValues?.eventTypes,
      client: formValues?.client,
      dateFrom: formValues?.dateFrom,
      dateTo: formValues?.dateTo,
      first,
      max,
    };

    const reducedParams = Object.fromEntries(
      Object.entries(params).filter(([key]) => key !== "" && params[key])
    );

    const replacementKeys = {
      user: "User ID",
      type: "Event type",
      client: "Client",
      dateFrom: "Date(from)",
      dateTo: "Date(to)",
    } as { [key: string]: string };

    const replacedKeysInChips = Object.keys(reducedParams)
      .filter((key) => key !== "max")
      .reduce((acc: any, key: string) => {
        const newKey = replacementKeys[key];
        acc[newKey] = reducedParams[key];
        return acc;
      }, {});

    setChipsToDisplay(replacedKeysInChips);
    return adminClient.realms.findEvents({ realm, ...reducedParams });
  };

  const StatusRow = (event: EventRepresentation) => (
    <>
      {!event.error && (
        <span key={`status-${event.time}-${event.type}`}>
          <CheckCircleIcon
            color="green"
            key={`circle-${event.time}-${event.type}`}
          />{" "}
          {event.type}
        </span>
      )}
      {event.error && (
        <Tooltip
          content={event.error}
          key={`tooltip-${event.time}-${event.type}`}
        >
          <span key={`label-${event.time}-${event.type}`}>
            <WarningTriangleIcon
              color="orange"
              key={`triangle-${event.time}-${event.type}`}
            />{" "}
            {event.type}
          </span>
        </Tooltip>
      )}
    </>
  );

  const UserDetailLink = (event: EventRepresentation) => (
    <>
      <Link
        key={`link-${event.time}-${event.type}`}
        to={`/${realm}/users/${event.userId}/details`}
      >
        {event.userId}
      </Link>
    </>
  );

  const DetailCell = (event: EventRepresentation) => (
    <>
      <DescriptionList isHorizontal className="keycloak_eventsection_details">
        {Object.keys(event.details!).map((k) => (
          <DescriptionListGroup key={k}>
            <DescriptionListTerm>{k}</DescriptionListTerm>
            <DescriptionListDescription>
              {event.details![k]}
            </DescriptionListDescription>
          </DescriptionListGroup>
        ))}
      </DescriptionList>
    </>
  );

  const clearEventTypeSelectionDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvents([]);
    setValue("eventTypes", []);
  };

  const clearSelectionDropdown = (e: React.MouseEvent, chip: string) => {
    const updatedEventSelection = selectedEvents.filter((obj) => obj !== chip);
    setSelectedEvents(updatedEventSelection);
    setValue("eventTypes", updatedEventSelection);
    e.stopPropagation();
  };

  const chipGroupComponent = () => {
    return (
      <ChipGroup>
        {selectedEvents.map((chip, index) => (
          <Chip
            isReadOnly={index === 0}
            key={chip}
            onClick={(e) => clearSelectionDropdown(e, chip)}
          >
            {chip}
          </Chip>
        ))}
      </ChipGroup>
    );
  };

  const deleteEventTypeChip = (chip: string) => {
    const chips = chipsToDisplay?.["Event type"];
    const index = chips?.indexOf(chip);
    if (index !== -1) {
      chips?.splice(index, 1);
      setChipsToDisplay(chipsToDisplay);
      setSelectedEvents(chips);
      setValue("eventTypes", [...chips]);
    }
    setKey(new Date().getTime());
  };

  const deleteCategory = (categoryChip: string) => {
    const chips = chipsToDisplay;
    const remainingCategories = Object.fromEntries(
      Object.entries(chips!).filter(([key]) => key !== categoryChip)
    );
    setChipsToDisplay(remainingCategories);

    const updatedFormSearchObj = {
      userId: remainingCategories["User ID"] || "",
      eventTypes: remainingCategories["Event type"] || [],
      client: remainingCategories["Client"] || "",
      dateFrom: remainingCategories["Date(from)"] || "",
      dateTo: remainingCategories["Date(to)"] || "",
    };

    if (updatedFormSearchObj.eventTypes.length === 0) {
      setSelectedEvents([]);
    }

    setSelectedFormValues(updatedFormSearchObj);
    setValue("userId", updatedFormSearchObj.userId);
    setValue("eventTypes", [...updatedFormSearchObj.eventTypes]);
    setValue("client", updatedFormSearchObj.client);
    setValue("dateFrom", updatedFormSearchObj.dateFrom);
    setValue("dateTo", updatedFormSearchObj.dateTo);

    setKey(new Date().getTime());
  };

  return (
    <>
      <ViewHeader
        titleKey="events:title"
        subKey={
          <Trans i18nKey="events:eventExplain">
            If you want to configure user events, Admin events or Event
            listeners, please enter
            <Link to={`/${realm}/realm-settings/events`}>
              {t("eventConfig")}
            </Link>
            page realm settings to configure.
          </Trans>
        }
        divider={false}
      />
      <PageSection variant="light" className="pf-u-p-0">
        <KeycloakTabs isBox>
          <Tab
            eventKey="userEvents"
            title={<TabTitleText>{t("userEvents")}</TabTitleText>}
          >
            <Flex>
              <FlexItem>
                <Dropdown
                  id="user-events-search-select"
                  data-testid="UserEventsSearchSelector"
                  toggle={
                    <DropdownToggle
                      data-testid="userEventsSearchSelectorToggle"
                      onToggle={(isOpen) => setSearchDropdownOpen(isOpen)}
                      className="keycloak__user_events_search_selector_dropdown__toggle pf-u-mt-md pf-u-ml-md pf-u-mb-md"
                    >
                      {t("searchForEvent")}
                    </DropdownToggle>
                  }
                  isOpen={searchDropdownOpen}
                >
                  <Form
                    isHorizontal
                    className="keycloak__user_events_search__form"
                    data-testid="searchForm"
                  >
                    <FormGroup
                      label={t("userId")}
                      fieldId="kc-userId"
                      className="keycloak__user_events_search__form_label"
                    >
                      <TextInput
                        ref={register()}
                        type="text"
                        id="kc-userId"
                        name="userId"
                        data-testid="userId-searchField"
                        onChange={() => {
                          setIsDirty(true);
                        }}
                        defaultValue={selectedFormValues?.userId ?? ""}
                      />
                    </FormGroup>
                    <FormGroup
                      label={t("eventType")}
                      fieldId="kc-eventType"
                      className="keycloak__user_events_search__form_label"
                    >
                      <Select
                        id="kc-eventType"
                        name="eventType"
                        data-testid="event-type-searchField"
                        chipGroupProps={{
                          numChips: 1,
                          expandedText: "Hide",
                          collapsedText: "Show ${remaining}",
                        }}
                        variant={SelectVariant.typeaheadMulti}
                        typeAheadAriaLabel="Select"
                        onToggle={(isOpen) => setSelectOpen(isOpen)}
                        selections={selectedEvents}
                        onSelect={(_, value) => {
                          const option = value.toString();
                          register("eventTypes");
                          const selected = selectedEvents.includes(option)
                            ? selectedEvents.filter((item) => item !== option)
                            : [...selectedEvents, option];
                          setSelectedEvents(selected);
                          setValue("eventTypes", selected);
                          setIsDirty(true);
                        }}
                        onClear={clearEventTypeSelectionDropdown}
                        isOpen={selectOpen}
                        aria-labelledby={"eventType"}
                        chipGroupComponent={chipGroupComponent()}
                      >
                        {events?.enabledEventTypes?.map((option, index) => (
                          <SelectOption
                            key={`eventType-${index}`}
                            value={option}
                          />
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup
                      label={t("client")}
                      fieldId="kc-client"
                      className="keycloak__user_events_search__form_label"
                    >
                      <TextInput
                        ref={register()}
                        type="text"
                        id="kc-client"
                        name="client"
                        data-testid="client-searchField"
                        onChange={() => {
                          setIsDirty(true);
                        }}
                        defaultValue={selectedFormValues?.client ?? ""}
                      />
                    </FormGroup>
                    <FormGroup
                      label={t("dateFrom")}
                      fieldId="kc-dateFrom"
                      className="keycloak__user_events_search__form_label"
                    >
                      <TextInput
                        ref={register()}
                        type="text"
                        id="kc-dateFrom"
                        name="dateFrom"
                        className="pf-c-form-control pf-m-icon pf-m-calendar"
                        placeholder="yyyy-MM-dd"
                        data-testid="dateFrom-searchField"
                        onChange={() => {
                          setIsDirty(true);
                        }}
                        defaultValue={selectedFormValues?.dateFrom ?? ""}
                      />
                    </FormGroup>
                    <FormGroup
                      label={t("dateTo")}
                      fieldId="kc-dateTo"
                      className="keycloak__user_events_search__form_label"
                    >
                      <TextInput
                        ref={register()}
                        type="text"
                        id="kc-dateTo"
                        name="dateTo"
                        className="pf-c-form-control pf-m-icon pf-m-calendar"
                        placeholder="yyyy-MM-dd"
                        data-testid="dateTo-searchField"
                        onChange={() => {
                          setIsDirty(true);
                        }}
                        defaultValue={selectedFormValues?.dateTo ?? ""}
                      />
                    </FormGroup>
                    <ActionGroup>
                      <Button
                        className="keycloak__user_events_search__form_btn"
                        variant={"primary"}
                        onClick={searchEvents}
                        data-testid="search-events-btn"
                        isDisabled={!isDirty}
                      >
                        {t("searchBtn")}
                      </Button>
                    </ActionGroup>
                  </Form>
                </Dropdown>
              </FlexItem>
              <FlexItem className="keycloak__refresh_btn">
                <Button onClick={refresh} data-testid="refresh-events-btn">
                  {t("refresh")}
                </Button>
              </FlexItem>
            </Flex>
            {chipsToDisplay ? (
              <div className="keycloak__searchChips pf-u-ml-md">
                {Object.keys(chipsToDisplay).map((chip, index) => (
                  <>
                    {chip !== "Event type" && (
                      <ChipGroup
                        className="pf-u-mr-md pf-u-mb-md"
                        key={`chip-group-${index}`}
                        categoryName={chip}
                        isClosable
                        onClick={() => deleteCategory(chip)}
                      >
                        <Chip key={`chip-${index}`} isReadOnly>
                          {chipsToDisplay[chip]}
                        </Chip>
                      </ChipGroup>
                    )}

                    {chip === "Event type" && (
                      <ChipGroup
                        className="pf-u-mr-md pf-u-mb-md"
                        key={`eventType-chip-group-${index}`}
                        categoryName={chip}
                        isClosable
                        onClick={() => deleteCategory(chip)}
                      >
                        {chipsToDisplay?.["Event type"].map(
                          (eventTypeChip: string, idx: number) => (
                            <>
                              <Chip
                                key={`eventType-chip-${idx}`}
                                onClick={() =>
                                  deleteEventTypeChip(eventTypeChip)
                                }
                              >
                                {eventTypeChip}
                              </Chip>
                            </>
                          )
                        )}
                      </ChipGroup>
                    )}
                  </>
                ))}
              </div>
            ) : null}
            <div className="keycloak__events_table">
              <KeycloakDataTable
                key={key}
                loader={loader}
                detailColumns={[
                  {
                    name: "details",
                    enabled: (event) => event.details !== undefined,
                    cellRenderer: DetailCell,
                  },
                ]}
                isPaginated
                ariaLabelKey="events:title"
                columns={[
                  {
                    name: "time",
                    displayKey: "events:time",
                    cellRenderer: (row) => moment(row.time).format("LLL"),
                    cellFormatters: [expandable],
                  },
                  {
                    name: "userId",
                    displayKey: "events:user",
                    cellRenderer: UserDetailLink,
                  },
                  {
                    name: "type",
                    displayKey: "events:eventType",
                    cellRenderer: StatusRow,
                  },
                  {
                    name: "ipAddress",
                    displayKey: "events:ipAddress",
                    transforms: [cellWidth(10)],
                  },
                  {
                    name: "clientId",
                    displayKey: "events:client",
                  },
                ]}
                emptyState={
                  <div className="pf-u-mt-md">
                    <Divider className="keycloak__events_empty_state_divider" />
                    <ListEmptyState
                      message={t("emptyEvents")}
                      instructions={t("emptyEventsInstructions")}
                    />
                  </div>
                }
              />
            </div>
          </Tab>
          <Tab
            eventKey="adminEvents"
            title={<TabTitleText>{t("adminEvents")}</TabTitleText>}
          >
            <AdminEvents />
          </Tab>
        </KeycloakTabs>
      </PageSection>
    </>
  );
};
