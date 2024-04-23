import type { ColumnType, GeneratedAlways } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type SampleOrder = {
    id: GeneratedAlways<string>;
    region: string;
    name: string;
    email: string;
    zip: string;
    country: string;
    prefecture: string;
    city: string;
    address: string;
    phone: string;
    note: string | null;
    createdAt: Generated<string>;
};
export type DB = {
    sampleOrders: SampleOrder;
};
