import { PrismaClient } from '@prisma/client';

type SeedRole = 'TOURIST' | 'ORGANIZER' | 'ADMIN';

const prisma = new PrismaClient();

async function run() {
    const admin = await prisma.user.upsert({
        where: { email: 'admin@platformn.am' },
        update: {},
        create: {
            email: 'admin@platformn.am',
            password: '$2b$10$abcdefghijklmnopqrstuv',
            role: 'ADMIN' as SeedRole,
            name: 'Admin',
        },
    });

    const regions = [
        'Երևան', 'Արագածոտն', 'Արարատ', 'Արմավիր', 'Գեղարքունիք', 'Կոտայք', 'Լոռի', 'Շիրակ', 'Սյունիք', 'Տավուշ', 'Վայոց Ձոր'
    ];

    const now: Date = new Date();
    const addDays = (base: Date, days: number): Date => {
        const d = new Date(base.getTime());
        d.setDate(d.getDate() + days);
        return d;
    };

    const eventsData: Array<{ title: string; region: string; type: string; date: Date }> = [
        { title: 'Գինու փառատոն', region: 'Վայոց Ձոր', type: 'Festival', date: addDays(now, 7) },
        { title: 'Վարդավառ', region: 'Երևան', type: 'Tradition', date: addDays(now, 30) },
        { title: 'Դիլիջան Jazz', region: 'Տավուշ', type: 'Music', date: addDays(now, -10) },
        { title: 'Արարատի Մշակույթի օր', region: 'Արարատ', type: 'Culture', date: addDays(now, 3) },
        { title: 'Լոռի Food Market', region: 'Լոռի', type: 'Food', date: addDays(now, 14) },
        { title: 'Շիրակ Maraton', region: 'Շիրակ', type: 'Sport', date: addDays(now, -20) },
    ];

    for (const e of eventsData) {
        await prisma.event.create({
        data: {
            title: e.title,
            description: `${e.title} միջոցառում`,
            region: e.region,
            type: e.type,
            date: e.date,
        },
        });
    }

    console.log('Seed completed', { adminId: admin.id, regions: regions.length });
}

run().finally(async () => {
    await prisma.$disconnect();
});


