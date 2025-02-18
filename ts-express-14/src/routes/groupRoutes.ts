import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticate';
import { viewGroup, createGroup, getAllGroups, 
    getMembersByGroup, groupMembershipStats, rejectMember,
    requestJoin, adminInviteToJoin, memberApprovedByAdmin
} from '../controllers/group.controller';

const groupRouter = Router();
groupRouter.post("/", authenticateToken, createGroup)
groupRouter.get("/", getAllGroups)
groupRouter.get("/:groupId", viewGroup)
groupRouter.post("/:groupId/join", authenticateToken, requestJoin)
groupRouter.get("/:groupId/members", authenticateToken, getMembersByGroup);
groupRouter.post("/:groupId/invite", authenticateToken, adminInviteToJoin);
groupRouter.patch("/:groupId/approve/:userId", authenticateToken, memberApprovedByAdmin);
groupRouter.get("/:groupId/membership", authenticateToken, groupMembershipStats);
groupRouter.delete("/:groupId/reject/:userId", authenticateToken, rejectMember );


/*
endpoints:

X   POST /groups → Create a group
X   GET /groups/:groupId → View a group
X	POST /groups/:groupId/join → Request to join a group
X   POST /groups/:groupId/invite → Invite a user
X   PATCH /groups/:groupId/approve/:userId → Approve a member
X   DELETE /groups/:id/reject/:userId → Reject a member
*/

export default groupRouter;