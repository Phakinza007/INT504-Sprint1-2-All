# INT504 — โค้ด Sprint 1–2 ทั้งทีม (Alan · Beam · Dragon)

> ดึงจาก snapshot จบ Sprint 2 (`commit 5e30ae0`) ครบทุกส่วน (Frontend · Backend · Prisma DB · Docker/Nginx) แบบสะอาด ไม่มีโค้ด Sprint 3 ปน

---

## `01-frontend-sprint1-guest/` — หน้า Guest ตารางรวม + กรองชั้นปี (PBI1–2)
| ไฟล์ | เจ้าของ | เอาไว้ทำอะไร |
| :--- | :---: | :--- |
| `index.html` | Beam | โครงหน้า Guest (`Class Schedule`), ปุ่ม `All`/`Year 1–4`, ตาราง 9 คอลัมน์ (ไม่มี Room) |
| `app.js` | Beam | โหลด `GET ./api/v1/schedules` ครั้งเดียว → กรองใน RAM + อัปเดต URL `?yearLevel=...` |

---

## `02-frontend-sprint2-my-schedule/` — หน้า My Schedule (PBI3–7, เรียงตามลำดับทำงาน 0 → 8)
| ไฟล์ | เจ้าของ | เอาไว้ทำอะไร |
| :--- | :---: | :--- |
| `0-my-schedule.html` | ทั้งทีม | โครง HTML ของหน้า My Schedule (2 ตาราง, ข้อความแจ้งเตือน, `<dialog>` ทั้งหมด) |
| `1-auth.js` | Alan (PBI3) | ล็อกอิน/ออกจากระบบผ่าน Keycloak (`signIn`, `signOut`, `isLecturer`) |
| `2-config.js` | Alan (PBI3) | ค่าตั้งต้น Keycloak (`url`, `realm`, `clientId`) |
| `3-api.js` | Beam | ตัวช่วยยิง API กลาง (`apiRequest`, `getJson`) |
| `4-profile.js` | Alan + Beam | ดึงโปรไฟล์นักศึกษา `GET /students/{id}` (404 คืน `null` ไม่เด้ง Error Dialog) |
| `5-my-schedule.js` | Beam (PBI4) | ตัวคุมหลัก + `state` — ล็อกอิน → โหลด Profile → `Promise.all` โหลด `schedules` + `selections` |
| `6-course-tables.js` | Beam (PBI4–5) | แยก 2 ตารางจาก State เดียว (`My Schedule` ใช้ `.get()`, `Courses to Choose` ใช้ `!has()`) + สร้างปุ่ม |
| `7-selections.js` | Beam (PBI5) / Dragon (PBI6–7) | `handleSelect` (`POST 201`), `handleRemove` (`DELETE 204`), `handleChange` (`PUT 200`) |
| `8-dialogs.js` | Beam (PBI4–5) / Dragon (PBI6–7) | กล่อง `showError`, `showMessage`, `askRemove`, `askChange` |

---

## `03-backend/` — Express + Prisma API ทั้งหมดของ Sprint 1–2
| ไฟล์ | เจ้าของ | เอาไว้ทำอะไร |
| :--- | :---: | :--- |
| `server.js` / `app.js` | ทั้งทีม | จุดสตาร์ต Express server + `/api/v1/health` + mount routes ทั้งหมด |
| `routes/schedule.routes.js` | Beam | Route `/api/v1/schedules` และ `/api/v1/year-levels/:yearLevel/schedules` |
| `routes/student.routes.js` | Alan | Route `/api/v1/students/:studentId` |
| `routes/selection.routes.js` | Beam + Dragon | Route `/api/v1/students/:studentId/selections` (`GET/POST/DELETE/PUT`) |
| `controllers/schedule.controller.js` | Beam | จัดการ request ตารางสาธารณะ (PBI1–2) และตารางชั้นปี/กลุ่ม (PBI4) |
| `controllers/student.controller.js` | Alan | จัดการ `GET /students/:studentId` (200 / 404) |
| `controllers/selection.controller.js` | Beam + Dragon | จัดการ `GET`, `POST` (201/409/404), `DELETE` (204), `PUT` (200) |
| `services/schedule.service.js` | Beam | Query `courses_schedule` จาก Prisma |
| `services/student.service.js` | Alan | คำนวณ `yearLevel` + `studentGroup` จาก `academic_settings` & `student_group_ranges` |
| `services/selection.service.js` | Beam + Dragon | Query/สร้าง/ลบ/เปลี่ยน `selections` ใน Prisma (กันเลือก fixed, ดักซ้ำ `P2002`) |
| `utils/schedule.js` | Beam | คำนวณ `isFixed`, จัดเรียงแบบ PBI1 (`compareSchedules`), format เวลา `HH:MM` |

---

## `04-database-prisma/` — ฐานข้อมูล Sprint 1–2
- `schema.prisma` — โมเดล `Course`, `CourseSchedule`, `AcademicSetting`, `StudentGroupRange`, `Selection`
- `seed.js` — Script เติมข้อมูลตั้งต้น (51 วิชา, 92 schedules, 1 setting, 8 group ranges)
- `migrations/1..4` — SQL migration ทั้ง 4 ตัวของ Sprint 1–2

---

## `05-deploy-docker-nginx/` — Deploy 4 Containers (Docker Compose + Nginx)
- `compose.yaml` — 4 containers: `proxy`, `frontend`, `backend`, `database`
- `nginx-default.conf.template` — Reverse proxy `/intproj26/<TEAM-PATH>/` + HTTPS TLS
- `frontend.Dockerfile`, `backend.Dockerfile`, `frontend.nginx.conf`, `.env.example`, `package.json`
