// SPDX-FileCopyrightText: Advanced Micro Devices, Inc.
// SPDX-License-Identifier: Apache-2.0

/// <reference path="../.astro/types.d.ts" />

// @rollup/plugin-yaml returns the parsed document as the default export.
declare module "*.yaml" {
  const data: any;
  export default data;
}
declare module "*.yml" {
  const data: any;
  export default data;
}
