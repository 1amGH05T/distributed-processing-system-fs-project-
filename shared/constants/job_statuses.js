/**
 * Job status constants — mirrors backend API/models.py JobStatus.TextChoices
 * Import these in frontend components instead of hardcoding strings.
 *
 * Usage:
 *   import { JOB_STATUS, TERMINAL_STATUSES } from '../../../../shared/constants/job_statuses';
 */

export const JOB_STATUS = Object.freeze({
  CREATED:   'CREATED',
  QUEUED:    'QUEUED',
  RUNNING:   'RUNNING',
  COMPLETED: 'COMPLETED',
  RETRY:     'RETRY',
  DEAD:      'DEAD',
});

/** Statuses that mean the job is no longer being processed */
export const TERMINAL_STATUSES = Object.freeze([
  JOB_STATUS.COMPLETED,
  JOB_STATUS.DEAD,
]);

/** Statuses that mean the job is actively in progress */
export const ACTIVE_STATUSES = Object.freeze([
  JOB_STATUS.QUEUED,
  JOB_STATUS.RUNNING,
  JOB_STATUS.RETRY,
]);

/** Human-readable labels for each status */
export const JOB_STATUS_LABELS = Object.freeze({
  [JOB_STATUS.CREATED]:   'Created',
  [JOB_STATUS.QUEUED]:    'Queued',
  [JOB_STATUS.RUNNING]:   'Running',
  [JOB_STATUS.COMPLETED]: 'Completed',
  [JOB_STATUS.RETRY]:     'Retrying',
  [JOB_STATUS.DEAD]:      'Dead',
});

/**
 * Simulated progress percentage per status (used in progress bars).
 * Mirrors the logic in frontend/processing-system/src/components/JobCard.jsx
 */
export const JOB_STATUS_PROGRESS = Object.freeze({
  [JOB_STATUS.CREATED]:   5,
  [JOB_STATUS.QUEUED]:    10,
  [JOB_STATUS.RUNNING]:   60,
  [JOB_STATUS.RETRY]:     40,
  [JOB_STATUS.COMPLETED]: 100,
  [JOB_STATUS.DEAD]:      0,
});

/** Default job configuration — must match backend model field defaults */
export const JOB_DEFAULTS = Object.freeze({
  priority:     0,
  max_attempts: 3,
  timeout_ms:   10000,
});

/** Priority range enforced by the backend */
export const JOB_PRIORITY = Object.freeze({
  MIN: 0,
  MAX: 10,
});
