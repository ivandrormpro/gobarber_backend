import { container } from 'tsyringe';

import '@modules/users/providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepositories';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepositories';

import './providers';

container.registerSingleton<IAppointmentsRepository>('AppointmentsRepository', AppointmentsRepository);

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository);