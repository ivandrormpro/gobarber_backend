import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;
