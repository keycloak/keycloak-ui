import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
} from "react";
import { Controller } from "react-hook-form";
import {
  ActionGroup,
  Form,
  FormGroup,
  FormProps,
  Grid,
  GridItem,
  TextArea,
} from "@patternfly/react-core";

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

  const recursiveCloneChildren = (
    children: ReactElement[],
    newProps: any
  ): ReactElement[] => {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) {
        return child;
      }

      if (child.props) {
        const element = child as ReactElement;
        if (child.type === Controller) {
          return cloneElement(child, {
            ...element.props,
            render: (props: any) => {
              const renderElement = element.props.render(props);
              return cloneElement(renderElement, {
                value: props.value,
                onChange: props.onChange,
                ...newProps,
              });
            },
          });
        }
        const children = recursiveCloneChildren(
          element.props.children,
          newProps
        );
        if (child.type === TextArea) {
          return cloneElement(child, {
            readOnly: newProps.isDisabled,
            children,
          } as any);
        }
        return cloneElement(
          child,
          child.type === FormGroup ||
            child.type === GridItem ||
            child.type === Grid ||
            child.type === ActionGroup
            ? { children }
            : { ...newProps, children }
        );
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
