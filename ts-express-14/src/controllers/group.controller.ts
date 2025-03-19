import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import { validateUser, validateGroup } from "../middlewares/validators";
import { MembershipStatus } from "@prisma/client";


// POST /groups/
export const createGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupName, description } = req.body;

  const adminId = req.user?.id;
  // checking whether user exists
  const userExists = await validateUser(adminId);
  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const newGroup = await prisma.group.create({
      data: {
        groupName,
        description,
        adminId,
      },
    });
    res.status(201).json(newGroup);
  } catch (err) {
    console.error("Error creating a group: ", err);
    res.status(500).json({ error: "Error 500 at creating group" });
    next(err);
  }
};

// GET /groups/:groupId
export const viewGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupId } = req.params;

  try {
    const numericGroupId = parseInt(groupId, 10);

    if (isNaN(numericGroupId)) {
      return res.status(400).json({ error: "Invalid group ID format" });
    }
    const groupExists = await validateGroup(numericGroupId);

    if (!groupExists) {
      return res.status(401).json({ error: "Invalid group id" });
    }
    res.status(200).json(groupExists);
  } catch (err) {
    console.error("Error retrieving group:", err);
    res.status(500).json({ error: "Internal server error" });
    next(err);
  }
};
// GET /groups/
export const getAllGroups = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const groups = await prisma.group.findMany();
    res.status(200).json(groups);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
    next(err);
  }
};

// POST /groups/:groupId/join → Request to join a group
export const requestJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupId } = req.params;
  const userId = req.user?.id;

  const userExists = await validateUser(userId);
  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const numericGroupId = parseInt(groupId, 10);
    if (isNaN(numericGroupId)) {
      return res.status(400).json({ error: "Invalid event ID format" });
    }

    const groupExists = await validateGroup(numericGroupId);
    if (!groupExists) {
      return res.status(404).json({ error: "Group not found" });
    }

    // 🛑 Prevent admin from requesting to join their own group
    if (groupExists.adminId == userId) {
      return res.status(400).json({ error: "Admin cannot request to join their own group" });
    }
    // 🛑 Check if the user is already a member or has a pending request
    const currentRequest = await prisma.groupMembership.findUnique({
      where: {
        groupId_userId: { groupId: numericGroupId, userId },
      },
    });

    console.log("POST /groups/:groupId/join currentRequest >> ", currentRequest);

    if (currentRequest) {
      return res.status(400)
        .json({ error: currentRequest.status == "PENDING"
              ? "Join request already pending"
              : "User is already a member of the group",
        });
    }

    const newMemberRequest = await prisma.groupMembership.create({
      data: {
        group: { connect: { id: numericGroupId } },
        user: { connect: { id: userId } },
      },
    });
    console.log("this is newMemberRequest from controller ", newMemberRequest)
    res.status(201).json(newMemberRequest);
  } catch (err) {
    console.error("Error requesting memebership:", err);
    res
      .status(500)
      .json({ error: "Internal server error when requesting memebership" });
    next(err);
  }
};

// GET groups/:groupId/members
export const getMembersByGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("Incoming params:", req.params); // Debug log
  const { groupId } = req.params;
  const numericGroupId = parseInt(groupId, 10);


  if (isNaN(numericGroupId)) {
    return res.status(400).json({ error: "Invalid group ID format" });
  }
  // check group exists
  const groupExists = await validateGroup(numericGroupId);
  if (!groupExists) {
    return res.status(401).json({ error: "Invalid group id" });
  }
  //  find group memebers
  try {
    const groupMembers = await prisma.groupMembership.findMany({
      where: {
        groupId: numericGroupId,
        status: "APPROVED",
      },
      include: {
        user: {
          select: { id: true, email: true }, // user details
        },
      },
    });

    const members = groupMembers.map((m) => ({
      id: m.user.id,
      email: m.user.email,
    }));

    res.status(200).json({ groupId: numericGroupId, members });
  } catch (err) {
    console.error("Error fetching group members:", err);
    res.status(500).json({ error: "Error retrieving group members" });
    next(err);
  }
};

// admin invites to join
// POST /groups/:groupId/invite → Invite a user

export const adminInviteToJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("Incoming params:", req.params);
  const { groupId } = req.params;
  const adminId = req.user?.id; // Admin's ID from JWT
  const { userId } = req.body;
  const numericUserId = parseInt(userId, 10);

  try {
    const numericGroupId = parseInt(groupId, 10);

    const groupExists = await validateGroup(numericGroupId);
    if (!groupExists) return res.status(404).json({ error: "Group not found" });

    //  Check if requester is the group admin
    if (groupExists.adminId !== adminId) {
      return res.status(403).json({ error: "Only the admin can invite users" });
    }

    const userExists = await validateUser(numericUserId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const invitation = await prisma.groupMembership.create({
      data: {
        groupId: groupExists.id,
        userId: numericUserId,
        status: "APPROVED",
      },
    });
    res.status(201).json(invitation);
  } catch (err) {
    console.error("Error sending invite to join: ", err);
    res
      .status(500)
      .json({ error: "Internal server error when sending invite to join." });
    next(err);
  }
};



//GET PEnding requests  groups/:groupId/pending-requests

export const getPendingRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { groupId } = req.params;
  const numericGroupId = parseInt(groupId, 10);
  if (isNaN(numericGroupId)) {
    return res.status(400).json({ error: "Invalid group ID format" });
  }

  try {
    const pendingRequests = await prisma.groupMembership.findMany ({
      where: {
        groupId: numericGroupId,
        status: "PENDING",
      },
      include: {
        user: { select: {id: true, email: true}}, //including user details
      },
    });
    return res.status(200).json(pendingRequests);
  } catch(error) {
    console.error("Error fetching pending requests:", error);
      return res.status(500).json({ error: "Failed to fetch pending requests" });
  }
}

// PATCH /groups/:id/approve/:userId → Approve a member
export const memberApprovedByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminId = req.user?.id; // Admin's ID from JWT
  const { groupId, userId } = req.params;

  const numericGroupId = parseInt(groupId, 10);
  const numericUserId = parseInt(userId, 10);

  if (isNaN(numericGroupId) || isNaN(numericUserId)) {
    return res
      .status(400)
      .json({ error: "Invalid group ID or user ID format" });
  }

  try {
    const groupExists = await validateGroup(numericGroupId);
    if (!groupExists) return res.status(404).json({ error: "Group not found" });

    //  Check if requester is the group admin
    if (groupExists.adminId !== adminId) {
      return res.status(403).json({ error: "Only the admin can invite users" });
    }

    const userExists = await validateUser(numericUserId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const approved = await prisma.groupMembership.update({
      where: {
        groupId_userId: {
          // compound unique key
          groupId: numericGroupId,
          userId: numericUserId,
        },
      },
      data: {
        status: "APPROVED",
      },
    });
    res.status(200).json({ userId: numericUserId, status: "Approved" });
  } catch (err) {
    console.error("Error Approving user status:", err);
    res.status(500).json({ error: "Error Approving user status" });
    next(err);
  }
};

//Patch /groups/:groupid/reject/:userId → Reject a member

export const rejectMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminId = req.user?.id;
  const { groupId, userId } = req.params;

  const numericGroupId = parseInt(groupId, 10);
  const numericUserId = parseInt(userId, 10);

  if (isNaN(numericGroupId) || isNaN(numericUserId)) {
    return res
      .status(400)
      .json({ error: "Invalid group ID or user ID format" });
  }

  try {
    const groupExists = await validateGroup(numericGroupId);
    if (!groupExists) return res.status(404).json({ error: "Group not found" });

    //  Check if requester is the group admin
    if (groupExists.adminId !== adminId) {
      return res.status(403).json({ error: "Only the admin can reject users" });
    }

    const userExists = await validateUser(numericUserId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const rejected = await prisma.groupMembership.update({
      where: {
        groupId_userId: {
          groupId: numericGroupId,
          userId: numericUserId,
        },
      },
      data: {
        status: "REJECTED",
      },
    });
    res.status(200).json({ userId: numericUserId, status: "rejected" });
  } catch (err) {
    console.error("Error rejecting user :", err);
    res.status(500).json({ error: "Error rejecting user" });
    next(err);
  }
};

// User LEAVES group
// DELETE /groups/:groupId/leave → Invite a user

export const leaveGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const userId = req.user?.id;
  const { groupId } = req.params;

  const numericGroupId = parseInt(groupId, 10);
  const numericUserId = parseInt(userId, 10);

  if (isNaN(numericGroupId) || isNaN(numericUserId)) {
    return res
      .status(400)
      .json({ error: "Invalid group ID or user ID format" });
  }

  const groupExists = await validateGroup(numericGroupId);
    if (!groupExists) return res.status(404).json({ error: "Group not found" });

    const userExists = await validateUser(numericUserId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }
try { 
  // check if user is group member status "APPROVED"
   const isMember = await prisma.groupMembership.findFirst({
    where: {
        groupId: numericGroupId,
        userId: numericUserId,
        status: "APPROVED",
      },
  });

  console.log("check whether approvedMmeber ", isMember)
  //  get id of the membership out of isMember

  if(!isMember){
    return res.status(404).json({ error: "User was not approved member" });
  }

  // remove
    await prisma.groupMembership.delete({
    where: { id: isMember.id },
  });
  
console.log("deleted membership id ", isMember.id )
  res.status(200).json({ deletedUser: isMember.userId, message: `Successfully left the group userid ${isMember.userId} ` })
}  catch (err) {
  console.error("Error leaving group :", err);
  res.status(500).json({ error: "Failed to leave group" });
  next(err);
}
}

// GET membershipStats  groups/:groupId/membership
export const groupMembershipStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminId = req.user?.id;

  const { groupId } = req.params;
  const numericGroupId = parseInt(groupId, 10);

  if (isNaN(numericGroupId)) {
    return res.status(400).json({ error: "Invalid group ID format" });
  }

  try {
    const groupExists = await validateGroup(numericGroupId);
    if (!groupExists) return res.status(404).json({ error: "Group not found" });
    // console.log("Group admin ID from DB >>", groupExists.adminId);

    //  Check if requester is the group admin
    if (groupExists.adminId !== adminId) {
      return res.status(403).json({
        error: "Only the admin can check membership status for this group",
      });
    }

    const stats = await prisma.groupMembership.findMany({
      where: {
        groupId: numericGroupId,
      },
    });
    res.status(200).json(stats);
  } catch (err) {
    console.error("Error fetching membership statuses");
    res.status(500).json({ error: "Error fetching membership statuses" });
    next(err);
  }
};

// GET get("/:groupId/news", getGroupNews);

export const getGroupNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupId } = req.params;
  const numericGroupId = parseInt(groupId, 10);

  if (isNaN(numericGroupId)) {
    return res.status(400).json({ error: "Invalid group ID format" });
  }

  try {
    const groupExists = await validateGroup(numericGroupId);
    if (!groupExists) return res.status(404).json({ error: "Group not found" });

    const news = await prisma.groupNews.findMany({
      where: {
        groupId: numericGroupId,
      },
    });

    res.status(200).json(news);
  } catch (err) {
    console.error(`Error fetching group ${groupId} news`);
    res.status(500).json({ error: "Error fetching group news" });
    next(err);
  }
};

// GET .get("/:groupId/news/:newsId", getGroupNewsById);
export const getGroupNewsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupId } = req.params;
  const numericGroupId = parseInt(groupId, 10);

  const { newsId } = req.params;
  const numericNewsId = parseInt(newsId, 10);

  if (isNaN(numericGroupId) || isNaN(numericNewsId)) {
    return res.status(400).json({ error: "Invalid groupId or newsId format" });
  }

  try {
    const groupExists = await validateGroup(numericGroupId);
    if (!groupExists) return res.status(404).json({ error: "Group not found" });

    const newsExists = await prisma.groupNews.findUnique({
      where: {
        // groupId: numericGroupId,
        id: numericNewsId,
      },
    });

    if (!newsExists) return res.status(404).json({ error: "News not found" });

    res.status(200).json(newsExists);
  } catch (err) {
    console.error("Error fetching news");
    res.status(500).json({ error: "Error fetching news" });
    next(err);
  }
};

// POST post("/:groupId/news")

export const createGroupNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newsName, content, newsImg } = req.body;
  const { groupId } = req.params;
  const numericGroupId = parseInt(groupId, 10);

  if (isNaN(numericGroupId)) {
    return res.status(400).json({ error: "Invalid group ID format" });
  }

  const groupExists = await validateGroup(numericGroupId);
  if (!groupExists) {
    return res.status(404).json({ error: "Group does not exist" });
  }

  // get author info and check whether he is member of this group
  const userId = req.user?.id;
  const userExists = await validateUser(userId);
  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  const numericUserId = parseInt(userId, 10);

  // 🛑 Check if the user is a member of the group status "Approved"

  const userIsMember = await prisma.groupMembership.findFirst({
    where: {
      groupId: numericGroupId,
      userId: numericUserId,
      status: MembershipStatus.APPROVED,
    },
  });

  // 🛑 Check if the user is an admin of the group
  //only member and admin can post news

  if (!userIsMember && groupExists.adminId !== numericUserId) {
    return res.status(403).json({ error: "Only approved members and admins can post news." });
  }

  try {
    const newsItem = await prisma.groupNews.create({
      data: {
        newsName,
        content,
        newsImg,
        groupId: numericGroupId,
        userId: numericUserId,
      },
    });

    res.status(201).json(newsItem);
  } catch (err) {
    console.error("Error creating news: ", err);
    res.status(500).json({ error: "Error 500 at creating news" });
    next(err);
  }
};

export const deleteGroupNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupId, newsId } = req.params;
 const numericGroupId = parseInt(groupId, 10);
    const numericNewsId = parseInt(newsId, 10);

    const userId = req.user?.id;
    const userExists = await validateUser(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const numericUserId = parseInt(userId, 10);
  
  if (isNaN(numericGroupId) || isNaN(numericNewsId)) {
    return res.status(400).json({ error: "Invalid groupId or newsId format" });
  }

  const groupExists = await validateGroup(numericGroupId);
  if (!groupExists) return res.status(404).json({ error: "Group not found" });

  try {
    const newsExists = await prisma.groupNews.findUnique({
      where: {
        // groupId: numericGroupId,
        id: numericNewsId,
      },
    });

    if (!newsExists) return res.status(404).json({ error: "News not found" });

    // only author or group admin can delete newsitem
    if (newsExists.userId !== numericUserId  && groupExists.adminId == numericUserId ) {
      return res.status(403).json({ error: "You are not allowed to delete newisitem" });
    }
// delete from db
    await prisma.groupNews.delete({
      where: {
        id: numericNewsId
      },
    })

    res.status(204).send();
    
  } catch (err) {
    console.error("Error deleting news: ", err);
    res.status(500).json({ error: "Error 500 at deleting news" });
    next(err);
  }
};
