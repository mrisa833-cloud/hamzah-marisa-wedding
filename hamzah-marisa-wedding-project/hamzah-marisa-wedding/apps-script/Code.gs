/** Hamzah & Marisa — Google Sheets RSVP backend.
 * Bound to the target spreadsheet. Run setup() once, then deploy as Web App.
 */
const SHEET_NAME = "RSVP";
const HEADERS = ["Timestamp", "Nama Lengkap", "Kehadiran", "Jumlah Tamu", "Ucapan"];

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.autoResizeColumns(1, HEADERS.length);
  }
  return "Siap: " + ss.getUrl();
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const p = (e && e.parameter) || {};
    if (p.action !== "rsvp") return json_({ ok: false, error: "Aksi tidak valid." });
    const name = clean_(p.name, 100);
    const attendance = p.attendance === "Hadir" ? "Hadir" : p.attendance === "Tidak Hadir" ? "Tidak Hadir" : "";
    const message = clean_(p.message, 500);
    const rawGuests = Number(p.guests);
    const guests = attendance === "Hadir" ? Math.max(1, Math.min(5, Number.isFinite(rawGuests) ? Math.floor(rawGuests) : 1)) : 0;
    if (!name || !attendance) return json_({ ok: false, error: "Nama dan konfirmasi kehadiran wajib diisi." });
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("Sheet RSVP belum tersedia. Jalankan setup() terlebih dahulu.");
    sheet.appendRow([new Date(), safeCell_(name), attendance, guests, safeCell_(message)]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action !== "wishes") return json_({ ok: true, service: "Hamzah & Marisa RSVP" });
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet && sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getDisplayValues() : [];
  const wishes = rows.filter(r => String(r[4] || "").trim()).slice(-100)
    .map(r => ({ name: String(r[1]), message: String(r[4]) }));
  const payload = JSON.stringify({ ok: true, wishes: wishes });
  const callback = String(p.callback || "");
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput(callback + "(" + payload + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
}

function clean_(value, maxLength) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, maxLength);
}
// Prevent guest-submitted text from being interpreted as a spreadsheet formula.
function safeCell_(value) {
  return /^[=+\-@\t\r]/.test(String(value)) ? "'" + value : value;
}
function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
