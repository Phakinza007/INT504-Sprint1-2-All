const errorDialog = document.getElementById("error-dialog");
const messageDialog = document.getElementById("message-dialog");
const messageText = document.getElementById("message-text");
const messageOkButton = document.getElementById("message-ok");
const removeDialog = document.getElementById("remove-dialog");
const removeQuestion = document.getElementById("remove-question");
const changeDialog = document.getElementById("change-dialog");
const changeOptions = document.getElementById("change-options");
const changeConfirm = document.getElementById("change-confirm");

errorDialog.addEventListener("cancel", (event) => event.preventDefault());
messageOkButton.addEventListener("click", () => messageDialog.close());

function showError() {
  if (!errorDialog.open) errorDialog.showModal();
}

function showMessage(text) {
  messageText.textContent = text;
  messageDialog.showModal();
  return new Promise((resolve) => {
    messageDialog.addEventListener("close", resolve, { once: true });
  });
}

function dayAndTime(schedule) {
  const day = schedule.dayOfWeek.toLowerCase();
  return `${day[0].toUpperCase() + day.slice(1)} ${schedule.startTime}-${schedule.endTime}`;
}

function askRemove(schedule) {
  removeQuestion.textContent = `Remove ${schedule.course.code} ${schedule.course.title} section ${schedule.section}?`;
  removeDialog.returnValue = "cancel";
  removeDialog.showModal();
  return new Promise((resolve) => {
    removeDialog.addEventListener("close", () => resolve(removeDialog.returnValue === "remove"), { once: true });
  });
}

function askChange(schedule, schedules) {
  changeDialog.returnValue = "cancel";
  changeOptions.replaceChildren();
  changeConfirm.disabled = true;
  const sections = new Map();
  for (const row of schedules) {
    if (row.course.id === schedule.course.id && row.section !== schedule.section && !sections.has(row.section)) {
      sections.set(row.section, row);
    }
  }
  for (const [section, row] of sections) {
    const label = document.createElement("label");
    label.className = "flex items-center gap-2 py-2";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "change-section";
    radio.value = String(section);
    radio.addEventListener("change", () => { changeConfirm.disabled = false; });
    label.append(radio, `Section ${section}: ${dayAndTime(row)}`);
    changeOptions.appendChild(label);
  }
  changeDialog.showModal();
  return new Promise((resolve) => {
    changeDialog.addEventListener("close", () => {
      const chosen = changeOptions.querySelector('input[name="change-section"]:checked');
      resolve(changeDialog.returnValue === "change" && chosen ? Number(chosen.value) : null);
    }, { once: true });
  });
}

export { showError, showMessage, askRemove, askChange };
