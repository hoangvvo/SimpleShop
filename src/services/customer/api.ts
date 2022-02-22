import { useSQLite } from "db";
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "react-query";
import { CustomerService } from "./service";
import { Customer } from "./types";

const invalidateCache = (client: QueryClient, customerId?: Customer["id"]) => {
  client.invalidateQueries("customers");
  if (customerId) client.invalidateQueries(["customer", customerId]);
};

export const useCustomersQuery = () => {
  const db = useSQLite();
  return useQuery<Customer[]>("customers", () => CustomerService.findAll(db));
};

export const useCustomerQuery = (id: Customer["id"]) => {
  const db = useSQLite();
  return useQuery<Customer | null>(["customer", id], () =>
    id === -1 ? null : CustomerService.findById(db, id)
  );
};

export const useCustomerCreateMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, Omit<Customer, "id">, unknown>,
    "mutationFn"
  >
) => {
  const client = useQueryClient();
  const db = useSQLite();
  return useMutation<void, Error, Omit<Customer, "id">>(async (data) => {
    await CustomerService.create(db, data);
    invalidateCache(client);
  }, options);
};

export const useCustomerUpdateMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, Customer, unknown>,
    "mutationFn"
  >
) => {
  const client = useQueryClient();
  const db = useSQLite();
  return useMutation<void, Error, Customer>(async ({ id, ...data }) => {
    await CustomerService.update(db, id, data);
    invalidateCache(client, id);
  }, options);
};

export const useCustomerDeleteMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, Pick<Customer, "id">, unknown>,
    "mutationFn"
  >
) => {
  const client = useQueryClient();
  const db = useSQLite();
  return useMutation<void, Error, Pick<Customer, "id">>(async ({ id }) => {
    await CustomerService.delete(db, id);
    invalidateCache(client, id);
  }, options);
};
