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

  const { getValues, register, reset, setValue } =
    useForm<UserEventSearchForm>();
  const [isDirty, setIsDirty] = useState(false);

  const refresh = () => {
    setKey(new Date().getTime());
    setSearch(false);
    setSelectedEvents([]);
    setIsDirty(false);
    reset();
  };

  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedFormValues, setSelectedFormValues] =
    useState<UserEventSearchForm>();
  const [events, setEvents] = useState<RealmEventsConfigRepresentation>();
  const [search, setSearch] = useState(false);
  const [chipsToDisplay, setChipsToDisplay] = useState<Record<string, any>>();

  const onDropdownToggle = () => {
    setSearchDropdownOpen(!searchDropdownOpen);
  };

  const onSelectToggle = () => {
    setSelectOpen(!selectOpen);
  };

  useFetch(
    () => adminClient.realms.getConfigEvents({ realm }),
    (events) => setEvents(events),
    []
  );

  const searchEvents = () => {
    setSearchDropdownOpen(false);
    setKey(new Date().getTime());
    setSearch(true);
  };

  const loader = async (first?: number, max?: number) => {
    const formValues = getValues();
    setSelectedFormValues(formValues);

    const params: { [key: string]: any } = {
      user: formValues?.userId,
      type: formValues?.eventTypes,
      client: formValues?.client,
      dateFrom: formValues?.dateFrom,
      dateTo: formValues?.dateTo,
      first: first!,
      max: max!,
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
    return await adminClient.realms.findEvents({ realm, ...reducedParams });
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
        {Object.keys(event.details!).map((k, index) => (
          <DescriptionListGroup key={`detail-${index}`}>
            <DescriptionListTerm>{k}</DescriptionListTerm>
            <DescriptionListDescription>
              {event.details![k]}
            </DescriptionListDescription>
          </DescriptionListGroup>
        ))}
      </DescriptionList>
    </>
  );

  const clearSelection = (e: any) => {
    e.stopPropagation();
    setSelectedEvents([]);
    setValue("eventTypes", []);
  };

  const deleteIndividualSelection = (e: any, chip: string) => {
    const updatedEventSelection = selectedEvents.filter((obj) => obj !== chip);
    setSelectedEvents(updatedEventSelection);
    setValue("eventTypes", updatedEventSelection);
    e.stopPropagation();
  };

  const chipGroupComponent = () => {
    return (
      <ChipGroup>
        {(selectedEvents || []).map((chip, index) => (
          <Chip
            isReadOnly={index === 0 ? true : false}
            key={chip}
            onClick={(e) => deleteIndividualSelection(e, chip)}
          >
            {chip}
          </Chip>
        ))}
      </ChipGroup>
    );
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
                      onToggle={onDropdownToggle}
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
                        onToggle={onSelectToggle}
                        selections={selectedEvents}
                        onSelect={(_, value) => {
                          const option = value.toString();
                          register("eventTypes");
                          if (selectedEvents?.includes(option)) {
                            setSelectedEvents(
                              selectedEvents.filter((item) => item !== option)
                            );
                            setValue(
                              "eventTypes",
                              selectedEvents.filter((item) => item !== option)
                            );
                            setIsDirty(true);
                          } else {
                            setSelectedEvents([...selectedEvents, option]);
                            setValue("eventTypes", [...selectedEvents, option]);
                            setIsDirty(true);
                          }
                        }}
                        onClear={clearSelection}
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
            {search && chipsToDisplay ? (
              <div className="keycloak__searchChips pf-u-ml-md">
                {Object.keys(chipsToDisplay).map((key, index) => (
                  <>
                    {key === "Event type" ? (
                      <ChipGroup
                        className="pf-u-mr-md pf-u-mb-md"
                        key={`search-chip-group-type-${index}`}
                        categoryName={key}
                        isClosable
                      >
                        {chipsToDisplay["Event type"].map(
                          (typeChip: string, idx: number) => (
                            <Chip key={`search-type-chip-type-${idx}`}>
                              {typeChip}
                            </Chip>
                          )
                        )}
                      </ChipGroup>
                    ) : (
                      <ChipGroup
                        className="pf-u-mr-md pf-u-mb-md"
                        key={`search-chip-group-${index}`}
                        categoryName={key}
                        isClosable
                      >
                        <Chip key={`search-chip-${index}`} isReadOnly>
                          {chipsToDisplay[key]}
                        </Chip>
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
