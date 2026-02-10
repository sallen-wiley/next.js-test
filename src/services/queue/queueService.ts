// Invitation queue management service
import { supabase } from "../shared/supabaseClient";
import type { InvitationQueueItem } from "@/lib/supabase";

/**
 * Fetch invitation queue for a specific manuscript
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptQueue(
  manuscriptId: string,
): Promise<InvitationQueueItem[]> {
  // Fetch queue items without join
  const { data, error } = await supabase
    .from("invitation_queue")
    .select("*")
    .eq("manuscript_id", manuscriptId)
    .order("queue_position", { ascending: true });

  if (error) {
    console.error("Error fetching manuscript queue:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Get unique reviewer IDs
  const reviewerIds = [...new Set(data.map((item) => item.reviewer_id))];

  // Fetch reviewer details for all reviewer IDs
  const { data: reviewers } = await supabase
    .from("potential_reviewers")
    .select("id, name, affiliation")
    .in("id", reviewerIds);

  // Create a map of reviewer data
  const reviewerMap = new Map((reviewers || []).map((r) => [r.id, r]));

  // Combine queue data with reviewer details
  const queueItems: InvitationQueueItem[] = data.map((item) => {
    const reviewer = reviewerMap.get(item.reviewer_id);
    return {
      id: item.id,
      manuscript_id: item.manuscript_id,
      reviewer_id: item.reviewer_id,
      queue_position: item.queue_position,
      created_date: item.created_date,
      scheduled_send_date: item.scheduled_send_date,
      priority: item.priority,
      notes: item.notes,
      reviewer_name: reviewer?.name || "Unknown Reviewer",
      reviewer_affiliation: reviewer?.affiliation,
    };
  });

  return queueItems;
}

/**
 * Add a reviewer to the invitation queue
 * @param manuscriptId - The manuscript UUID
 * @param reviewerId - The reviewer UUID
 * @param priority - Queue priority level
 */
export async function addToQueue(
  manuscriptId: string,
  reviewerId: string,
  priority: "high" | "normal" | "low" = "normal",
): Promise<InvitationQueueItem | null> {
  // Check if reviewer already has an invitation
  const { data: existingInvitation } = await supabase
    .from("review_invitations")
    .select("id")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existingInvitation) {
    throw new Error(
      "Cannot add to queue: Reviewer already has an invitation for this manuscript",
    );
  }

  // Check if reviewer is already in queue
  const { data: existingQueueItem } = await supabase
    .from("invitation_queue")
    .select("id")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existingQueueItem) {
    throw new Error("Reviewer is already in the queue for this manuscript");
  }

  // Get current max position for this manuscript
  const { data: existingQueue } = await supabase
    .from("invitation_queue")
    .select("queue_position")
    .eq("manuscript_id", manuscriptId)
    .order("queue_position", { ascending: false })
    .limit(1);

  const nextPosition =
    existingQueue && existingQueue.length > 0
      ? existingQueue[0].queue_position + 1
      : 1;

  // Calculate scheduled send date (weekly intervals)
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + nextPosition * 7);

  const { data, error } = await supabase
    .from("invitation_queue")
    .insert({
      manuscript_id: manuscriptId,
      reviewer_id: reviewerId,
      queue_position: nextPosition,
      scheduled_send_date: scheduledDate.toISOString(),
      priority,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding to queue:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });
    throw new Error(
      `Failed to add to queue: ${error.message || JSON.stringify(error)}`,
    );
  }

  if (!data) {
    return null;
  }

  // Fetch reviewer details
  const { data: reviewer } = await supabase
    .from("potential_reviewers")
    .select("name, affiliation")
    .eq("id", reviewerId)
    .single();

  // Return with reviewer details
  return {
    ...data,
    reviewer_name: reviewer?.name || "Unknown Reviewer",
    reviewer_affiliation: reviewer?.affiliation,
  };
}

/**
 * Remove a reviewer from the invitation queue
 * @param queueItemId - The queue item UUID
 */
export async function removeFromQueue(queueItemId: string): Promise<void> {
  // First, get the item being removed to know its position and manuscript
  const { data: itemToRemove, error: fetchError } = await supabase
    .from("invitation_queue")
    .select("queue_position, manuscript_id")
    .eq("id", queueItemId)
    .single();

  if (fetchError) {
    console.error("Error fetching queue item:", fetchError);
    throw fetchError;
  }

  // Delete the item
  const { error: deleteError } = await supabase
    .from("invitation_queue")
    .delete()
    .eq("id", queueItemId);

  if (deleteError) {
    console.error("Error removing from queue:", deleteError);
    throw deleteError;
  }

  // Renumber remaining items with higher positions
  // Get all items with higher positions in the same manuscript queue
  const { data: itemsToRenumber, error: renumberFetchError } = await supabase
    .from("invitation_queue")
    .select("id, queue_position")
    .eq("manuscript_id", itemToRemove.manuscript_id)
    .gt("queue_position", itemToRemove.queue_position)
    .order("queue_position", { ascending: true });

  if (renumberFetchError) {
    console.error("Error fetching items to renumber:", renumberFetchError);
    throw renumberFetchError;
  }

  // Update positions (decrement each by 1)
  if (itemsToRenumber && itemsToRenumber.length > 0) {
    const updates = itemsToRenumber.map((item) => ({
      id: item.id,
      queue_position: item.queue_position - 1,
    }));

    await updateQueuePositions(updates);
  }
}

/**
 * Update queue positions (for drag-and-drop reordering)
 * @param updates - Array of {id, newPosition} objects
 */
export async function updateQueuePositions(
  updates: Array<{ id: string; queue_position: number }>,
): Promise<void> {
  // Update each item's position
  const promises = updates.map(({ id, queue_position }) =>
    supabase.from("invitation_queue").update({ queue_position }).eq("id", id),
  );

  const results = await Promise.all(promises);

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    console.error("Error updating queue positions:", errors);
    throw new Error("Failed to update queue positions");
  }
}

/**
 * Move a queued reviewer up or down in the queue
 * @param queueItemId - The queue item UUID
 * @param direction - 'up' or 'down'
 */
export async function moveInQueue(
  queueItemId: string,
  direction: "up" | "down",
): Promise<void> {
  // Get the current item
  const { data: currentItem, error: fetchError } = await supabase
    .from("invitation_queue")
    .select("*")
    .eq("id", queueItemId)
    .single();

  if (fetchError || !currentItem) {
    console.error("Error fetching queue item:", fetchError);
    throw fetchError || new Error("Queue item not found");
  }

  const currentPosition = currentItem.queue_position;
  const newPosition =
    direction === "up" ? currentPosition - 1 : currentPosition + 1;

  // Can't move beyond bounds
  if (newPosition < 1) {
    throw new Error("Cannot move higher - already at top of queue");
  }

  // Get the item at the target position
  const { data: targetItem, error: targetError } = await supabase
    .from("invitation_queue")
    .select("*")
    .eq("manuscript_id", currentItem.manuscript_id)
    .eq("queue_position", newPosition)
    .single();

  if (targetError && targetError.code !== "PGRST116") {
    // PGRST116 = no rows returned
    console.error("Error fetching target item:", targetError);
    throw targetError;
  }

  if (!targetItem) {
    throw new Error(
      `Cannot move ${direction} - no item at position ${newPosition}`,
    );
  }

  // Swap positions
  await updateQueuePositions([
    { id: currentItem.id, queue_position: newPosition },
    { id: targetItem.id, queue_position: currentPosition },
  ]);
}

/**
 * Get or create queue control state for a manuscript
 * Note: This is a demo function - queue_active is not yet in database
 * @param manuscriptId - The manuscript UUID
 */
export async function getQueueControlState(
  manuscriptId: string,
): Promise<import("@/lib/supabase").QueueControlState> {
  // TODO: When queue_active is added to manuscripts table, fetch from there
  // For now, return demo data based on queue existence

  const { data: queueItems } = await supabase
    .from("invitation_queue")
    .select("scheduled_send_date")
    .eq("manuscript_id", manuscriptId)
    .order("scheduled_send_date", { ascending: true })
    .limit(1);

  return {
    manuscript_id: manuscriptId,
    queue_active: false, // Demo: always false for now
    next_scheduled_send: queueItems?.[0]?.scheduled_send_date,
  };
}

/**
 * Toggle queue active state for a manuscript
 * Note: This is a demo function - queue_active is not yet in database
 * @param manuscriptId - The manuscript UUID
 * @param active - Whether queue should be active
 */
export async function toggleQueueActive(
  manuscriptId: string,
  active: boolean,
): Promise<void> {
  // TODO: When queue_active is added to manuscripts table, update it here
  console.log(
    `Demo: Queue for manuscript ${manuscriptId} set to ${
      active ? "active" : "paused"
    }`,
  );

  // For now, this is just a demo function
  // In production, this would:
  // 1. Update manuscripts.queue_active = active
  // 2. Trigger/pause automated queue processing
}
