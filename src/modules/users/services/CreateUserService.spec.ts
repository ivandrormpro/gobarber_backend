import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {

    it('Should be able to create a new user', async ()=> {
        const fakeUsersRepository = new FakeUsersRepository();
        const createUser = new CreateUserService(fakeUsersRepository);
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
        const fakeUsersRepository = new FakeUsersRepository();
        const createUser = new CreateUserService(fakeUsersRepository);
        const user = await createUser.execute({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        expect(createUser.execute({
            name: 'Ivandro Silva',
            email: 'mario@gmail.com',
            password: '12345678'
        })).rejects.toBeInstanceOf(AppError);
    });

});
