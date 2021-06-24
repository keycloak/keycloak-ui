import React, { useState } from "react";
// import {
//   AlertVariant,
//   Button,
//   ButtonVariant,
//   Modal,
//   ModalVariant,
// } from "@patternfly/react-core";
// import { useTranslation } from "react-i18next";
// import type ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
// import { useAdminClient, useFetch } from "../../context/auth/AdminClient";
// import { useAlerts } from "../../components/alert/Alerts";
// import { useRealm } from "../../context/realm-context/RealmContext";
// import { AESGeneratedForm } from "../key-providers/aes-generated/AESGeneratedForm";
// import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";


// type AESGeneratedModalProps = {
//   providerType?: string;
//   handleModalToggle?: () => void;
//   refresh?: () => void;
//   open: boolean;
//   displayName: string
// };

// export const AESGeneratedModal = ({
//   providerType,
//   handleModalToggle,
//   open,
//   refresh,
//   // displayName,
// }: // save,
// AESGeneratedModalProps) => {
//   const { t } = useTranslation("groups");
//   const adminClient = useAdminClient();
//   const { addAlert } = useAlerts();

//   const { id } = useParams<{ id: string }>();


//   const form = useForm<ComponentRepresentation>({ mode: "onChange" });
//   const [displayName, setDisplayName] = useState("");

//   const watchName = form.watch("name")

//   console.log("watch name", watchName)

//   const setupForm = (component: ComponentRepresentation) => {
//     form.reset();
//     console.log("uihhhh", component);
//     Object.entries(component).map((entry) => {
//       // form.setValue(
//       //   "config.allowPasswordAuthentication",
//       //   component.config?.allowPasswordAuthentication
//       // );
//       if (entry[0] === "name") {
//         console.log("name?", entry[1]);
//         form.setValue(entry[0], entry[1]);
//       }
//       // else if (entry[0] === "config") {
//       //   console.log("???", entry[1].ecdsaEllipticCurveKey);

//       //   form.setValue(
//       //     "config.ecdsaEllipticCurveKey",
//       //     entry[1].ecdsaEllipticCurveKey[0]
//       //   );

//       //   form.setValue("config.enabled", entry[1]);

//       //   form.setValue("config.active", entry[1]);

//       // console.log(convertToFormValues(entry[1][0], "config.ecdsaEllipticCurveKey", form.setValue));
//       // }
//       // form.setValue(entry[0], entry[1]);
//     });
//   };

//   useFetch(
//     async () => {
//       return await adminClient.components.findOne({ id: id });
//     },
//     (result) => {
//       if (result) {
//         // setFetchedProvider(result);
//         setupForm(result);
//       }
//     },
//     []
//   );

//   console.log("modal display name", displayName)

//   const realm = useRealm();

//   const save = async (component: ComponentRepresentation) => {
//     try {
//       await adminClient.components.create({
//         parentId: realm.realm,
//         name: displayName,
//         providerId: providerType,
//         providerType: "org.keycloak.keys.KeyProvider",
//         ...component,
//       });
//       refresh!();
//       addAlert(t("realm-settings:saveProviderSuccess"), AlertVariant.success);
//       handleModalToggle!();
//     } catch (error) {
//       addAlert(
//         t("realm-settings:saveProviderError") +
//           error.response?.data?.errorMessage || error,
//         AlertVariant.danger
//       );
//     }
//   };

//   return (
//     <Modal
//       className="add-provider-modal"
//       variant={ModalVariant.medium}
//       title={t("realm-settings:addProvider")}
//       isOpen={open}
//       onClose={handleModalToggle}
//       actions={[
//         <Button
//           data-testid="add-provider-button"
//           key="confirm"
//           variant="primary"
//           type="submit"
//           form="add-provider"
//         >
//           {t("common:Add")}
//         </Button>,
//         <Button
//           id="modal-cancel"
//           key="cancel"
//           variant={ButtonVariant.link}
//           onClick={() => {
//             handleModalToggle!();
//           }}
//         >
//           {t("common:cancel")}
//         </Button>,
//       ]}
//     >
//       <AESGeneratedForm onNameUpdate={() => setDisplayName(watchName!)} displayName={form.getValues().name!} save={save} providerType={providerType}/>
//     </Modal>
//   );
// };
