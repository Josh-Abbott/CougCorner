export function formatDateToLocal(dateString: string) {
    // timestamps without timezone info are treated as UTC
    const normalized = dateString.endsWith("Z") ? dateString : dateString + "Z";
    return new Date(normalized).toLocaleString();
}
