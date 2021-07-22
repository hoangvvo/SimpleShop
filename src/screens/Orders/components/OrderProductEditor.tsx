import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  CustomBackdropModal,
  CustomBackgroundComponent,
} from "components/BottomSheet";
import { LoadingScreen } from "components/Loading";
import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BackHandler, ListRenderItem, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  Button,
  Divider,
  List,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { OrderProduct, OrderProductWithoutOrderId } from "services/order/types";
import { Product } from "services/product";
import { useProductsQuery } from "services/product/api";
import { toast } from "utils/toasts";

const snapPoints = ["85%"];

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "transparent",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  list: {
    flex: 1,
  },
  perPrice: {
    width: 120,
    marginRight: 12,
  },
  amount: {
    width: 80,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

type OrderProductMap = Map<Product["id"], OrderProductWithoutOrderId>;
type FormMapRef = Map<
  Product["id"],
  UseFormReturn<Pick<OrderProduct, "per_price" | "amount">>
>;

const rules = {
  amount: {
    required: true,
    min: 0,
    max: 1000000,
    validate: (v: number) => Number.isInteger(Number(v)),
  },
  perPrice: {
    required: true,
    min: 0,
    max: 1000000000,
    pattern: /^[0-9]+$/i,
  },
};

const ProductItem: FC<{
  product: Product;
  orderProductMapRef: MutableRefObject<OrderProductMap>;
  formMapRef: MutableRefObject<FormMapRef>;
  isBuyOrder: boolean;
}> = ({ product, orderProductMapRef, formMapRef, isBuyOrder }) => {
  const { t } = useTranslation();

  const form = useForm<Pick<OrderProduct, "per_price" | "amount">>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const formMapRefValue = formMapRef.current;
    formMapRefValue.set(product.id, form);
    return () => {
      formMapRefValue.delete(product.id);
    };
  }, [form, formMapRef, product.id]);

  const { control, setValue } = form;

  useEffect(() => {
    const orderProduct = orderProductMapRef.current.get(product.id);
    if (!orderProduct) return;
    setValue("per_price", orderProduct.per_price);
    setValue("amount", orderProduct.amount);
  }, [orderProductMapRef, product.id, setValue]);

  return (
    <List.Item
      title={product.name}
      right={() => (
        <>
          <Controller
            control={control}
            name="per_price"
            rules={rules.perPrice}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { invalid },
            }) => (
              <TextInput
                style={styles.perPrice}
                label={t("order.per_price")}
                dense
                mode="outlined"
                value={String(value)}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                error={invalid}
              />
            )}
            defaultValue={
              isBuyOrder
                ? product.default_buy_price
                : product.default_sell_price
            }
          />
          <Controller
            control={control}
            name="amount"
            rules={rules.amount}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { invalid },
            }) => (
              <TextInput
                style={styles.amount}
                label={t("order.amount")}
                dense
                mode="outlined"
                value={String(value)}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                error={invalid}
              />
            )}
            defaultValue={0}
          />
        </>
      )}
    />
  );
};

const keyExtractor = (item: Product) => String(item.id);

export const OrderProductEditor: FC<{
  isBuyOrder: boolean;
  orderProducts: OrderProductWithoutOrderId[];
  setOrderProducts: Dispatch<SetStateAction<OrderProductWithoutOrderId[]>>;
}> = ({ orderProducts, setOrderProducts, isBuyOrder }) => {
  const { t } = useTranslation();

  const totalPrice = useMemo(() => {
    let total = 0;
    for (const orderProduct of orderProducts) {
      total += orderProduct.amount * orderProduct.per_price;
    }
    return total;
  }, [orderProducts]);

  const sheetRef = useRef<BottomSheetModal>(null);
  const sheetIndexRef = useRef(-1);

  const { data: dataProducts, status: statusGetProducts } = useProductsQuery();

  const formMapRef = useRef<FormMapRef>(new Map());

  // A map used for initial values
  const orderProductMapRef = useRef<OrderProductMap>(new Map());
  useEffect(() => {
    orderProductMapRef.current.clear();
    for (const orderProduct of orderProducts) {
      orderProductMapRef.current.set(orderProduct.product_id, orderProduct);
    }
  }, [orderProducts]);

  const onDone = useCallback(() => {
    const values: OrderProductWithoutOrderId[] = [];
    for (const [productId, formRef] of formMapRef.current) {
      if (Object.keys(formRef.formState.errors).length > 0) {
        toast(t("form.form_is_invalid"));
        return;
      }
      const formValues = formRef.getValues();
      const amount = Number(formValues.amount);
      const perPrice = Number(formValues.per_price);
      values.push({
        amount,
        per_price: perPrice,
        product_id: productId,
      });
    }
    setOrderProducts(values);
    sheetRef.current?.dismiss();
  }, [t, setOrderProducts]);

  useEffect(() => {
    const onBackHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (sheetIndexRef.current === 0) {
          return true;
        }
        return false;
      }
    );
    return onBackHandler.remove;
  }, []);

  const onPressButton = useCallback(() => sheetRef.current?.present(), []);

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => {
      return (
        <ProductItem
          product={item}
          formMapRef={formMapRef}
          orderProductMapRef={orderProductMapRef}
          isBuyOrder={isBuyOrder}
        />
      );
    },
    [isBuyOrder]
  );

  const theme = useTheme();

  return (
    <>
      <Surface
        style={[styles.container, { borderColor: theme.colors.surface }]}
      >
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>{t("order.total")}</Text>
          <Text style={styles.totalText}>{totalPrice}</Text>
        </View>
        <Button icon="pencil" mode="outlined" onPress={onPressButton}>
          {t("order_editor.product_list")}
        </Button>
      </Surface>
      <BottomSheetModal
        backdropComponent={CustomBackdropModal}
        snapPoints={snapPoints}
        backgroundComponent={CustomBackgroundComponent}
        ref={sheetRef}
        handleComponent={null}
        onChange={(index) => (sheetIndexRef.current = index)}
      >
        <FlatList
          style={styles.list}
          ItemSeparatorComponent={Divider}
          data={dataProducts || []}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            statusGetProducts === "loading" ? <LoadingScreen /> : null
          }
        />
        <Button theme={{ roundness: 0 }} onPress={onDone} mode="contained">
          {t("action.done")}
        </Button>
      </BottomSheetModal>
    </>
  );
};
