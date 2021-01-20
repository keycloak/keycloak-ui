import React, { useState } from "react";
import {
  ActionGroup,
  Button,
  // FormGroup,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useFieldArray, UseFormMethods } from "react-hook-form";
import "./RealmRolesSection.css";
// import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";

import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { MinusCircleIcon, PlusCircleIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import { FormAccess } from "../components/form-access/FormAccess";
import { useParams } from "react-router-dom";
import { useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";



export type KeyValueType = { key: string; value: string };

type RoleAttributesProps = {
  form: UseFormMethods;
  save: any; // SubmitHandler<RoleRepresentation>;
  defaultValues: []
};

export const RoleAttributes = ({ form, save, defaultValues }: RoleAttributesProps) => {
  const { t } = useTranslation("roles");
  // const history = useHistory();
  // const { url } = useRouteMatch();
  // const [dirtyFields, setDirtyFields] = useState([] as any);

  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const adminClient = useAdminClient();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  }); 
  const formSubmitted = form.formState?.isSubmitted;

  // const attributesRed = React.useRef(defaultAttributeValues);



  const onAdd = () => {
    
    append({ key: "", value: "" });
  };

  // React.useEffect(() => {
  //   (async () => {
  //     if (id) {
  //       const fetchedRole = await adminClient.roles.findOneById({ id });
  //       setName(fetchedRole.name!);
  //       setupForm(fetchedRole);
  //       console.log("form loaded", )
  //     } else {
  //       setName(t("createRole"));
  //     }
  //   })();
  // }, []);

  // On Init, append a row
  React.useEffect(() => {

    console.log(form.getValues())
    
    const timer = setTimeout(() => append({ key: "", value: "" }), 25);
    return () => clearTimeout(timer);
  
  }, [append]);

  
  console.log("values", form.getValues())
  console.log("dirt", form.formState.dirtyFields)


  // see if theres a way to tell if the forn has initially been 
  // loaded/updated... use that to append that value and not use useffect bc vale isn;t being set until later on

  React.useEffect(() => {
    console.log(`------------ Fields Updated: ${fields.length} -------------`);
  }, [fields]); 

  // ON SAVE, append a row
  // React.useEffect(() => {
  //   console.log(`======== Submitted: ${formSubmitted}`);
  //   // if (form.formState.submitCount) {
  //     console.log(`Adding new empty row after save`);
  //     append({ key: "", value: "" });
  //   // }
  // }, [form.formState.submitCount]);

  React.useEffect(() => {
    console.log(`=========== Dirty Fields ===========`);
    console.dir(form.formState.dirtyFields);
  }, [form.formState.dirtyFields]);

  // React.useEffect(() => {
  //   console.log(
  //     ` ============ FORM SUBMITTED: ${
  //       form.formState.isSubmitted === true ? "TRUE" : "FALSE"
  //     } =============`
  //   );
  //   console.dir(form.formState.dirtyFields?.attributes);
  //   fields.forEach((attribute, rowIndex) => {
  //     console.dir(form.formState.dirtyFields?.attributes?.[rowIndex]);
  //     console.log(
  //       `Attriubute: ${attribute.key}  Index: ${rowIndex} Dirty: ${form.formState.dirtyFields?.attributes?.[rowIndex]?.key}`
  //     );
  //   });
  // }, [form]);

  const columns = ["Key", "Value"];

  return (
    <>
      <FormAccess
        role="manage-realm"
        onSubmit={form.handleSubmit(async (role) => {
          await save(role);
          form.formState.dirtyFields.attributes ? onAdd() : "";
        })}
      >
        <TableComposable
          className="kc-role-attributes__table"
          aria-label="Role attribute keys and values"
          variant="compact"
          borders={false}
        >
          <Thead>
            <Tr>
              <Th id="key" width={40}>
                {columns[0]}
              </Th>
              <Th id="value" width={40}>
                {columns[1]}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {fields.map((attribute, rowIndex) => (
              <Tr key={attribute.id}>
                <Td
                  key={`${attribute.id}-key`}
                  id={`text-input-${rowIndex}-key`}
                  dataLabel={columns[0]}
                >
                  <TextInput
                    name={`attributes[${rowIndex}].key`}
                    ref={form.register({ required: true })}
                    validated={
                      form.errors.name
                        ? ValidatedOptions.error
                        : ValidatedOptions.default
                    }
                    aria-label="key-input"
                    defaultValue={attribute.key}
                    // isReadOnly={form.formState.dirtyFields?.attributes?.[rowIndex]?.key === undefined}
                    isReadOnly={
                      attribute.key &&
                      (form.formState?.isSubmitted ||
                        form.formState.dirtyFields?.attributes?.[rowIndex]
                          ?.key === undefined)
                    }
                  />
                </Td>
                <Td
                  key={`${attribute}-value`}
                  id={`text-input-${rowIndex}-value`}
                  dataLabel={columns[1]}
                >
                  <TextInput
                    name={`attributes[${rowIndex}].value`}
                    ref={form.register()}
                    aria-label="value-input"
                    defaultValue={attribute.value}
                    validated={form.errors.description}
                  />
                </Td>
                {rowIndex !== fields.length - 1 && fields.length - 1 !== 0 && (
                  <Td
                    key="minus-button"
                    id={`kc-minus-button-${rowIndex}`}
                    dataLabel={columns[2]}
                  >
                    <Button
                      id={`minus-button-${rowIndex}`}
                      aria-label={`remove ${attribute.key} with value ${attribute.value} `}
                      variant="link"
                      className="kc-role-attributes__minus-icon"
                      onClick={() => remove(rowIndex)}
                    >
                      <MinusCircleIcon />
                    </Button>
                  </Td>
                )}
                {rowIndex === fields.length - 1 && (
                  <Td key="add-button" id="add-button" dataLabel={columns[2]}>
                    <Button
                      aria-label={t("roles:addAttributeText")}
                      id="plus-icon"
                      variant="link"
                      className="kc-role-attributes__plus-icon"
                      onClick={onAdd}
                      icon={<PlusCircleIcon />}
                      isDisabled={!form.formState.isValid}
                    />
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
        <ActionGroup className="kc-role-attributes__action-group">
          <Button
            variant="primary"
            type="submit"
            isDisabled={!form.formState.isValid}
          >
            {t("common:save")}
          </Button>
          <Button onClick={() => {}} variant="link">{t("common:reload")}</Button>
        </ActionGroup>
      </FormAccess>
    </>
  );
};
