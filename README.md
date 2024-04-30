# @erfangharib/use-form-handler

React hook for validating and sending form

## Benefits
- validate form using yup
- less configuration needed compared to formik
- no need for setting event on each field
- PUT and POST methods are supported
- typesafe

## Installation
```
npm i @erfangharib/use-form-handler && npm i yup
```

## Usage
```ts
// 1. Define Yup Schema
const validationSchema = {
    username: Yup.string().required().max(50),
    password: Yup.string().required("your custom message"),
}

// 2. Init hook
const { send } = useFormHandler({
    endPoint: '/path/to/api',
    validationSchema: validationSchema,
    axiosConfigs: { },
    onSuccess(response, form, data) {
        // runs when request success
    },
    onFailure(reason, form) {
        // runs when request fails
    },
    onSubmit(response, formData, form) {
        // runs when form submitted
    },
    onValidationError(reason: string) {
        // runs when invalid data entered
    },
});

// 3. Setup form
// IMPORTANT: set inputs name based on validationSchema
// supported input elements are: `INPUT`, `TEXTAREA`, `CHECKBOX`, `SELECT`
return (
    <form onSubmit={send}>
        <input type="text" name="username" />
        <input type="password" name="password" />
    </form>
)
```

Thats it!