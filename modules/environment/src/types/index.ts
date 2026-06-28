export type AssetCategory = "workspace" | "hardware" | "software" | "furniture" | "other";
export type AssetStatus = "owned" | "planned" | "sold";

export interface EnvironmentAsset {
  readonly _id: string;
  readonly name: string;
  readonly category: AssetCategory;
  readonly status: AssetStatus;
  readonly note?: string;
  readonly purchasedAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface EnvironmentProject {
  readonly _id: string;
  readonly title: string;
  readonly description?: string;
  readonly completed: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
