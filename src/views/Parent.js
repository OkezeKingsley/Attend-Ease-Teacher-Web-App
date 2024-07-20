import React, { useState, useEffect } from 'react';
import '../styles/Parent.css';
import ClassSessionHistory from '../components/ClassSessionHistory';
import AttendeesList from '../components/AttendeesList';

function Parent () {
  const [view, setView] = useState('class-session-history'); // Track which view to show
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    let gottenView = sessionStorage.getItem("currentView");
    let gottenSelectedClass = sessionStorage.getItem("selectedClass");

    if (
        gottenView === null || typeof gottenView === "undefined" ||
        gottenSelectedClass === null || typeof gottenSelectedClass === "undefined"
      ) {
      sessionStorage.setItem("currentView", JSON.stringify(view));
      setView('class-session-history');
    }

    if (JSON.parse(gottenView) === 'class-session-history') {
      setView('class-session-history');
    }

    if (JSON.parse(gottenView) === 'attendees-lists') {
      setView('attendees-lists');
      setSelectedClass(JSON.parse(gottenSelectedClass));
    }

  }, []);

  const showAttendeesList = (classData) => {
    setSelectedClass(classData);
    setView('attendees-lists');

    sessionStorage.setItem("currentView", JSON.stringify('attendees-lists'));
    sessionStorage.setItem("selectedClass", JSON.stringify(classData));
  };

  const goBack = () => {
    setView('class-session-history');
    setSelectedClass(null);
    sessionStorage.setItem("currentView", JSON.stringify('class-session-history'));
  };


  return (
    <div className="parent-container">
      {view === 'class-session-history' && <ClassSessionHistory showAttendeesList={showAttendeesList} />}
      {view === 'attendees-lists' && <AttendeesList classData={selectedClass} goBack={goBack} />}
    </div>
  );
}

export default Parent;
