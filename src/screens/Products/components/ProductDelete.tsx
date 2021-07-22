import { useNavigation } from "@react-navigation/native";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Button, Colors, Dialog, Paragraph, Portal } from "react-native-paper";
import { Product } from "services/product";
import { useProductDeleteMutation } from "services/product/api";
import { toast } from "utils/toasts";

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.red400,
  },
});

export const ProductDelete: FC<{
  product: Product;
}> = ({ product }) => {
  const { t } = useTranslation();
  const { mutateAsync } = useProductDeleteMutation();
  const navigation = useNavigation();

  const [deleteVisible, setDeleteVisible] = useState(false);
  const onDismiss = useCallback(() => setDeleteVisible(false), []);
  const onPress = useCallback(() => setDeleteVisible(true), []);

  const onDelete = () =>
    mutateAsync({ id: product.id }).then(() => {
      toast(t("entity.has_been_deleted", { name: `'${product.name}'` }));
      setDeleteVisible(false);
      navigation.goBack();
    });

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
            {t("entity.delete_name", { name: product.name })}
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
