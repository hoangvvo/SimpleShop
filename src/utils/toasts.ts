import { ToastAndroid } from "react-native";

// FIXME: Implement for iOS
export const toast = (msg: string) =>
  ToastAndroid.show(msg, ToastAndroid.SHORT);
