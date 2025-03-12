import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../store/groupSlice";
import { RootState, AppDispatch } from "../store/store";
import { CreateGroup } from "./CreateGroup";

export const GroupsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Extract groups state from Redux

  const {
    groups,
    loading: groupsLoading,
    error: groupsError,
  } = useSelector((state: RootState) => state.groups);

  // Fetch groups when component mounts
  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  return (
    <div>
      <h2> Groups</h2>
      {groupsLoading && <p>Loading groups ...</p>}

      {groupsError && <p>{groupsError}</p>}

      {!groupsLoading && !groupsError && groups.length == 0 && (
        <p> No groups created yet</p>
      )}

      {!groupsLoading && !groupsError && groups.length > 0 && (
        <ul>
          {groups.map((g) => {
            return (
              <div key={g.id}>
                <h3>{g.groupName}</h3>
                <p>{g.description}</p>
                {/* <p><em>created on {g.createdAt.split('T')[0]}</em></p> */}
                <button>Join</button>
                <button>To group page</button>
                {/* to add joining func */}
              </div>
            );
          })}
        </ul>
      )}
      <div>
        <CreateGroup />
      </div>
    </div>
  );
};
