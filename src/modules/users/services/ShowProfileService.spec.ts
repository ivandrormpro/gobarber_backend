import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';

describe('ShowProfile', () => {

    let fakeUsersRepository: FakeUsersRepository;
    let showProfile: ShowProfileService;

    beforeEach(()=> {
        fakeUsersRepository = new FakeUsersRepository();
        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it('Should be able to show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        const profile = await showProfile.execute({
            user_id: user.id,
        });

        expect(profile.name).toBe('Mario Silva');
        expect(profile.email).toBe('mario@gmail.com');
    });

    it('Should not be able to show the profile from non-existing user', async () => {
        expect(
            showProfile.execute({
                user_id: 'non-existing-user-id',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

});
