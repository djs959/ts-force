import { AxiosResponse } from 'axios';
import { ApiLimit } from './restTypes';
export declare const parseLimitsFromResponse: (response: AxiosResponse) => ApiLimit;
