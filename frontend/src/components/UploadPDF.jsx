/* eslint-disable react/prop-types */
// src/components/UploadPDF.jsx
import { useState } from "react";
import axios from "axios";
import Alert from "./Alerts";

const UploadPDF = ({ user }) => {
  const [file, setFile] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [fileName, setFileName] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : ""); // Update file name state
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setAlertType("error");
      setAlertMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const apiUrl = 'https://doctor-management-system-backend.vercel.app';

      // const res = await axios.post("/api/v1/pdfUpload/", formData, {
      //   withCredentials: true,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      
      const res = await axios.post(`${apiUrl}/api/v1/pdfUpload/`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        setAlertType("success");
        setAlertMessage("File uploaded successfully!");
        setFile(null); // Reset file input
        window.setTimeout(() => {
          location.reload();
        }, 1500)
      }
    } catch (err) {
      setAlertType("error");
      setAlertMessage("An error occurred while uploading the file.");
      console.error("Upload error:", err);
    }
  };

  if (!user || user.id.role !== "doctor") {
    return( 
      <main className='main'>
        <section className='section'>
          <p className='login__warning'>You must be logged in as a doctor to upload files!</p>
          <a href='/login' className='warning__link login__link'>Login/Signup as Doctor</a>
        </section>
      </main>
      );
  }
  return (
    <>
        <main className='main'>
          {alertType && <Alert type={alertType} message={alertMessage} />}
          <form onSubmit={handleUpload} className='upload__form'>
          <div className="file-input-container">
          <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <span className="file-input-text">Choose File</span>
          </div>
          {fileName && <p>Selected file: {fileName}</p>}
            <button className="btn upload__btn" type="submit">Upload PDF</button>
          </form>
        </main>
    </>
  );
};

export default UploadPDF;
