import http from 'k6/http';
import {check, sleep} from 'k6';
import {Rate} from 'k6/metrics';

const reqRate = new Rate('http_req_rate');

export const options = {
    stages: [
        {target: 20, duration: '1s'},
        {target: 20, duration: '1s'},
        {target: 0, duration: '1s'},
    ],
    thresholds: {
        'checks': ['rate>0.9'],
        'http_req_duration': ['p(95)<1000'],
        'http_req_rate{deployment:stable}': ['rate>=0'],
        'http_req_rate{deployment:canary}': ['rate>=0'],
    },
};

export default function () {
    const params = {
        headers: { 'Host': 'demo.local', 'x-region': 'us-east' },
        cookies: { 'canary-cookie': 'always' },
      };

    const res = http.get('http://localhost:8080', params);
    check(res, {
        'status code is 200': (r) => r.status === 200,
        'deployment is stable or canary': (r) => res.body.includes('v1') || res.body.includes('v2'),
    });

    if (res.body.includes('v1')) { 
            reqRate.add(true, { deployment: 'stable' });
            reqRate.add(false, { deployment: 'canary' });
    } else if (res.body.includes('v2')) { 
            reqRate.add(false, { deployment: 'stable' });
            reqRate.add(true, { deployment: 'canary' });
      
    }

    sleep(1);
}
