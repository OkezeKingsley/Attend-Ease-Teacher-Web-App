import React, { useState, useEffect } from 'react';
import Header from "./Header";
import '../styles/ClassSessionHistory.css';
import { FaQrcode, FaTrash, FaSearch } from 'react-icons/fa';
import CreateClassSessionModal from '../modals/CreateClassSessionModal';  // Import the modal component
import QrCodeModal from '../modals/QrCodeModal'; // Import the QR code modal component
import axios from 'axios';
import CustomAlert from '../modals/CustomAlert';
import { useNavigate } from 'react-router-dom';

function ClassSessionHistory ({ showAttendeesList }) {
    const navigate = useNavigate();
    const [createClassSessionModalIsOpen, setCreateClassSessionModalIsOpen] = useState(false);
    const [qrCodeModalIsOpen, setQrCodeModalIsOpen] = useState(false);
    const [qrCodeId, setQrCodeId] = useState('');
    const [deleteClassSessionId, setDeleteClassSessionId] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [createdClassSessions, setCreatedClassSessions] = useState([]);
    const [message, setShowMessage] = useState();
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    
    const fetchAllCreatedClassSession = async () => {
        const teacherId = localStorage.getItem("teacherId");
        const token = localStorage.getItem("token");

        if (!token) {
            return alert("Could not get session");
        }
        if (!teacherId) {
            return alert("Please logout and login again");
        }
        try {
            if (teacherId && token) {
                const response = await axios.post("/teacher/fetch-created-class-sessions",
                    { teacherId: JSON.parse(teacherId) },
                    {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(token)}`,
                        }
                    }
                );

                if (response.status === 200) {
                    setCreatedClassSessions(response.data);

                    if (qrCodeModalIsOpen === false) {
//  setAlert({ show: true, message: "Class Session Created Successfully!", type: 'success'});
                    }
                }
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data.error;
        
                if (status === 400 || status === 404 || status === 401 || status === 403 || status === 500) {
                  setAlert({ show: true, message: message, type: 'error'});
                } else { setAlert({ show: true, message: 'An unexpected error occured!', type: 'error'}); }
        
            } else { setAlert({ show: true, message: 'An unknown error occured!', type: 'error'}); }
              
        }
    };

    useEffect(() => {
        fetchAllCreatedClassSession();
    }, []);

    useEffect(() => {
        if (alert.show === true) {
          setTimeout(() => {
            setAlert({ show: false, message: '', type: ''});
          }, 5000);
        }
      }, [alert]);
      
    const openCreateClassSessionModal = () => {
        setCreateClassSessionModalIsOpen(true);
    };

    const closeCreateClassSessionModal = () => {
        setCreateClassSessionModalIsOpen(false);
    };

    const openQrCodeModal = (id) => {
        setQrCodeId(id);
        setQrCodeModalIsOpen(true);
    };

    const closeQrCodeModal = () => {
        setQrCodeModalIsOpen(false);
        fetchAllCreatedClassSession();
        // setAlert({ show: true, message: "Class Session Created Successfully!", type: 'success'});
    };

    const handleSuccess = (id) => {
        closeCreateClassSessionModal();
        openQrCodeModal(id);
        setAlert({ show: true, message: "Class Session Created Successfully!", type: 'success'});
    };

    const handleDeleteClick = (id) => {
        setDeleteClassSessionId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        // Handle event deletion logic here
        console.log(`Deleting Class session with id: ${deleteClassSessionId}`);
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return alert("Could not get session");
            }

            const response = await axios.post("/teacher/delete-class-session", { 
                classSessionId: deleteClassSessionId 
            },
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                }
            });

            if (response.status === 200) {
                console.log("Class session deleted successfully");
                fetchAllCreatedClassSession(); // Refresh the class session list after deletion
                setAlert({ show: true, message: response.data.message, type: 'success'});
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data.error;
        
                if (status === 400 || status === 404 || status === 403 || status === 500) {
                  setAlert({ show: true, message: message, type: 'error'});
                } else if (status === 401) {
                  navigate("/");
                  setAlert({ show: true, message: message, type: 'error'});
                }
                else { setAlert({ show: true, message: 'An unexpected error occured!', type: 'error'}); }
        
            } else { setAlert({ show: true, message: 'An unknown error occured!', type: 'error'}); }
              
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    const closeDeleteConfirm = () => {
        setShowDeleteConfirm(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // Handle search input change
    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter Class session based on search term
    const filteredClassSession = createdClassSessions.filter((session) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            session.school.toLowerCase().includes(searchLower) ||
            session.className.toLowerCase().includes(searchLower) ||
            formatDate(session.date).toLowerCase().includes(searchLower) ||
            session.startTime.toLowerCase().includes(searchLower) ||
            session.endTime.toLowerCase().includes(searchLower) ||
            session.status.toLowerCase().includes(searchLower)
        );
    });

    
    return (
        <div className="class-session-history-container">
            <Header />
            {alert.show && (
              <CustomAlert 
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ show: false, message: '', type: '' })}
               />
            )}
            <div className="class-session-history-board">
                <div className="class-session-history-header">
                    <div>
                        <p className="class-session-history-header-text">Teacher Dashboard</p>
                    </div>
                    <div>
                        <button className="create-btn" onClick={openCreateClassSessionModal}>Create Class</button>
                    </div>
                </div>

                <div className="record-container">
                    <div className="class-session-history-head-text-and-search-container">
                        <div className="class-session-history-head-text">
                            <p>History</p>
                        </div>
                        <div className="class-session-history-search-container">
                            <FaSearch className="class-session-history-search-icon" />
                            <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearchInputChange} />
                        </div>
                    </div>

                    <div className="class-session-history-table-container">
                        <table>
                            <thead>
                                <tr className="class-session-history-table-header">
                                    <th>School</th>
                                    <th>Class Name</th>
                                    <th>Level</th>
                                    <th>Date</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                        </table>
                        <div className="class-session-history-table-body-container">
                            <table>
                                <tbody>
                                    {filteredClassSession && filteredClassSession.length > 0 ? (
                                        filteredClassSession.reverse().map((item) => (
                                            <tr key={item._id} className="class-session-history-table-data" onClick={() => showAttendeesList(item)}>
                                            <td>{item.school}</td>
                                            <td>{item.className}</td>
                                            <td>{item.level}</td>
                                            <td>{formatDate(item.date)}</td>
                                            <td>{item.startTime}</td>
                                            <td>{item.endTime}</td>
                                            <td>{item.status}</td>
                                            <td className="class-session-history-actions">
                                                <FaQrcode className="FaQrcode" onClick={(e) => {
                                                e.stopPropagation();
                                                openQrCodeModal(item._id);
                                                }} />
                                                <FaTrash className="FaTrash" onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(item._id);
                                                }} />
                                            </td>
                                            </tr>
                                        ))
                                        ) : (
                                        <tr>
                                            <td colSpan="7" className="no-class-session-found">No Class Session Created.</td>
                                        </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <CreateClassSessionModal 
                isOpen={createClassSessionModalIsOpen} 
                onRequestClose={closeCreateClassSessionModal} 
                onSuccess={handleSuccess} />
            <QrCodeModal isOpen={qrCodeModalIsOpen} onRequestClose={closeQrCodeModal} qrCodeId={qrCodeId} />
            {showDeleteConfirm && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-modal">
                        <p>Are you sure you want to delete this Class Session?</p>
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

export default ClassSessionHistory;
