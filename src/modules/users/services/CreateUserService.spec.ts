import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/Hashprovider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

describe('CreateUserTest', () => {

    let fakeUsersRepository: FakeUsersRepository;
    let fakeHashProvider: FakeHashProvider;
    let createUser: CreateUserService;

    beforeEach(()=> {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    });


    it('Should be able to create a new user', async ()=> {
        const user = await createUser.execute({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });
        expect(user).toHaveProperty('id');
        expect(user.name).toBe('Mario Silva');
        expect(user.email).toBe('mario@gmail.com');
    });

    it('Should not be able to create a new user with an used e-mail', async ()=> {
        await createUser.execute({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        await expect(createUser.execute({
            name: 'Ivandro Silva',
            email: 'mario@gmail.com',
            password: '12345678'
        })).rejects.toBeInstanceOf(AppError);
    });

});
