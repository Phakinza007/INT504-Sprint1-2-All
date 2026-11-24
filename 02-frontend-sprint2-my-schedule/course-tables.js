function addCell(row, testId, value) {
  const cell = document.createElement("td");
  cell.dataset.testid = testId;
  cell.className = "border-t border-slate-200 px-4 py-4";
  cell.textContent = value ?? "";
  row.appendChild(cell);
}

function addScheduleRow(body, schedule, { selectable = false, selected = false, changeable = false } = {}, handlers) {
  const row = document.createElement("tr");
  row.dataset.testid = "schedule-row";
  row.className = "hover:bg-slate-50";
  const day = schedule.dayOfWeek.toLowerCase();

  addCell(row, "code", schedule.course.code);
  addCell(row, "title", schedule.course.title);
  addCell(row, "type", schedule.course.type);
  addCell(row, "section", schedule.section);
  addCell(row, "group", schedule.studentGroup);
  addCell(row, "day", day[0].toUpperCase() + day.slice(1));
  addCell(row, "time", `${schedule.startTime}-${schedule.endTime}`);
  addCell(row, "weeks", `${schedule.startWeek}-${schedule.endWeek}`);
  addCell(row, "room", schedule.room);
  const remarksCell = document.createElement("td");
  remarksCell.className = "border-t border-slate-200 px-4 py-4";
  const remarksText = document.createElement("span");
  remarksText.dataset.testid = "remarks";
  remarksText.textContent = schedule.remarks ?? "";
  remarksCell.appendChild(remarksText);

  if (selectable) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Select";
    button.className = "mt-2 rounded-lg bg-purple-600 px-3 py-1.5 text-white disabled:opacity-50";
    button.addEventListener("click", () => handlers.handleSelect(schedule, button));
    remarksCell.appendChild(button);
  }
  if (selected) {
    for (const [text, handler] of [
      ["Remove", handlers.handleRemove],
      ...(changeable ? [["Change", handlers.handleChange]] : []),
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = text;
      button.className = "mt-2 mr-2 rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50";
      button.addEventListener("click", () => handler(schedule, button));
      remarksCell.appendChild(button);
    }
  }

  row.appendChild(remarksCell);
  body.appendChild(row);
}

function renderTables(schedules, selections, handlers) {
  const selectedSections = new Map(
    selections.map((selection) => [selection.courseId, selection.section]),
  );
  const mySchedules = schedules.filter((schedule) =>
    schedule.fixed || selectedSections.get(schedule.course.id) === schedule.section,
  );
  const options = schedules.filter((schedule) =>
    !schedule.fixed && !selectedSections.has(schedule.course.id),
  );
  const sectionsByCourse = new Map();
  for (const schedule of schedules) {
    if (!sectionsByCourse.has(schedule.course.id)) sectionsByCourse.set(schedule.course.id, new Set());
    sectionsByCourse.get(schedule.course.id).add(schedule.section);
  }

  const myBody = document.getElementById("my-schedule-body");
  const optionsBody = document.getElementById("options-body");
  myBody.replaceChildren();
  optionsBody.replaceChildren();
  mySchedules.forEach((schedule) => addScheduleRow(myBody, schedule, {
    selected: !schedule.fixed && selectedSections.get(schedule.course.id) === schedule.section,
    changeable: (sectionsByCourse.get(schedule.course.id)?.size ?? 0) > 1,
  }, handlers));
  options.forEach((schedule) => addScheduleRow(optionsBody, schedule, { selectable: true }, handlers));

  document.getElementById("schedule-section").hidden = false;
  document.querySelector('[data-testid="my-schedule-empty"]').hidden = mySchedules.length > 0;
  document.getElementById("options-section").hidden = options.length === 0;
}

export { renderTables };
