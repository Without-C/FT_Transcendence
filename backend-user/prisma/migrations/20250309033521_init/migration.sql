/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "oauth_id_42" TEXT,
    "oauth_id_github" TEXT,
    "oauth_id_google" TEXT
);
INSERT INTO "new_User" ("id", "oauth_id_42", "oauth_id_github", "oauth_id_google", "username") SELECT "id", "oauth_id_42", "oauth_id_github", "oauth_id_google", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
