export function getAttendanceFieldName(date: Date): string {
    return `${getDateString(date)}-attendance`;
}

export function getTeamFieldName(date: Date): string {
    return `${getDateString(date)}-team`;
}

function getDateString(date: Date): string {
    return `${date.getFullYear()}_${date.getMonth()+1}_${date.getDate()}`;
}