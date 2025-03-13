import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticate';
import { viewGroup, createGroup, getAllGroups, 
    getMembersByGroup, groupMembershipStats, rejectMember,
    requestJoin, adminInviteToJoin, memberApprovedByAdmin,
    getGroupNews, getGroupNewsById, createGroupNews, deleteGroupNews, getPendingRequests
} from '../controllers/group.controller';

const groupRouter = Router();
groupRouter.post("/", authenticateToken, createGroup)
groupRouter.get("/", getAllGroups)
groupRouter.get("/:groupId", viewGroup)
groupRouter.post("/:groupId/join", authenticateToken, requestJoin)
groupRouter.get("/:groupId/members", authenticateToken, getMembersByGroup); // add to groupslice
groupRouter.post("/:groupId/invite", authenticateToken, adminInviteToJoin);
groupRouter.patch("/:groupId/approve/:userId", authenticateToken, memberApprovedByAdmin);
groupRouter.get("/:groupId/membership", authenticateToken, groupMembershipStats);
groupRouter.get("/:groupId/pending-requests", authenticateToken, getPendingRequests);
groupRouter.patch("/:groupId/reject/:userId", authenticateToken, rejectMember );
// if i want to remove from queue (db) >> delete
//groupRouter.delete("/:groupId/reject/:userId", authenticateToken, rejectMember );
// also delete in prsima.delete

// Groupnews
groupRouter.post("/:groupId/news", authenticateToken, createGroupNews);
groupRouter.get("/:groupId/news", getGroupNews);
groupRouter.get("/:groupId/news/:newsId", getGroupNewsById);
groupRouter.delete("/:groupId/news/:newsId", authenticateToken, deleteGroupNews);
// Admin Approves News (if needed):
// groupRouter.patch("/:groupId/news/:newsId/approve", authenticateToken, approveNews);



export default groupRouter;