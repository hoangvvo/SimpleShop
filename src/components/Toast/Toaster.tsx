import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Snackbar, useTheme } from "react-native-paper";
import { emitter } from "./pubsub";
import type { ToastValue } from "./types";

export const Toaster: FC = () => {
  const [toast, setToast] = useState<ToastValue | null>(null);

  useEffect(() => {
    emitter.off("toast"); // clear out other listeners
    emitter.on("toast", setToast);
    return () => emitter.off("toast", setToast);
  }, []);

  // when toast is being removed, there is a flicker so we use this to prevent it
  const lastTypeStyle = useRef<ToastValue["type"]>();

  const theme = useTheme();
  const colors = useMemo(() => {
    if (toast) lastTypeStyle.current = toast.type;
    if (!lastTypeStyle.current)
      return {
        surface: theme.colors.surface,
        onSurface: theme.colors.onSurface,
        primary: theme.colors.primary,
      };
    if (lastTypeStyle.current === "success")
      return {
        surface: "#ffffff",
        onSurface: theme.colors.primary,
        accent: "#ffffff",
      };
    if (lastTypeStyle.current === "error")
      return {
        surface: "#ffffff",
        onSurface: theme.colors.error,
        accent: "#ffffff",
      };
  }, [theme, toast]);

  return (
    <Snackbar
      visible={!!toast}
      onDismiss={() => setToast(null)}
      action={{
        label: "OK",
        onPress: () => setToast(null),
      }}
      theme={{
        colors: colors,
      }}
    >
      {toast?.message}
    </Snackbar>
  );
};
