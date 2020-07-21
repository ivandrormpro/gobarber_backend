import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/Hashprovider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {

    beforeEach(()  => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider
        );
    });

    it('Should be able to reset the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'Ivandro Silva',
            email: 'ivandrosilva@hotmail.com',
            password: '123456'
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            password: '123123',
            token
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('Should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
                password: '123123',
                token: 'non-existing-token'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate('non-existing-user');
        await expect(
            resetPasswordService.execute({
                password: '123123',
                token
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to reset the password if passed 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ivandro Silva',
            email: 'ivandrosilva@gmail.com',
            password: '123456'
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                password: '123123',
                token
            })
        ).rejects.toBeInstanceOf(AppError);
    });

});
