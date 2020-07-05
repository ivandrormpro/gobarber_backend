import { Router } from 'express';

import appointmentRouter from './appointments.routes';
import userRouter from './users.routes';
import sessionRouter from './sessions.routes';

const routes = Router();

routes.use('/appointments', appointmentRouter);
routes.use('/sessions', sessionRouter);
routes.use('/users', userRouter);

export default routes;
