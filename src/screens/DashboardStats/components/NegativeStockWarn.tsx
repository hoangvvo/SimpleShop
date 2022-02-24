import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Banner } from "react-native-paper";
import { RouteName } from "screens/types";
import { useProductsStockQuery } from "services/calculate";

const NegativeStockWarn: FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: stocks } = useProductsStockQuery();
  const hasNegativeStock = useMemo(
    () => !!stocks && Object.values(stocks).some((stock) => stock < 0),
    [stocks]
  );
  return (
    <Banner
      visible={hasNegativeStock}
      icon="alert"
      actions={[
        {
          label: t("action.see_more"),
          onPress: () => navigation.navigate(RouteName.Products),
        },
      ]}
      style={{ marginBottom: 10 }}
    >
      {t("error.negative_stock")}
    </Banner>
  );
};

export default NegativeStockWarn;
