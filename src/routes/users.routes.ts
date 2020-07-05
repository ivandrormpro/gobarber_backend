import { Router, request, response} from 'express';
import multer from 'multer';

import createUserService from '../services/CreateUserService';
import uploadConfig from '../config/uploadConfig';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const userRouter = Router();
const upload = multer(uploadConfig);

userRouter.post('/', async (request, response) => {

    try {
        const { name, email, password } = request.body;
        const createUser = new createUserService();

        const user = await createUser.execute({
            name,
            email,
            password,
        });

        delete user.password;

        return response.json(user);
    } catch(err) {
        return response.status(err.statusCode).json({ error: err.message });
    }
});

userRouter.patch('/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async(request, response) =>{

        const updateUserAvatar = new UpdateUserAvatarService();
        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename
        });
        delete user.password;
        return response.json(user);
    },
);

export default userRouter;
