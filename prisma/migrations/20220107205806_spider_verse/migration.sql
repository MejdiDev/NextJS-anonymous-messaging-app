/*
  Warnings:

  - Added the required column `slug` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);
INSERT INTO "new_users" ("dateOfBirth", "email", "fullName", "id", "password", "phoneNumber", "userName") SELECT "dateOfBirth", "email", "fullName", "id", "password", "phoneNumber", "userName" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");
CREATE UNIQUE INDEX "users_slug_key" ON "users"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
