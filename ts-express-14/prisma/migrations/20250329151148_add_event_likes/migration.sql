-- CreateTable
CREATE TABLE "EventLikes" (
    "eventId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EventLikes_eventId_userId_key" ON "EventLikes"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "EventLikes" ADD CONSTRAINT "EventLikes_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLikes" ADD CONSTRAINT "EventLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
