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
import type { Customer } from "services/customer";
import {
  useCustomerCreateMutation,
  useCustomerQuery,
  useCustomerUpdateMutation,
} from "services/customer";
import { styles as screenStyles } from "styles/screens";
import { CustomerDelete } from "./components/CustomerDelete";

const rules = {
  name: {
    required: true,
  },
  locText: {
    maxLength: 200,
  },
  note: {
    maxLength: 256,
  },
};

const CustomerEditorScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.CustomerEditor>
> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, setValue } = useForm<Omit<Customer, "id">>({});
  const editingId = route.params?.id;

  const { mutate: mutateCreate, isLoading: isLoadingCreate } =
    useCustomerCreateMutation({
      onSuccess() {
        toast.success(
          t("entity.has_been_created", { name: t("customer.title_one") })
        );
        navigation.goBack();
      },
      onError(e) {
        toast.error(e.message);
      },
    });

  const { mutate: mutateEdit, isLoading: isLoadingEdit } =
    useCustomerUpdateMutation({
      onSuccess() {
        toast.success(
          t("entity.has_been_updated", { name: t("customer.title_one") })
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
            t("entity.has_been_created", { name: t("customer.title_one") })
          );
        }
      }),
    [t, handleSubmit, mutateCreate, mutateEdit, editingId]
  );

  const { data: dataGetEdit, status: statusGetEdit } = useCustomerQuery(
    editingId || -1
  );

  useEffect(() => {
    if (dataGetEdit) {
      setValue("name", dataGetEdit.name);
      setValue("loc_text", dataGetEdit.loc_text);
      setValue("note", dataGetEdit.note);
    }
  }, [dataGetEdit, setValue]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: editingId
        ? t("customer_editor.title_edit")
        : t("customer_editor.title_create"),
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
                  label={t("customer.name")}
                  error={!!error}
                  disabled={isLoading}
                />
                <FormHelperText
                  error={error}
                  name={t("customer.name")}
                  rules={rules.name}
                />
              </View>
            )}
            name="name"
          />
          <Controller
            control={control}
            rules={rules.locText}
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
                    label={t("customer.loc_text")}
                    error={!!error}
                    disabled={isLoading}
                  />
                  <FormHelperText
                    error={error}
                    name={t("customer.loc_text")}
                    rules={rules.locText}
                  />
                </View>
              );
            }}
            name="loc_text"
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
                  label={t("customer.note")}
                  multiline
                  numberOfLines={3}
                  disabled={isLoading}
                />
                <FormHelperText error={error} name={t("customer.note")} />
              </View>
            )}
            name="note"
          />
          {dataGetEdit && <CustomerDelete customer={dataGetEdit} />}
        </ScrollView>
      )}
    </View>
  );
};

export default CustomerEditorScreen;
