import { DateTime } from 'luxon';
import momentTZ from 'moment-timezone';
import { useState } from 'react';
import './App.css';

function App() {
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [selectedTimeZone, setSelectedTimeZone] = useState('');
  const [parsedFutureStartDate, setParsedFutureStartDate] = useState<any>('');
  const [parsedFutureEndDate, setParsedFutureEndDate] = useState<any>('');
  // check if the date is in DST or not and if it is get the offset and timezone
  const getDSTOffset = (date: string) => {
    const parsedDate = DateTime.fromISO(date).setZone(selectedTimeZone);
    const isDST = parsedDate.isInDST;
    const offset = parsedDate.offset;
    const timezone = parsedDate.zoneName;
    return { isDST, offset, timezone };
  };



  const timezones = momentTZ.tz.names().filter(timezone => {
    return timezone.includes('US');
  });
  const timezoneOffsets = timezones.map(timezone =>
    momentTZ.tz(timezone).format('Z')
  );
  // get full name of timezone
  const timezoneNames = timezones.map(timezone =>
    momentTZ.tz(timezone).format('z')
  );

  const timezoneDropdown = (
    <select
      onChange={e => {
        setSelectedTimeZone(e.target.value);
      }}
    >
      {timezones.map((timezone, index) => (
        <option key={timezone} value={timezone}>
          {timezone} - {timezoneNames[index]} {timezoneOffsets[index]}
        </option>
      ))}
    </select>
  );


  const onChange = (e: any) => {
    // const parsedUTCStartDate = DateTime.fromISO(e.target.value).setZone('UTC');
    //     console.log(parsedUTCStartDate, 'UTC TImeeee');

    // get the date and time selected and set the zone to UTC
    // get hours, minutes, seconds, day, month, year
    const hours = DateTime.fromISO(e.target.value).hour;
    const minutes = DateTime.fromISO(e.target.value).minute;
    const day = DateTime.fromISO(e.target.value).day;
    const month = DateTime.fromISO(e.target.value).month;
    const year = DateTime.fromISO(e.target.value).year;
    const dateTime = DateTime.fromObject({
      year,
      month,
      day,
      hour: hours,
      minute: minutes,
    }, {
      zone: 'UTC'
    });


    setParsedFutureStartDate(dateTime);
  };

  // calendar to get the start date and time and end date and time
  const calendar = (
    <div>
      <input type='datetime-local' onChange={onChange} />
      <input
        type='datetime-local'
        onChange={e => {
          setEventEndDate(e.target.value);
        }}
      />
    </div>
  );

  // get all valid US timezone and their offsets and short name depending on the date and time selected that parsedFutureStartDate will be in
  // const getValidTimezone = (date: string) => {
  //   const validTimezones = timezones.filter(timezone => {
  //     const timezoneOffset = momentTZ.tz(timezone).format('Z');
  //     const timezoneShortName = momentTZ.tz(timezone).format('z');
  //     const timezoneFullName = timezone;
  //     const timezoneOffsetFromDateTime = DateTime.fromISO(date, {
  //       zone: timezoneFullName,
  //     }).toFormat('ZZ');
  //     return (
  //       timezoneOffset === timezoneOffsetFromDateTime ||
  //       timezoneShortName === timezoneOffsetFromDateTime
  //     );
  //   });
  //   return validTimezones;
  // };

  // console.log(getValidTimezone(eventStartDate));

  // display the future date and time based on my timezone andd check if it is in DST or not and then display the date and time
  // const displayDate = (date: string) => {
  //   // get my timezone

  //   const myTimezone = momentTZ.tz.guess();
  //   // get the offset of my timezone
  //   const myTimezoneOffset = momentTZ.tz(myTimezone).format('Z');
  //   const displayStartDate = DateTime.fromISO(date, {
  //     zone: myTimezone
  //   }).toFormat('yyyy-MM-dd hh:mm:ss a');
  //   return `${displayStartDate} ${myTimezoneOffset}`;
  // };

  const displayDateOnSelectedTimezone = (date: any) => {
    // date object is in UTC convert to selected timezone
    if(!date) return;
    console.log(date, 'date');
   
    const displayStartDate = date
      .setZone(selectedTimeZone)
      .toFormat('yyyy-MM-dd hh:mm:ss a');
    // check isDST and get the offset
    const { isDST, offset } = getDSTOffset(date);
    console.log(isDST, offset, 'isDST');

    let timezoneShortName = momentTZ.tz(selectedTimeZone).format('z');
    console.log(timezoneShortName, 'timezoneShortName');
    // if it is in DST change the short name to from EST to EDT and from CST to CDT and from MST to MDT and from PST to PDT and from AKST to AKDT and from HAST to HADT and from HST to HDT and from SST to SDT and from NST to NDT and from EST to EDT and from AST to ADT
    if (isDST) {
      timezoneShortName = timezoneShortName.replace('ST', 'DT');
    }

    
   
    

    return `${displayStartDate} ${timezoneShortName}`;
  };

  return (
    <div>
      {timezoneDropdown}
      {calendar}
      <button>Submit</button>
      <div>
        <h1>Event selected with timezone</h1>
        <p>
          Start Date: {displayDateOnSelectedTimezone(parsedFutureStartDate)}
          <br />
          {/* End Date: {displayDateOnSelectedTimezone(parsedFutureEndDate)} */}
        </p>
      </div>
      {/* <div>
        <p>Display date for user</p>
        <p>Start Date: {displayDate(parsedFutureStartDate)}</p>
        <p>End Date: {displayDate(parsedFutureEndDate)}</p>
      </div> */}
    </div>
  );
}

export default App;
