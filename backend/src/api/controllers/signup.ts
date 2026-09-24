import express from 'express';
import { signupService } from '../../application/services/index.js';
import { parseSignupRequest, toSignupResponse } from '../dtos/signup-dto.js';

export const signupRouter: express.Router = express.Router();

signupRouter.post('/', async (req, res) => {
  res.status(201).json(toSignupResponse(await signupService.signup(parseSignupRequest(req.body))));
});
