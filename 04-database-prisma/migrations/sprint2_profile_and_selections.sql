CREATE TABLE `academic_settings` (
    `id` INTEGER NOT NULL,
    `current_academic_year` INTEGER NOT NULL,
    `current_semester` INTEGER NOT NULL,
    `program_code` CHAR(6) NOT NULL,
    `program_name` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `student_group_ranges` (
    `id` INTEGER NOT NULL,
    `entry_year` INTEGER NOT NULL,
    `student_group` ENUM('A', 'B') NOT NULL,
    `from_no` INTEGER NOT NULL,
    `to_no` INTEGER NOT NULL,
    UNIQUE INDEX `student_group_ranges_entry_year_student_group_key`(`entry_year`, `student_group`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `selections` (
    `student_id` CHAR(11) NOT NULL,
    `course_id` INTEGER NOT NULL,
    `section` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`student_id`, `course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `selections` ADD CONSTRAINT `selections_course_id_fkey`
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
