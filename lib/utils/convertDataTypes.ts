export const convertDataTypes = (val: string): boolean | string | number | null => {
    const value = val.trim();

    // "123": true , "f123": false
    const isNumber = /^[0-9]+$/.test(value);
    // "false": true , "something": false
    const isBool = /^(true|false)$/i.test(value);

    if (isBool) return value.toLowerCase() === 'true';
    else if (isNumber) return parseInt(value);
    else if (value === 'null') return null;
    else return value;
}