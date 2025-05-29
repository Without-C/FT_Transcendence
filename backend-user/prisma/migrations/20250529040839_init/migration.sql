-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "oauth_id_42" TEXT,
    "oauth_id_github" TEXT,
    "oauth_id_google" TEXT
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "followerId" TEXT NOT NULL,
    "followingUsername" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_oauth_id_42_key" ON "User"("oauth_id_42");

-- CreateIndex
CREATE UNIQUE INDEX "User_oauth_id_github_key" ON "User"("oauth_id_github");

-- CreateIndex
CREATE UNIQUE INDEX "User_oauth_id_google_key" ON "User"("oauth_id_google");
