import React from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Stack,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReviewerWithStatus, QueueControlState } from "@/lib/supabase";
import { InvitedReviewerCard } from "./InvitedReviewerCard";
import { QueuedReviewerCard } from "./QueuedReviewerCard";

interface QueueInvitationsTabProps {
  reviewersWithStatus: ReviewerWithStatus[];
  queueControl: QueueControlState | null;
  onToggleQueue: () => void;
  onActionMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    reviewer: ReviewerWithStatus,
  ) => void;
}

// Sortable wrapper for queue cards
function SortableQueueCard({
  reviewer,
  onActionMenuOpen,
  onMoveUp,
  onMoveDown,
}: {
  reviewer: ReviewerWithStatus;
  onActionMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    reviewer: ReviewerWithStatus,
  ) => void;
  onMoveUp: (reviewer: ReviewerWithStatus) => void;
  onMoveDown: (reviewer: ReviewerWithStatus) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: reviewer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <QueuedReviewerCard
        reviewer={reviewer}
        onActionMenuOpen={onActionMenuOpen}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </Box>
  );
}

export default function QueueInvitationsTab({
  reviewersWithStatus,
  queueControl,
  onActionMenuOpen,
}: QueueInvitationsTabProps) {
  // Separate sent invitations from queued invitations
  const sentInvitations = reviewersWithStatus.filter(
    (r) => r.invitation_status && r.invitation_status !== "queued",
  );
  const queuedInvitations = reviewersWithStatus.filter(
    (r) => r.invitation_status === "queued",
  );

  // Collapsible section states
  const [invitationsExpanded, setInvitationsExpanded] = React.useState(true);
  const [queueExpanded, setQueueExpanded] = React.useState(true);

  // Local state for drag-and-drop reordering
  const [localQueue, setLocalQueue] = React.useState<ReviewerWithStatus[]>([]);

  // Initialize local queue when data changes
  React.useEffect(() => {
    const queued = reviewersWithStatus.filter(
      (r) => r.invitation_status === "queued",
    );
    const sorted = [...queued].sort(
      (a, b) => (a.queue_position || 0) - (b.queue_position || 0),
    );
    setLocalQueue(sorted);
  }, [reviewersWithStatus]);

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalQueue((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      // TODO: Persist the new order to the database
      // This would require a new data service function like updateQueueOrder
    }
  };

  const handleMoveUp = (reviewer: ReviewerWithStatus) => {
    const index = localQueue.findIndex((r) => r.id === reviewer.id);
    if (index > 0) {
      const newQueue = arrayMove(localQueue, index, index - 1);
      setLocalQueue(newQueue);
      // TODO: Persist to database
    }
  };

  const handleMoveDown = (reviewer: ReviewerWithStatus) => {
    const index = localQueue.findIndex((r) => r.id === reviewer.id);
    if (index < localQueue.length - 1) {
      const newQueue = arrayMove(localQueue, index, index + 1);
      setLocalQueue(newQueue);
      // TODO: Persist to database
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 280px)",
        overflow: "hidden",
      }}
    >
      {/* Scrollable content area */}
      <Box>
        {/* Invited Reviewers Section */}
        <Box sx={{ mb: 1 }}>
          {/* Header with collapse toggle */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: invitationsExpanded ? 1 : 0,
              cursor: "pointer",
              height: 24,
            }}
            onClick={() => setInvitationsExpanded(!invitationsExpanded)}
          >
            <Typography variant="overline" sx={{ fontWeight: 700 }}>
              Invited Reviewers ({sentInvitations.length})
            </Typography>
            <IconButton size="small" sx={{ p: 1 }}>
              {invitationsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {/* Collapsible content */}
          <Collapse in={invitationsExpanded}>
            <Box sx={{ py: 1 }}>
              {sentInvitations.length > 0 ? (
                <Stack spacing={2}>
                  {sentInvitations.map((reviewer) => (
                    <InvitedReviewerCard
                      key={reviewer.id}
                      reviewer={reviewer}
                      onActionMenuOpen={onActionMenuOpen}
                    />
                  ))}
                </Stack>
              ) : (
                <Box sx={{ py: 1, textAlign: "center" }}>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    No reviewers invited yet.
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Select a reviewer from the left panel.
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 1 }} />

        {/* Queue Section */}
        <Box>
          {/* Header with collapse toggle */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: queueExpanded ? 0.5 : 0,
              cursor: "pointer",
              height: 24,
            }}
            onClick={() => setQueueExpanded(!queueExpanded)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="overline" sx={{ fontWeight: 700 }}>
                Queued Reviewers ({queuedInvitations.length})
              </Typography>
              <Chip
                label={queueControl?.queue_active ? "Active" : "Inactive"}
                size="small"
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 700,
                  fontSize: "0.6875rem",
                  height: 16,
                }}
              />
            </Box>
            <IconButton size="small" sx={{ p: 1 }}>
              {queueExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {/* Collapsible content with drag-and-drop */}
          <Collapse in={queueExpanded}>
            <Box sx={{ mt: 1 }}>
              {localQueue.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={localQueue.map((r) => r.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Stack spacing={1}>
                      {localQueue.map((reviewer) => (
                        <SortableQueueCard
                          key={reviewer.id}
                          reviewer={reviewer}
                          onActionMenuOpen={onActionMenuOpen}
                          onMoveUp={handleMoveUp}
                          onMoveDown={handleMoveDown}
                        />
                      ))}
                    </Stack>
                  </SortableContext>
                </DndContext>
              ) : (
                <Box sx={{ py: 1, textAlign: "center" }}>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    No reviewers queued yet.
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Select a reviewer from the left panel.
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
}
