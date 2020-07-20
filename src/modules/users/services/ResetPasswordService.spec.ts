import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordEmail', () => {

    beforeEach(()  => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
        );
    });

    it('Should be able to reset the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'Ivandro Silva',
            email: 'ivandrosilva@hotmail.com',
            password: '123456'
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPasswordService.execute({
            password: '123123',
            token
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);
        expect(updatedUser?.password).toBe('123123');
    });
});
