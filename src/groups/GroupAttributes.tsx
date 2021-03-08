import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFieldArray, useForm } from "react-hook-form";
import { AlertVariant } from "@patternfly/react-core";

import { useAlerts } from "../components/alert/Alerts";
import {
  arrayToAttributes,
  AttributeForm,
  AttributesForm,
  attributesToArray,
} from "../components/attribute-form/AttributeForm";
import { useAdminClient } from "../context/auth/AdminClient";

import { getLastId } from "./groupIdUtils";
import { useSubGroups } from "./SubGroupsContext";

export const GroupAttributes = () => {
  const { t } = useTranslation("groups");
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const form = useForm<AttributeForm>({ mode: "onChange" });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const id = getLastId(location.pathname);
  const { subGroups } = useSubGroups();
  const getGroup = () => subGroups[subGroups.length - 1];

  useEffect(() => {
    const group = getGroup();
    const attributes = attributesToArray(group.attributes!);
    attributes.push({ key: "", value: "" });
    form.setValue("attributes", attributes);
  }, [id]);

  const save = async (attributeForm: AttributeForm) => {
    try {
      const group = getGroup();
      await adminClient.groups.update(
        { id: id! },
        { ...group, attributes: arrayToAttributes(attributeForm.attributes) }
      );
      addAlert(t("groupUpdated"), AlertVariant.success);
    } catch (error) {
      addAlert(t("groupUpdateError", { error }), AlertVariant.danger);
    }
  };

  return (
    <AttributesForm
      form={form}
      save={save}
      array={{ fields, append, remove }}
      reset={() =>
        form.reset({
          attributes: attributesToArray(
            subGroups[subGroups.length - 1].attributes
          ),
        })
      }
    />
  );
};
