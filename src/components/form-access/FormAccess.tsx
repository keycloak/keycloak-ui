import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
} from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Form, FormProps, Switch } from "@patternfly/react-core";

import { useAccess } from "../../context/access/Access";
import { AccessType } from "../../context/whoami/who-am-i-model";

export type FormAccessProps = FormProps & {
  role: AccessType;
  fineGrainedAccess?: boolean;
  unWrap?: boolean;
  children: ReactElement[];
};

export const FormAccess = ({
  children,
  role,
  fineGrainedAccess = false,
  unWrap = false,
  ...rest
}: FormAccessProps) => {
  const { hasAccess } = useAccess();

  const ReadOnly = (props: any) => {
    const { t } = useTranslation();
    if (typeof props.value === "boolean") {
      return (
        <Switch
          id={props.name}
          isDisabled
          label={t("common:on")}
          labelOff={t("common:off")}
          isChecked={props.value}
          onChange={props.onChange}
        />
      );
    }
    return (
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        disabled
      />
    );
  };

  const recursiveCloneChildren = (children: ReactElement[], newProps: any) => {
    return Children.map(children, (child: ReactElement) => {
      if (!isValidElement(child)) {
        return child;
      }

      if (child.props) {
        if (child.type === Controller && newProps.isDisabled) {
          return cloneElement(child, {
            ...(child as ReactElement).props,
            // eslint-disable-next-line react/display-name
            render: (props: any) => (
              <ReadOnly {...props} name={(child as ReactElement).props.name} />
            ),
          });
        }
        newProps.children = recursiveCloneChildren(
          (child as ReactElement).props.children,
          newProps
        );
        return cloneElement(child, newProps);
      }
      return child;
    });
  };
  return (
    <>
      {!unWrap && (
        <Form {...rest}>
          {recursiveCloneChildren(children, {
            isDisabled: !hasAccess(role) && !fineGrainedAccess,
            readOnly: !hasAccess(role) && !fineGrainedAccess,
          })}
        </Form>
      )}
      {unWrap &&
        recursiveCloneChildren(children, {
          isDisabled: !hasAccess(role) && !fineGrainedAccess,
          readOnly: !hasAccess(role) && !fineGrainedAccess,
        })}
    </>
  );
};
