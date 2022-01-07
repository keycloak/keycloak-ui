import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import {
  Button,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  TextInput,
} from "@patternfly/react-core";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { MinusCircleIcon, PlusCircleIcon } from "@patternfly/react-icons";

import "../attribute-form/attribute-form.css";
import { defaultContextAttributes } from "../../clients/utils";

export type AttributeType = {
  key: string;
  name: string;
  custom?: boolean;
  values?: {
    [key: string]: string;
  }[];
};

type AttributeInputProps = {
  name: string;
  selectableValues?: string[];
  isKeySelectable?: boolean;
};

export const AttributeInput = ({
  name,
  isKeySelectable,
  selectableValues,
}: AttributeInputProps) => {
  const { t } = useTranslation("common");
  const { control, register, watch } = useFormContext();
  const { fields, append, remove, insert } = useFieldArray({
    control: control,
    name,
  });

  useEffect(() => {
    if (!fields.length) {
      append({ key: "", value: "" });
    }
  }, []);

  const [isOpenArray, setIsOpenArray] = useState<boolean[]>([false]);
  const watchLastKey = watch(`${name}[${fields.length - 1}].key`, "");
  const watchLastValue = watch(`${name}[${fields.length - 1}].value`, "");

  const [valueOpen, setValueOpen] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<AttributeType[]>(
    []
  );
  const [authenticationMethod, setAuthenticationMethod] = useState("");

  const toggleSelect = (rowIndex: number, open: boolean) => {
    const arr = [...isOpenArray];
    arr[rowIndex] = open;
    setIsOpenArray(arr);
  };

  const getAttributeValues = (rowIndex: number) =>
    defaultContextAttributes.find(
      (attr) => attr.name === selectedAttributes[rowIndex]?.name
    )?.values;

  return (
    <TableComposable
      className="kc-attributes__table"
      aria-label="Role attribute keys and values"
      variant="compact"
      borders={false}
    >
      <Thead>
        <Tr>
          <Th id="key" width={40}>
            {t("key")}
          </Th>
          <Th id="value" width={40}>
            {t("value")}
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {fields.map((attribute, rowIndex) => (
          <Tr key={attribute.id} data-testid="attribute-row">
            <Td>
              {isKeySelectable ? (
                <FormGroup fieldId="test">
                  <Controller
                    name={`${name}[${rowIndex}].key`}
                    defaultValue={attribute.key}
                    control={control}
                    render={() => (
                      <Select
                        id={`${attribute.id}-key`}
                        className="kc-attribute-key-selectable"
                        name={`${name}[${rowIndex}].key`}
                        toggleId={`group-${name}`}
                        onToggle={(open) => toggleSelect(rowIndex, open)}
                        isOpen={isOpenArray[rowIndex]}
                        variant={SelectVariant.typeahead}
                        typeAheadAriaLabel={t("clients:selectOrTypeAKey")}
                        placeholderText={t("clients:selectOrTypeAKey")}
                        isGrouped
                        selections={attribute.key}
                        onSelect={(_, value) => {
                          const arr = [...selectedAttributes];

                          arr[rowIndex] = {
                            ...selectedAttributes[rowIndex],
                            name: value as string,
                          };
                          setSelectedAttributes(arr);

                          remove(rowIndex);
                          insert(rowIndex, {
                            key: value as string,
                            value: attribute.value,
                          });

                          toggleSelect(rowIndex, false);
                        }}
                      >
                        {selectableValues?.map((attribute) => (
                          <SelectOption
                            selected={
                              attribute === selectedAttributes[rowIndex]?.name
                            }
                            key={attribute}
                            value={attribute}
                          />
                        ))}
                      </Select>
                    )}
                  />
                </FormGroup>
              ) : (
                <TextInput
                  id={`${attribute.id}-key`}
                  name={`${name}[${rowIndex}].key`}
                  ref={register()}
                  defaultValue={attribute.key}
                  data-testid="attribute-key-input"
                />
              )}
            </Td>
            <Td>
              {getAttributeValues(rowIndex)?.length ? (
                <Select
                  id={`${attribute.id}-value`}
                  className="kc-attribute-value-selectable"
                  name={`${name}[${rowIndex}].value`}
                  toggleId={`group-${name}`}
                  onToggle={(open) => setValueOpen(open)}
                  isOpen={valueOpen}
                  variant={SelectVariant.typeahead}
                  typeAheadAriaLabel={t("clients:selectOrTypeAKey")}
                  placeholderText={t("clients:selectOrTypeAKey")}
                  isGrouped
                  selections={authenticationMethod}
                  onSelect={(_, value) => {
                    setAuthenticationMethod(value as string);

                    remove(rowIndex);
                    insert(rowIndex, {
                      key: selectedAttributes[rowIndex]?.name,
                      value: value,
                    });
                    setValueOpen(false);
                  }}
                >
                  {getAttributeValues(rowIndex)?.map((attribute) => (
                    <SelectOption
                      selected={
                        attribute.name === selectedAttributes[rowIndex]?.name
                      }
                      key={attribute.name}
                      value={attribute.name}
                    />
                  ))}
                </Select>
              ) : (
                <TextInput
                  id={`${attribute.id}-value`}
                  name={`${name}[${rowIndex}].value`}
                  ref={register()}
                  defaultValue={attribute.value}
                  data-testid="attribute-value-input"
                />
              )}
            </Td>
            <Td key="minus-button" id={`kc-minus-button-${rowIndex}`}>
              <Button
                id={`minus-button-${rowIndex}`}
                variant="link"
                className="kc-attributes__minus-icon"
                onClick={() => remove(rowIndex)}
              >
                <MinusCircleIcon />
              </Button>
            </Td>
          </Tr>
        ))}
        <Tr>
          <Td>
            <Button
              aria-label={t("roles:addAttributeText")}
              id="plus-icon"
              variant="link"
              className="kc-attributes__plus-icon"
              onClick={() => {
                append({ key: "", value: "" });
                if (isKeySelectable) {
                  setIsOpenArray([...isOpenArray, false]);
                }
              }}
              icon={<PlusCircleIcon />}
              isDisabled={isKeySelectable ? !watchLastValue : !watchLastKey}
              data-testid="attribute-add-row"
            >
              {t("roles:addAttributeText")}
            </Button>
          </Td>
        </Tr>
      </Tbody>
    </TableComposable>
  );
};
