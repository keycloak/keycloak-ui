import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
} from "react";
import { useAccess } from "../../context/access/Access";
import { AccessType } from "../../context/whoami/who-am-i-model";

export type FormAccessProps = {
  role: AccessType;
  fineGrainedAccess?: boolean;
  children: ReactElement[];
};

export const FormAccess = ({ children, role, fineGrainedAccess = true }: FormAccessProps) => {
  const { hasAccess } = useAccess();

  const recursiveCloneChildren = (children: ReactElement[], newProps: any) => {
    return Children.map(children, (child: ReactElement) => {
      if (!isValidElement(child)) {
        return child;
      }

      if (child.props) {
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
      {recursiveCloneChildren(children, {
        isDisabled: !hasAccess(role),
      })}
    </>
  );
};
