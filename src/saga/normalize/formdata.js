var qs = require('qs');
export const normailzeFormData = payload => {
    const formData = new global.FormData();
    if (payload) {
        Object.keys(payload).map(key => {
            if (payload[key]) {
                formData.append(key, payload[key]);
            }
        });
    }
    return formData;
};

export const normailzeQSData = payload => {
    return qs.stringify(payload);
};
