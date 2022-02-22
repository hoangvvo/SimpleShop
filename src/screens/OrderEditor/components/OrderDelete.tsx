import { useNavigation } from "@react-navigation/native";
import { toast } from "components/Toast";
import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Button, Colors, Dialog, Paragraph, Portal } from "react-native-paper";
import type { Order } from "services/order";
import { useOrderDeleteMutation } from "services/order";

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
  const { mutate } = useOrderDeleteMutation({
    onError(e) {
      toast.error(e.message);
    },
    onSuccess(_data, variables) {
      setDeleteVisible(false);
      toast.success(
        t("entity.has_been_deleted", {
          name: `'${t("order.order_number_num", { id: variables.id })}'`,
        })
      );
      navigation.goBack();
    },
  });

  const navigation = useNavigation();

  const [deleteVisible, setDeleteVisible] = useState(false);
  const onDismiss = () => setDeleteVisible(false);
  const onPress = () => setDeleteVisible(true);
  const onDelete = () => mutate({ id: order.id });

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
