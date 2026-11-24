-- Enforce the value ranges described in the Sprint 1 Attributes sheet.
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_code_format_check`
    CHECK (REGEXP_LIKE(`code`, '^[A-Z]{3}[0-9]{3}$', 'c')),
  ADD CONSTRAINT `courses_title_not_empty_check`
    CHECK (CHAR_LENGTH(TRIM(`title`)) > 0),
  ADD CONSTRAINT `courses_year_level_check`
    CHECK (`year_level` BETWEEN 1 AND 4);

ALTER TABLE `courses_schedule`
  ADD CONSTRAINT `courses_schedule_section_check`
    CHECK (`section` BETWEEN 1 AND 99),
  ADD CONSTRAINT `courses_schedule_weeks_check`
    CHECK (`start_week` BETWEEN 1 AND 15 AND `end_week` BETWEEN `start_week` AND 15),
  ADD CONSTRAINT `courses_schedule_times_check`
    CHECK (`start_time` < `end_time`);
