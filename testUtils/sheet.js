export function getBaseScheduleValues() {
    return [
        [
            'Sunday',
            '',
            'Monday',
            '',
            'Tuesday',
            '',
            'Wednesday',
            '',
            'Thursday',
            '',
            'Friday',
            '',
            'Saturday',
        ],
        [
            'Time',
            'Temperature',
            'Time',
            'Temperature',
            'Time',
            'Temperature',
            'Time',
            'Temperature',
            'Time',
            'Temperature',
            'Time',
            'Temperature',
            'Time',
            'Temperature',
        ],
    ];
}
export function getEmptyRow(numRows = 14) {
    const row = [];
    for (let i = 0; i < numRows; i++) {
        row.push('');
    }
    return row;
}
export function createScheduleRow(...entries) {
    const row = [...entries];
    for (let i = entries.length; i <= 14; i++) {
        row.push('');
    }
    return row;
}
export function createMockSheduleSheet(providedValues) {
    let values = providedValues;
    if (!values) {
        values = [
            ...getBaseScheduleValues(),
            getEmptyRow(14),
            getEmptyRow(14),
            getEmptyRow(14),
            getEmptyRow(14),
            getEmptyRow(14),
            getEmptyRow(14),
            getEmptyRow(14),
            getEmptyRow(14),
            getEmptyRow(14),
            getEmptyRow(14),
        ];
    }
    return {
        getRange(rowStart, columnStart, numRows, numColumns) {
            const rows = values.filter(
                (_, index) => index >= rowStart - 1 && index < numRows + rowStart - 1
            );
            const filteredRows = rows.map(row =>
                row.filter(
                    (_, index) => index >= columnStart - 1 && index < numColumns + columnStart - 1
                )
            );
            return {
                getValues() {
                    return filteredRows;
                },
            };
        },
    };
}
