export function getAttendanceFieldName(date: Date): string {
    return `${getDateString(date)}-attendance`;
}

function getDateString(date: Date): string {
    return `${date.getFullYear()}_${date.getMonth()+1}_${date.getDate()}`;
}