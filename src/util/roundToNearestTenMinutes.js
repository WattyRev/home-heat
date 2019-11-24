export default function roundToNearestTenMinutes(minutes, hours = 0, dayIndex = 0) {
    let roundedMinutes = Math.round(minutes / 10) * 10;
    let roundedHours = hours;
    let roundedDayIndex = dayIndex;
    if (roundedMinutes === 60) {
        roundedMinutes = 0;
        roundedHours += 1;
    }
    if (roundedHours === 24) {
        roundedHours = 0;
        roundedDayIndex += 1;
    }
    if (roundedDayIndex === 7) {
        roundedDayIndex = 0;
    }
    return [roundedMinutes, roundedHours, roundedDayIndex];
}
