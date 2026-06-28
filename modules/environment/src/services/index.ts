import { createAsset } from "../repository";
import { emitAssetAcquired } from "../events";
import type { EnvironmentAsset } from "../types";

export async function acquireAsset(
  input: Omit<EnvironmentAsset, "_id" | "createdAt" | "updatedAt">
): Promise<EnvironmentAsset> {
  const asset = await createAsset(input);
  if (asset.status === "owned") {
    emitAssetAcquired({ assetId: asset._id, assetName: asset.name, category: asset.category });
  }
  return asset;
}
