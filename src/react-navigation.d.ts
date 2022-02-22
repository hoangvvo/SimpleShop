import type { ParamList } from "./screens/types";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends ParamList {}
  }
}
