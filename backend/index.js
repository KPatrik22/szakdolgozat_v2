const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { PDFDocument, StandardFonts, grayscale, rgb } = require('pdf-lib');

const app = express();

app.use(cors());
app.use(express.json());
const port = 3001;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const UPLOADS_FOLDER = path.join(__dirname, 'uploads');

function objectToFormData(obj) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    formData.append(key, value);
  }
  return formData;
}

const removeFilesInFolder = async (folderPath) => {
  try {
    
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      await fs.unlink(filePath);
      console.log(`Removed file: ${filePath}`);
    }

    console.log('All files removed successfully.');
  } catch (error) {
    console.error('Error removing files:', error);
  }
};

const createUploadsFolder = async () => {
  try {
    await fs.access(UPLOADS_FOLDER);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(UPLOADS_FOLDER);
    }
  }
};

const saveFile = async (buffer, fieldName) => {
  const fileName = `${fieldName}_${Date.now()}.pdf`;
  const filePath = path.join(UPLOADS_FOLDER, fileName);
  await fs.writeFile(filePath, buffer);
  return filePath;
};

const combinePDFs = async (savedFiles, formData, outputPath) => {
  const combinedPdfDoc = await PDFDocument.create();

  const tnrFont = await combinedPdfDoc.embedFont(StandardFonts.TimesRoman);
  
  const firstPage = combinedPdfDoc.addPage();

  firstPage.drawRectangle({x: 35, y: 515, width: 450, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // 0.
  firstPage.drawRectangle({x: 485, y: 515, width: 80, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // 0.
  firstPage.drawRectangle({x: 35, y: 440, width: 450, height: 75, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // obligatory
  firstPage.drawRectangle({x: 485, y: 440, width: 80, height: 75, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // credit
  firstPage.drawRectangle({x: 35, y: 390, width: 450, height: 50, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // optional
  firstPage.drawRectangle({x: 485, y: 390, width: 80, height: 50, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // credit
  firstPage.drawRectangle({x: 35, y: 365, width: 450, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // research seminar
  firstPage.drawRectangle({x: 485, y: 365, width: 80, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // credit
  firstPage.drawRectangle({x: 35, y: 340, width: 450, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // institutional
  firstPage.drawRectangle({x: 485, y: 340, width: 80, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // credit
  firstPage.drawRectangle({x: 35, y: 290, width: 450, height: 50, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // educational
  firstPage.drawRectangle({x: 485, y: 290, width: 80, height: 50, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // credit
  firstPage.drawRectangle({x: 35, y: 265, width: 450, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // research report
  firstPage.drawRectangle({x: 485, y: 265, width: 80, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // credit
  firstPage.drawRectangle({x: 35, y: 240, width: 450, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // complex
  firstPage.drawRectangle({x: 485, y: 240, width: 80, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // credit
  firstPage.drawRectangle({x: 35, y: 190, width: 450, height: 50, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // second language
  firstPage.drawRectangle({x: 485, y: 190, width: 80, height: 50, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // credit
  firstPage.drawRectangle({x: 35, y: 165, width: 450, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // publication
  firstPage.drawRectangle({x: 485, y: 165, width: 80, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // credit
  firstPage.drawRectangle({x: 35, y: 140, width: 450, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // total credit
  firstPage.drawRectangle({x: 485, y: 140, width: 80, height: 25, borderWidth: 1.5, borderColor: grayscale(0), color: rgb(1, 1, 1) }) // credit


  firstPage.drawText('Credit Summary', { x: 205, y: 800, size: 28, font: tnrFont});

  const originalName = formData.get('Name');
  const splitName = originalName.split(" ");
  const shortName = splitName[0] + " " + splitName[splitName.length-1];
  const nameWidth = tnrFont.widthOfTextAtSize(originalName, 20);
  var nameText = "Name: ";
  var nameName = "Nincs meghatarozva";
  if(nameWidth>450){
    var nameName = shortName;
  }
  else{
    var nameName = originalName;
  }
  const finalName = nameText.concat(nameName);
  const mtmtText = "MTMT Number: " + formData.get('MTMT');
  const topicfieldText = "Topic Field: " + formData.get('Topic Field');

  if(topicfieldText=="Topic Field: Engineering material science, production systems and processes"){
    firstPage.drawText(finalName, { x: 45, y: 745, size: 20, font: tnrFont});
    firstPage.drawText(mtmtText, { x: 45, y: 720, size: 20, font: tnrFont});
    firstPage.drawText(topicfieldText, { x: 45, y: 695, size: 20, font: tnrFont, maxWidth: 500});
  }
  else{
    firstPage.drawText(finalName, { x: 45, y: 720, size: 20, font: tnrFont});
    firstPage.drawText(mtmtText, { x: 45, y: 695, size: 20, font: tnrFont});
    firstPage.drawText(topicfieldText, { x: 45, y: 670, size: 20, font: tnrFont});
  }

  const topicgroupText = "Topic Group: " + formData.get('Topic Group');
  firstPage.drawText(topicgroupText, { x: 45, y: 645, size: 20, font: tnrFont});

  const academicyearText = "Academic Year: " + formData.get('Academic Year');
  firstPage.drawText(academicyearText, { x: 45, y: 620, size: 20, font: tnrFont});

  const phdstudyyearText = "Year of Ph.D. Study: " + formData.get('phdStudyYear');
  firstPage.drawText(phdstudyyearText, { x: 45, y: 595, size: 20, font: tnrFont});

  const numberofsemesterText = "Number of Semester: " + formData.get('Number of Semester');
  firstPage.drawText(numberofsemesterText, { x: 45, y: 570, size: 20, font: tnrFont});

  firstPage.drawText('Scope of Activities', { x: 200, y: 520, size: 20, font: tnrFont});
  firstPage.drawText('Credits', { x: 495, y: 520, size: 20, font: tnrFont});

  const obligatoryExamsText = formData.get('obligatoryExams');
  firstPage.drawText("Obligatory Subjects: ", { x: 45, y: 495, size: 20, font: tnrFont});
  firstPage.drawText(obligatoryExamsText, { x: 45, y: 470, size: 16, font: tnrFont, maxWidth: 430});
  const obligatoryCredit = formData.get('TotalObligatoryElectiveCredit');
  firstPage.drawText(obligatoryCredit, { x: 515, y: 470, size: 20, font: tnrFont});

  const optionalExamsText = formData.get('optionalExams');
  firstPage.drawText("Optional Subjects: ", { x: 45, y: 420, size: 20, font: tnrFont});
  firstPage.drawText(optionalExamsText, { x: 45, y: 397, size: 16, font: tnrFont});
  let optionalCredit = '0';
  const hasOptionalCredit = formData.has('TotalOptionalCredit');
  if (hasOptionalCredit) {
    optionalCredit = formData.get('TotalOptionalCredit');
  } else {
    optionalCredit = '0';
  }
  firstPage.drawText(optionalCredit, { x: 520, y: 407, size: 20, font: tnrFont});

  firstPage.drawText("Research Seminar", { x: 45, y: 370, size: 20, font: tnrFont});
  let researchseminarCredit = '0';
  const hasResearchSeminarCredit = formData.has('ResearchSeminarCredit');
  if (hasResearchSeminarCredit) {
    researchseminarCredit = formData.get('ResearchSeminarCredit');
  } else {
    researchseminarCredit = '0';
  }
  firstPage.drawText(researchseminarCredit, { x: 515, y: 370, size: 20, font: tnrFont});

  firstPage.drawText("Institutional/Departmental Research", { x: 45, y: 345, size: 20, font: tnrFont});
  let institutionalCredit = '0';
  const hasInstitutionalCredit = formData.has('InstitutionalResearchCredit');
  if (hasInstitutionalCredit) {
    institutionalCredit = formData.get('InstitutionalResearchCredit');
  } else {
    institutionalCredit = '0';
  }
  firstPage.drawText(institutionalCredit, { x: 515, y: 345, size: 20, font: tnrFont});

  firstPage.drawText("Educational activity", { x: 45, y: 320, size: 20, font: tnrFont});
  const hasEducationalActivity = formData.has('educationalActivity');
  if (hasEducationalActivity) {
    var educationalCourse = formData.get('educationalActivity');
  } else {
    var educationalCourse = "-";
  }
  firstPage.drawText(educationalCourse, { x: 45, y: 297, size: 16, font: tnrFont});
  let educationalCredit = '0';
  const hasEducationalCredit = formData.has('TotalEducationalActivityCredit');
  if (hasEducationalCredit) {
    educationalCredit = formData.get('TotalEducationalActivityCredit');
  } else {
    educationalCredit = '0';
  }
  firstPage.drawText(educationalCredit, { x: 515, y: 307, size: 20, font: tnrFont});

  firstPage.drawText("Research Report", { x: 45, y: 270, size: 20, font: tnrFont});
  let researchreportCredit = '0';
  const hasResearchreportCredit = formData.has('ResearchReportCredit');
  if (hasResearchreportCredit) {
    researchreportCredit = formData.get('ResearchReportCredit');
  } else {
    researchreportCredit = '0';
  }
  firstPage.drawText(researchreportCredit, { x: 515, y: 270, size: 20, font: tnrFont});
  
  firstPage.drawText("Complex Report", { x: 45, y: 245, size: 20, font: tnrFont});
  let complexreportCredit = '0';
  const hasComplexReportCredit = formData.has('ComplexReportCredit');
  if (hasComplexReportCredit) {
    complexreportCredit = formData.get('ComplexReportCredit');
  } else {
    complexreportCredit = '0';
  }
  firstPage.drawText(complexreportCredit, { x: 515, y: 245, size: 20, font: tnrFont});

  const secondLanguageExam = formData.get('secondLanguageExam');
  let secondLanguageExamCredit = 0;
  if(secondLanguageExam === "IOK (Language Teaching Centre)"){
    secondLanguageExamCredit = 15;
  }else if(secondLanguageExam === "Intermediate"){
    secondLanguageExamCredit = 20;
  }else if(secondLanguageExam === "Advanced"){
    secondLanguageExamCredit = 25;
  }

  firstPage.drawText("Second Language Exam: ", { x: 45, y: 220, size: 20, font: tnrFont});
  firstPage.drawText(secondLanguageExam, { x: 45, y: 197, size: 16, font: tnrFont});
  firstPage.drawText(secondLanguageExamCredit.toString(), { x: 515, y: 207, size: 20, font: tnrFont});

  firstPage.drawText("List of publications and professional presentations", { x: 45, y: 170, size: 20, font: tnrFont, maxWidth: 430});
  let publicationCredit = '0';
  const hasPublicationCredit = formData.has('PublicationCredit');
  if (hasPublicationCredit) {
    publicationCredit = formData.get('PublicationCredit');
  } else {
    publicationCredit = '0';
  }
  firstPage.drawText(publicationCredit, { x: 515, y: 170, size: 20, font: tnrFont});

  firstPage.drawText("Total Credit", { x: 45, y: 145, size: 20, font: tnrFont});
  const totalCredit = Number(formData.get('creditSum')) + Number(secondLanguageExamCredit);
  firstPage.drawText(totalCredit.toString(), { x: 515, y: 145, size: 20, font: tnrFont});


  const currentDate = new Date().toISOString().split('T')[0];
  const miskolc = 'Miskolc, ';
  const dateAndPlace = miskolc.concat(currentDate);
  firstPage.drawText(dateAndPlace, { font: tnrFont, size: 20, x: 45, y: 100 });

  for (const fieldName of Object.keys(savedFiles)) {
    const pdfPaths = savedFiles[fieldName];

    for (const pdfPath of pdfPaths) {
      const pdfBytes = await fs.readFile(pdfPath);
      const externalPdfDoc = await PDFDocument.load(pdfBytes);

      const externalPages = await combinedPdfDoc.copyPages(
        externalPdfDoc,
        externalPdfDoc.getPageIndices()
      );

      externalPages.forEach((page) => {
        combinedPdfDoc.addPage(page);
      });
    }
  }

  const combinedPdfBytes = await combinedPdfDoc.save();
  await fs.writeFile(outputPath, combinedPdfBytes);
};

app.post(
  '/upload',
  upload.fields([
    { name: 'ResearchSeminarFile', maxCount: 1 },
    { name: 'InstitutionalResearchFile', maxCount: 1 },
    { name: 'researchReport', maxCount: 1 },
    { name: 'complexReport', maxCount: 1 },
    { name: 'publicationsAndPresentations', maxCount: 5 }, 
  ]),
  async (req, res) => {
    try {
      removeFilesInFolder(UPLOADS_FOLDER);

      await createUploadsFolder();

      const savedFiles = {};
      for (const fieldName of Object.keys(req.files)) {
        const files = req.files[fieldName];
        for (const file of files) {
          const filePath = await saveFile(file.buffer, fieldName);
          savedFiles[fieldName] = savedFiles[fieldName] || [];
          savedFiles[fieldName].push(filePath);
        }
      }

      const combinedPdfPath = path.join(UPLOADS_FOLDER, 'combined_pdf.pdf');

      const filteredData = Object.entries(req.body)
      .filter(([key, value]) => !(value instanceof File) && value !== undefined && value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

      const formData = objectToFormData(filteredData);

      const obligatoryExamsValues = [];
      for (const [key, value] of formData.entries()) {
        if (key.endsWith('obligatoryCourseCode')) {
          obligatoryExamsValues.push(value);
        }
      }
      const obligatoryExamsString = obligatoryExamsValues.join(', ');
      formData.set('obligatoryExams', obligatoryExamsString);

      const optionalExamsValues = [];
      for (const [key, value] of formData.entries()) {
        if (key.endsWith('optionalCourseCode')) {
          optionalExamsValues.push(value);
        }
      }
      const optionalExamsString = optionalExamsValues.join(', ');
      formData.set('optionalExams', optionalExamsString);

      let creditSum = 0;
      
      for (const [key, value] of formData.entries()) {
        if (key.endsWith('Credit')) {
          creditSum = creditSum + Number(value);
        }
      }

      formData.set('creditSum', creditSum);
      
      await combinePDFs(savedFiles, formData, combinedPdfPath);

      const combinedPdfBytes = await fs.readFile(combinedPdfPath);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=combined_pdf.pdf');
      res.send(combinedPdfBytes);
    } catch (error) {
      console.error('Error saving files:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
