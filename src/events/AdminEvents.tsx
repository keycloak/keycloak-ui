import {
  ActionGroup,
  Button,
  Chip,
  ChipGroup,
  Dropdown,
  DropdownToggle,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  Select,
  SelectOption,
  SelectVariant,
  TextInput,
  Tooltip,
} from "@patternfly/react-core";
import {
  cellWidth,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from "@patternfly/react-table";
import type AdminEventRepresentation from "@keycloak/keycloak-admin-client/lib/defs/adminEventRepresentation";
import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import moment from "moment";
import React, { FunctionComponent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAdminClient } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import "./events.css";

type DisplayDialogProps = {
  titleKey: string;
  onClose: () => void;
};

type AdminEventSearchForm = {
  resourceType: string[];
  operationType: string[];
  resourcePath: string;
  dateFrom: string;
  dateTo: string;
  client: string;
  user: string;
  realm: RealmRepresentation[];
  ipAddress: string;
};

const defaultValues: AdminEventSearchForm = {
  resourceType: [],
  operationType: [],
  resourcePath: "",
  dateFrom: "",
  dateTo: "",
  client: "",
  user: "",
  realm: [],
  ipAddress: "",
};

const DisplayDialog: FunctionComponent<DisplayDialogProps> = ({
  titleKey,
  onClose,
  children,
}) => {
  const { t } = useTranslation("events");
  return (
    <Modal
      variant={ModalVariant.medium}
      title={t(titleKey)}
      isOpen={true}
      onClose={onClose}
    >
      {children}
    </Modal>
  );
};

const MAX_TEXT_LENGTH = 38;
const Truncate = ({
  text,
  children,
}: {
  text?: string;
  children: (text: string) => any;
}) => {
  const definedText = text || "";
  const needsTruncation = definedText.length > MAX_TEXT_LENGTH;
  const truncatedText = definedText.substr(0, MAX_TEXT_LENGTH);
  return (
    <>
      {needsTruncation && (
        <Tooltip content={text}>{children(truncatedText + "...")}</Tooltip>
      )}
      {!needsTruncation && <>{children(definedText)}</>}
    </>
  );
};

export const AdminEvents = () => {
  const { t } = useTranslation("events");
  const adminClient = useAdminClient();
  const { realm } = useRealm();
  const serverInfo = useServerInfo();
  const resourceTypes = serverInfo.enums?.["resourceType"];
  const operationTypes = serverInfo.enums?.["operationType"];

  const [key, setKey] = useState(0);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [selectResourceTypeOpen, setSelectResourceTypeOpen] = useState(false);
  const [selectOperationTypeOpen, setSelectOperationTypeOpen] = useState(false);
  const refresh = () => setKey(new Date().getTime());

  const [authEvent, setAuthEvent] = useState<AdminEventRepresentation>();
  const [representationEvent, setRepresentationEvent] =
    useState<AdminEventRepresentation>();

  const {
    register,
    formState: { isDirty },
    control,
  } = useForm<AdminEventSearchForm>({
    shouldUnregister: false,
    mode: "onChange",
    defaultValues,
  });

  const loader = async (first?: number, max?: number, search?: string) => {
    const params = {
      first: first!,
      max: max!,
      realm,
    };
    if (search) {
      console.log("how to search?", search);
    }
    return await adminClient.realms.findAdminEvents({ ...params });
  };

  const LinkResource = (row: AdminEventRepresentation) => (
    <Truncate text={row.resourcePath}>
      {(text) => (
        <>
          {row.resourceType !== "COMPONENT" && (
            <Link
              to={`/${realm}/${row.resourcePath}${
                row.resourceType !== "GROUP" ? "/settings" : ""
              }`}
            >
              {text}
            </Link>
          )}
          {row.resourceType === "COMPONENT" && <span>{text}</span>}
        </>
      )}
    </Truncate>
  );

  const adminEventSearchFormDisplay = () => {
    return (
      <Flex
        direction={{ default: "column" }}
        spaceItems={{ default: "spaceItemsNone" }}
      >
        <FlexItem>
          <Dropdown
            id="admin-events-search-select"
            data-testid="AdminEventsSearchSelector"
            className="pf-u-ml-md"
            toggle={
              <DropdownToggle
                data-testid="adminEventsSearchSelectorToggle"
                onToggle={(isOpen) => setSearchDropdownOpen(isOpen)}
                className="keycloak__events_search_selector_dropdown__toggle"
              >
                {t("searchForAdminEvent")}
              </DropdownToggle>
            }
            isOpen={searchDropdownOpen}
          >
            <Form
              isHorizontal
              className="keycloak__events_search__form"
              data-testid="searchForm"
            >
              <FormGroup
                label={t("resourceType")}
                fieldId="kc-resourceType"
                className="keycloak__events_search__form_multiline_label"
              >
                <Controller
                  name="resourceType"
                  control={control}
                  render={({
                    onChange,
                    value,
                  }: {
                    onChange: (newValue: string[]) => void;
                    value: string[];
                  }) => (
                    <Select
                      className="keycloak__events_search__type_select"
                      name="resourceType"
                      data-testid="resource-type-searchField"
                      chipGroupProps={{
                        numChips: 1,
                        expandedText: "Hide",
                        collapsedText: "Show ${remaining}",
                      }}
                      variant={SelectVariant.typeaheadMulti}
                      typeAheadAriaLabel="Select"
                      onToggle={(isOpen) => setSelectResourceTypeOpen(isOpen)}
                      selections={value}
                      onSelect={(_, selectedValue) => {
                        const option = selectedValue.toString();
                        const changedValue = value.includes(option)
                          ? value.filter((item) => item !== option)
                          : [...value, option];

                        onChange(changedValue);
                      }}
                      onClear={(resource) => {
                        resource.stopPropagation();
                        onChange([]);
                      }}
                      isOpen={selectResourceTypeOpen}
                      aria-labelledby={"resourceType"}
                      chipGroupComponent={
                        <ChipGroup>
                          {value.map((chip) => (
                            <Chip
                              key={chip}
                              onClick={(resource) => {
                                resource.stopPropagation();
                                onChange(value.filter((val) => val !== chip));
                              }}
                            >
                              {chip}
                            </Chip>
                          ))}
                        </ChipGroup>
                      }
                    >
                      {resourceTypes?.map((option) => (
                        <SelectOption key={option} value={option} />
                      ))}
                    </Select>
                  )}
                />
              </FormGroup>
              <FormGroup
                label={t("operationType")}
                fieldId="kc-operationType"
                className="keycloak__events_search__form_multiline_label"
              >
                <Controller
                  name="operationType"
                  control={control}
                  render={({
                    onChange,
                    value,
                  }: {
                    onChange: (newValue: string[]) => void;
                    value: string[];
                  }) => (
                    <Select
                      className="keycloak__events_search__type_select"
                      name="operationType"
                      data-testid="operation-type-searchField"
                      chipGroupProps={{
                        numChips: 1,
                        expandedText: "Hide",
                        collapsedText: "Show ${remaining}",
                      }}
                      variant={SelectVariant.typeaheadMulti}
                      typeAheadAriaLabel="Select"
                      onToggle={(isOpen) => setSelectOperationTypeOpen(isOpen)}
                      selections={value}
                      onSelect={(_, selectedValue) => {
                        const option = selectedValue.toString();
                        const changedValue = value.includes(option)
                          ? value.filter((item) => item !== option)
                          : [...value, option];

                        onChange(changedValue);
                      }}
                      onClear={(operation) => {
                        operation.stopPropagation();
                        onChange([]);
                      }}
                      isOpen={selectOperationTypeOpen}
                      aria-labelledby={"operationType"}
                      chipGroupComponent={
                        <ChipGroup>
                          {value.map((chip) => (
                            <Chip
                              key={chip}
                              onClick={(operation) => {
                                operation.stopPropagation();
                                onChange(value.filter((val) => val !== chip));
                              }}
                            >
                              {chip}
                            </Chip>
                          ))}
                        </ChipGroup>
                      }
                    >
                      {operationTypes?.map((option) => (
                        <SelectOption key={option} value={option} />
                      ))}
                    </Select>
                  )}
                />
              </FormGroup>
              <FormGroup
                label={t("user")}
                fieldId="kc-user"
                className="keycloak__events_search__form_label"
              >
                <TextInput
                  ref={register()}
                  type="text"
                  id="kc-user"
                  name="user"
                  data-testid="user-searchField"
                />
              </FormGroup>
              <FormGroup
                label={t("ipAddress")}
                fieldId="kc-ipAddress"
                className="keycloak__events_search__form_label"
              >
                <TextInput
                  ref={register()}
                  type="text"
                  id="kc-ipAddress"
                  name="ipAddress"
                  data-testid="ipAddress-searchField"
                />
              </FormGroup>
              <FormGroup
                label={t("dateFrom")}
                fieldId="kc-dateFrom"
                className="keycloak__events_search__form_label"
              >
                <TextInput
                  ref={register()}
                  type="text"
                  id="kc-dateFrom"
                  name="dateFrom"
                  className="pf-c-form-control pf-m-icon pf-m-calendar"
                  placeholder="yyyy-MM-dd"
                  data-testid="dateFrom-searchField"
                />
              </FormGroup>
              <FormGroup
                label={t("dateTo")}
                fieldId="kc-dateTo"
                className="keycloak__events_search__form_label"
              >
                <TextInput
                  ref={register()}
                  type="text"
                  id="kc-dateTo"
                  name="dateTo"
                  className="pf-c-form-control pf-m-icon pf-m-calendar"
                  placeholder="yyyy-MM-dd"
                  data-testid="dateTo-searchField"
                />
              </FormGroup>
              <ActionGroup>
                <Button
                  className="keycloak__admin_events_search__form_btn"
                  variant={"primary"}
                  data-testid="search-events-btn"
                  isDisabled={!isDirty}
                >
                  {t("searchAdminEventsBtn")}
                </Button>
              </ActionGroup>
            </Form>
          </Dropdown>
          <Button
            className="pf-u-ml-md"
            onClick={refresh}
            data-testid="refresh-btn"
          >
            {t("refresh")}
          </Button>
        </FlexItem>
      </Flex>
    );
  };

  return (
    <>
      {authEvent && (
        <DisplayDialog titleKey="auth" onClose={() => setAuthEvent(undefined)}>
          <Table
            aria-label="authData"
            variant={TableVariant.compact}
            cells={[t("attribute"), t("value")]}
            rows={Object.entries(authEvent.authDetails!)}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </DisplayDialog>
      )}
      {representationEvent && (
        <DisplayDialog
          titleKey="representation"
          onClose={() => setRepresentationEvent(undefined)}
        >
          some json from the changed values
        </DisplayDialog>
      )}
      <KeycloakDataTable
        key={key}
        loader={loader}
        isPaginated
        ariaLabelKey="events:adminEvents"
        toolbarItem={adminEventSearchFormDisplay()}
        actions={[
          {
            title: t("auth"),
            onRowClick: (event) => setAuthEvent(event),
          },
          {
            title: t("representation"),
            onRowClick: (event) => setRepresentationEvent(event),
          },
        ]}
        columns={[
          {
            name: "time",
            displayKey: "events:time",
            cellRenderer: (row) => moment(row.time).format("LLL"),
          },
          {
            name: "resourcePath",
            displayKey: "events:resourcePath",
            cellRenderer: LinkResource,
          },
          {
            name: "resourceType",
            displayKey: "events:resourceType",
          },
          {
            name: "operationType",
            displayKey: "events:operationType",
            transforms: [cellWidth(10)],
          },
          {
            name: "",
            displayKey: "events:user",
            cellRenderer: (event) => event.authDetails?.userId,
          },
        ]}
        emptyState={
          <ListEmptyState
            message={t("emptyEvents")}
            instructions={t("emptyEventsInstructions")}
          />
        }
      />
    </>
  );
};
