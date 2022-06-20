/**
 * @jest-environment jsdom
 */
import { fireEvent, screen, render } from "@testing-library/react";

import { useConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  it("renders a simple confirm dialog", () => {
    const onConfirm = jest.fn();
    const Test = () => {
      const [toggle, ConfirmDialog] = useConfirmDialog({
        titleKey: "Delete app02?",
        messageKey:
          "If you delete this client, all associated data will be removed.",
        continueButtonLabel: "Delete",
        onConfirm: onConfirm,
      });

      return (
        <>
          <button data-testid="show" onClick={toggle}>
            Show
          </button>
          <ConfirmDialog />
        </>
      );
    };

    render(<Test />);
    fireEvent.click(screen.getByTestId("show"));

    const confirmButton = screen.getByTestId("confirm");
    expect(confirmButton).toBeInTheDocument();

    fireEvent.click(confirmButton);
    expect(onConfirm).toBeCalled();
  });
});
