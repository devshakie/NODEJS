import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    status?: number;
}

const customErrors = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (err.status) {
        const statusCode = err.status || 500;
        const errorMessage = err.message || 'Internal Server Error';
        res.status(statusCode).json({
            status: statusCode,
            message: errorMessage
        })
    
    } else {
        next(err);
    }
};

export { customErrors, CustomError };

