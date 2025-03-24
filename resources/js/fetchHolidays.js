export const fetchHolidays = async (year) => {
    const apiKey = "AIzaSyAiRfFw6I74tn_kOY8NRoMd14ep1x6GV1M"; // Replace with your Google API key
    const calendarId = "en.philippines#holiday@group.v.calendar.google.com"; // Public Philippine holidays calendar
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendarId
    )}/events?key=${apiKey}&timeMin=${year}-01-01T00:00:00Z&timeMax=${year}-12-31T23:59:59Z&singleEvents=true&orderBy=startTime`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Error fetching holidays:", error);
        return [];
    }
};