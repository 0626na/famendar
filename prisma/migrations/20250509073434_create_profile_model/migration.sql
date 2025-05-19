-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "updated_at" TIMESTAMP(3),
    "email" TEXT,
    "full_name" TEXT,
    "avatar_url" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");
