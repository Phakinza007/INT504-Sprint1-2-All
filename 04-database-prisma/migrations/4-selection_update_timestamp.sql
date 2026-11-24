ALTER TABLE `selections`
  MODIFY COLUMN `updated_at` DATETIME(3) NOT NULL
    DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  ADD CONSTRAINT `selections_student_id_check`
    CHECK (REGEXP_LIKE(`student_id`, '^[0-9]{11}$', 'c')),
  ADD CONSTRAINT `selections_section_check`
    CHECK (`section` BETWEEN 1 AND 99);
