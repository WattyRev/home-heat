/**
 * Handy data to replecate the headings of schedules.
 */
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

/**
 * Create a row with empty values
 */
export function getEmptyRow(numColumns = 14) {
    const row = [];
    for (let i = 0; i < numColumns; i++) {
        row.push('');
    }
    return row;
}

/**
 * Create a row for schedule data buffered with empty columns at the end
 */
export function createScheduleRow(...entries) {
    const row = [...entries];
    for (let i = entries.length; i <= 14; i++) {
        row.push('');
    }
    return row;
}

/**
 * Creates a mock schedule spreadsheet
 */
export function createMockScheduleSheet(providedValues) {
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
    return createMockSheet(values);
}

/**
 * Creates a mock sheet from the provided rectangular array data.
 */
export function createMockSheet(data) {
    return {
        getRange(rowStart, columnStart, numRows = 1, numColumns = 1) {
            const rows = data.filter(
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
                getValue() {
                    return data[rowStart - 1][columnStart - 1];
                },
                setValue(value) {
                    const updatedData = data;
                    updatedData[rowStart - 1][columnStart - 1] = value;
                    return createMockSheet(updatedData);
                },
            };
        },
    };
}

/**
 * Creates a mock Spreadsheet with multiple sheets
 */
export function createMockSpreadsheet(overrides = {}) {
    const data = {
        'Status': [
            ['Away', false],
            ['Vacation', false],
        ],
        'Logs': [['mock logs']],
        'Office Schedule': [['mock office schedule']],
        'Bedroom Schedule': [['mock bedroom schedule']],
        'Bathroom Schedule': [['mock bathroom schedule']],
        'Living Room Schedule': [['mock living room schedule']],
        'Game Room Schedule': [['mock game room schedule']],
        'Guest Room Schedule': [['mock guest room Schedule']],
        'Guest Bathroom Schedule': [['mock guest bathroom schedule']],
        ...overrides,
    };
    return {
        getSheetByName(name) {
            return createMockSheet(data[name]);
        },
    };
}
