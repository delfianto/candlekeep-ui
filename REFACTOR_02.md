Here are the detailed implementation guides for both the Backend and Frontend.

### **BACKEND.md**

````markdown
# Backend Implementation Guide: Cursor-Based Pagination

This guide details the implementation of cursor-based pagination for the Chat Message API. This approach is superior to offset pagination for real-time chat interfaces as it prevents "skipping" or "duplicating" messages when new messages arrive during a user's session.

## Overview

We will implement "seek" pagination using the `created_at` timestamp as our cursor.

1. **Default Fetch**: Returns the $N$ most recent messages (ordered Newest → Oldest).
2. **Cursor Fetch**: Returns $N$ messages strictly _older_ than a specific timestamp.

## Step 1: Repository Layer

**File:** `src/chat_message/repository_async.py`

Add a method to fetch messages in reverse chronological order (Newest First) with a filter for the cursor.

```python
from datetime import datetime
from typing import Optional
from sqlalchemy import select

# ... inside AsyncMessageRepository class ...

    async def find_latest_by_chat_id(
        self,
        chat_id: str,
        limit: int,
        before: Optional[datetime] = None
    ) -> list[Message]:
        """
        Fetch latest messages for a chat, capable of 'scrolling back' in time.

        Args:
            chat_id: The chat ID.
            limit: Maximum number of messages to return.
            before: The cursor (timestamp). If set, only return messages created BEFORE this time.
        """
        # Base query: Filter by chat_id
        stmt = select(Message).where(Message.chat_id == chat_id)

        # Apply Cursor: "Give me messages older than the top message I currently see"
        if before:
            stmt = stmt.where(Message.created_at < before)

        # Ordering: ALWAYS Newest -> Oldest for efficient pagination
        stmt = stmt.order_by(Message.created_at.desc())

        # Limit the batch size
        stmt = stmt.limit(limit)

        result = await self.db.execute(stmt)

        # Return list (Note: Consumer may need to reverse this list for display)
        return list(result.scalars().all())
```
````

## Step 2: Service Layer

**File:** `src/chat_message/service.py`

Update the `get_messages` method to handle the cursor string parsing and pass parameters to the repository.

```python
# ... inside ChatMessageService class ...

    async def get_messages(
        self,
        chat_id: str,
        limit: int = 20,
        cursor: str | None = None
    ) -> list[Message]:
        """
        Get messages with cursor-based pagination.

        Args:
            cursor: ISO 8601 datetime string representing the oldest message currently loaded.
        """
        # 1. Verify chat exists
        await self._get_chat_by_id(chat_id)

        # 2. Parse Cursor
        before_time = None
        if cursor:
            try:
                # Handle "Z" suffix if present from JS Date.toISOString()
                before_time = datetime.fromisoformat(cursor.replace("Z", "+00:00"))
            except ValueError:
                # If cursor is invalid, log it or ignore it to fetch latest
                pass

        # 3. Fetch Data
        messages = await self.message_repo.find_latest_by_chat_id(
            chat_id=chat_id,
            limit=limit,
            before=before_time
        )

        # Optional: Reverse here if your frontend strictly expects [Oldest ... Newest]
        # However, keeping them [Newest ... Oldest] is often easier for the frontend
        # to determine the "next cursor" (which is the last item in this list).
        return messages

```

## Step 3: Router Layer

**File:** `src/chat_message/router.py`

Update the endpoint to accept standard pagination query parameters.

```python
from typing import Optional
from fastapi import Query

# ... inside router ...

@router.get("", response_model=list[MessageResponse])
async def get_chat_messages(
    chat_id: str,
    service: ChatMessageServiceDep,
    limit: int = Query(default=20, ge=1, le=100, description="Number of messages to load"),
    cursor: Optional[str] = Query(default=None, description="ISO datetime of the oldest loaded message")
):
    """
    Get chat messages.

    * **Initial Load**: Call without `cursor`. Returns latest `limit` messages.
    * **Load More**: Call with `cursor` set to the `created_at` of the top-most message in your view.
    """
    return await service.get_messages(chat_id, limit=limit, cursor=cursor)

```

````

---

### **FRONTEND.md**

```markdown
# Frontend Implementation Guide: Infinite Scroll Up

This guide details how to consume the paginated Chat API to build a seamless "Scroll Up to Load More" experience, similar to WhatsApp, Slack, or Discord.

## The Challenge
When you load older messages and insert them at the top of a list, the browser keeps the scroll position static relative to the *top* of the container. This pushes the content the user was reading down and out of view (a "visual jump"). We must manually adjust the scroll position to prevent this.

## 1. API Client Strategy

Ensure your API fetcher can handle the `cursor` param.

```typescript
// Example API call
async function fetchMessages(chatId: string, cursor?: string) {
  const params = new URLSearchParams({ limit: '20' });
  if (cursor) {
    params.append('cursor', cursor);
  }

  const response = await fetch(`/api/chats/${chatId}/messages?${params}`);
  return response.json();
}

````

## 2. Data Structure & Ordering

The backend returns messages sorted **Newest First** (DESC).

- **Network Response**: `[Message T (newest), Message T-1, ... Message T-20 (oldest)]`
- **UI Render Order**: Usually **Oldest First** (Top to Bottom).

You must reverse the batch received from the API before prepending it to your state.

**State Variables:**

- `messages`: Array of message objects.
- `oldestMessageCursor`: The `created_at` timestamp of `messages[0]`.
- `isLoading`: Boolean to prevent duplicate fetches.
- `hasMore`: Boolean (false if API returns fewer items than `limit`).

## 3. Implementation Steps (React/Vue Logic)

### A. Initial Load

1. Fetch without a cursor.
2. Reverse the result (`result.reverse()`).
3. Set `messages`.
4. Scroll the container to the **bottom**.

### B. Detect "Scroll to Top"

Add a scroll event listener to your chat container (e.g., `<div class="chat-viewport">`).

```javascript
const handleScroll = (e) => {
    const container = e.target;

    // Threshold: e.g., if user is within 50px of the top
    if (container.scrollTop < 50 && !isLoading && hasMore) {
        loadOlderMessages();
    }
};
```

### C. The "Seamless" Load Logic (Crucial)

This is the specific sequence required to prevent the visual jump.

```javascript
async function loadOlderMessages() {
    setIsLoading(true);

    // 1. CAPTURE CURRENT GEOMETRY
    // We need the height of the content BEFORE we add new items.
    const container = chatContainerRef.current;
    const previousScrollHeight = container.scrollHeight;

    // 2. FETCH DATA
    // Use the timestamp of the FIRST message in your current list as the cursor
    const cursor = messages[0].created_at;
    const newBatch = await fetchMessages(chatId, cursor);

    if (newBatch.length < 20) setHasMore(false);

    // 3. UPDATE STATE
    // Prepend the new messages (reversed to correct chronological order)
    const sortedBatch = newBatch.reverse();
    setMessages((prev) => [...sortedBatch, ...prev]);

    // 4. RESTORE SCROLL POSITION (Layout Effect)
    // Use useLayoutEffect (React) or nextTick (Vue) to run this
    // immediately after the DOM updates but BEFORE the browser paints.
    requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        const heightDifference = newScrollHeight - previousScrollHeight;

        // Adjust scrollTop by the exact amount of content added
        container.scrollTop = container.scrollTop + heightDifference;
    });

    setIsLoading(false);
}
```

## 4. CSS Recommendations

To make the "stick to bottom" behavior easier for new messages, consider using `flex-direction: column-reverse`.

**Option A: Standard Column (Requires manual "Scroll to Bottom" on load)**

```css
.chat-container {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
```

**Option B: Column Reverse (Browser handles "stick to bottom" automatically)**
_Note: If you use this, you must reverse your `messages` array in the UI code so index 0 is at the bottom._

```css
.chat-container {
    display: flex;
    flex-direction: column-reverse; /* Bottom is "Top" */
    overflow-y: auto;
}
/* With this method, "scrolling up" technically means scrolling to a negative value or checking scrollHeight - scrollTop */
```

_Recommendation: Stick to **Option A** (Standard Column) as it is more intuitive for implementing the "Scroll Jump Fix" described in Step 3._

```

```
