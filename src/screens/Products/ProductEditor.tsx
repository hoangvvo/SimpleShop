import { StackScreenProps } from "@react-navigation/stack";
import { FormHelperText } from "components/HelperText";
import { LoadingScreen } from "components/Loading";
import { ErrorSnackbar } from "components/Snackbar";
import { toast } from "components/Toast";
import { FC, useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Appbar, TextInput } from "react-native-paper";
import { ParamList, RouteName } from "screens/types";
import { Product } from "services/product";
import {
  useProductCreateMutation,
  useProductQuery,
  useProductUpdateMutation,
} from "services/product/api";
import { styles as screenStyles } from "styles/screens";
import { isNumeric } from "utils/number";
import { ProductDelete } from "./components/ProductDelete";

const rules = {
  name: {
    required: true,
  },
  defaultPrice: {
    required: true,
    min: 0,
    max: 1000000000,
    validate: isNumeric,
  },
};

export const ProductEditorScreen: FC<
  StackScreenProps<ParamList, RouteName.ProductEditor>
> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, setValue } = useForm<Omit<Product, "id">>({});
  const editingId = route.params?.id;

  const {
    mutateAsync: mutateAsyncCreate,
    error: errorCreate,
    reset: resetCreate,
    status: statusCreate,
  } = useProductCreateMutation();

  const {
    mutateAsync: mutateAsyncEdit,
    error: errorEdit,
    reset: resetEdit,
    status: statusEdit,
  } = useProductUpdateMutation();

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (data) => {
        if (editingId) {
          await mutateAsyncEdit({
            id: editingId,
            ...data,
          });
          toast.success(
            t("entity.has_been_updated", { name: t("product.title_one") })
          );
        } else {
          await mutateAsyncCreate(data);
          toast.success(
            t("entity.has_been_created", { name: t("product.title_one") })
          );
        }
        navigation.goBack();
      }),
    [t, handleSubmit, mutateAsyncCreate, mutateAsyncEdit, editingId, navigation]
  );

  const { data: dataGetEdit, status: statusGetEdit } = useProductQuery(
    editingId || -1
  );

  useEffect(() => {
    if (dataGetEdit) {
      setValue("name", dataGetEdit.name);
      setValue("description", dataGetEdit.description);
      setValue("default_sell_price", dataGetEdit.default_sell_price);
      setValue("default_buy_price", dataGetEdit.default_buy_price);
    }
  }, [dataGetEdit, setValue]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: editingId
        ? t("product_editor.title_edit")
        : t("product_editor.title_create"),
    });
  }, [navigation, editingId, t]);

  const disableEditing = statusCreate === "loading" || statusEdit === "loading";
  const resetMutate = useCallback(() => {
    resetEdit();
    resetCreate();
  }, [resetEdit, resetCreate]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight() {
        return (
          <Appbar.Action
            icon="check"
            onPress={onSubmit}
            disabled={disableEditing}
            accessibilityLabel={
              editingId ? t("entity.update") : t("entity.create")
            }
          />
        );
      },
    });
  }, [editingId, navigation, t, disableEditing, onSubmit]);

  return (
    <View style={screenStyles.root}>
      <ErrorSnackbar error={errorCreate || errorEdit} onDismiss={resetMutate} />
      {statusGetEdit === "loading" ? (
        <LoadingScreen />
      ) : (
        <ScrollView style={screenStyles.content}>
          <Controller
            control={control}
            rules={rules.name}
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
                  label={t("product.name")}
                  error={!!error}
                  disabled={disableEditing}
                />
                <FormHelperText
                  error={error}
                  name={t("product.name")}
                  rules={rules.name}
                />
              </View>
            )}
            name="name"
          />
          <Controller
            control={control}
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
                  label={t("product.description")}
                  multiline
                  numberOfLines={3}
                  disabled={disableEditing}
                />
                <FormHelperText error={error} name={t("product.description")} />
              </View>
            )}
            name="description"
            defaultValue=""
          />
          <Controller
            control={control}
            rules={rules.defaultPrice}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => {
              return (
                <View>
                  <TextInput
                    value={value !== undefined ? String(value) : ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    label={t("product.default_sell_price")}
                    error={!!error}
                    disabled={disableEditing}
                  />
                  <FormHelperText
                    error={error}
                    name={t("product.default_sell_price")}
                    rules={rules.defaultPrice}
                  />
                </View>
              );
            }}
            name="default_sell_price"
          />
          <Controller
            control={control}
            rules={rules.defaultPrice}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => {
              return (
                <View>
                  <TextInput
                    value={value !== undefined ? String(value) : ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    label={t("product.default_buy_price")}
                    error={!!error}
                    disabled={disableEditing}
                  />
                  <FormHelperText
                    error={error}
                    name={t("product.default_buy_price")}
                    rules={rules.defaultPrice}
                  />
                </View>
              );
            }}
            name="default_buy_price"
          />
          {dataGetEdit && <ProductDelete product={dataGetEdit} />}
        </ScrollView>
      )}
    </View>
  );
};
