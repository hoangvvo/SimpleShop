import { AppRegistry } from "react-native";
import "react-native-gesture-handler";
import { name as appName } from "./app.json";
import App from "./src/App";
import "./src/i18n";
import "./src/intl-polyfill";

AppRegistry.registerComponent(appName, () => App);
