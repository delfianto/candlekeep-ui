import type { components } from "@/api/schema";
import { allModelsMock } from "@/mocks/data/models-data";

type ModelPage = components["schemas"]["PaginatedResponse_ModelResponse_"];
type ModelItem = components["schemas"]["ModelResponse"];

// Helper to generate a paginated response structure
const createPage = (
  items: ModelItem[],
  page: number,
  totalItems: number,
  limit: number = 10,
): ModelPage => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: items,
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
