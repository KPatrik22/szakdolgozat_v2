import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';
import axios from 'axios';


function App() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  
  const [topicField, setTopicField] = useState("Basic engineering sciences"); 

  const handleTopicFieldChange = (event) => {
    setTopicField(event.target.value);
  };
  
  const [phdStudyYear, setPhdStudyYear] = useState(1);

  const handlePhdStudyYearChange = (event) => {
    setPhdStudyYear(parseInt(event.target.value));
  };
  
  const [checkboxes, setCheckboxes] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
    checkbox6: false
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes({
      ...checkboxes,
      [name]: checked
    });
  };
  
  const [languageExam, setLanguageExam] = useState("None"); 

  const handleLanguageExamChange = (event) => {setLanguageExam(event.target.value);};

  const [obligatoryExams, setObligatoryExams] = useState([{ courseCode: '' }]);

  const handleExamCodeChange = (index, value) => {
    const updatedExams = [...obligatoryExams];
    updatedExams[index].courseCode = value;
    setObligatoryExams(updatedExams);
  };

  const addObligatoryExams = () => {
    setObligatoryExams([...obligatoryExams, { courseCode: '' }]);
  };

  const removeObligatoryExams = (index) => {
    const updatedExams = [...obligatoryExams];
    updatedExams.splice(index, 1);
    setObligatoryExams(updatedExams);
  };

  const [optionalExams, setOptionalExams] = useState([{ courseCode: '' }]);

  const handleOptionalExamCodeChange = (index, value) => {
    const updatedExams = [...optionalExams];
    updatedExams[index].courseCode = value;
    setOptionalExams(updatedExams);
  };

  const addOptionalExams = () => {
    setOptionalExams([...optionalExams, { courseCode: '' }]);
  };

  const removeOptionalExams = (index) => {
    const updatedExams = [...optionalExams];
    updatedExams.splice(index, 1);
    setOptionalExams(updatedExams);
  };


  const onSubmit = async (data) => {
    try {

      console.log('Form data:', data);

      const formData = new FormData();

      for (const key in data) {
        if (data[key] instanceof FileList) {
          for (let i = 0; i < data[key].length; i++) {
            formData.append(key, data[key][i]);
          }
        } else if (Array.isArray(data[key]) ) {
            data[key].forEach((item, index) => {
              Object.entries(item).forEach(([subKey, subValue]) => {
                  formData.append(`${key}[${index}].${subKey}`, subValue);
              });
            });
        } else {
          if (data[key] !== undefined && data[key] !== '') {
            formData.append(key, data[key]);
          }
        }
      }

      const response = await axios.post(
        'http://localhost:3001/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'arraybuffer',
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;

      link.download = 'combined_pdf.pdf';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL('a');

      alert('PDF generated successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="app-container">
      <center><h1>Credit Summary</h1></center>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Name:</label>
          <input {...register('Name', { required: true })} />
          <p className="error-message">
            {errors.Name && 'Name is required'}
          </p>
        </div>

        <div className="form-group">
          <label>MTMT Number:</label>
          <input {...register('MTMT', { required: true })} />
          <p className="error-message">
            {errors.MTMT && 'MTMT number is required'}
          </p>
        </div>

        <div className="form-group">
          <label>Topic Field:</label>
          <select {...register('Topic Field')} onChange={handleTopicFieldChange}>
            <option value="Basic engineering sciences">Basic engineering sciences</option>
            <option value="Design of machines and structures">Design of machines and structures</option>
            <option value="Engineering material science, production systems and processes">Engineering material science, production systems and processes</option>
          </select>
        </div>

        <div className="form-group">
          <label>Topic Group:</label>
          <select {...register('Topic Group')}>
            {topicField === "Basic engineering sciences" && (
              <>
                <option value="Mechanics of solids">Mechanics of solids</option>
                <option value="Transport processes and machines">Transport processes and machines</option>
              </>
            )}
            {topicField === "Design of machines and structures" && (
              <>
                <option value="Material handling machine design">Material handling machine design</option>
                <option value="Design of machines and elements">Design of machines and elements</option>
                <option value="Product Development and Design">Product Development and Design</option>
                <option value="Design of mechatronic systems">Design of mechatronic systems</option>
                <option value="Design of engineering structures">Design of engineering structures</option>
                <option value="Design of machine tools">Design of machine tools</option>
                <option value="Energy and chemical engineering systems design">Energy and chemical engineering systems design</option>
              </>
            )}
            {topicField === "Engineering material science, production systems and processes" && (
              <>
                <option value="Materials engineering and mechanical technology">Materials engineering and mechanical technology</option>
                <option value="Manufacturing systems and processes">Manufacturing systems and processes</option>
                <option value="Assembly systems">Assembly systems</option>
                <option value="Structural integrity">Structural integrity</option>
              </>
            )}
          </select>
          <p></p>
        </div>

        <div className="form-group">
          <label>Academic Year:</label>
          <select {...register('Academic Year')}>
            <option value="2023/2024 II.">2023/2024 II.</option>
            <option value="2024/2025 I.">2024/2025 I.</option>
          </select>
        </div>

        <div className="form-group">
        <label>Year of PHD Study:</label>
        <select {...register('phdStudyYear')} value={phdStudyYear} onChange={handlePhdStudyYearChange}>
          {[...Array(4).keys()].map((year) => (
            <option key={year + 1} value={year + 1}>
              {year + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Number of Semester:</label>
        <select {...register('Number of Semester')}>
          {[...Array(2).keys()].map((semester) => (
            <option key={(phdStudyYear - 1) * 2 + semester + 1} value={(phdStudyYear - 1) * 2 + semester + 1}>
              {(phdStudyYear - 1) * 2 + semester + 1}
            </option>
          ))}
        </select>
        <p></p>
      </div>

        <div className="form-group" id="formfield">
          <label>
            Exam of Obligatory and Elective Subjects (Neptun Course Code):
          </label>
          {obligatoryExams.map((exam, index) => (
            <div key={index} className="input-group">
              <input
                {...register(`obligatoryExams[${index}].obligatoryCourseCode`)}
                placeholder="Course Code"
                value={exam.courseCode}
                onChange={(e) => handleExamCodeChange(index, e.target.value)}
              />
              <button type="button" onClick={() => removeObligatoryExams(index)}>
                Remove
              </button>
              <p/>
            </div>
          ))}

          <button type="button" onClick={addObligatoryExams}>Add Exam</button>
          <p/>
          <label>Obtained Credits with Obligatory Subjects:</label>
          <input {...register('TotalObligatoryElectiveCredit', { required: true })} />
          <p className="error-message">
            {errors.TotalObligatoryElectiveCredit &&
              'Total Credit for Obligatory and Elective Subjects is required'}
          </p>
        </div>

        <div className="form-group">
          <label>Exam of Optional Subjects (Neptun Course Code):</label>
          {optionalExams.map((exam, index) => (
            <div key={index} className="input-group">
              <input
                {...register(`optionalExams[${index}].optionalCourseCode`)}
                placeholder="Course Code"
                value={exam.courseCode}
                onChange={(e) => handleOptionalExamCodeChange(index, e.target.value)}
              />
              <button type="button" onClick={() => removeOptionalExams(index)}>
                Remove
              </button>
              <p/>
            </div>
          ))}

          <button type="button" onClick={addOptionalExams}>Add Exam</button>
          <p/>
          <label>Obtained Credits with Optional Subjects:</label>
          <input {...register('TotalOptionalCredit')} />
        </div>
          

        <div className="form-group">
          <label>Research Seminar (Upload .pdf):</label>
          <label>
          <input
            type="checkbox"
            name="checkbox1"
            checked={checkboxes.checkbox1}
            onChange={handleCheckboxChange}/>
          </label>
          {checkboxes.checkbox1 && (
          <div>
            <input type="file"
            {...register('ResearchSeminarFile')} 
            accept=".pdf" 
          /> 
          <label>Obtained Credits with Research Seminar:</label>
          <input {...register('ResearchSeminarCredit', { required: true })}  />
          <p className="error-message">
            {errors.ResearchSeminarCredit &&
              'Obtained Credits for Research Seminar is required'}
          </p>
          </div> )}

          
        </div>

        <div className="form-group">
          <label>Institutional/Departmental Research (Upload .pdf):</label>
          <label>
          <input
            type="checkbox"
            name="checkbox2"
            checked={checkboxes.checkbox2}
            onChange={handleCheckboxChange}/>
          </label>
          {checkboxes.checkbox2 && (
          <div>
            <input type="file"
            {...register('InstitutionalResearchFile')} 
            accept=".pdf" 
          /> 
          <label>Obtained Credits With Institutional/Departmental Research:</label>
          <input {...register('InstitutionalResearchCredit', { required: true })}  />
          <p className="error-message">
            {errors.InstitutionalResearchCredit &&
              'Obtained Credits for Institutional/Departmental Research is required'}
          </p>
          </div> )}
        </div>

        
        <div className="form-group">
          <label>Educational Activity (with Course Code from NEPTUN):</label>
          <label>
          <input
            type="checkbox"
            name="checkbox6"
            checked={checkboxes.checkbox6}
            onChange={handleCheckboxChange}/>
          </label>
          {checkboxes.checkbox6 && (
            <div>
              <input
                {...register('educationalActivity', { required: true })}
                placeholder="Course Code"/>
                <p className="error-message">
            {errors.educationalActivity &&
              'Course Code from NEPTUN is required'}
          </p>
          <label>Obtained Credits:</label>
          <input {...register('TotalEducationalActivityCredit', { required: true })} />
          <p className="error-message">
            {errors.TotalEducationalActivityCredit &&
              'Obtained Credits for Educational Activity is required'}
          </p>
          </div> )}
        </div>

        <div className="form-group">
          <label>Research Report (Upload .pdf):</label>
          <label>
          <input
            type="checkbox"
            name="checkbox3"
            checked={checkboxes.checkbox3}
            onChange={handleCheckboxChange}/>
          </label>
          {checkboxes.checkbox3 && (
          <div>
            <input type="file"
            {...register('researchReport')} 
            accept=".pdf" 
          /> 
          <label>Obtained Credits with Research Report:</label>
          <input {...register('ResearchReportCredit', { required: true })}  />
          <p className="error-message">
            {errors.ResearchReportCredit &&
              'Obtained Credits for Research Report is required'}
          </p>
          </div> )}
        </div>

        <div className="form-group">
          <label>Complex Report (Upload .pdf):</label>
          <label>
          <input
            type="checkbox"
            name="checkbox4"
            checked={checkboxes.checkbox4}
            onChange={handleCheckboxChange}/>
          </label>
          {checkboxes.checkbox4 && (
          <div>
            <input type="file"
            {...register('complexReport')} 
            accept=".pdf" 
          /> 
          <label>Obtained Credits with Complex Report:</label>
          <input {...register('ComplexReportCredit', { required: true })}  />
          <p className="error-message">
            {errors.ComplexReportCredit &&
              'Obtained Credits for Complex Report is required'}
          </p>
          </div> )}
        </div>

        <div className="form-group">
          <label>Second Language Exam:</label>
          <select {...register('secondLanguageExam')} value={languageExam} onChange={handleLanguageExamChange}>
            <option value="None">None</option>
            <option value="IOK (Language Teaching Centre)">IOK (Language Teaching Centre)</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label>Obtained Credits with Language Exam:</label>
          <select {...register('LanguageCredit')} class="disabled">
              {languageExam === "None" && (
                <>
                  <option value="0">0</option>
                </>
              )}
              {languageExam === "IOK (Language Teaching Centre)" && (
                <>
                  <option value="15">15</option>
                </>
              )}
              {languageExam === "Intermediate" && (
                <>
                  <option value="20">20</option>
                </>
              )}
              {languageExam === "Advanced" && (
                <>
                  <option value="25">25</option>
                </>
              )}
            </select>
          <p className="error-message">
            {errors.LanguageCredit &&
              'Obtained Credits for Second Language Exam is required'}
          </p>
        </div>

        <div className="form-group">
          <label>
            List of Publications and Professional Presentations (Upload multiple
            files):
          </label>
          <label>
          <input
            type="checkbox"
            name="checkbox5"
            checked={checkboxes.checkbox5}
            onChange={handleCheckboxChange}/>
          </label>
          {checkboxes.checkbox5 && (
          <div>
            <input type="file"
            {...register('publicationsAndPresentations')} 
            accept=".pdf" 
          /> 
          <label>Obtained Credits with Publications:</label>
          <input {...register('PublicationCredit', { required: true })}  />
          <p className="error-message">
            {errors.PublicationCredit &&
              'Obtained Credits for Publications is required'}
          </p>
          </div> )}
          <p className="error-message">
            {errors.PublicationCredit &&
              'Only PDF files are allowed'}
          </p>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
