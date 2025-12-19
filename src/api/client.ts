import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public details: unknown,
  ) {
    super(`API Error ${statusCode}`);
    this.name = "APIError";
  }
}

export function getAvatarUrl(characterId: string): string {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${baseUrl}/api/characters/${characterId}/avatar`;
}

export function getPersonaAvatarUrl(personaId: string): string {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${baseUrl}/api/personas/${personaId}/avatar`;
}
