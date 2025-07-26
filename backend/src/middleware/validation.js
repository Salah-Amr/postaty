import joi from "joi";

const passwordRegex = new RegExp(process.env.REGULAR_EXP);

const signupSchema = joi.object({
    name: joi.string().min(3).max(25).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(passwordRegex).required(),
    rePassword: joi.ref("password")
});

const signinSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(passwordRegex).required()
});

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error)
            res.status(422).json(error.details.map(err => err.message));
        else next();
    }
}

export { signupSchema, signinSchema, validate };