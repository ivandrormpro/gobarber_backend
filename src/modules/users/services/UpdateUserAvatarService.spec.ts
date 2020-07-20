import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

describe('UpdateUserAvatar', () => {

    it('Should be able to update user´s avatar', async () => {
        const fakeStorageProvider = new FakeStorageProvider();
        const fakeUsersRepository = new FakeUsersRepository();
        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        const user = await fakeUsersRepository.create({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('Should not be able to update avatar from inexistent user', async () => {
        const fakeStorageProvider = new FakeStorageProvider();
        const fakeUsersRepository = new FakeUsersRepository();
        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        await expect(updateUserAvatar.execute({
            user_id: 'user-inexistente',
            avatarFilename: 'avatar.jpg'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('Should be able to update user´s avatar and delete old avatar', async () => {
        const fakeStorageProvider = new FakeStorageProvider();
        const fakeUsersRepository = new FakeUsersRepository();
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        const user = await fakeUsersRepository.create({
            name: 'Mario Silva',
            email: 'mario@gmail.com',
            password: '123456'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg'
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });

});
