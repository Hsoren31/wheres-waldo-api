-- CreateTable
CREATE TABLE "Stage" (
    "title" TEXT NOT NULL,
    "imageTitle" TEXT,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("title")
);

-- CreateTable
CREATE TABLE "Image" (
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "stageTitle" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("title")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stageTitle" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stageTitle" TEXT,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stage_title_key" ON "Stage"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Image_title_key" ON "Image"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Image_stageTitle_key" ON "Image"("stageTitle");

-- CreateIndex
CREATE UNIQUE INDEX "Character_stageTitle_key" ON "Character"("stageTitle");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_stageTitle_fkey" FOREIGN KEY ("stageTitle") REFERENCES "Stage"("title") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_stageTitle_fkey" FOREIGN KEY ("stageTitle") REFERENCES "Stage"("title") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_stageTitle_fkey" FOREIGN KEY ("stageTitle") REFERENCES "Stage"("title") ON DELETE SET NULL ON UPDATE CASCADE;
