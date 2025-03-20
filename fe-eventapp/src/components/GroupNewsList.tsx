import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchGroupNewsByGroupId } from "../store/groupNewsSlice";
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes";

interface GroupNewsListProps {
  groupId: number; // or string, depending on your actual type
}

export const GroupNewsList: React.FC<GroupNewsListProps> = ({ groupId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { groupNews, loading: newsLoading, error: newsError,
  } = useSelector((state: RootState) => state.groupNews);

  const { users, loading: usersLoading, error: usersError,
  } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchGroupNewsByGroupId(groupId));
  }, [dispatch, groupId]);

  return (
    <>
      <Heading> Latest Group Announcements </Heading>

      {newsLoading && <Text color="gray">Loading news...</Text>}

      {!newsLoading && !newsError && groupNews.length === 0 && (
        <p>No news available.</p>
      )}
      {!newsLoading && !newsError && groupNews.length > 0 && (
        <ul>
          {groupNews.map((news) => {
            const authorUser = users.find((u) => Number(u.id) == news.userId);

            return (
              <div key={news.id}>
                <p>{news.newsName}</p>
                <p>{`${news.createdAt.split("T")[0]}`}</p>
                <p>{news.content}</p>
                <p>
                  Authored by:{" "}
                  <em>
                    {authorUser ? authorUser.email.split("@")[0] : "Unknown"}
                  </em>
                </p>
              </div>
            );
          })}
        </ul>
      )}
    </>
  );
};
