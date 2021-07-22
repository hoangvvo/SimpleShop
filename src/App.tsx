import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationBar } from "components/NavigationBar";
import merge from "deepmerge";
import { InitComponent } from "InitComponent";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { LogBox, StatusBar } from "react-native";
import "react-native-gesture-handler";
import {
  Colors,
  DefaultTheme as PaperDefaultTheme,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { DashboardScreen } from "screens/Dashboard";
import { OrderEditorScreen, OrdersScreen } from "screens/Orders";
import { ProductEditorScreen, ProductsScreen } from "screens/Products";
import { SettingsScreen } from "screens/Settings";
import { RouteName } from "screens/types";
import { TabThemeColor } from "styles/Colors";

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const OverrideTheme = { colors: { primary: Colors.blue500 } };
const CombinedDefaultTheme = merge(
  merge(PaperDefaultTheme, NavigationDefaultTheme),
  OverrideTheme
) as any;

const Main: FC = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator shifting>
      <Tab.Screen
        name={RouteName.Dashboard}
        component={DashboardScreen}
        options={{
          tabBarLabel: t("dashboard.title"),
          tabBarIcon: "home",
          tabBarColor: TabThemeColor.dashboard,
        }}
      />
      <Tab.Screen
        name={RouteName.Orders}
        component={OrdersScreen}
        options={{
          tabBarLabel: t("order.title_plural"),
          tabBarIcon: "clipboard-text",
          tabBarColor: TabThemeColor.order,
        }}
      />
      <Tab.Screen
        name={RouteName.Products}
        component={ProductsScreen}
        options={{
          tabBarLabel: t("product.title_plural"),
          tabBarIcon: "shopping",
          tabBarColor: TabThemeColor.product,
        }}
      />
    </Tab.Navigator>
  );
};

const queryClient = new QueryClient();

const App: FC = () => {
  const { t } = useTranslation();
  return (
    <PaperProvider theme={CombinedDefaultTheme}>
      <InitComponent>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider
            style={{ backgroundColor: CombinedDefaultTheme.colors.background }}
          >
            <StatusBar translucent backgroundColor="transparent" />
            <Portal.Host>
              <BottomSheetModalProvider>
                <NavigationContainer theme={CombinedDefaultTheme}>
                  <Stack.Navigator
                    screenOptions={{
                      header(props) {
                        return <NavigationBar {...props} />;
                      },
                    }}
                  >
                    <Stack.Screen
                      name={RouteName.Main}
                      component={Main}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={RouteName.OrderEditor}
                      component={OrderEditorScreen}
                      options={{
                        headerTitle: "",
                        headerTintColor: TabThemeColor.order,
                      }}
                    />
                    <Stack.Screen
                      name={RouteName.ProductEditor}
                      component={ProductEditorScreen}
                      options={{
                        headerTitle: "",
                        headerTintColor: TabThemeColor.product,
                      }}
                    />
                    <Stack.Screen
                      name={RouteName.Settings}
                      component={SettingsScreen}
                      options={{
                        headerTitle: t("settings.title"),
                      }}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </BottomSheetModalProvider>
            </Portal.Host>
          </SafeAreaProvider>
        </QueryClientProvider>
      </InitComponent>
    </PaperProvider>
  );
};

export default App;
