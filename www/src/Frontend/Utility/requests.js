export const serverURL = window.process.env.SERVER_URL


/*
 * 'Fetch' wrapper
 */
const request = async (path, options = {}) => {
    options.credentials = 'include';

    const res = await fetch(serverURL + path, options);
    return new Promise((resolve, reject) => {
        if (res.ok) {
            res.json().then(resolve);
        }
        else {
            res.text().then(reject);
        }
    });
}

/*
 * 'GET' wrapper, uses request function from above
 */
export const get = path => {
    return request(path);
}

/* 
 * 'POST' wrapper, uses request function from above
 */
export const post = (path, data) => {
    return request(path, {
        method: 'POST',
        body: data
    });
}