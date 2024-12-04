import http from 'k6/http';
import {sleep, check} from 'k6';

//test configuration
export const options = {
    vus: 2, //number of virtual users
    duration: '30s' //test duration
};

export default function(){
    const res = http.get('http://localhost:5000/products');

    //validate response
    check(res, {
        'is status 200': (r) => r.status ===200,
        'response time <200ms': (r) => r.timings.duration < 200,
    });

    sleep(1) //simulate user think time
}