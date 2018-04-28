export function getHeldDates(year:number, month: number, day: number): Date[] {
    const firstDate = getFirstDateOfDay(year, month, day);
    const heldDates = new Array<Date>();
    for(const d = new Date(firstDate); d.getMonth() === month; d.setDate(d.getDate() + 7)) {
        heldDates.push(new Date(d));
    }
    return heldDates;
}

function getFirstDateOfDay(year:number, month: number, day: number): Date {
    const firstDate = new Date(year, month, 1);
    for(let d = 0; 0 < 7; ++d) {
        if(firstDate.getDay() === day) {
            return firstDate;
        }
        firstDate.setDate(firstDate.getDate() + 1);
    }
    throw new Error();
}
