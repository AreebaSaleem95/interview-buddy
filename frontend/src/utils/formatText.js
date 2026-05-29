export const capitalizeText = (value = "") => {
    if (!value || typeof value !== "string") {
        return "Unknown";
    }

    const formatted = value.replace(/-/g, " ");

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};