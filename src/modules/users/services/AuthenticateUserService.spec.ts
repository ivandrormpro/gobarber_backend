import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/Hashprovider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

describe('Authenticate User', () => {

    let fakeUsersRepository: FakeUsersRepository;
    let fakeHashProvider: FakeHashProvider;
    let authenticateUser: AuthenticateUserService;
    let createUser: CreateUserService;

    beforeEach(()=> {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );
    });

    it('Should be able to authenticate', async ()=> {
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

    it('Should not be able to authenticate with non existent user', async ()=> {
        await expect(authenticateUser.execute({
            email: 'mario@gmail.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to authenticate with wrong password', async ()=> {
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
});
