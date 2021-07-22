import { FormHelperText } from "components/HelperText";
import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  Caption,
  Checkbox,
  Colors,
  Divider,
  Surface,
  TextInput,
} from "react-native-paper";
import { Order } from "services/order";

const styles = StyleSheet.create({
  toggle: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    padding: 12,
    backgroundColor: Colors.grey300,
  },
  toggleLabel: {
    fontSize: 16,
    marginRight: 12,
  },
  divider: {
    marginBottom: 12,
  },
});

const rules = {
  locText: {
    maxLength: 100,
    required: true,
  },
  note: {
    maxLength: 256,
  },
};

export const OrderDetailEditor: FC<{
  disableEditing: boolean;
  control: Control<Omit<Order, "id" | "created_at" | "is_buy_order">>;
  isBuyOrder: boolean;
}> = ({ disableEditing, control, isBuyOrder }) => {
  const { t } = useTranslation();

  return (
    <>
      <Controller
        control={control}
        rules={rules.locText}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              maxLength={100}
              label={t("order.loc_text")}
              error={!!error}
              disabled={disableEditing}
            />
            <FormHelperText
              error={error}
              name={t("order.loc_text")}
              rules={rules.locText}
            />
          </View>
        )}
        name="loc_text"
      />
      <Controller
        control={control}
        rules={rules.note}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              maxLength={256}
              label={t("order.note")}
              multiline
              numberOfLines={3}
              disabled={disableEditing}
            />
            <FormHelperText
              error={error}
              name={t("order.note")}
              rules={rules.note}
            />
          </View>
        )}
        name="note"
        defaultValue=""
      />
      <Divider style={styles.divider} />
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Surface style={styles.toggle}>
            <Caption style={styles.toggleLabel}>{t("order.has_paid")}</Caption>
            <Checkbox
              status={value ? "checked" : "unchecked"}
              onPress={() => onChange(!value)}
              disabled={disableEditing}
              color={Colors.blue600}
            />
          </Surface>
        )}
        name="has_paid"
        defaultValue={isBuyOrder ? true : false}
      />
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Surface style={styles.toggle}>
            <Caption style={styles.toggleLabel}>
              {t("order.has_delivered")}
            </Caption>
            <Checkbox
              status={value ? "checked" : "unchecked"}
              onPress={() => onChange(!value)}
              disabled={disableEditing}
              color={Colors.blue600}
            />
          </Surface>
        )}
        name="has_delivered"
        defaultValue={isBuyOrder ? true : false}
      />
    </>
  );
};
