import React, { MouseEventHandler } from "react";
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
  Button,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { SearchIcon } from "@patternfly/react-icons";

export type ListEmptyStateProps = {
  message: string;
  instructions: string;
  primaryActionText?: string;
  onPrimaryAction?: MouseEventHandler<HTMLButtonElement>;
  hasIcon?: boolean;
  hasSearchIcon?: boolean;
};

export const ListEmptyState = ({
  message,
  instructions,
  primaryActionText,
  onPrimaryAction,
  hasIcon,
  hasSearchIcon
}: ListEmptyStateProps) => {
  return (
    <>
      <EmptyState variant="large">
        { hasIcon &&
          <EmptyStateIcon icon={PlusCircleIcon} />
        }
        { hasSearchIcon &&
          <EmptyStateIcon icon={SearchIcon} />
        }
        <Title headingLevel="h4" size="lg">
          {message}
        </Title>
        <EmptyStateBody>{instructions}</EmptyStateBody>
        { primaryActionText &&
          <Button variant="primary" onClick={onPrimaryAction}>
            {primaryActionText}
          </Button>
        }
      </EmptyState>
    </>
  );
};
