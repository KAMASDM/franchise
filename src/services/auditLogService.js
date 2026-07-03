import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import logger from "../utils/logger";

/**
 * Admin audit trail.
 *
 * Every mutating admin action is recorded in the `auditLogs` collection so
 * there is always an answer to "who changed what, and when". Writes are
 * fire-and-forget: an audit failure must never block or fail the action
 * itself, so this function never throws.
 *
 * Action naming convention: <target>.<verb>, e.g. "brand.approve",
 * "user.promote", "lead.delete", "notification.broadcast".
 */
export const logAdminAction = async (action, { targetType, targetId, targetLabel, details } = {}) => {
  try {
    const user = auth.currentUser;
    await addDoc(collection(db, "auditLogs"), {
      action,
      targetType: targetType || null,
      targetId: targetId || null,
      // Human-readable label (brand name, user email…) so the activity
      // feed is meaningful even if the target is later deleted
      targetLabel: targetLabel || null,
      details: details || null,
      actorUid: user?.uid || null,
      actorEmail: user?.email || null,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    logger.error("Failed to write audit log:", action, error);
  }
};

export default logAdminAction;
