import { useSQLite } from "db";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { ProductService } from "./service";
import { Product } from "./types";

const invalidateCache = (client: QueryClient, productId?: Product["id"]) => {
  client.invalidateQueries("products");
  if (productId) client.invalidateQueries(["product", productId]);
};

export const useProductsQuery = () => {
  const db = useSQLite();
  return useQuery<Product[]>("products", () => ProductService.findAll(db));
};

export const useProductQuery = (id: Product["id"]) => {
  const db = useSQLite();
  return useQuery<Product | null>(["product", id], () =>
    id === -1 ? null : ProductService.findById(db, id)
  );
};

export const useProductCreateMutation = () => {
  const client = useQueryClient();
  const db = useSQLite();
  return useMutation<void, Error, Omit<Product, "id">>(async (data) => {
    await ProductService.create(db, data);
    invalidateCache(client);
  });
};

export const useProductUpdateMutation = () => {
  const db = useSQLite();
  const client = useQueryClient();
  return useMutation<void, Error, Product>(async ({ id, ...data }) => {
    await ProductService.update(db, id, data);
    invalidateCache(client, id);
  });
};

export const useProductDeleteMutation = () => {
  const db = useSQLite();
  const client = useQueryClient();
  return useMutation<void, Error, Pick<Product, "id">>(async ({ id }) => {
    await ProductService.delete(db, id);
    invalidateCache(client, id);
  });
};
