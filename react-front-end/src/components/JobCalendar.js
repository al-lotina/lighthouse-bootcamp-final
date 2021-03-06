import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './JobCalendar.css'
import moment from 'moment'

// Setup the localizer by providing the moment Object
// to the correct localizer.
const localizer = momentLocalizer(moment);

export default function JobCalendar({toolChest}){
  const {setSelectDay, calendar, setSelectedJob, setCalendarSelectDay, setCalendarSelectJob, selectedJob} = toolChest;
  const selectedDay = toolChest.selectDay;
  const selectDay = (info) => {
    //start and end are JS Date Objects so capture date and time
    let startDate = new Date(info.start.getTime());
    let endDate = new Date(info.end.getTime());
    startDate.setHours( 0, 0, 0);
    endDate.setHours(23, 59, 59);
    if (startDate.toISOString() === selectedDay.starts.toISOString()){
      setCalendarSelectDay(true);
    } else {
      setSelectDay({starts: startDate, ends: endDate});
    }
    
  };

  const onNavigate = (date) => {
    selectDay({start: date, end: date});
  }

  const highlightDays = (date) => {
    let currentDay = new Date();
    const currentMonth = currentDay.getMonth;
    currentDay = currentDay.getDate;
    const selectDay = selectedDay.starts.getDate();
    const selectMonth = selectedDay.starts.getMonth();
    if ((date.getDate() === currentDay && date.getMonth() === currentMonth )|| (date.getDate() === selectDay && date.getMonth() === selectMonth))
      return {
        className: 'highlighted-day',
        style: {
          border: 'solid 3px #afa',
        },
      }
    else return {}
  }
  const selectBooking = function(booking){
    if (selectedJob === booking.job_id){
      setCalendarSelectJob(true);
    } else {
      setSelectedJob(booking.job_id);
    }
  };

  return (
      <Calendar
        className="JobCalendar"
        views={['month', 'week', 'day']}
        date={selectedDay.starts}
        events={calendar}
        selectable={true}
        onSelectSlot={selectDay}
        onNavigate={onNavigate}
        dayPropGetter={highlightDays}
        onSelectEvent={selectBooking}
        startAccessor="start"
        endAccessor="end"
        defaultDate={moment().toDate()}
        localizer={localizer}
      />
  );
}

