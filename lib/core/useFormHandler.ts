import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as Yup from 'yup';
import { FormHandler } from '../utils/formHandler';
import { FormEvent, useState } from 'react';

export type T_Data = { [key: string]: any } | FormData;
export type T_ExpectedInputElements = 'INPUT' | 'TEXTAREA' | 'CHECKBOX' | 'SELECT';
export type T_YupSchema = { 
    [key: string]: 
        | Yup.StringSchema
        | Yup.NumberSchema
        | Yup.BooleanSchema
};
export type T_Send = (e: FormEvent<HTMLFormElement>, method?: 'put' | 'post') => void;
export type T_useFormHandlerOptions = {
    /**
       * Specifies the URL endpoint to which the form data will be submitted. This should be the API or server address that handles the data processing.
       * 
       * ### Example
       * ```endPoint:``` ```"http://localhost:5000/api/submit-form"``` 
     */
    endPoint: string;
    /**
     * Defines the Yup validation schema to validate the form data before submission.
     * 
     * ### Example
     * ```
     * validationSchema: {
        * name: Yup.string().required(),
        * email: Yup.string().email().required(), 
     * }
     * ```
     */
    validationSchema: T_YupSchema;
    /**
     * Provides additional configurations for the Axios request. This can include headers, timeout settings, authentication tokens, etc.
     */
    axiosConfigs?: AxiosRequestConfig;
    /**
     * Indicates whether the form data should be sent as JSON. 
     * Defaults to ```true```. If set to ```false```, the data will be sent as ```application/x-www-form-urlencoded``` (FormData)
     */
    sendAsJson?: boolean;
    /**
     * Callback function executed upon a successful form submission.
     */
    onSuccess?: (response: AxiosResponse, form: HTMLFormElement, data: T_Data) => void;
    /**
     * Callback function executed if the form submission fails
     */
    onFailure?: (form: HTMLFormElement, reason: any) => void;
    /**
     * Callback function triggered immediately after form submission.
     */
    onSubmit?: (form: HTMLFormElement, data: T_Data) => void;
    /**
     * Callback function triggered when the form data fails validation according to the defined ```validationSchema```
     */
    onValidationError?: (reason: string) => void;
}

/**
 * The useFormHandler hook facilitates form submissions by managing loading states and handling data transmission. 
 * It simplifies the process of integrating form submissions with APIs by providing a unified interface.
 */
const useFormHandler = (options: T_useFormHandlerOptions) => {
    const [loading, setLoading] = useState<boolean>(false);
    return { 
        /**
         * A function returned by the useFormHandler hook that sends the form data to the specified endpoint.
         * This function must be used in form ```onSubmit``` event
         */
        send: new FormHandler(options, setLoading).send,
        /**
         * A boolean state value returned by the useFormHandler hook indicating whether a form submission is currently in progress. 
         * This state can be used to disable the form or show a loading indicator to provide feedback to the user. 
         */ 
        loading 
    };
}

export default useFormHandler;
