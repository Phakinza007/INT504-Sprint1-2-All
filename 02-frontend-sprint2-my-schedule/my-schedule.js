import { signIn, signOut, isLecturer } from "./auth.js";
import { getStudentProfile } from "./profile.js";
import { getJson } from "./api.js";
import { showError } from "./dialogs.js";
import { renderTables } from "./course-tables.js";
import { createSelectionHandlers } from "./selections.js";

const userName = document.querySelector('[data-testid="user-name"]');
const profileText = document.querySelector('[data-testid="student-profile"]');
const signOutButton = document.getElementById("sign-out");

const state = {
  studentId: "",
  schedules: [],
  selections: [],
};

const selectionHandlers = createSelectionHandlers(state, renderCurrentTables);

signOutButton.addEventListener("click", () => {
  signOut();
});

function renderCurrentTables() {
  renderTables(state.schedules, state.selections, selectionHandlers);
}

async function loadMySchedule() {
  try {
    const token = await signIn();
    userName.textContent = token.name ?? "";
    signOutButton.hidden = false;

    if (isLecturer(token)) {
      document.querySelector('[data-testid="lecturer-message"]').hidden = false;
      return;
    }

    state.studentId = token.preferred_username;
    const studentUrl = `./api/v1/students/${encodeURIComponent(state.studentId)}`;
    const profile = await getStudentProfile(state.studentId);
    if (!profile) {
      document.querySelector('[data-testid="not-student"]').hidden = false;
      return;
    }
    profileText.textContent = `Year ${profile.yearLevel} · Group ${profile.studentGroup}`;
    profileText.hidden = false;

    const schedulesUrl = `./api/v1/year-levels/${profile.yearLevel}/schedules?studentGroup=${profile.studentGroup}`;
    const selectionsUrl = `${studentUrl}/selections`;
    const [schedules, selections] = await Promise.all([
      getJson(schedulesUrl),
      getJson(selectionsUrl),
    ]);
    state.schedules = schedules;
    state.selections = selections;
    renderCurrentTables();
  } catch (error) {
    console.error("Failed to load My Schedule", error);
    showError();
  }
}

loadMySchedule();
