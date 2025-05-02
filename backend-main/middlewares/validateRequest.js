const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages = error?.message || error ;
            return res.status(400).json({
                data: null,
                meta: {
                    code: 0,
                    status: 400,
                    message: errorMessages
                }
            });
        }

        next();
    };
};

export default validateRequest;
