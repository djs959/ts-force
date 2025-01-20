import { AxiosInstance } from "axios";
export interface BaseConfig {
    accessToken: string;
    instanceUrl: string;
    version: number;
    axiosInstance?: AxiosInstance;
}
export declare const DEFAULT_CONFIG: BaseConfig;
export type ConfigParams = Partial<BaseConfig> & {
    access_token?: string;
    instance_url?: string;
};
/**
 * @param  {ConfigParams} params
 */
export declare const setDefaultConfig: (params: ConfigParams) => void;
export declare const createConfig: (params: ConfigParams, config?: BaseConfig) => BaseConfig;
