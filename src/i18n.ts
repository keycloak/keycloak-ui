import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import backend from "i18next-http-backend";

import messages from "./messages.json";
import clients from "./clients/messages.json";
import realm from "./realm/messages.json";
import help from "./help.json";

const initOptions = {
  ns: ["messages", "help", "clients", "realm"],
  defaultNS: "messages",
  resources: {
    en: { ...messages, ...help, ...clients, ...realm },
  },
  lng: "en",
  fallbackLng: "en",
  saveMissing: true,

  interpolation: {
    escapeValue: false,
  },
  debug: true,
};

i18n
  .use(initReactI18next)
  // .use(backend)
  .init(initOptions);

export default i18n;
