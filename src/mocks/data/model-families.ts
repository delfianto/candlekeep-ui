import type { components } from "@/api/schema";
import { allModelFamiliesMock } from "@/mocks/data/model-families-data";

type ModelFamilyPage = components["schemas"]["PaginatedResponse_ModelFamilyResponse_"];
type ModelFamilyItem = components["schemas"]["ModelFamilyResponse"];

// Helper to strip 'parameters' for the list view to reduce payload size
const toSummary = (item: ModelFamilyItem): ModelFamilyItem => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { parameters, ...rest } = item;
  return rest as ModelFamilyItem;
};

// Helper to generate a paginated response structure
const createPage = (
  items: ModelFamilyItem[],
  page: number,
  totalItems: number,
  limit: number = 10,
): ModelFamilyPage => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: items.map(toSummary),
    total_items: totalItems,
    current_page: page,
    limit: limit,
    has_next_page: page < totalPages,
    has_previous_page: page > 1,
    next_page: page < totalPages ? page + 1 : null,
    previous_page: page > 1 ? page - 1 : null,
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
