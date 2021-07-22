import { FC } from "react";
import { Snackbar, useTheme } from "react-native-paper";

export const ErrorSnackbar: FC<{
  error: Error | undefined | null;
  onDismiss(): void;
}> = ({ error, onDismiss }) => {
  const { colors } = useTheme();
  return (
    <Snackbar
      style={{ backgroundColor: colors.error }}
      onDismiss={onDismiss}
      visible={!!error}
    >
      {error?.message}
    </Snackbar>
  );
};
