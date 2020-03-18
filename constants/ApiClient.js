const apiRoot = process.env.NODE_ENV === 'developnt' ?
    'http://192.168.1.99:3001' :
    'https://ancient-plains-38653.herokuapp.com/'

export default {
    apiRoot: apiRoot,
    config: user => {
        const authorization_token = user ? `Token token=${user.authentication_token}, email=${user.email}` : '';
        return {
            baseURL: apiRoot,
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: authorization_token
            }
        };
    },
    imageUrl: path => {
        return(apiRoot + path);
    }
}