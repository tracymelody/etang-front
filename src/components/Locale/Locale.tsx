import React from "react";
import { IntlProvider } from "react-intl";
import { usePreferences } from "@hooks";
import { Locale } from "@types";

import locale_DE from "@locale/de.json";

interface StructuredMessage {
  context?: string;
  string: string;
}
type LocaleMessages = Record<string, StructuredMessage>;
const localeData: Record<Locale, LocaleMessages | undefined> = {
  // Default language
  [Locale.EN]: undefined,
  [Locale.DE]: locale_DE,
};

export const localeNames: Record<Locale, string> = {
  [Locale.DE]: "Deutsch",
  [Locale.EN]: "English",
};

export const localeFlag: Record<Locale, string | null> = {
  [Locale.DE]: "DE",
  [Locale.EN]: "GB",
};

export const localesOptions = (Object.keys(localeNames) as Array<Locale>).map(
  locale => ({
    localeCode: locale,
    localeName: localeNames[locale],
  })
);

const dotSeparator = "_dot_";
const sepRegExp = new RegExp(dotSeparator, "g");

function getKeyValueJson(
  messages: LocaleMessages | undefined
): Record<string, string> | undefined {
  if (messages) {
    const keyValueMessages: Record<string, string> = {};
    return Object.entries(messages).reduce((acc, [id, msg]) => {
      acc[id.replace(sepRegExp, ".")] = msg.string;
      return acc;
    }, keyValueMessages);
  }
}

const LocaleProvider: React.FC = ({ children }) => {
  const {
    preferences: { locale },
  } = usePreferences();

  return (
    <IntlProvider
      defaultLocale={Locale.DE}
      locale={locale}
      messages={getKeyValueJson(localeData[locale])}
      key={locale}
    >
      {children}
    </IntlProvider>
  );
};

export { LocaleProvider };
