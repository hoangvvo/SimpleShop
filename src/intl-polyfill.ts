// FIXME: TO BE REMOVED IN 0.65

import { Platform } from "react-native";

if (Platform.OS === "android") {
  require("@formatjs/intl-getcanonicallocales/polyfill");
  require("@formatjs/intl-locale/polyfill");

  require("@formatjs/intl-pluralrules/polyfill");
  require("@formatjs/intl-pluralrules/locale-data/en.js");
  require("@formatjs/intl-pluralrules/locale-data/vi.js");

  require("@formatjs/intl-displaynames/polyfill");
  require("@formatjs/intl-displaynames/locale-data/en.js");
  require("@formatjs/intl-displaynames/locale-data/vi.js");

  require("@formatjs/intl-listformat/polyfill");
  require("@formatjs/intl-listformat/locale-data/en.js");
  require("@formatjs/intl-listformat/locale-data/vi.js");

  require("@formatjs/intl-numberformat/polyfill");
  require("@formatjs/intl-numberformat/locale-data/en.js");
  require("@formatjs/intl-numberformat/locale-data/vi.js");

  require("@formatjs/intl-relativetimeformat/polyfill");
  require("@formatjs/intl-relativetimeformat/locale-data/en.js");
  require("@formatjs/intl-relativetimeformat/locale-data/vi.js");

  require("@formatjs/intl-datetimeformat/polyfill");
  require("@formatjs/intl-datetimeformat/locale-data/en.js");
  require("@formatjs/intl-datetimeformat/locale-data/vi.js");

  require("@formatjs/intl-datetimeformat/add-golden-tz.js");

  // https://formatjs.io/docs/polyfills/intl-datetimeformat/#default-timezone

  if ("__setDefaultTimeZone" in Intl.DateTimeFormat) {
    let RNLocalize = require("react-native-localize");
    // @ts-ignore
    Intl.DateTimeFormat.__setDefaultTimeZone(RNLocalize.getTimeZone());
  }
}
