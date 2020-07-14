import { Router } from 'express';

import appointmentRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import userRouter from '@modules/users/infra/http/routes/users.routes';
import sessionRouter from '../../../../modules/users/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/appointments', appointmentRouter);
routes.use('/sessions', sessionRouter);
routes.use('/users', userRouter);

export default routes;
