import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    return {
        name: 'Vadim',
        age: 28
    };
};