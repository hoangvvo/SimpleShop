import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FormHelperText } from "components/HelperText";
import { LoadingScreen } from "components/Loading";
import { toast } from "components/Toast";
import type { FC } from "react";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Appbar, TextInput } from "react-native-paper";
import type { ParamList, RouteName } from "screens/types";
import type { Product } from "services/product";
import {
  useProductCreateMutation,
  useProductQuery,
  useProductUpdateMutation,
} from "services/product";
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

const ProductEditorScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.ProductEditor>
> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, setValue } = useForm<Omit<Product, "id">>({});
  const editingId = route.params?.id;

  const { mutate: mutateCreate, isLoading: isLoadingCreate } =
    useProductCreateMutation({
      onSuccess() {
        toast.success(
          t("entity.has_been_created", { name: t("product.title_one") })
        );
        navigation.goBack();
      },
      onError(e) {
        toast.error(e.message);
      },
    });

  const { mutate: mutateEdit, isLoading: isLoadingEdit } =
    useProductUpdateMutation({
      onSuccess() {
        toast.success(
          t("entity.has_been_updated", { name: t("product.title_one") })
        );
        navigation.goBack();
      },
      onError(e) {
        toast.error(e.message);
      },
    });

  const onSubmit = useMemo(
    () =>
      handleSubmit((data) => {
        if (editingId) {
          mutateEdit({
            id: editingId,
            ...data,
          });
        } else {
          mutateCreate(data);
          toast.success(
            t("entity.has_been_created", { name: t("product.title_one") })
          );
        }
      }),
    [t, handleSubmit, mutateCreate, mutateEdit, editingId]
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

  const isLoading = isLoadingCreate || isLoadingEdit;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight() {
        return (
          <Appbar.Action
            icon="check"
            onPress={onSubmit}
            disabled={isLoading}
            accessibilityLabel={
              editingId ? t("entity.update") : t("entity.create")
            }
          />
        );
      },
    });
  }, [editingId, navigation, t, isLoading, onSubmit]);

  return (
    <View style={screenStyles.root}>
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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

export default ProductEditorScreen;
