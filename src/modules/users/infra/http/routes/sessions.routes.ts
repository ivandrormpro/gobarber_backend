import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessiontRouter = Router();
const sessionsController = new SessionsController();

sessiontRouter.post('/', sessionsController.create);

export default sessiontRouter;
