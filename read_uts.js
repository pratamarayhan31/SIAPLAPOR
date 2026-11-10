const AdmZip = require('adm-zip');

try {
  const zip = new AdmZip('C:\\Users\\L3I7G14R32S1TRTX46TI\\Downloads\\Ujian Tengah Semester.docx');
  const xml = zip.readAsText('word/document.xml');
  const text = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log('--- UTS CONTENT ---');
  console.log(text);
} catch (err) {
  console.error(err);
}
