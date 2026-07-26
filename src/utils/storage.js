export const setItem = (key, val) => {
    const value = JSON.stringify(val);
    localStorage.setItem(key, value);
};

export const getItem = (key) => {
    const data = localStorage.getItem(key);
    if (data === null) {
        return null;
    }
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Error parsing JSON from localStorage for key:", key, error);
        return null;
    }
};

export const removeItem = (key) => {
    localStorage.removeItem(key);
};
