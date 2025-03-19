import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { approveMemberRequest, fetchingPendingRequests} from "../store/groupMembershipSlice";



export const PendingGroupRequests = ({ groupId }: { groupId: number }) => {

 const dispatch = useDispatch<AppDispatch>();

  const pendingRequests = useSelector( (state: RootState) => state.groupMembership.pendingRequests );

  // Fetch pending requests
  useEffect(() => {
    dispatch(fetchingPendingRequests(groupId));
  }, [dispatch, groupId])

  const handleApprove = (userId: number) => {
    dispatch(approveMemberRequest({ groupId, userId }));
  };

  return (
    <div>
      <h2>Pending Requests</h2>
      {pendingRequests.length === 0 && <p>No pending requests.</p>}
      {pendingRequests.map((request) => (
        <div key={request.userId}>
          {/* <p>User ID: {request.userId}</p> */}
          <p>User name : {request.user?.email.split('@')[0]}</p>
          <button onClick={() => handleApprove(request.userId)}>Approve</button>
        </div>
      ))}
    </div>
  );
};

 