/**
 * Utility functions for generating mock data dates
 */

const NOW = new Date();

/**
 * Generate a date in the past
 * @param daysAgo - Number of days in the past
 * @param additionalMs - Additional milliseconds offset (default: 0)
 * @returns ISO string date
 */
export function daysAgo(daysAgo: number, additionalMs: number = 0): string {
  return new Date(NOW.getTime() - daysAgo * 24 * 60 * 60 * 1000 + additionalMs).toISOString();
}

/**
 * Generate a date in the future
 * @param daysFromNow - Number of days in the future
 * @param additionalMs - Additional milliseconds offset (default: 0)
 * @returns ISO string date
 */
export function daysFromNow(daysFromNow: number, additionalMs: number = 0): string {
  return new Date(NOW.getTime() + daysFromNow * 24 * 60 * 60 * 1000 + additionalMs).toISOString();
}

/**
 * Generate a date with hours offset
 * @param hoursAgo - Number of hours in the past
 * @returns ISO string date
 */
export function hoursAgo(hoursAgo: number): string {
  return new Date(NOW.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();
}

/**
 * Generate a date with minutes offset
 * @param minutesAgo - Number of minutes in the past
 * @returns ISO string date
 */
export function minutesAgo(minutesAgo: number): string {
  return new Date(NOW.getTime() - minutesAgo * 60 * 1000).toISOString();
}

/**
 * Generate a date with seconds offset
 * @param secondsAgo - Number of seconds in the past
 * @returns ISO string date
 */
export function secondsAgo(secondsAgo: number): string {
  return new Date(NOW.getTime() - secondsAgo * 1000).toISOString();
}

/**
 * Get current timestamp as ISO string
 * @returns ISO string date
 */
export function now(): string {
  return NOW.toISOString();
}

/**
 * Generate random date within a range
 * @param minDaysAgo - Minimum days in the past
 * @param maxDaysAgo - Maximum days in the past
 * @returns ISO string date
 */
export function randomDateInRange(minDaysAgo: number, maxDaysAgo: number): string {
  const min = minDaysAgo * 24 * 60 * 60 * 1000;
  const max = maxDaysAgo * 24 * 60 * 60 * 1000;
  const randomOffset = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Date(NOW.getTime() - randomOffset).toISOString();
}

/**
 * Create date pair (created_at, updated_at) for mock entities
 * @param createdDaysAgo - Days ago the entity was created
 * @param updatedDaysAgo - Days ago the entity was last updated (default: 0 = now)
 * @returns Object with created_at and updated_at ISO strings
 */
export function datePair(
  createdDaysAgo: number,
  updatedDaysAgo: number = 0,
): {
  created_at: string;
  updated_at: string;
} {
  return {
    created_at: daysAgo(createdDaysAgo),
    updated_at: updatedDaysAgo === 0 ? now() : daysAgo(updatedDaysAgo),
  };
}

/**
 * Generate sequential message timestamps for a chat session
 * @param startDaysAgo - Days ago the chat started
 * @param messageCount - Number of messages
 * @param averageDelayMinutes - Average delay between messages (default: 5)
 * @returns Array of ISO string timestamps
 */
export function chatMessageTimestamps(
  startDaysAgo: number,
  messageCount: number,
  averageDelayMinutes: number = 5,
): string[] {
  const startTime = NOW.getTime() - startDaysAgo * 24 * 60 * 60 * 1000;
  const timestamps: string[] = [];

  let currentTime = startTime;
  for (let i = 0; i < messageCount; i++) {
    timestamps.push(new Date(currentTime).toISOString());
    // Add random delay between 1 minute and 2x average delay
    const delay = (Math.random() * averageDelayMinutes * 2 + 1) * 60 * 1000;
    currentTime += delay;
  }

  return timestamps;
}

/**
 * Generate a random number for IDs
 * @param min - Minimum value (default: 1000)
 * @param max - Maximum value (default: 9999)
 * @returns Random integer
 */
export function randomId(min: number = 1000, max: number = 9999): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Convert string to URL-friendly slug
 * @param text - Text to slugify
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Generate character ID in format: [random_number]-[url-friendly-char-name-slug]
 * @param name - Character name
 * @returns Character ID
 */
export function generateCharacterId(name: string): string {
  return `${randomId()}-${slugify(name)}`;
}

/**
 * Generate chat ID in format: [char_id]_[random_number]
 * @param characterId - Character ID
 * @returns Chat ID
 */
export function generateChatId(characterId: string): string {
  return `${characterId}_${randomId()}`;
}

/**
 * Generate message ID in format: [chat_id]_[sequence_number]
 * @param chatId - Chat ID
 * @param sequence - Message sequence number
 * @returns Message ID
 */
export function generateMessageId(chatId: string, sequence: number): string {
  return `${chatId}_${sequence}`;
}

/**
 * Consolidated date mock utilities
 */
export const dateMock = {
  now,
  daysAgo,
  daysFromNow,
  hoursAgo,
  minutesAgo,
  secondsAgo,
  randomDateInRange,
  datePair,
  chatMessageTimestamps,
};

/**
 * Consolidated ID generation utilities
 */
export const idMock = {
  randomId,
  slugify,
  generateCharacterId,
  generateChatId,
  generateMessageId,
};
