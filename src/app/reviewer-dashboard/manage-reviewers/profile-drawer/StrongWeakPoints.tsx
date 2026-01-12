"use client";

import * as React from "react";
import { Alert, Grid, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import type { ReviewerProfile } from "./types";

interface StrongWeakPointsProps {
  reviewer: ReviewerProfile;
}

export function StrongWeakPoints({ reviewer }: StrongWeakPointsProps) {
  const getStrongPoints = (): string[] => {
    const points: string[] = [];

    // 1. ✓ Institutional email - NOT Gmail/Yahoo/etc.
    if (reviewer.email_is_institutional) {
      points.push("Institutional email");
    }

    // 2. ✓ Response rate < 3 days
    if (
      reviewer.average_response_time_hours &&
      reviewer.average_response_time_hours < 72
    ) {
      const days = Math.round(reviewer.average_response_time_hours / 24);
      points.push(`Fast response (<${days} day${days !== 1 ? "s" : ""})`);
    }

    // 3. ✓ Sends report on average within 5 days
    if (
      reviewer.average_review_time_days &&
      reviewer.average_review_time_days <= 5
    ) {
      points.push(`Quick reviews (≤${reviewer.average_review_time_days} days)`);
    }

    // 4. ✓ Published in similar scope (related publications)
    if (
      reviewer.related_publications_count &&
      reviewer.related_publications_count > 0
    ) {
      points.push(
        `${reviewer.related_publications_count} related publication${
          reviewer.related_publications_count !== 1 ? "s" : ""
        }`
      );
    }

    // 5. ✓ Published in the last 5 years
    if (reviewer.last_publication_date) {
      const lastPubDate = new Date(reviewer.last_publication_date);
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
      if (lastPubDate >= fiveYearsAgo) {
        points.push("Recently published");
      }
    }

    // 6. ✓ Has been an author for this journal
    if (reviewer.manuscript_journal && reviewer.all_publications) {
      const hasJournalPub = reviewer.all_publications.some(
        (pub) => pub.journal_name === reviewer.manuscript_journal
      );
      if (hasJournalPub) {
        points.push("Published in this journal");
      }
    }

    return points;
  };

  const getWeakPoints = (): string[] => {
    const points: string[] = [];

    // 1. ⚠ Conflict of Interest
    if (
      reviewer.conflicts_of_interest &&
      reviewer.conflicts_of_interest.trim().length > 0
    ) {
      points.push("Conflict of Interest");
    }

    // 2. ⚠ Response rate > 30 days
    if (
      reviewer.average_response_time_hours &&
      reviewer.average_response_time_hours > 720
    ) {
      const days = Math.round(reviewer.average_response_time_hours / 24);
      points.push(`Slow to respond (${days}+ days)`);
    }

    // 3. ⚠ Sends report on average after > 60 days
    if (
      reviewer.average_review_time_days &&
      reviewer.average_review_time_days > 60
    ) {
      points.push(`Slow reviews (${reviewer.average_review_time_days}+ days)`);
    }

    // 4. ⚠ Is an author of this manuscript
    if (reviewer.manuscript_authors && reviewer.manuscript_authors.length > 0) {
      const isAuthor = reviewer.manuscript_authors.some(
        (author) =>
          author
            .toLowerCase()
            .includes(reviewer.email.split("@")[0].toLowerCase()) ||
          author.toLowerCase().includes(reviewer.name.toLowerCase())
      );
      if (isAuthor) {
        points.push("⚠️ Author of this manuscript");
      }
    }

    // 5. ⚠ Has not published in the last 5 years
    if (reviewer.last_publication_date) {
      const lastPubDate = new Date(reviewer.last_publication_date);
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
      if (lastPubDate < fiveYearsAgo) {
        const years = Math.floor(
          (Date.now() - lastPubDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
        );
        points.push(`No recent publications (${years}+ years)`);
      }
    }

    // 6. ⚠ Has retractions on record
    if (reviewer.retractions?.retraction_reasons?.length) {
      points.push(
        `${reviewer.retractions.retraction_reasons.length} retraction${
          reviewer.retractions.retraction_reasons.length !== 1 ? "s" : ""
        }`
      );
    }

    // 7. ⚠ Didn't respond to the last 3 invites
    if (
      reviewer.recent_invitations &&
      reviewer.recent_invitations.length >= 3
    ) {
      const lastThree = reviewer.recent_invitations.slice(0, 3);
      const allDeclined = lastThree.every(
        (inv) => inv.status === "declined" || inv.status === "expired"
      );
      if (allDeclined) {
        points.push("Declined last 3 invitations");
      }
    }

    // 8. ⚠ Unavailable status
    if (
      reviewer.availability_status &&
      reviewer.availability_status !== "available"
    ) {
      const statusLabel =
        reviewer.availability_status.charAt(0).toUpperCase() +
        reviewer.availability_status.slice(1);
      points.push(statusLabel);
    }

    // 9. ⚠ At or over capacity
    if (reviewer.current_review_load >= reviewer.max_review_capacity) {
      points.push("At capacity");
    }

    return points;
  };

  const strongPoints = getStrongPoints();
  const weakPoints = getWeakPoints();

  if (strongPoints.length === 0 && weakPoints.length === 0) {
    return null;
  }

  return (
    <Grid container spacing={1.5}>
      {strongPoints.length > 0 && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Alert severity="success" icon={<CheckCircleIcon />}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              Strong Points
            </Typography>
            <Typography variant="body2">{strongPoints.join(", ")}</Typography>
          </Alert>
        </Grid>
      )}

      {weakPoints.length > 0 && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Alert severity="warning" icon={<WarningIcon />}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              Weak Points
            </Typography>
            <Typography variant="body2">{weakPoints.join(", ")}</Typography>
          </Alert>
        </Grid>
      )}
    </Grid>
  );
}
