import { Request } from 'express';
import { STAGE_FIELD_ID } from 'settings.config';
import { Task } from 'src/common/types/tasks';
const fs = require('fs');

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

export function extractTokenFromCookies(request: Request): string | undefined {
  return request.cookies?.authToken;
}

// Function to create a folder recursively
export const createFolders = async (dir: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(); // Resolve the promise if successful
      }
    });
  });
};

export const sanitizePathName = (name: string): string => {
  // Replace invalid characters (including dots) with underscores
  let sanitized = name.replace(/[<>:"/\\|?*.\x00-\x1F]/g, '_');

  // Replace consecutive underscores with a single underscore
  sanitized = sanitized.replace(/_+/g, '_');

  // Remove leading and trailing spaces
  sanitized = sanitized.trim();

  // Ensure the name isn't empty after sanitization
  if (sanitized.length === 0) {
    sanitized = '_';
  }

  // Truncate to 255 characters (max length for most file systems)
  sanitized = sanitized.slice(0, 255);

  // Avoid reserved names in Windows
  const reservedNames = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
  if (reservedNames.test(sanitized)) {
    sanitized = '_' + sanitized;
  }

  return sanitized;
};

export const cancelTasks = (tasks: Task[], taskId: string) => {
  for (const task of tasks) {
    // Check if the current task has the given taskId in its previousTasks
    if (task.previousTasks.some((subtask) => subtask.id === taskId)) {
      task.status = 'CANCELLED';

      // Recursively check and cancel subtasks of this task
      cancelTasks(tasks, task.id);
    }
  }
};

// Helper function to format duration
export const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 0) return '0d 0h 0m 0s'; // Handle negative durations

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  return `${days}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
};

export const groupDurationsByStage = (
  stageDurations: { stage: string; duration: number }[],
) => {
  const groupedDurations: Record<string, number> = {};

  // Group durations by stage
  for (const { stage, duration } of stageDurations) {
    if (!groupedDurations[stage]) {
      groupedDurations[stage] = 0;
    }
    groupedDurations[stage] += duration;
  }

  // Convert back to formatted durations
  return Object.entries(groupedDurations).map(([stage, totalDuration]) => ({
    stage,
    duration: formatDuration(totalDuration),
  }));
};

export const filterStageTransitions = (trackingValues: any[]): any[] => {
  const stageFieldId = STAGE_FIELD_ID;

  return trackingValues.filter((change) => {
    const fieldId = change.field_id?.[0]; // Extract field ID from field_id array
    return fieldId === stageFieldId; // Include only changes with the relevant field ID
  });
};

export const timeToLocalTimeZone = (
  time: string,
  timeZoneOffsetMs: number,
): Date => {
  const date = new Date(new Date(time).getTime() - timeZoneOffsetMs);

  return date;
};
