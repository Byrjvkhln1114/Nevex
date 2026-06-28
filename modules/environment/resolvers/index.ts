import { findAllAssets } from "../src/repository";
import { acquireAsset } from "../src/services";
import type { EnvironmentAsset } from "../src/types";

export const environmentResolvers = {
  EnvironmentQuery: { assets: () => findAllAssets() },
  EnvironmentMutation: {
    acquireAsset: (_: unknown, args: { input: Omit<EnvironmentAsset, "_id" | "createdAt" | "updatedAt"> }) =>
      acquireAsset(args.input),
  },
  EnvironmentAsset: { id: (a: { _id: string }) => a._id },
};
