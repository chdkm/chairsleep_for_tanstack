-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "crypted_password" TEXT,
    "salt" TEXT,
    "name" TEXT NOT NULL,
    "sleep_time" TEXT,
    "favorite_goods" TEXT,
    "reset_password_token" TEXT,
    "reset_password_token_expires_at" TIMESTAMP(3),
    "reset_password_email_sent_at" TIMESTAMP(3),
    "access_count_to_reset_password_page" INTEGER NOT NULL DEFAULT 0,
    "line_login" BOOLEAN,
    "line_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authentications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "line_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authentications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" INTEGER,
    "image" TEXT,
    "prepare" TEXT,
    "care" TEXT,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "user_uid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "price" INTEGER,
    "image_url" TEXT,
    "rakuten_item_id" TEXT,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "post_id" INTEGER,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "post_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "post_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "line_notification" BOOLEAN,
    "line_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "item_tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_password_token_key" ON "users"("reset_password_token");

-- CreateIndex
CREATE INDEX "authentications_user_id_idx" ON "authentications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "authentications_provider_uid_key" ON "authentications"("provider", "uid");

-- CreateIndex
CREATE UNIQUE INDEX "authentications_provider_line_user_id_key" ON "authentications"("provider", "line_user_id");

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "posts"("user_id");

-- CreateIndex
CREATE INDEX "items_post_id_idx" ON "items"("post_id");

-- CreateIndex
CREATE INDEX "items_user_id_idx" ON "items"("user_id");

-- CreateIndex
CREATE INDEX "comments_user_id_idx" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "comments_post_id_idx" ON "comments"("post_id");

-- CreateIndex
CREATE INDEX "bookmarks_user_id_idx" ON "bookmarks"("user_id");

-- CreateIndex
CREATE INDEX "bookmarks_post_id_idx" ON "bookmarks"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_post_id_key" ON "bookmarks"("user_id", "post_id");

-- CreateIndex
CREATE INDEX "likes_user_id_idx" ON "likes"("user_id");

-- CreateIndex
CREATE INDEX "likes_post_id_idx" ON "likes"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_post_id_key" ON "likes"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_tags_name_key" ON "item_tags"("name");

-- CreateIndex
CREATE INDEX "post_tags_post_id_idx" ON "post_tags"("post_id");

-- CreateIndex
CREATE INDEX "post_tags_item_tag_id_idx" ON "post_tags"("item_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_tags_post_id_item_tag_id_key" ON "post_tags"("post_id", "item_tag_id");

-- AddForeignKey
ALTER TABLE "authentications" ADD CONSTRAINT "authentications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_item_tag_id_fkey" FOREIGN KEY ("item_tag_id") REFERENCES "item_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
