/*
  Warnings:

  - Made the column `avatar_url` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "oauth_id_42" TEXT,
    "oauth_id_github" TEXT,
    "oauth_id_google" TEXT
);
INSERT INTO "new_User" ("avatar_url", "id", "oauth_id_42", "oauth_id_github", "oauth_id_google", "username") SELECT "avatar_url", "id", "oauth_id_42", "oauth_id_github", "oauth_id_google", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
