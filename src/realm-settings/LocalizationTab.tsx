import React, { useState } from "react";
import * as _ from "lodash";
import { useTranslation } from "react-i18next";
import { Controller, useForm, useFormContext, useWatch } from "react-hook-form";
import {
  ActionGroup,
  AlertVariant,
  Button,
  Divider,
  FormGroup,
  PageSection,
  Select,
  SelectGroup,
  SelectOption,
  SelectVariant,
  Switch,
  TextContent,
  ToolbarItem,
} from "@patternfly/react-core";

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { FormAccess } from "../components/form-access/FormAccess";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { FormPanel } from "../components/scroll-form/FormPanel";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAdminClient } from "../context/auth/AdminClient";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { AddMessageBundleModal } from "./AddMessageBundleModal";
import { useAlerts } from "../components/alert/Alerts";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { useRealm } from "../context/realm-context/RealmContext";
import { DEFAULT_LOCALE } from "../i18n";
import {
  EditableTextCell,
  validateCellEdits,
  cancelCellEdits,
  applyCellEdits,
  RowErrors,
  RowEditType,
  IRowCell,
} from "@patternfly/react-table";
import type { EditableTextCellProps } from "@patternfly/react-table/dist/esm/components/Table/base";

type LocalizationTabProps = {
  save: (realm: RealmRepresentation) => void;
  reset: () => void;
  refresh: () => void;
  realm: RealmRepresentation;
};

export type KeyValueType = { key: string; value: string };

export enum RowEditAction {
  save = "save",
  cancel = "cancel",
  edit = "edit",
}

export type BundleForm = {
  messageBundle: KeyValueType;
};

export const LocalizationTab = ({
  save,
  reset,
  realm,
}: LocalizationTabProps) => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const [addMessageBundleModalOpen, setAddMessageBundleModalOpen] =
    useState(false);

  const [supportedLocalesOpen, setSupportedLocalesOpen] = useState(false);
  const [defaultLocaleOpen, setDefaultLocaleOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectMenuLocale, setSelectMenuLocale] = useState(DEFAULT_LOCALE);

  const { getValues, control, handleSubmit, formState } = useFormContext();
  const [selectMenuValueSelected, setSelectMenuValueSelected] = useState(false);
  const [messageBundles, setMessageBundles] = useState<[string, string][]>([]);
  const [tableRows, setTableRows] = useState<any[]>([]);

  const themeTypes = useServerInfo().themes!;
  const bundleForm = useForm<BundleForm>({ mode: "onChange" });
  const { addAlert, addError } = useAlerts();
  const { realm: currentRealm } = useRealm();

  const watchSupportedLocales = useWatch<string[]>({
    control,
    name: "supportedLocales",
  });
  const internationalizationEnabled = useWatch({
    control,
    name: "internationalizationEnabled",
    defaultValue: false,
  });

  const [tableKey, setTableKey] = useState(0);

  const refreshTable = () => {
    setTableKey(new Date().getTime());
  };

  React.useEffect(() => {
    const updatedRows = messageBundles.map(
      (messageBundle: [string, string]) => ({
        rowEditBtnAriaLabel: () => `Edit ${messageBundle[1]}`,
        rowSaveBtnAriaLabel: () => `Save edits for ${messageBundle[1]}`,
        rowCancelBtnAriaLabel: () => `Cancel edits for ${messageBundle[1]}`,
        cells: [
          {
            title: (
              value: string,
              rowIndex: number,
              cellIndex: number,
              props: EditableTextCellProps
            ) => (
              <EditableTextCell
                value={value}
                rowIndex={rowIndex}
                cellIndex={cellIndex}
                props={props}
                isDisabled
                handleTextInputChange={handleTextInputChange}
                inputAriaLabel={messageBundle[0]}
              />
            ),
            props: {
              value: messageBundle[0],
            },
          },
          {
            title: (value, rowIndex, cellIndex, props) => (
              <EditableTextCell
                value={value}
                rowIndex={rowIndex}
                cellIndex={cellIndex}
                props={props}
                handleTextInputChange={handleTextInputChange}
                inputAriaLabel={messageBundle[1]}
              />
            ),
            props: {
              value: messageBundle[1],
            },
          },
        ],
      })
    );
    setTableRows(updatedRows);
  }, [messageBundles]);

  const loader = async () => {
    const result = await adminClient.realms.getRealmLocalizationTexts({
      realm: realm.realm!,
      selectedLocale:
        selectMenuLocale || getValues("defaultLocale") || DEFAULT_LOCALE,
    });
    setMessageBundles(Object.entries(result));
    return Object.entries(result);
  };

  const handleTextInputChange = (
    newValue: string,
    evt: any,
    rowIndex: number,
    cellIndex: number
  ) => {
    setTableRows((prev) => {
      const newRows = _.cloneDeep(prev);
      newRows[rowIndex].cells[cellIndex].props.editableValue = newValue;
      return newRows;
    });
  };

  const updateEditableRows = (
    evt: any,
    type: RowEditType,
    isEditable?: boolean | undefined,
    rowIndex?: number,
    validationErrors?: RowErrors
  ) => {
    if (rowIndex === undefined) {
      return;
    }
    const newRows = _.cloneDeep(tableRows);
    let newRow;
    const invalid = validationErrors && Object.keys(validationErrors).length;
    if (invalid) {
      newRow = validateCellEdits(newRows[rowIndex], type, validationErrors);
    } else if (type === RowEditAction.cancel) {
      newRow = cancelCellEdits(newRows[rowIndex]);
    } else {
      newRow = applyCellEdits(newRows[rowIndex], type);
    }
    newRows[rowIndex] = newRow;

    // Update the copy of the retrieved data set so we can save it when the user saves changes
    if (!invalid && type === RowEditAction.save) {
      const key = (newRow.cells?.[0] as IRowCell).props.value;
      const value = (newRow.cells?.[1] as IRowCell).props.value;

      // We only have one editable value, otherwise we'd need to save each
      try {
        adminClient.setConfig({
          requestConfig: { headers: { "Content-Type": "text/plain" } },
        });
        adminClient.realms.addLocalization(
          {
            realm: realm.realm!,
            selectedLocale:
              selectMenuLocale || getValues("defaultLocale") || DEFAULT_LOCALE,
            key,
          },
          value
        );
        addAlert(t("updateMessageBundleSuccess"), AlertVariant.success);
      } catch (error) {
        addAlert(t("updateMessageBundleError"), AlertVariant.danger);
      }
    }
    setTableRows(newRows);
  };

  const handleModalToggle = () => {
    setAddMessageBundleModalOpen(!addMessageBundleModalOpen);
  };

  const options = [
    <SelectGroup label={t("defaultLocale")} key="group1">
      {watchSupportedLocales
        ?.filter((item) => item === realm.defaultLocale)
        .map((locale) => (
          <SelectOption key={locale} value={locale}>
            {t(`allSupportedLocales.${locale}`)}
          </SelectOption>
        ))}
    </SelectGroup>,
    <Divider key="divider" />,
    <SelectGroup label={t("supportedLocales")} key="group2">
      {watchSupportedLocales
        ?.filter((item) => item !== realm.defaultLocale)
        .map((locale) => (
          <SelectOption key={locale} value={locale}>
            {t(`allSupportedLocales.${locale}`)}
          </SelectOption>
        ))}
    </SelectGroup>,
  ];

  const addKeyValue = async (pair: KeyValueType): Promise<void> => {
    try {
      adminClient.setConfig({
        requestConfig: { headers: { "Content-Type": "text/plain" } },
      });
      await adminClient.realms.addLocalization(
        {
          realm: currentRealm!,
          selectedLocale:
            selectMenuLocale || getValues("defaultLocale") || DEFAULT_LOCALE,
          key: pair.key,
        },
        pair.value
      );

      adminClient.setConfig({
        realmName: currentRealm!,
      });
      refreshTable();
      addAlert(t("addMessageBundleSuccess"), AlertVariant.success);
    } catch (error) {
      addError("addMessageBundleError", error);
    }
  };

  return (
    <>
      {addMessageBundleModalOpen && (
        <AddMessageBundleModal
          handleModalToggle={handleModalToggle}
          save={(pair: any) => {
            addKeyValue(pair);
            handleModalToggle();
          }}
          form={bundleForm}
        />
      )}
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          role="manage-realm"
          className="pf-u-mt-lg"
          onSubmit={handleSubmit(save)}
        >
          <FormGroup
            label={t("internationalization")}
            fieldId="kc-internationalization"
            labelIcon={
              <HelpItem
                helpText="realm-settings-help:internationalization"
                fieldLabelId="realm-settings:internationalization"
              />
            }
          >
            <Controller
              name="internationalizationEnabled"
              control={control}
              defaultValue={false}
              render={({ onChange, value }) => (
                <Switch
                  id="kc-l-internationalization"
                  label={t("common:enabled")}
                  labelOff={t("common:disabled")}
                  isChecked={internationalizationEnabled}
                  data-testid={
                    value
                      ? "internationalization-enabled"
                      : "internationalization-disabled"
                  }
                  onChange={onChange}
                />
              )}
            />
          </FormGroup>
          {internationalizationEnabled && (
            <>
              <FormGroup
                label={t("supportedLocales")}
                fieldId="kc-l-supported-locales"
              >
                <Controller
                  name="supportedLocales"
                  control={control}
                  defaultValue={[DEFAULT_LOCALE]}
                  render={({ onChange, value }) => (
                    <Select
                      toggleId="kc-l-supported-locales"
                      onToggle={(open) => {
                        setSupportedLocalesOpen(open);
                      }}
                      onSelect={(_, v) => {
                        const option = v as string;
                        if (value.includes(option)) {
                          onChange(
                            value.filter(
                              (item: string) =>
                                item !== option || option === DEFAULT_LOCALE
                            )
                          );
                        } else {
                          onChange([...value, option]);
                        }
                      }}
                      onClear={() => {
                        onChange([]);
                      }}
                      selections={value}
                      variant={SelectVariant.typeaheadMulti}
                      aria-label={t("supportedLocales")}
                      isOpen={supportedLocalesOpen}
                      placeholderText={t("selectLocales")}
                    >
                      {themeTypes.login![0].locales.map(
                        (locale: string, idx: number) => (
                          <SelectOption
                            selected={value.includes(locale)}
                            key={`locale-${idx}`}
                            value={locale}
                          >
                            {t(`allSupportedLocales.${locale}`)}
                          </SelectOption>
                        )
                      )}
                    </Select>
                  )}
                />
              </FormGroup>
              <FormGroup
                label={t("defaultLocale")}
                fieldId="kc-l-default-locale"
              >
                <Controller
                  name="defaultLocale"
                  control={control}
                  defaultValue={DEFAULT_LOCALE}
                  render={({ onChange, value }) => (
                    <Select
                      toggleId="kc-default-locale"
                      onToggle={() => setDefaultLocaleOpen(!defaultLocaleOpen)}
                      onSelect={(_, value) => {
                        onChange(value as string);
                        setDefaultLocaleOpen(false);
                      }}
                      selections={
                        value
                          ? t(`allSupportedLocales.${value}`)
                          : realm.defaultLocale !== ""
                          ? t(
                              `allSupportedLocales.${
                                realm.defaultLocale || DEFAULT_LOCALE
                              }`
                            )
                          : t("placeholderText")
                      }
                      variant={SelectVariant.single}
                      aria-label={t("defaultLocale")}
                      isOpen={defaultLocaleOpen}
                      placeholderText={t("placeholderText")}
                      data-testid="select-default-locale"
                    >
                      {watchSupportedLocales?.map(
                        (locale: string, idx: number) => (
                          <SelectOption
                            key={`default-locale-${idx}`}
                            value={locale}
                          >
                            {t(`allSupportedLocales.${locale}`)}
                          </SelectOption>
                        )
                      )}
                    </Select>
                  )}
                />
              </FormGroup>
            </>
          )}
          <ActionGroup>
            <Button
              variant="primary"
              isDisabled={!formState.isDirty}
              type="submit"
              data-testid="localization-tab-save"
            >
              {t("common:save")}
            </Button>
            <Button variant="link" onClick={reset}>
              {t("common:revert")}
            </Button>
          </ActionGroup>
        </FormAccess>

        <FormPanel className="kc-message-bundles" title="Edit message bundles">
          <TextContent className="messageBundleDescription">
            {t("messageBundleDescription")}
          </TextContent>
          <div className="tableBorder">
            <KeycloakDataTable
              isEditable
              onRowEdit={updateEditableRows}
              key={tableKey}
              editableRows={tableRows}
              loader={loader}
              ariaLabelKey="realm-settings:localization"
              searchTypeComponent={
                <ToolbarItem>
                  <Select
                    width={180}
                    data-testid="filter-by-locale-select"
                    isOpen={filterDropdownOpen}
                    className="kc-filter-by-locale-select"
                    variant={SelectVariant.single}
                    isDisabled={!formState.isSubmitSuccessful}
                    onToggle={(isExpanded) => setFilterDropdownOpen(isExpanded)}
                    onSelect={(_, value) => {
                      setSelectMenuLocale(value.toString());
                      setSelectMenuValueSelected(true);
                      refreshTable();
                      setFilterDropdownOpen(false);
                    }}
                    selections={
                      selectMenuValueSelected
                        ? t(`allSupportedLocales.${selectMenuLocale}`)
                        : realm.defaultLocale !== ""
                        ? t(`allSupportedLocales.${DEFAULT_LOCALE}`)
                        : t("placeholderText")
                    }
                  >
                    {options}
                  </Select>
                </ToolbarItem>
              }
              toolbarItem={
                <Button
                  data-testid="add-bundle-button"
                  isDisabled={!formState.isSubmitSuccessful}
                  onClick={() => setAddMessageBundleModalOpen(true)}
                >
                  {t("addMessageBundle")}
                </Button>
              }
              searchPlaceholderKey=" "
              emptyState={
                <ListEmptyState
                  hasIcon={true}
                  message={t("noMessageBundles")}
                  instructions={t("noMessageBundlesInstructions")}
                  onPrimaryAction={handleModalToggle}
                />
              }
              canSelectAll
              columns={[
                {
                  name: "Key",
                },
                {
                  name: "Value",
                },
              ]}
            />
          </div>
        </FormPanel>
      </PageSection>
    </>
  );
};
