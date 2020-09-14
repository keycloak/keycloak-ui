import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";

import clientMock from "./mock-clients.json";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import { ClientList } from "../ClientList";

test("renders ClientList", () => {
  const { getByText } = render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <ClientList clients={clientMock} baseUrl="http://blog.nerdin.ch" />
      </MemoryRouter>
    </I18nextProvider>
  );
  const headerElement = getByText(/Client ID/i);
  expect(headerElement).toBeInTheDocument();
});
