import { useNavigation } from "@react-navigation/native";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Button, Colors, Dialog, Paragraph, Portal } from "react-native-paper";
import { Order } from "services/order";
import { useOrderDeleteMutation } from "services/order/api";
import { toast } from "utils/toasts";

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.red400,
    marginTop: 24,
  },
});

export const OrderDelete: FC<{
  order: Order;
}> = ({ order }) => {
  const { t } = useTranslation();
  const { mutateAsync } = useOrderDeleteMutation();

  const navigation = useNavigation();

  const [deleteVisible, setDeleteVisible] = useState(false);
  const onDismiss = useCallback(() => setDeleteVisible(false), []);
  const onPress = useCallback(() => setDeleteVisible(true), []);

  const onDelete = useCallback(
    () =>
      mutateAsync({ id: order.id }).then(() => {
        setDeleteVisible(false);
        toast(
          t("entity.has_been_deleted", {
            name: `'${t("order.order_number_num", { id: order.id })}'`,
          })
        );
        navigation.goBack();
      }),
    [navigation, order, t, mutateAsync]
  );

  return (
    <>
      <Button
        color="#ffffff"
        style={styles.button}
        onPress={onPress}
        icon="archive"
      >
        {t("action.delete")}
      </Button>
      <Portal>
        <Dialog visible={deleteVisible} onDismiss={onDismiss}>
          <Dialog.Title>
            {t("entity.delete_name", {
              name: t("order.order_number_num", { id: order.id }),
            })}
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph>{t("action.not_undoable")}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismiss}>{t("action.cancel")}</Button>
            <Button color={Colors.red400} onPress={onDelete}>
              {t("action.delete")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
