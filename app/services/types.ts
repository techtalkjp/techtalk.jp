import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type SampleOrder = {
    id: string;
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
    updatedAt: Generated<string>;
    createdAt: Generated<string>;
};
export type FtsContents = {
    id: Generated<number>;
    title: string;
    body: string;
    createdAt: Generated<string>;
};

export type UploadedFile = {
    id: Generated<number>;
    key: string;
    contentType: string | null;
    size: number;
    createdAt: Generated<string>;
};

export type DB = {
    sampleOrders: SampleOrder;
    ftsContents: FtsContents;
    uploadedFiles: UploadedFile;
};
