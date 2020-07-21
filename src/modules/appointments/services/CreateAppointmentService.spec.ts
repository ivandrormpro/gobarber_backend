import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {

    let fakeAppointmentsRepository: FakeAppointmentsRepository;
    let createAppointment: CreateAppointmentService;

    beforeEach(()=> {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
    });

    it('Should be able to create a new appointment', async ()=> {
        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123524523453455'
        });
        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123524523453455');
    });

    it('Should not be able to create two appointments on the same time', async ()=> {
        const appointmentDate = new Date();
        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123524523453455'
        });
        expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: '123524523453455'
        })).rejects.toBeInstanceOf(AppError);
    });
});
