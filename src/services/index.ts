// Barrel export for all data services
// This maintains backward compatibility with existing imports from @/services/dataService

// Manuscript operations
export * from "./manuscripts/manuscriptService";

// Reviewer operations
export * from "./reviewers/reviewerService";

// Invitation operations
export * from "./invitations/invitationService";

// Queue operations
export * from "./queue/queueService";

// Match operations
export * from "./matches/matchService";

// Assignment operations
export * from "./assignments/assignmentService";

// Shared helpers (exported for convenience)
export * from "./shared/helpers";
