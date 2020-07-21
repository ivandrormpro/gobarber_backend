import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/Hashprovider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

describe('UpdateProfile', () => {

    let fakeHashProvider: FakeHashProvider;
    let fakeUsersRepository: FakeUsersRepository;
    let updateProfileService: UpdateProfileService;

    beforeEach(()=> {
        fakeHashProvider = new FakeHashProvider();
        fakeUsersRepository = new FakeUsersRepository();
        updateProfileService = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
    });

    it('Should be able to update user´s profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'Mario Caetano Silva',
            email: 'mario2@gmail.com'
        });

        expect(updatedUser.name).toBe('Mario Caetano Silva');
        expect(updatedUser.email).toBe('mario2@gmail.com');
    });

    it('Should not be able change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        const user = await fakeUsersRepository.create({
            name: 'Ivandro Silva',
            email: 'ivandro@gmail.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'Marcos Alexandro',
            email: 'mario@gmail.com'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            old_password: '123456',
            password: '123123'
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('Should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            old_password: 'wrong-old-password',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to update the profile from non-existing user', async () => {
        expect(
            updateProfileService.execute({
                user_id: 'non-existing-user-id',
                name: 'Teste',
                email: 'test@gmail.com'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

});
