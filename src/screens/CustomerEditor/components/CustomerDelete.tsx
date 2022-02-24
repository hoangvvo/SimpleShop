import { useNavigation } from "@react-navigation/native";
import { toast } from "components/Toast";
import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Button, Colors, Dialog, Paragraph, Portal } from "react-native-paper";
import type { Customer } from "services/customer";
import { useCustomerDeleteMutation } from "services/customer";

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.red400,
    marginVertical: 8,
  },
});

export const CustomerDelete: FC<{
  customer: Customer;
}> = ({ customer }) => {
  const { t } = useTranslation();
  const { mutate } = useCustomerDeleteMutation({
    onSuccess() {
      toast.success(
        t("entity.has_been_deleted", { name: `'${customer.name}'` })
      );
      setDeleteVisible(false);
      navigation.goBack();
    },
    onError(e) {
      toast.error(e.message);
    },
  });
  const navigation = useNavigation();

  const [deleteVisible, setDeleteVisible] = useState(false);
  const onDismiss = () => setDeleteVisible(false);
  const presentDelete = () => setDeleteVisible(true);
  const onDelete = () => mutate({ id: customer.id });

  return (
    <>
      <Button
        color="#ffffff"
        style={styles.button}
        onPress={presentDelete}
        icon="archive"
      >
        {t("action.delete")}
      </Button>
      <Portal>
        <Dialog visible={deleteVisible} onDismiss={onDismiss}>
          <Dialog.Title>
            {t("entity.delete_name", { name: customer.name })}
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
