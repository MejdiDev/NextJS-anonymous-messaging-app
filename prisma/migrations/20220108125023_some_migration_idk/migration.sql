-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "content" TEXT NOT NULL
);
INSERT INTO "new_messages" ("content", "date", "id", "receiver") SELECT "content", "date", "id", "receiver" FROM "messages";
DROP TABLE "messages";
ALTER TABLE "new_messages" RENAME TO "messages";
CREATE UNIQUE INDEX "messages_receiver_key" ON "messages"("receiver");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
