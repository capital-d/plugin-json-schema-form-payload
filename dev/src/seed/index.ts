import { Payload } from 'payload';

export const seed = async (payload: Payload) => {
    payload.logger.info('Seeding data...');

    await payload.create({
        collection: 'users',
        data: {
            roles: ['admin'],
            email: 'admin@payloadcms.com',
            password: 'test',
        },
    });
    await payload.create({
        collection: 'users',
        data: {
            roles: ['editor'],
            email: 'editor@test.com',
            password: 'test',
        },
    });


};