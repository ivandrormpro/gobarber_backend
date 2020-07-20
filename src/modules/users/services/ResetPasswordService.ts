import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import AppError from '@shared/errors/AppError';
import IUserTokenRepository from '../repositories/IUserTokensRepository';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {

    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokenRepository
    ) { }

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token);

        if(!userToken) {
            throw new AppError('User token does not exist');
        }

        const user = await this.userRepository.findById(userToken.user_id);

        if(!user) {
            throw new AppError('User does not exist');
        }

        user.password = password;

        await this.userRepository.save(user);
    };
}

export default ResetPasswordService;
