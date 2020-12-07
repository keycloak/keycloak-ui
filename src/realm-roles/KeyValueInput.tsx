import React, { useEffect } from "react";
import { useFieldArray, UseFormMethods } from "react-hook-form";
import {
  TextInput,
  Button,
  ButtonVariant,
  TextInputProps,
  Flex,
  FlexItem,
  Text,
} from "@patternfly/react-core";
import { MinusCircleIcon, PlusCircleIcon } from "@patternfly/react-icons";

type KeyValue = {
  value: string;
};

export function convertToMultiline(fields: string[]): KeyValue[] {
  return (fields && fields.length > 0 ? fields : [""]).map((field) => {
    return { value: field };
  });
}

export function toValue(formValue: KeyValue[]): string[] {
  return formValue.map((field) => field.value);
}

export type MultiLineInputProps = Omit<TextInputProps, "form"> & {
  form: UseFormMethods;
  name: string;
};

export const KeyValueInput = ({ name, form, ...rest }: MultiLineInputProps) => {
  const { register, control } = form;
  const { fields, append, remove } = useFieldArray({
    name,
    control,
  });
  useEffect(() => {
    form.reset({
      [name]: [{ value: "" }],
    });
  }, []);
  return (
    <>
      {fields.map(({ id, value }, index) => (
        <Flex key={id}>
          <FlexItem>
            <TextInput
              id={id}
              ref={register()}
              name={`${name}[${index}].value`}
              defaultValue={value}
              {...rest}
            />
            <Text>Key</Text>
          </FlexItem>
          <FlexItem>
            <TextInput
              id={id}
              ref={register()}
              name={`${name}[${index}].value`}
              defaultValue={value}
              {...rest}
            />
            <Text>Value</Text>
          </FlexItem>
          <FlexItem>
            {index === fields.length - 1 && (
              <Button
                variant={ButtonVariant.link}
                onClick={() => append({})}
                tabIndex={-1}
                isDisabled={rest.isDisabled}
              >
                <PlusCircleIcon className="co-icon-space-r" />
              </Button>
            )}
            {index !== fields.length - 1 && (
              <Button
                variant={ButtonVariant.link}
                onClick={() => remove(index)}
                tabIndex={-1}
              >
                <MinusCircleIcon />
              </Button>
            )}
          </FlexItem>
        </Flex>
      ))}
    </>
  );
};
