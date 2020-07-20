import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/Hashprovider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

describe('Authenticate User', () => {

    it('Should be able to authenticate', async ()=> {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );

        const user = await createUser.execute({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        const response = await authenticateUser.execute({
            email: 'mario@gmail.com',
            password: '123456'
        });
        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('Should not be able to authenticate with wrong password', async ()=> {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );

        await createUser.execute({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        await expect(authenticateUser.execute({
            email: 'mario@gmail.com',
            password: '12345678'
        })).rejects.toBeInstanceOf(AppError);
    });


    it('Should not be able to authenticate with non existent user', async ()=> {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        await expect(authenticateUser.execute({
            email: 'mario@gmail.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });
});
