export const serverURL = window.process.env.SERVER_URL

/*
 * 'Fetch' wrapper
 */
export const request = async (path, options = {}) => {
    console.log(path);
    options.credentials = 'include';
    const res = await fetch(serverURL + path, options);
    return new Promise((resolve, reject) => {
        if (res.ok) {
            console.log(res)
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
export const get = (path) => {
    console.log(path);
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

export default request