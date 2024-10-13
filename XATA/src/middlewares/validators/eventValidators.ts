import { validationResult, Schema } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Define the schema for event validation
export const eventValidatorSchema: Schema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Name must have three or more characters",
    },
    notEmpty: {
      errorMessage: "Name is required",
    },
  },
  location: {
    in: ["body"],
    isString: {
      errorMessage: "Location must be a string",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Location must have three or more characters",
    },
    notEmpty: {
      errorMessage: "Location is required",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description must be a string",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Description must have three or more characters",
    },
    notEmpty: {
      errorMessage: "Description is required",
    },
  },
  price: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Price must be a numeric value",
    },
    notEmpty: {
      errorMessage: "Price is required",
    },
  },
  company: {
    in: ["body"],
    isString: {
      errorMessage: "Company must be a string",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Company name must have three or more characters",
    },
    notEmpty: {
      errorMessage: "Company name is required",
    },
  },
};

// Middleware to check for validation errors
export const validateEvent = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
