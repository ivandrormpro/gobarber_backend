import { Router, request, response} from 'express';
import multer from 'multer';
import { container } from 'tsyringe';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import uploadConfig from '@config/uploadConfig';

import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';

const userRouter = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

userRouter.post('/', usersController.create);

userRouter.patch('/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    userAvatarController.update);

export default userRouter;
