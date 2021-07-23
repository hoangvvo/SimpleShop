import { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Caption, Divider, FAB, List, Text, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ParamList, RouteName } from "screens/types";
import { useProductsStockQuery } from "services/calculate";
import { Product } from "services/product";
import { useProductsQuery } from "services/product/api";
import { TabThemeColor } from "styles/Colors";
import { styles as screenStyles } from "styles/screens";

const styles = StyleSheet.create({
  fab: {
    backgroundColor: TabThemeColor.product,
  },
  list: { flex: 1 },
  text: {
    fontWeight: "bold",
  },
  quantityTextHeader: {
    lineHeight: 12,
  },
  quantityText: {
    textAlign: "center",
    width: 52,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
  },
  listCenter: {
    justifyContent: "center",
  },
});

const ProductItem: FC<{ product: Product }> = ({ product }) => {
  const navigation = useNavigation();

  const onEdit = () =>
    navigation.navigate(RouteName.ProductEditor, { id: product.id });

  const { data: stocks } = useProductsStockQuery();

  return (
    <List.Item
      title={<Text style={styles.text}>{product.name}</Text>}
      right={({ style }) => (
        <View style={[style, styles.listCenter]}>
          <Text style={styles.quantityText}>{stocks?.[product.id]}</Text>
        </View>
      )}
      description={product.description}
      descriptionNumberOfLines={1}
      onPress={onEdit}
    />
  );
};

const renderItem: ListRenderItem<Product> = ({ item }) => (
  <ProductItem product={item} />
);

const keyExtractor = (item: Product) => String(item.id);

export const ProductsScreen: FC<
  MaterialBottomTabScreenProps<ParamList, RouteName.Products>
> = ({ navigation }) => {
  const { t } = useTranslation();
  const onAdd = useCallback(
    () => navigation.navigate(RouteName.ProductEditor),
    [navigation]
  );

  const { data } = useProductsQuery();

  return (
    <SafeAreaView style={screenStyles.root}>
      <View style={[screenStyles.content, screenStyles.contentRoot]}>
        <Title style={screenStyles.title}>{t("product.title_plural")}</Title>
        <FlatList
          style={styles.list}
          ItemSeparatorComponent={Divider}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <View style={styles.statHeader}>
              <Caption style={[styles.quantityText, styles.quantityTextHeader]}>
                {t("product.stock")}
              </Caption>
            </View>
          }
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
      <FAB
        accessibilityLabel={t("product_editor.title_create")}
        onPress={onAdd}
        style={[screenStyles.fab, styles.fab]}
        icon="plus"
      />
    </SafeAreaView>
  );
};
