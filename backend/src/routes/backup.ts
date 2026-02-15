import { Router } from 'express';
import { backupService } from '../services/backupService';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = Router();

/**
 * Get backup status
 */
router.get('/backup/status', asyncHandler(async (req, res) => {
  // TODO: Add admin authentication middleware
  const status = backupService.getStatus();
  res.json(status);
}));

/**
 * Get backup logs
 */
router.get('/backup/logs', asyncHandler(async (req, res) => {
  // TODO: Add admin authentication middleware
  const limit = parseInt(req.query.limit as string) || 30;
  const logs = backupService.getBackupLogs(limit);
  res.json({ logs });
}));

/**
 * Trigger manual backup
 */
router.post('/backup/trigger', asyncHandler(async (req, res) => {
  // TODO: Add admin authentication middleware
  const result = await backupService.triggerManualBackup();
  
  if (!result.success) {
    throw createError(result.error || 'Backup failed', 500, 'error');
  }

  res.json({
    message: 'Backup completed successfully',
    backupId: result.backupId,
  });
}));

/**
 * Get restoration instructions
 */
router.get('/backup/restoration-instructions', asyncHandler(async (req, res) => {
  // TODO: Add admin authentication middleware
  const instructions = backupService.getRestorationInstructions();
  res.json({ instructions });
}));

export const backupRouter = router;
