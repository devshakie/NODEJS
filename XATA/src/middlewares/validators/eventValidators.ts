import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

const eventValidator: RequestHandler[] = [
  body("name")
    .isString()
    .isLength({ min: 3 })
    .withMessage("name must have three or more characters")
    .notEmpty()
    .withMessage("name is required"),
  body("location")
    .isString()
    .isLength({ min: 3 })
    .withMessage("name must have three or more characters")
    .notEmpty()
    .withMessage("name is required"),
  body("description")
    .isString()
    .isLength({ min: 3 })
    .withMessage("name must have three or more characters")
    .notEmpty()
    .withMessage("name is required"),
  body("price")
    .isNumeric()
    .withMessage("name must have three or more characters")
    .notEmpty()
    .withMessage("name is required"),
  body("company")
    .isString()
    .isLength({ min: 3 })
    .withMessage("name must have three or more characters")
    .notEmpty()
    .withMessage("name is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
      return;
    }
    next();
  },
];

export { eventValidator };
