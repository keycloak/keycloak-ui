import React from "react";
import { useTranslation } from "react-i18next";
import { Button, ToolbarItem } from "@patternfly/react-core";
import { IFormatterValueType } from "@patternfly/react-table";

import { KeycloakDataTable } from "../../components/table-toolbar/KeycloakDataTable";
import { ListEmptyState } from "../../components/list-empty-state/ListEmptyState";

type EventType = {
  eventType: string;
};

type EventsTypeTableProps = {
  loader: () => Promise<EventType[]>;
  addTypes?: () => void;
};

export function EventsTypeTable({ loader, addTypes }: EventsTypeTableProps) {
  const { t } = useTranslation("realm-settings");

  const DescriptionCell = (event: { eventType: string }) => (
    <>{t(`eventTypes.${event.eventType}.description`)}</>
  );

  return (
    <KeycloakDataTable
      ariaLabelKey="userEventsRegistered"
      searchPlaceholderKey="realm-settings:searchEventType"
      loader={loader}
      toolbarItem={
        <>
          {addTypes && (
            <ToolbarItem>
              <Button id="addTypes" onClick={addTypes}>
                {t("addSavedTypes")}
              </Button>
            </ToolbarItem>
          )}
        </>
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
          displayKey: "realm-settings:eventType",
          cellFormatters: [
            (data?: IFormatterValueType) => t(`eventTypes.${data}.name`),
          ],
        },
        {
          name: "description",
          displayKey: "description",
          cellRenderer: DescriptionCell,
        },
      ]}
      emptyState={
        <ListEmptyState
          message={t("emptyEvents")}
          instructions={t("emptyEventsInstructions")}
        />
      }
    />
  );
}
