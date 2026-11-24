-- CreateTable
CREATE TABLE `courses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` CHAR(6) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `type` ENUM('CORE', 'ELECTIVE') NOT NULL,
    `year_level` INTEGER NOT NULL,

    UNIQUE INDEX `courses_code_title_key`(`code`, `title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courses_schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_id` INTEGER NOT NULL,
    `section` INTEGER NOT NULL,
    `start_week` INTEGER NOT NULL,
    `end_week` INTEGER NOT NULL,
    `day_of_week` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    `start_time` TIME(0) NOT NULL,
    `end_time` TIME(0) NOT NULL,
    `room` VARCHAR(20) NULL,
    `student_group` ENUM('A', 'B') NULL,
    `remarks` VARCHAR(255) NULL,

    INDEX `courses_schedule_course_id_idx`(`course_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courses_schedule` ADD CONSTRAINT `courses_schedule_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
