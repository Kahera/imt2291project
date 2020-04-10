export const serverURL = window.process.env.SERVER_URL


/*
 * 'Fetch' wrapper
 */
const request = (path, options = {}) => {
    options.credentials = 'include';

    return fetch(serverURL + path, options).then(res => {
        return new Promise((resolve, reject) => {
            if (res.ok) {
                res.json().then(resolve);
            } else {
                res.text().then(reject);
            }
        })
    })
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