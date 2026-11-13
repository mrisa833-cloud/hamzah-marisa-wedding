const SHEET_NAME = 'RSVP';
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'wishes';
  if (action === 'wishes') {
    const sheet = getSheet_();
    const rows = sheet.getDataRange().getValues().slice(1);
    const wishes = rows.filter(r => String(r[4] || '').trim()).slice(-100).reverse().map(r => ({name:r[1], attendance:r[2], message:r[4], timestamp:r[0]}));
    return json_({ok:true,wishes});
  }
  return json_({ok:true,message:'Hamzah & Marisa RSVP endpoint aktif.'});
}
function doPost(e) {
  const p = (e && e.parameter) || {};
  const name = String(p.name || '').trim().slice(0,100);
  const attendance = String(p.attendance || '').trim();
  const guests = Math.max(1, Math.min(4, Number(p.guests) || 1));
  const message = String(p.message || '').trim().slice(0,500);
  if (!name || !['Hadir','Tidak Hadir'].includes(attendance)) return json_({ok:false,error:'Data tidak valid'});
  getSheet_().appendRow([new Date(), name, attendance, guests, message]);
  return json_({ok:true});
}
function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Jalankan setup() terlebih dahulu.');
  const ss = SpreadsheetApp.openById(id);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) { sheet = ss.insertSheet(SHEET_NAME); sheet.appendRow(['Timestamp','Nama','Kehadiran','Jumlah Tamu','Ucapan']); }
  return sheet;
}
function setup() {
  const ss = SpreadsheetApp.create('RSVP Pernikahan Hamzah & Marisa');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  const sheet = ss.getSheets()[0]; sheet.setName(SHEET_NAME);
  sheet.appendRow(['Timestamp','Nama','Kehadiran','Jumlah Tamu','Ucapan']);
  Logger.log('Google Sheet: ' + ss.getUrl());
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}