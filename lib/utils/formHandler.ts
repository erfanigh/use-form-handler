import axios from 'axios';
import { T_Send, T_useFormHandlerOptions } from '../core/useFormHandler';

export class FormHandler {
    expectedInputElements: string[];
    data: FormData;
    form: HTMLFormElement;
    options: T_useFormHandlerOptions;
    
    constructor(options: T_useFormHandlerOptions) {
        this.expectedInputElements = ['INPUT', 'TEXTAREA', 'CHECKBOX', 'SELECT'];
        this.data = new FormData();
        this.form = undefined;
        this.options = options;
    }

    isFormValuesValid(): boolean {
        const inputValues: Array<[string, HTMLFormElement]> = Object.entries(this.form);
        const errArray: boolean[] = [];
    
        inputValues.forEach(([_, element], index) => {
            if (!this.expectedInputElements.some((v) => v === element.tagName) || !element.name)
                return;
    
            let nextElement  = element.nextElementSibling;
            let isErrElement = nextElement?.classList.contains('err');
            const currentValidationSchema = this.options.validationSchema?.[element?.name];
    
            if(!isErrElement) {
                const errNode = document.createElement('p');
                errNode.classList.add('err');
                this.form.insertBefore(errNode, nextElement);
    
                nextElement  = errNode;
                isErrElement = true;
            } else {
                nextElement.innerHTML = '';
            }
    
            try {
                currentValidationSchema?.validateSync(element?.value);
                errArray[index] = false;
                this.data.append(
                    element?.name,
                    element?.files?.length >= 1
                        ? element?.files[0]
                        : element?.value.trim()
                );
    
                if (isErrElement) nextElement.innerHTML = '';
            }
            catch (err) {
                errArray[index] = true;
    
                this.disableSubmitBtn(false);

                if(typeof this.options.onValidationError === 'function')
                    this.options.onValidationError(`${element?.name}: ${err?.errors?.[0]}`);
    
                if (isErrElement) nextElement.innerHTML = err?.errors?.[0];
            }
        });
    
        const isValid = errArray.every((v) => v === false);
    
        return isValid;
    }

    disableSubmitBtn (
        disabled: boolean = true,
        btnSelector = 'button[type="submit"]'
    ): void {
        const button = this.form.querySelector(btnSelector);

        if (!button)
            throw new Error(
                `formHandler: No submit button exist with this selector: ${btnSelector}`
            );

        if (disabled) button.setAttribute('disabled', String(true));
        else button.removeAttribute('disabled');
    }

    send: T_Send = async (e, method = 'post') => {
        e.preventDefault();

        if (e.type !== 'submit') return;

        this.form = e.target as HTMLFormElement;
        this.data = new FormData();

        this.disableSubmitBtn();

        const _isFormValuesValid = this.isFormValuesValid();
        
        if (_isFormValuesValid) {
            await axios?.[method](
                this.options.endPoint,
                this.data,
                this.options.axiosConfigs ?? {}
            )
                .then((res) => {
                    if('onSuccess' in this.options)
                        this.options?.onSuccess(res, this.form, this.data)
                })
                .catch((reason) => {
                    // add response error to last p.err element in form
                    //@ts-ignore
                    const allErr = this.form.querySelectorAll('p.err');

                    const data = reason.response?.data;
                    allErr[allErr.length - 1].innerHTML =
                        data?.['title'] ?? data?.['errors'] ?? reason.message;

                    console.log(reason);

                    if('onFailure' in this.options)
                        this.options?.onFailure(reason, this.form);
                    this.disableSubmitBtn(false);
                })
        }
        else this.disableSubmitBtn(false);
    }
}