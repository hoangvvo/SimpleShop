import { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  Caption,
  Colors,
  Divider,
  FAB,
  List,
  Text,
  Title,
} from "react-native-paper";
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
  listHeadQuantity: {
    lineHeight: 12,
    width: 56,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
  },
  listQuantityText: {
    textAlign: "center",
    width: 56,
  },
  listSide: {
    justifyContent: "center",
  },
  listTitle: {
    fontWeight: "bold",
  },
});

const ProductItem: FC<{ product: Product }> = ({ product }) => {
  const navigation = useNavigation();

  const onEdit = useCallback(
    () => navigation.navigate(RouteName.ProductEditor, { id: product.id }),
    [navigation, product.id]
  );

  const { data: stocks } = useProductsStockQuery();

  const stockCount = stocks?.[product.id] || 0;

  return (
    <List.Item
      title={<Text style={styles.listTitle}>{product.name}</Text>}
      right={({ style }) => (
        <View style={[style, styles.listSide]}>
          <Text
            style={[
              styles.listQuantityText,
              stockCount < 0 && { color: Colors.red500 },
            ]}
          >
            {stockCount}
          </Text>
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
            <View style={styles.listHeader}>
              <Caption style={styles.listHeadQuantity}>
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
