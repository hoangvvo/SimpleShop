import { AppRegistry } from "react-native";
import "react-native-gesture-handler";
import { en, registerTranslation } from "react-native-paper-dates";
import { name as appName } from "./app.json";
import App from "./src/App";
import "./src/i18n";

registerTranslation(en);

AppRegistry.registerComponent(appName, () => App);
