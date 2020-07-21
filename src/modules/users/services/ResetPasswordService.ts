import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';
import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IUserTokenRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/Hashprovider/models/IHashProvider';

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
        private userTokensRepository: IUserTokenRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
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

        const tokenCreatedAt = userToken.created_at;
        const compareDate = addHours(tokenCreatedAt, 2);

        if (isAfter(Date.now(), compareDate)) {
            throw new AppError('Token expired!');
        }

        user.password = await this.hashProvider.generateHash(password);

        await this.userRepository.save(user);

    };
}

export default ResetPasswordService;
