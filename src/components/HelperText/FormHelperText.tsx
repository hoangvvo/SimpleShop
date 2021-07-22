import { FC } from "react";
import { FieldError, UseControllerProps } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelperText } from "react-native-paper";

export const FormHelperText: FC<{
  error: FieldError | undefined;
  name: string;
  rules?: UseControllerProps["rules"];
}> = ({ error, name, rules }) => {
  const { t, i18n } = useTranslation();
  const tKey = `form.validate_messages.${error?.type}`;
  const errorMessage = error
    ? i18n.exists(tKey)
      ? t(tKey, {
          name,
          [error.type]: rules?.[error.type as keyof typeof rules],
        })
      : t(`form.validate_messages.default`, { name })
    : "";
  return (
    <HelperText type="error" visible={!!error}>
      {errorMessage}
    </HelperText>
  );
};
