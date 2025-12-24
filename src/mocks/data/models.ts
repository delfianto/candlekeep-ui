import type { components } from "@/api/schema";
import { allModelsMock } from "@/mocks/data/models-data";

type ModelPage = components["schemas"]["PaginatedResponse_ModelListResponse_"];
type ModelItem = components["schemas"]["ModelListResponse"];

// Helper to generate a paginated response structure
const createPage = (
  items: any[],
  page: number,
  totalItems: number,
  limit: number = 10,
): ModelPage => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: items as ModelItem[],
    meta: {
      total: totalItems,
      page: page,
      limit: limit,
      has_more: page < totalPages,
    },
  };
};

const PAGE_LIMIT = 10;
const totalCount = allModelsMock.length;

export const modelsPages: ModelPage[] = [
  // Page 1
  createPage(allModelsMock.slice(0, PAGE_LIMIT), 1, totalCount, PAGE_LIMIT),
  // Page 2
  createPage(allModelsMock.slice(PAGE_LIMIT, PAGE_LIMIT * 2), 2, totalCount, PAGE_LIMIT),
  // Page 3
  createPage(allModelsMock.slice(PAGE_LIMIT * 2), 3, totalCount, PAGE_LIMIT),
];

// Generate the filtered "Claude" result dynamically
const claudeItems = allModelsMock.filter((item) => item.name.toLowerCase().includes("claude"));

export const modelsFilteredByName: ModelPage = createPage(
  claudeItems,
  1,
  claudeItems.length,
  PAGE_LIMIT,
);
