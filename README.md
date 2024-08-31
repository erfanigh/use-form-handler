# @erfanigh/use-form-handler

React hook for validating and sending form

## Overview
- validate form using yup
- less configuration needed compared to formik
- no need for setting event on each field
- PUT and POST methods are supported
- typesafe
- loading indicator

## Installation
```
npm i @erfanigh/use-form-handler && npm i yup
```

## Input Types
IMPORTANT: set inputs ```name``` attr based on validationSchema.<br>
supported input elements are: `INPUT`, `TEXTAREA`, `CHECKBOX`, `SELECT`

## Return

### `send: T_Send`
A function returned by the useFormHandler hook that sends the form data to the specified endpoint.<br>
This function must be used in form ```onSubmit``` event
        
### `loading: boolean`
A boolean state value returned by the useFormHandler hook indicating whether a form submission is currently in progress.<br>
This state can be used to disable the form or show a loading indicator to provide feedback to the user. 
    

## Options

### `endPoint: string`
Specifies the URL endpoint to which the form data will be submitted. This should be the API or server address that handles the data processing.
**Example**: ```"http://localhost:5000/api/submit-form"``` 


### `validationSchema: T_YupSchema`
Provides additional configurations for the Axios request. This can include headers, timeout settings, authentication tokens, etc.


### `axiosConfigs?: AxiosRequestConfig`:
Provides additional configurations for the Axios request.

### `sendAsJson?: boolean`:
Indicates whether the form data should be sent as JSON. 
Defaults to ```true```. If set to ```false```, the data will be sent as ```application/x-www-form-urlencoded``` (FormData)

### `onSuccess?: (response: AxiosResponse, form: HTMLFormElement, data: T_Data) => void`:
Callback function executed upon a successful form submission.

### `onFailure?: (form: HTMLFormElement, reason: any) => void`:
Callback function executed if the form submission fails

### `onSubmit?: (form: HTMLFormElement, data: T_Data) => void`
Callback function triggered immediately after form submission.

### `onValidationError?: (reason: string) => void`
Callback function triggered when the form data fails validation according to the defined ```validationSchema```

## Usage
```tsx
// 1. Define Yup Schema
const validationSchema = {
    username: Yup.string().required().max(50),
    password: Yup.string().required("your custom message"),
}

// 2. Init hook
const { send } = useFormHandler({
    endPoint: 'http://localhost:5000/api/submit-form',
    validationSchema,
});

// 3. Setup form
return (
    <form onSubmit={send}>
        <input placeholder="User Name" type="text" name="username" />
        <input placeholder="Password" type="password" name="password" />
        <button type="submit">Send</button>
    </form>
)
```

Thats it!