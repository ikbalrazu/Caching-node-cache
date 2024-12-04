import http from 'k6/http';
import {sleep, check} from 'k6';

//test configuration
export const options = {
    vus: 2, //number of virtual users
    duration: '30s' //test duration
};

export default function(){
    const url = 'https://dummyjson.com/auth/login';
    const payload = JSON.stringify({
        username: 'emilys',
        password: 'emilyspass',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res,{
        'is status 200': (r)=>r.status===200,
        'is res body':(r)=>r.body.includes('iqbal'),
    });
}