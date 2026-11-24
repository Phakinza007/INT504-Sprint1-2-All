import { apiRequest, getJson } from "./api.js";
import { showMessage, askRemove, askChange } from "./dialogs.js";

function createSelectionHandlers(state, onChange) {
  let selectionPending = false;

  function selectionsUrl() {
    return `./api/v1/students/${encodeURIComponent(state.studentId)}/selections`;
  }

  async function handleSelect(schedule, button) {
    if (selectionPending) return;
    selectionPending = true;
    button.disabled = true;

    const url = selectionsUrl();

    try {
      const response = await apiRequest(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: schedule.course.id,
          section: schedule.section,
        }),
      });

      if (response.status === 201) {
        const selection = await response.json();
        state.selections.push(selection);
        onChange();
      } else if (response.status === 409) {
        await showMessage("This course is already in your schedule.");
        state.selections = await getJson(url);
        onChange();
      } else {
        await showMessage("There is a problem. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to select section", error);
      await showMessage("There is a problem. Please try again later.");
    } finally {
      selectionPending = false;
      button.disabled = false;
    }
  }

  async function handleRemove(schedule, button) {
    if (selectionPending || !await askRemove(schedule)) return;
    selectionPending = true;
    button.disabled = true;
    const url = `${selectionsUrl()}/${schedule.course.id}`;
    try {
      const response = await apiRequest(url, { method: "DELETE" });
      if (response.status === 204) {
        state.selections = state.selections.filter((row) => row.courseId !== schedule.course.id);
        onChange();
      } else if (response.status === 404) {
        await showMessage("This course is not in your schedule.");
        state.selections = await getJson(selectionsUrl());
        onChange();
      } else {
        await showMessage("There is a problem. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to remove selection", error);
      await showMessage("There is a problem. Please try again later.");
    } finally {
      selectionPending = false;
      button.disabled = false;
    }
  }

  async function handleChange(schedule, button) {
    if (selectionPending) return;
    const section = await askChange(schedule, state.schedules);
    if (section === null) return;
    selectionPending = true;
    button.disabled = true;
    const url = `${selectionsUrl()}/${schedule.course.id}`;
    try {
      const response = await apiRequest(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section }),
      });
      if (response.status === 200) {
        const updated = await response.json();
        state.selections = state.selections.map((row) =>
          row.courseId === updated.courseId ? updated : row,
        );
        onChange();
      } else if (response.status === 404) {
        await showMessage("This course is not in your schedule or the section is no longer available to you.");
        state.selections = await getJson(selectionsUrl());
        onChange();
      } else {
        await showMessage("There is a problem. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to change section", error);
      await showMessage("There is a problem. Please try again later.");
    } finally {
      selectionPending = false;
      button.disabled = false;
    }
  }

  return { handleSelect, handleRemove, handleChange };
}

export { createSelectionHandlers };
