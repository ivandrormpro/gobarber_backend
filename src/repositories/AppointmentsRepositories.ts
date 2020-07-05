// A criacao do repositorio deveu-se a necessidade de termos
// um metodo que pesquise por data

import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>{

    public async findByDate(date: Date): Promise<Appointment | null> {

        const findAppointment = await this.findOne({
            where: {date}
        });

        return findAppointment || null;
    }
}

export default AppointmentsRepository;
