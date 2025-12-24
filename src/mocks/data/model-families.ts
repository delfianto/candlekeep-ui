import type { components } from "@/api/schema";
import { allModelFamiliesMock } from "@/mocks/data/model-families-data";

type ModelFamilyPage = components["schemas"]["PaginatedResponse_ModelFamilyListResponse_"];
type ModelFamilyItem = components["schemas"]["ModelFamilyListResponse"];

// Helper to strip 'parameters' for the list view to reduce payload size
const toSummary = (item: any): ModelFamilyItem => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { parameters, ...rest } = item;
  return rest as ModelFamilyItem;
};

// Helper to generate a paginated response structure
const createPage = (
  items: any[],
  page: number,
  totalItems: number,
  limit: number = 10,
): ModelFamilyPage => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: items.map(toSummary),
    meta: {
      total: totalItems,
      page: page,
      limit: limit,
      has_more: page < totalPages,
    },
  };
};

const PAGE_LIMIT = 10;
const totalCount = allModelFamiliesMock.length;

// Generate the 3 simulated pages dynamically
export const modelFamiliesPages: ModelFamilyPage[] = [
  // Page 1
  createPage(allModelFamiliesMock.slice(0, PAGE_LIMIT), 1, totalCount, PAGE_LIMIT),
  // Page 2
  createPage(allModelFamiliesMock.slice(PAGE_LIMIT, PAGE_LIMIT * 2), 2, totalCount, PAGE_LIMIT),
  // Page 3
  createPage(allModelFamiliesMock.slice(PAGE_LIMIT * 2), 3, totalCount, PAGE_LIMIT),
];

// Generate the filtered "Claude" result dynamically
const claudeItems = allModelFamiliesMock.filter((item) =>
  item.name.toLowerCase().includes("claude"),
);

export const modelFamiliesFilteredByName: ModelFamilyPage = createPage(
  claudeItems,
  1,
  claudeItems.length,
  PAGE_LIMIT,
);
