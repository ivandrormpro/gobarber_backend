import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import AppError from '@shared/errors/AppError';
import IUserTokenRepository from '../repositories/IUserTokensRepository';

interface IRequest {
    email: string,
}

@injectable()
class SendForgotPasswordEmailService {

    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokenRepository
    ) { }

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User does not exist');
        }

        await this.userTokensRepository.generate(user.id);

        this.mailProvider.sendMail(email, 'Pedido de recuperacao de senha recebido');
    };
}

export default SendForgotPasswordEmailService;
