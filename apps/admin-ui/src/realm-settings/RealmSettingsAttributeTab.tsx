import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  AlertVariant,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";

import { useAlerts } from "../components/alert/Alerts";
import {
  AttributeForm,
  AttributesForm,
} from "../components/key-value-form/AttributeForm";
import {
  arrayToKeyValue,
  keyValueToArray,
} from "../components/key-value-form/key-value-convert-unique-keys";
import { useAdminClient } from "../context/auth/AdminClient";
import RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";

type RealmSettingsAttributeTabProps = {
  realm: RealmRepresentation;
};

export const RealmSettingsAttributeTab = ({
  realm: defaultRealm,
}: RealmSettingsAttributeTabProps) => {
  const { t } = useTranslation("realms");
  const { adminClient } = useAdminClient();
  const { addAlert, addError } = useAlerts();
  const [realm, setRealm] = useState<RealmRepresentation>(defaultRealm);
  const form = useForm<AttributeForm>({ mode: "onChange" });

  const convertAttributes = () => {
    return arrayToKeyValue<any>(realm.attributes!);
  };

  useEffect(() => {
    form.setValue("attributes", convertAttributes());
  }, [realm]);

  const save = async (attributeForm: AttributeForm) => {
    try {
      const attributes = Object.assign(
        {},
        keyValueToArray(attributeForm.attributes!)
      );
      await adminClient.realms.update(
        { realm: realm.realm! },
        { ...realm, attributes }
      );

      setRealm({ ...realm, attributes });
      addAlert(t("saveSuccess"), AlertVariant.success);
    } catch (error) {
      addError("groups:groupUpdateError", error);
    }
  };

  return (
    <PageSection variant={PageSectionVariants.light}>
      <AttributesForm
        form={form}
        save={save}
        reset={() =>
          form.reset({
            attributes: convertAttributes(),
          })
        }
      />
    </PageSection>
  );
};
