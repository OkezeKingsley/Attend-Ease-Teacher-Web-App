import React, { useEffect, useState, useRef } from 'react';
import Header from './Header';
import { FaSearch, FaQrcode, FaPrint, FaArrowLeft, FaUserPlus, FaTrash } from 'react-icons/fa';
import QrCodeModal from '../modals/QrCodeModal';
import AddStudentModal from '../modals/AddStudentModal';
import '../styles/AttendeesList.css';
import axios from 'axios';
import CustomAlert from '../modals/CustomAlert';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function AttendeesList({ classData, goBack }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [qrCodeModalIsOpen, setQrCodeModalIsOpen] = useState(false);
  const [addStudentModalIsOpen, setAddStudentModalIsOpen] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [attendeeToDeleteId, setAttendeeToDeleteId] = useState('');
  const tableContainerRef = useRef(null);

  useEffect(() => {
    if (classData && classData._id) {
      fetchAttendees(classData._id);
    }
  }, [classData]);

  const fetchAttendees = async (classSessionId) => {
    const teacherId = localStorage.getItem("teacherId");
    const token = localStorage.getItem("token");

    if (!token) {
      return alert("Could not get session");
    }
    if (!teacherId) {
      return alert("Please logout and login again");
    }
    try {
      const response = await axios.post("/teacher/fetch-attendees",
        { teacherId: JSON.parse(teacherId), classSessionId },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          }
        }
      );

      if (response.status === 200) {
        console.log(response.data)
        setAttendees(response.data);
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.error;
console.log("error fecthing is", error)
        if (status === 400 || status === 500) {
          setAlert({ show: true, message: message, type: 'error' });
        } else if (status === 401) {
          navigate("/");
          setAlert({ show: true, message: message, type: 'error' });
        } else {
          setAlert({ show: true, message: "An Unexpected error occurred!", type: 'error' });
        }
      } else {
        setAlert({ show: true, message: "An Unknown error occurred!", type: 'error' });
      }
    }
  };

  useEffect(() => {
    if (alert.show === true) {
      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 5000);
    }
  }, [alert]);

  const handleQrCodeClick = () => {
    setQrCodeModalIsOpen(true);
  };

  const handleAddStudentClick = () => {
    setAddStudentModalIsOpen(true);
  };

  const handleQrCodeClose = () => {
    setQrCodeModalIsOpen(false);
  };

  const handleAddStudentClose = () => {
    setAddStudentModalIsOpen(false);
    fetchAttendees(classData._id); // Fetch attendees when modal closes
  };

  const confirmDelete = async () => {
    const teacherId = localStorage.getItem("teacherId");
    const token = localStorage.getItem("token");

    if (!token) {
      return alert("Could not get session");
    }
    if (!teacherId) {
      return alert("Please logout and login again");
    }

    try {
      const response = await axios.post("/teacher/delete-attendee",
        { teacherId: JSON.parse(teacherId), classSessionId: classData._id, studentId: attendeeToDeleteId },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          }
        }
      );

      if (response.status === 200) {
        setAttendees(attendees.filter(attendee => attendee.studentId !== attendeeToDeleteId));
        setAlert({ show: true, message: "Student deleted successfully!", type: 'success' });
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.error;

        if (status === 400 || status === 404 || status === 500) {
          setAlert({ show: true, message: message, type: 'error' });
        } else if (status === 401) {
          navigate("/");
          setAlert({ show: true, message: message, type: 'error' });
        } else {
          setAlert({ show: true, message: "An Unexpected error occurred!", type: 'error' });
        }
      } else {
        console.log(error)
        setAlert({ show: true, message: "An Unknown error occurred!", type: 'error' });
      }
    }
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
};

const handlePrint = async () => {
  fetchAttendees();
  
  const input = tableContainerRef.current;
  const doc = new jsPDF();

  // Create canvas from the DOM element
  const canvas = await html2canvas(input, {
    ignoreElements: (element) => element.classList.contains('ignore-for-pdf-download')
  });
  const imgData = canvas.toDataURL('image/png');

  // Header details
  const headerY = 10; // Vertical position of the header

  // Add attendance header with styling
  doc.setFont('bold');
  doc.setFontSize(18);
  const centerX = (doc.internal.pageSize.width - doc.getStringUnitWidth('Attendance Record') * doc.internal.scaleFactor) / 2;
  doc.text('Attendance Record', centerX, headerY);

  doc.setLineWidth(1);
  doc.line(0, headerY + 70, doc.internal.pageSize.width, headerY + 70); // Horizontal line below header title

  doc.setFont('normal');
  doc.setFontSize(12);
  doc.text(`School: ${classData.school}`, 10, headerY + 20);
  doc.text(`Class Name: ${classData.className}`, 10, headerY + 30);
  doc.text(`Level: ${classData.level}`, 10, headerY + 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, headerY + 50);
  doc.text(`Total Number of Attendees: ${attendees.length > 0 ? attendees.length : 0 }`, 10, headerY + 60);

  doc.setLineWidth(1);
  doc.line(0, headerY + 65, doc.internal.pageSize.width, headerY + 65); // Horizontal line below header details

  // Add image (table) below header
  doc.addImage(imgData, 'PNG', 0, headerY + 80, doc.internal.pageSize.width, 0);

  // Add custom text at the bottom of the PDF
  doc.setTextColor(255, 99, 71); // Tomato color
  doc.text('Generated from AttendeEase', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
    align: 'center'
  });

  // Save the PDF
  doc.save('attendees.pdf');
};




  return (
    <div className="attendees-list-container">
      <Header />
      {alert.show && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: '', type: '' })}
        />
      )}
      <div className="attendees-list-header">
        <div className="attendees-list-header-text-container">
          <button className="back-btn" onClick={goBack}><FaArrowLeft /></button>
          <p className="attendees-list-title">Attendees</p>
        </div>
        <div>
          <button className="qr-code-btn" onClick={handleQrCodeClick}><FaQrcode /></button>
        </div>
      </div>
      <div className="attendees-text-and-search-container">
        <div className="attendees-search-bar-container">
          <FaSearch className="attendees-search-icon" />
          <input
            type="text"
            className="attendees-search-bar"
            placeholder="Search attendees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="attendees-add-student-button-container">
          <button className="attendees-add-student-button" onClick={handleAddStudentClick}>
            <FaUserPlus className="attendees-add-student-icon" /> Add Student
          </button>
        </div>
      </div>
      <div className="attendees-table-container" ref={tableContainerRef}>
        <table>
          <thead className="attendees-table-header">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Matric Number</th>
              <th className="ignore-for-pdf-download">Action</th> 
            </tr>
          </thead>
          <tbody>
            {attendees && attendees.length > 0 ? (
              attendees
                .reverse()
                .filter((attendee) =>
                  attendee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  attendee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  attendee.matricNumber.includes(searchTerm))
                .map((attendee) => (
                  <tr key={attendee.studentId} className="attendees-table-data">
                    <td>{attendee.firstName}</td>
                    <td>{attendee.lastName}</td>
                    <td>{attendee.matricNumber}</td>
                    <td className="ignore-for-pdf-download">
                      <button
                        className="delete-btn"
                        onClick={() => {
                          setShowDeleteConfirm(true)
                          setAttendeeToDeleteId(attendee.studentId)
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" className="no-attendees-found">No attendees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="attendees-footer">
        <p>Total Students: {attendees.length > 0 ? attendees.length : 0}</p>
        <button className="print-btn" onClick={handlePrint}><FaPrint /> Print</button>
      </div>
      <QrCodeModal
        isOpen={qrCodeModalIsOpen}
        onRequestClose={handleQrCodeClose}
        qrCodeId={classData._id}
      />
      <AddStudentModal
        isOpen={addStudentModalIsOpen}
        onRequestClose={handleAddStudentClose}
        classSessionId={classData._id}
        successfullyAddedStudent={() => { 
          fetchAttendees(classData._id); 
          setAlert({ show: true, message: "Successfully added Student!", type: 'success' }); 
        }}
      />
      {showDeleteConfirm && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-modal">
              <p>Are you sure you want to delete this Student from the Attendance List?</p>
                <div className="delete-confirm-buttons">
                  <button onClick={confirmDelete}>Yes</button>
                    <button onClick={closeDeleteConfirm}>No</button>
                </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default AttendeesList;
