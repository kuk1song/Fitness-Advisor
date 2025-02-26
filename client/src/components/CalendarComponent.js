import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/ReactCalendar.css';
import { Link } from 'react-router-dom';

const localizer = momentLocalizer(moment);

function CalendarComponent() {
  const events = [
    { title: 'Event 1', start: new Date(2024, 10, 12, 10, 0), end: new Date(2024, 10, 12, 12, 0) },
    { title: 'Event 2', start: new Date(2024, 10, 13, 14, 0), end: new Date(2024, 10, 13, 16, 0) }
  ];

  return (
    <div>
    <Link to="/" className="homepage-button">Home</Link>
      <h2>My Fitness Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
      />
    </div>
    
  );
}

export default CalendarComponent;
