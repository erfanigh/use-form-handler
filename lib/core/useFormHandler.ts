import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as Yup from 'yup';
import { FormHandler } from '../utils/formHandler';
import { FormEvent, useState } from 'react';

export type T_YupSchema = { [key: string]: Yup.StringSchema };
export type T_LoadingFn = React.Dispatch<React.SetStateAction<boolean>>
export type T_Send = (e: FormEvent<HTMLFormElement>, method?: 'put' | 'post') => void;
export type T_useFormHandlerOptions = {
    endPoint: string;
    validationSchema: T_YupSchema;
    axiosConfigs?: AxiosRequestConfig;
    onSuccess?: (response: AxiosResponse, form: HTMLFormElement, data: FormData) => void;
    onFailure?: (reason: any, form: HTMLFormElement) => void;
    onSubmit?: (formData: FormData, form: HTMLFormElement) => void;
    onValidationError?: (reason: string) => void;
}

const useFormHandler = (options: T_useFormHandlerOptions) => {
    const [loading, setLoading] = useState<boolean>(false);
    return { 
        send: new FormHandler(options, setLoading).send, 
        loading 
    };
}

export default useFormHandler;
