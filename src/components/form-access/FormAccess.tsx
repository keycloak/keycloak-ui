import { Form, FormProps } from "@patternfly/react-core";
import React, {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  ReactElement,
} from "react";
import { Controller, useForm } from "react-hook-form";
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

  const ReadOnly = (props: any) => (
    <input type="text" value={props.value} onChange={props.onChange} disabled />
  );

  const recursiveCloneChildren = (children: ReactElement[], newProps: any) => {
    return Children.map(children, (child: ReactElement) => {
      if (!isValidElement(child)) {
        return child;
      }

      if (child.props) {
        if (child.type === Controller) {
          return cloneElement(child, {
            ...(child as ReactElement).props,
            render: ReadOnly,
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
          })}
        </Form>
      )}
      {unWrap &&
        recursiveCloneChildren(children, {
          isDisabled: !hasAccess(role) && !fineGrainedAccess,
        })}
    </>
  );
};
