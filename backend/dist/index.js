"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const requireEnv = (key) => {
    const value = process.env[key];
    return value && value.length > 0 ? value : 'dev-secret';
};
const authenticate = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: 'Missing Authorization header' });
    const token = header.replace('Bearer ', '');
    try {
        if (token === 'demo') {
            req.user = { id: 'u_demo', role: 'tourist' };
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, requireEnv('JWT_SECRET'));
        req.user = decoded;
        return next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
const userIdToRoutes = {};
app.get('/health', (_req, res) => {
    res.json({ ok: true });
});
const regions = [
    'Երևան', 'Արագածոտն', 'Արարատ', 'Արմավիր', 'Գեղարքունիք', 'Կոտայք', 'Լոռի', 'Շիրակ', 'Սյունիք', 'Տավուշ', 'Վայոց Ձոր'
];
// Region to specific areas mapping
const regionAreas = {
    'Երևան': ['Կենտրոն', 'Աջափնյակ', 'Ավան', 'Նոր Նորք', 'Մալաթիա', 'Էրեբունի', 'Նուբարաշեն', 'Շենգավիթ'],
    'Արագածոտն': ['Աշտարակ', 'Ապարան', 'Թալին', 'Արագած', 'Ուշի', 'Արուճ', 'Արտաշատ', 'Կոշ'],
    'Արարատ': ['Արտաշատ', 'Մասիս', 'Վեդի', 'Արարատ', 'Նորավան', 'Խոր Վիրապ', 'Էջմիածին', 'Վաղարշապատ'],
    'Արմավիր': ['Արմավիր', 'Էջմիածին', 'Վաղարշապատ', 'Մեծամոր', 'Փարաքար', 'Բագարան', 'Մուշ', 'Արագածոտն'],
    'Գեղարքունիք': ['Գավառ', 'Սևան', 'Մարտունի', 'Վարդենիս', 'Չամբարակ', 'Սևանա լիճ', 'Նորատուս', 'Գեղարդ'],
    'Կոտայք': ['Հրազդան', 'Աբովյան', 'Բյուրեղ', 'Չարենցավան', 'Նոր Հաճն', 'Ծաղկաձոր', 'Արզնի', 'Բջնի'],
    'Լոռի': ['Վանաձոր', 'Ալավերդի', 'Ստեփանավան', 'Տաշիր', 'Սպիտակ', 'Մեծավան', 'Օձուն', 'Կոբայր'],
    'Շիրակ': ['Գյումրի', 'Արթիկ', 'Մարալիկ', 'Աշոցք', 'Ամասիա', 'Արփի', 'Ջաջուռ', 'Սարատակ'],
    'Սյունիք': ['Կապան', 'Գորիս', 'Սիսիան', 'Մեղրի', 'Տաթև', 'Շահումյան', 'Քաջարան', 'Ագարակ'],
    'Տավուշ': ['Իջևան', 'Դիլիջան', 'Բերդ', 'Նոյեմբերյան', 'Այրում', 'Տավուշ', 'Նավուր', 'Պարավակար'],
    'Վայոց Ձոր': ['Եղեգնաձոր', 'Վայք', 'Ջերմուկ', 'Արենի', 'Գառնի', 'Մարտունի', 'Վերին Շորժա', 'Գետափ']
};
const addDays = (base, days) => {
    const d = new Date(base.getTime());
    d.setDate(d.getDate() + days);
    return d.toISOString();
};
const baseSampleEvents = [
    {
        id: 'ev_areni_wine',
        titleHy: 'Արենի Գինու Փառատոն',
        titleEn: 'Areni Wine Festival',
        descriptionHy: 'Արենի գինիների համտես, երաժշտություն և տոնական շքերթ',
        descriptionEn: 'Areni wine tasting, music and festive parade',
        region: 'Վայոց Ձոր',
        areaHy: 'Արենի',
        areaEn: 'Areni',
        type: 'Festival',
        date: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 2),
        imageUrl: '/placeholder.svg',
        pricing: { isFree: false, price: 5000 }
    },
    {
        id: 'ev_vardavar',
        titleHy: 'Վարդավառ',
        titleEn: 'Vardavar',
        descriptionHy: 'Ազգային ավանդույթ ջրախաղերով՝ քաղաքային տոն',
        descriptionEn: 'National tradition with water games — citywide celebration',
        region: 'Երևան',
        areaHy: 'Կենտրոն',
        areaEn: 'Center',
        type: 'Tradition',
        date: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 1),
        imageUrl: '/placeholder.svg',
        pricing: { isFree: true, price: 0 }
    },
    {
        id: 'ev_dilijan_jazz',
        titleHy: 'Դիլիջան Jazz',
        titleEn: 'Dilijan Jazz',
        descriptionHy: 'Բացօթյա ջազ համերգներ Դիլիջանի սրտում',
        descriptionEn: 'Open-air jazz concerts in the heart of Dilijan',
        region: 'Տավուշ',
        areaHy: 'Դիլիջան',
        areaEn: 'Dilijan',
        type: 'Music',
        date: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 3),
        imageUrl: '/placeholder.svg',
        pricing: { isFree: false, price: 8000 }
    },
    {
        id: 'ev_gyumri_street_food',
        titleHy: 'Գյումրի Street Food',
        titleEn: 'Gyumri Street Food',
        descriptionHy: 'Շիրակի ավանդական ուտեստներ և կենդանի երաժշտություն',
        descriptionEn: 'Traditional Shirak dishes and live music',
        region: 'Շիրակ',
        areaHy: 'Գյումրի',
        areaEn: 'Gyumri',
        type: 'Food',
        date: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 2),
        imageUrl: '/placeholder.svg',
        pricing: { isFree: false, price: 3000 }
    },
    {
        id: 'ev_sevan_regatta',
        titleHy: 'Սևան Ռեգատա',
        titleEn: 'Sevan Regatta',
        descriptionHy: 'Ռեգատա և ջրային սպորտեր Սևանա լճում',
        descriptionEn: 'Regatta and water sports on Lake Sevan',
        region: 'Գեղարքունիք',
        areaHy: 'Սևան',
        areaEn: 'Sevan',
        type: 'Sport',
        date: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 4),
        imageUrl: '/placeholder.svg',
        pricing: { isFree: true, price: 0 }
    },
    {
        id: 'ev_tatev_fest',
        titleHy: 'Տաթև Մշակութային Փառատոն',
        titleEn: 'Tatev Cultural Festival',
        descriptionHy: 'Տաթևի վանքի շրջակայքում արվեստի և արհեստների համադրություն',
        descriptionEn: 'Arts and crafts showcase around Tatev Monastery',
        region: 'Սյունիք',
        areaHy: 'Տաթև',
        areaEn: 'Tatev',
        type: 'Culture',
        date: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 5),
        imageUrl: '/placeholder.svg',
        pricing: { isFree: false, price: 4000 }
    },
    {
        id: 'ev_lori_pumpkin',
        titleHy: 'Լոռու Դդմի Տոն',
        titleEn: 'Lori Pumpkin Festival',
        descriptionHy: 'Աշնանձև տոն՝ տնական ուտեստներով և մրցույթներով',
        descriptionEn: 'Autumn festival with homemade dishes and contests',
        region: 'Լոռի',
        areaHy: 'Վանաձոր',
        areaEn: 'Vanadzor',
        type: 'Festival',
        date: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 2),
        imageUrl: '/placeholder.svg',
        pricing: { isFree: true, price: 0 }
    },
    {
        id: 'ev_ararat_apricot',
        titleHy: 'Ծիրանի Տոն',
        titleEn: 'Apricot Festival',
        descriptionHy: 'Արարատյան դաշտավայրի ծիրանի փառատոն և շուկա',
        descriptionEn: 'Apricot festival and market in Ararat Valley',
        region: 'Արարատ',
        areaHy: 'Արտաշատ',
        areaEn: 'Artashat',
        type: 'Food',
        date: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 3),
        imageUrl: '/placeholder.svg',
        pricing: { isFree: false, price: 2000 }
    },
    {
        id: 'ev_armavir_harvest',
        titleHy: 'Արմավիրի Բերքի Տոն',
        titleEn: 'Armavir Harvest Fair',
        descriptionHy: 'Տարեկան տոնավաճառ՝ տեղական արտադրանքով',
        descriptionEn: 'Annual fair with local produce',
        region: 'Արմավիր',
        areaHy: 'Արմավիր',
        areaEn: 'Armavir',
        type: 'Market',
        date: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 1),
        imageUrl: '/placeholder.svg',
        pricing: { isFree: true, price: 0 }
    },
    {
        id: 'ev_kotayk_winter',
        titleHy: 'Հրազդանի Ձմեռային Օրեր',
        titleEn: 'Hrazdan Winter Days',
        descriptionHy: 'Ձմեռային մարզական մրցույթներ և տոնավաճառ',
        descriptionEn: 'Winter sports competitions and fair in Hrazdan',
        region: 'Կոտայք',
        areaHy: 'Հրազդան',
        areaEn: 'Hrazdan',
        type: 'Sport',
        date: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 3),
        imageUrl: '/placeholder.svg',
        pricing: { isFree: false, price: 3500 }
    },
    {
        id: 'ev_tavush_honey',
        titleHy: 'Տավուշ Մեղր և Թեյ',
        titleEn: 'Tavush Honey & Tea',
        descriptionHy: 'Տեղական մեղրի, թեյերի և խոտաբույսերի փառատոն',
        descriptionEn: 'Festival of local honey, teas and herbs',
        region: 'Տավուշ',
        areaHy: 'Իջևան',
        areaEn: 'Ijevan',
        type: 'Food',
        date: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), 2),
        imageUrl: '/placeholder.svg',
        pricing: { isFree: true, price: 0 }
    }
];
const types = ['Festival', 'Culture', 'Music', 'Food', 'Sport', 'Tradition'];
const typeHyToEn = {
    'Festival': 'Festival',
    'Culture': 'Culture',
    'Music': 'Music',
    'Food': 'Food',
    'Sport': 'Sport',
    'Tradition': 'Tradition',
};
const extraEvents = regions.flatMap((r, rIdx) => {
    return [0, 1, 2].map((i) => {
        const isFree = (rIdx + i) % 2 === 0;
        const price = isFree ? 0 : (rIdx + 1) * (i + 1) * 1000;
        const t = types[(rIdx + i) % types.length];
        const titleHy = `${r} ${t} ${i + 1}`;
        const titleEn = `${typeHyToEn[t]} in ${r} ${i + 1}`;
        const descriptionHy = `${r} տարածաշրջան՝ ${t} միջոցառում`;
        const descriptionEn = `${typeHyToEn[t]} event in ${r}`;
        const baseDate = addDays(new Date(), (rIdx - i) * 5);
        const duration = Math.max(1, (rIdx + i) % 4 + 1); // 1-4 days
        // Get random area from the region
        const areas = regionAreas[r] || [r];
        const areaIndex = (rIdx + i) % areas.length;
        const areaHy = areas[areaIndex];
        const areaEn = areaHy; // For simplicity, using same name for both languages
        return {
            id: `ev_${encodeURIComponent(r)}_${i}`,
            titleHy,
            titleEn,
            descriptionHy,
            descriptionEn,
            region: r,
            areaHy,
            areaEn,
            type: t,
            date: baseDate,
            startDate: baseDate,
            endDate: addDays(new Date(baseDate), duration),
            imageUrl: '/placeholder.svg',
            pricing: { isFree, price }
        };
    });
});
const sampleEventsRaw = [
    ...baseSampleEvents,
    ...extraEvents,
];
const toPublicEvent = (e, lng) => ({
    id: e.id,
    title: lng === 'en' ? e.titleEn : e.titleHy,
    description: lng === 'en' ? e.descriptionEn : e.descriptionHy,
    region: e.region,
    area: lng === 'en' ? e.areaEn : e.areaHy,
    type: e.type,
    date: e.date,
    startDate: e.startDate,
    endDate: e.endDate,
    budgetMin: e.budgetMin,
    budgetMax: e.budgetMax,
    imageUrl: e.imageUrl,
    pricing: e.pricing,
});
app.get('/regions', (_req, res) => {
    res.json({ items: regions });
});
// Auth mock endpoints with test users
const loginBody = zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string().min(4) });
app.post('/auth/login', (req, res) => {
    const parsed = loginBody.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: 'Invalid credentials format' });
    const { email, password } = parsed.data;
    let user = null;
    if (email === 'admin@admin.com' && password === 'admin') {
        user = { id: 'u_admin', role: 'admin' };
    }
    else if (email === 'user@user.com' && password === 'user') {
        user = { id: 'u_user', role: 'tourist' };
    }
    else if (email === 'provider@provider.com' && password === 'provider') {
        user = { id: 'u_provider', role: 'provider' };
    }
    else {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jsonwebtoken_1.default.sign(user, requireEnv('JWT_SECRET'), { expiresIn: '7d' });
    res.json({ token, user });
});
// Profile endpoints
// Joined plans per user
const userIdToJoinedPlans = {};
app.get('/profile', authenticate, (req, res) => {
    const user = req.user;
    const routes = userIdToRoutes[user.id] || [];
    const joinedPlanIds = userIdToJoinedPlans[user.id] || [];
    const joinedPlans = travelPlans.filter(p => joinedPlanIds.includes(p.id)).map(plan => ({
        id: plan.id,
        eventTitle: sampleEventsRaw.find((e) => e.id === plan.eventId)?.titleHy || 'Unknown Event',
        eventDate: plan.date,
        fromLocation: plan.from,
        toLocation: plan.to,
        joinedAt: new Date().toISOString()
    }));
    res.json({ user, routes, joinedPlans });
});
app.get('/routes', authenticate, (req, res) => {
    const user = req.user;
    res.json({ items: userIdToRoutes[user.id] || [] });
});
const routeBody = zod_1.z.object({
    name: zod_1.z.string().min(1),
    days: zod_1.z.number().int().positive(),
    budget: zod_1.z.number().int().nonnegative(),
    interests: zod_1.z.array(zod_1.z.string()),
    stops: zod_1.z.any(),
});
app.post('/routes', authenticate, (req, res) => {
    const parsed = routeBody.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: 'Invalid route payload' });
    const user = req.user;
    const list = userIdToRoutes[user.id] || [];
    const newRoute = {
        id: `r_${Date.now()}`,
        ...parsed.data,
        createdAt: new Date().toISOString(),
        description: `Route with ${parsed.data.days} days, ${parsed.data.interests.join(', ')} interests`
    };
    userIdToRoutes[user.id] = [newRoute, ...list];
    res.status(201).json(newRoute);
});
// Events mock endpoints
app.get('/events', (req, res) => {
    const { region, type, pricing, lng } = req.query;
    const language = lng === 'en' ? 'en' : 'hy';
    let items = sampleEventsRaw;
    if (region && typeof region === 'string')
        items = items.filter(e => e.region === region);
    if (type && typeof type === 'string')
        items = items.filter(e => e.type === type);
    if (pricing === 'free')
        items = items.filter(e => e.pricing.isFree);
    if (pricing === 'paid')
        items = items.filter(e => !e.pricing.isFree);
    const mapped = items.map(e => toPublicEvent(e, language));
    res.json({ items: mapped, total: mapped.length });
});
app.get('/events/:id', (req, res) => {
    const language = (req.query.lng === 'en') ? 'en' : 'hy';
    const ev = sampleEventsRaw.find(e => e.id === req.params.id);
    if (!ev)
        return res.status(404).json({ error: 'Not found' });
    const pub = toPublicEvent(ev, language);
    const detail = {
        ...pub,
        location: { lat: 40.1792, lng: 44.4991 },
        transport: ['Bus lines', 'Taxi', 'Tour agency'],
        nearby: ['Տարածաշրջանային տեսարժան վայր 1', 'Տեսարժան վայր 2']
    };
    res.json(detail);
});
// Simple distance estimation between regions (km) from Երևան
const regionDistanceFromYerevan = {
    'Երևան': 0,
    'Արարատ': 50,
    'Արմավիր': 48,
    'Գեղարքունիք': 70,
    'Կոտայք': 45,
    'Լոռி': 150,
    'Շիրակ': 120,
    'Սյունիք': 250,
    'Տավուշ': 140,
    'Վայոց Ձոր': 130,
};
// Cost estimation endpoint
app.post('/estimate', (req, res) => {
    const { region, eventId, passengers = 1 } = req.body || {};
    const ev = sampleEventsRaw.find((e) => e.id === eventId);
    const distance = regionDistanceFromYerevan[region] ?? 100;
    const taxiPricePerKm = 180; // AMD per km (rough average)
    const taxiTotal = distance * 2 * taxiPricePerKm; // round trip
    // If there are rides to the region/event, take min available seat price
    const rideOptions = travelPlans
        .filter(p => (!region || p.to === region) && (!eventId || p.eventId === eventId))
        .map(p => ({ id: p.id, isFree: !!p.ridePricing?.isFree, pricePerSeat: p.ridePricing?.pricePerSeat ?? 0 }));
    const paidRide = rideOptions
        .filter(r => !r.isFree && r.pricePerSeat > 0)
        .sort((a, b) => a.pricePerSeat - b.pricePerSeat)[0];
    const freeRide = rideOptions.find(r => r.isFree);
    const transport = freeRide
        ? { mode: 'ride_free', perPerson: 0, total: 0 }
        : paidRide
            ? { mode: 'ride_paid', perPerson: paidRide.pricePerSeat, total: paidRide.pricePerSeat * passengers }
            : { mode: 'taxi', perPerson: Math.ceil(taxiTotal / passengers), total: taxiTotal };
    const eventCost = ev ? (ev.pricing.isFree ? 0 : ev.pricing.price) : 0;
    return res.json({
        region,
        eventId,
        passengers,
        distanceKm: distance,
        transport,
        event: { isFree: !ev ? true : ev.pricing.isFree, price: eventCost },
        totalPerPerson: transport.perPerson + eventCost,
        totalGroup: transport.total + eventCost * passengers,
    });
});
// Companions mock search
const companionsBody = zod_1.z.object({
    interests: zod_1.z.array(zod_1.z.string()).optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    regions: zod_1.z.array(zod_1.z.string()).optional(),
});
app.post('/companions/search', (req, res) => {
    const parsed = companionsBody.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: 'Invalid search params' });
    const matches = [
        { id: 'c_1', name: 'Ani', interests: ['culture', 'food'], regions: ['Երևան'] },
        { id: 'c_2', name: 'Aram', interests: ['hiking'], regions: ['Տավուշ'] },
    ];
    res.json({ items: matches });
});
const travelPlans = [
    {
        id: 'tp_1',
        organizer: { id: 'u_ani', name: 'Ani' },
        from: 'Երևան',
        to: 'Վայոց Ձոր',
        date: new Date().toISOString(),
        seats: 3,
        route: ['Երևան', 'Արտաշատ', 'Արենի', 'Եղեգնաձոր'],
        eventId: 'ev_areni_wine',
        ridePricing: { isFree: false, pricePerSeat: 2000 }
    },
    {
        id: 'tp_2',
        organizer: { id: 'u_aram', name: 'Aram' },
        from: 'Երևան',
        to: 'Վայոց Ձոր',
        date: new Date().toISOString(),
        seats: 2,
        route: ['Երևան', 'Մասիս', 'Արտաշատ', 'Արենի'],
        eventId: 'ev_areni_wine',
        ridePricing: { isFree: true, pricePerSeat: 0 }
    },
    {
        id: 'tp_3',
        organizer: { id: 'u_maria', name: 'Maria' },
        from: 'Երևան',
        to: 'Գեղարքունիք',
        date: addDays(new Date(), 2),
        seats: 4,
        route: ['Երևան', 'Աբովյան', 'Սևան'],
        eventId: 'ev_sevan_regatta',
        ridePricing: { isFree: false, pricePerSeat: 1500 }
    },
    {
        id: 'tp_4',
        organizer: { id: 'u_david', name: 'David' },
        from: 'Երևան',
        to: 'Տավուշ',
        date: addDays(new Date(), 1),
        seats: 2,
        route: ['Երևան', 'Իջևան', 'Դիլիջան'],
        eventId: 'ev_dilijan_jazz',
        ridePricing: { isFree: true, pricePerSeat: 0 }
    },
    {
        id: 'tp_5',
        organizer: { id: 'u_sara', name: 'Sara' },
        from: 'Երևան',
        to: 'Սյունիք',
        date: addDays(new Date(), 3),
        seats: 3,
        route: ['Երևան', 'Գորիս', 'Տաթև'],
        eventId: 'ev_tatev_fest',
        ridePricing: { isFree: false, pricePerSeat: 3000 }
    },
    {
        id: 'tp_6',
        organizer: { id: 'u_levon', name: 'Levon' },
        from: 'Երևան',
        to: 'Լոռի',
        date: addDays(new Date(), 5),
        seats: 5,
        route: ['Երևան', 'Վանաձոր', 'Ալավերդի'],
        eventId: 'ev_lori_pumpkin',
        ridePricing: { isFree: false, pricePerSeat: 1200 }
    },
    {
        id: 'tp_7',
        organizer: { id: 'u_nare', name: 'Nare' },
        from: 'Երևան',
        to: 'Շիրակ',
        date: addDays(new Date(), 4),
        seats: 2,
        route: ['Երևան', 'Գյումրի'],
        eventId: 'ev_gyumri_street_food',
        ridePricing: { isFree: true, pricePerSeat: 0 }
    },
    {
        id: 'tp_8',
        organizer: { id: 'u_armen', name: 'Armen' },
        from: 'Երևան',
        to: 'Արարատ',
        date: addDays(new Date(), 6),
        seats: 4,
        route: ['Երևան', 'Արտաշատ', 'Խոր Վիրապ'],
        eventId: 'ev_ararat_apricot',
        ridePricing: { isFree: false, pricePerSeat: 800 }
    }
];
app.get('/travel-plans', (req, res) => {
    const { to, eventId, lng } = req.query;
    const language = lng === 'en' ? 'en' : 'hy';
    let items = travelPlans;
    if (to && typeof to === 'string')
        items = items.filter(p => p.to === to);
    if (eventId && typeof eventId === 'string')
        items = items.filter(p => p.eventId === eventId);
    // Add event title to each travel plan
    const itemsWithEventTitles = items.map(plan => {
        const event = sampleEventsRaw.find(e => e.id === plan.eventId);
        const eventTitle = event ? (language === 'en' ? event.titleEn : event.titleHy) : 'Unknown Event';
        return {
            ...plan,
            eventTitle
        };
    });
    res.json({ items: itemsWithEventTitles });
});
app.post('/travel-plans/:id/join', authenticate, (req, res) => {
    const plan = travelPlans.find(p => p.id === req.params.id);
    if (!plan)
        return res.status(404).json({ error: 'Not found' });
    if (plan.seats <= 0)
        return res.status(400).json({ error: 'No seats left' });
    plan.seats -= 1;
    const user = req.user;
    const list = userIdToJoinedPlans[user.id] || [];
    if (!list.includes(plan.id))
        userIdToJoinedPlans[user.id] = [plan.id, ...list];
    res.json({ ok: true, seatsLeft: plan.seats });
});
// Info content (static)
app.get('/info', (_req, res) => {
    res.json({
        culture: 'Հայկական մշակույթը հարուստ է ավանդույթներով, երաժշտությամբ և խոհանոցով',
        traditions: ['Վարդավառ', 'Տրիքնապատք'],
    });
});
// Partners (discounts)
app.get('/partners', (_req, res) => {
    res.json({ items: [
            { id: 'p1', name: 'Yerevan Wine Bar', category: 'Restaurant', discount: '10%' },
            { id: 'p2', name: 'Dilijan Hotel', category: 'Hotel', discount: '15%' },
        ] });
});
const attractions = [
    // Երևան
    {
        id: 'attr_erebuni',
        titleHy: 'Էրեբունի ամրոց',
        titleEn: 'Erebuni Fortress',
        summaryHy: 'Երևանի հիմնադրման վայրը',
        summaryEn: 'The founding site of Yerevan',
        historyHy: 'Էրեբունի ամրոցը հիմնադրվել է մ.թ.ա. 782թ.-ին՝ ուրարտական արքա Արգիշտի Ա-ի կողմից։',
        historyEn: 'Erebuni Fortress was founded in 782 BC by Urartian King Argishti I.',
        imageUrl: '/placeholder.svg'
    },
    {
        id: 'attr_tsitsernakaberd',
        titleHy: 'Ծիծեռնակաբերդ',
        titleEn: 'Tsitsernakaberd',
        summaryHy: 'Հայոց ցեղասպանության հուշահամալիր',
        summaryEn: 'Armenian Genocide Memorial Complex',
        historyHy: 'Ծիծեռնակաբերդը կառուցվել է 1967թ.-ին՝ ի հիշատակ 1915թ.-ի Հայոց ցեղասպանության զոհերի։',
        historyEn: 'Tsitsernakaberd was built in 1967 to commemorate the victims of the 1915 Armenian Genocide.',
        imageUrl: '/placeholder.svg'
    },
    // Արարատ
    {
        id: 'attr_khor_virap',
        titleHy: 'Խոր Վիրապ',
        titleEn: 'Khor Virap',
        summaryHy: 'Սուրբ Գրիգոր Լուսավորիչի բանտը',
        summaryEn: 'The prison of Saint Gregory the Illuminator',
        historyHy: 'Խոր Վիրապը հայտնի է որպես այն վայր, որտեղ 13 տարի բանտարկված է եղել Սուրբ Գրիգոր Լուսավորիչը։',
        historyEn: 'Khor Virap is famous as the place where Saint Gregory the Illuminator was imprisoned for 13 years.',
        imageUrl: '/placeholder.svg'
    },
    // Արմավիր
    {
        id: 'attr_zvartnots',
        titleHy: 'Զվարթնոց տաճար',
        titleEn: 'Zvartnots Cathedral',
        summaryHy: 'ՅՈՒՆԵՍԿՕ-ի համաշխարհային ժառանգության օբյեկտ',
        summaryEn: 'UNESCO World Heritage site',
        historyHy: 'Զվարթնոց տաճարը կառուցվել է 7-րդ դարում և եղել է ամենամեծ եկեղեցիներից մեկը։',
        historyEn: 'Zvartnots Cathedral was built in the 7th century and was one of the largest churches.',
        imageUrl: '/placeholder.svg'
    },
    // Գեղարքունիք
    {
        id: 'attr_sevanavank',
        titleHy: 'Սևանավանք',
        titleEn: 'Sevanavank',
        summaryHy: 'Տեղակայված Սևանա լճի ափին',
        summaryEn: 'Located on the shores of Lake Sevan',
        historyHy: 'Սևանավանքը հիմնվել է 874թ.-ին՝ իշխան Աշոտ Բագրատունու կնոջ՝ Մարիամի կողմից։',
        historyEn: 'Sevanavank was founded in 874 AD by Princess Mariam, wife of Prince Ashot Bagratuni.',
        imageUrl: '/placeholder.svg'
    },
    // Կոտայք
    {
        id: 'attr_geghard',
        titleHy: 'Գեղարդ',
        titleEn: 'Geghard Monastery',
        summaryHy: 'ՅՈՒՆԵՍԿՕ-ի համաշխարհային ժառանգության օբյեկտ',
        summaryEn: 'UNESCO World Heritage site',
        historyHy: 'Գեղարդավանքը հայտնի է իր ժայռափոր եկեղեցիներով և սրբավայրերով։',
        historyEn: 'Geghard is renowned for its rock-cut churches and sacred relics.',
        imageUrl: '/placeholder.svg'
    },
    {
        id: 'attr_garni',
        titleHy: 'Գառնիի տաճար',
        titleEn: 'Garni Temple',
        summaryHy: 'Հելլենիստական ժամանակաշրջանի միակ պահպանված տաճարը',
        summaryEn: 'The only preserved temple from the Hellenistic period',
        historyHy: 'Գառնիի տաճարը կառուցվել է մ.թ. 1-ին դարում և նվիրված է եղել արևի աստծուն։',
        historyEn: 'Garni Temple was built in the 1st century AD and was dedicated to the sun god.',
        imageUrl: '/placeholder.svg'
    },
    // Լոռի
    {
        id: 'attr_haghpat',
        titleHy: 'Հաղպատի վանք',
        titleEn: 'Haghpat Monastery',
        summaryHy: 'ՅՈՒՆԵՍԿՕ-ի համաշխարհային ժառանգության օբյեկտ',
        summaryEn: 'UNESCO World Heritage site',
        historyHy: 'Հաղպատի վանքը հիմնադրվել է 10-րդ դարում և եղել է մշակութային ու գիտական կենտրոն։',
        historyEn: 'Haghpat Monastery was founded in the 10th century and served as a cultural and scholarly center.',
        imageUrl: '/placeholder.svg'
    },
    {
        id: 'attr_sanahin',
        titleHy: 'Սանահինի վանք',
        titleEn: 'Sanahin Monastery',
        summaryHy: 'ՅՈՒՆԵՍԿՕ-ի համաշխարհային ժառանգության օբյեկտ',
        summaryEn: 'UNESCO World Heritage site',
        historyHy: 'Սանահինի վանքը հիմնադրվել է 10-րդ դարում և հայտնի է իր գրադարանով ու դպրոցով։',
        historyEn: 'Sanahin Monastery was founded in the 10th century and is famous for its library and school.',
        imageUrl: '/placeholder.svg'
    },
    // Շիրակ
    {
        id: 'attr_gyumri_center',
        titleHy: 'Գյումրիի պատմական կենտրոն',
        titleEn: 'Gyumri Historic Center',
        summaryHy: '19-րդ դարի ճարտարապետական ժառանգություն',
        summaryEn: '19th century architectural heritage',
        historyHy: 'Գյումրին հայտնի է իր 19-րդ դարի քարե ճարտարապետությամբ և մշակութային կյանքով։',
        historyEn: 'Gyumri is famous for its 19th century stone architecture and cultural life.',
        imageUrl: '/placeholder.svg'
    },
    {
        id: 'attr_marmashen',
        titleHy: 'Մարմաշենի վանք',
        titleEn: 'Marmashen Monastery',
        summaryHy: '10-րդ դարի վանական համալիր',
        summaryEn: '10th century monastic complex',
        historyHy: 'Մարմաշենի վանքը կառուցվել է 10-րդ դարում և հայտնի է իր ճարտարապետական գեղեցկությամբ։',
        historyEn: 'Marmashen Monastery was built in the 10th century and is famous for its architectural beauty.',
        imageUrl: '/placeholder.svg'
    },
    // Սյունիք
    {
        id: 'attr_tatev',
        titleHy: 'Տաթևի վանք',
        titleEn: 'Tatev Monastery',
        summaryHy: 'Միջնադարյան վանական համալիր՝ Սյունիքում',
        summaryEn: 'Medieval monastic complex in Syunik',
        historyHy: 'Տաթևի վանքը հիմնադրվել է 9-րդ դարում և եղել է մշակութային և գիտական կենտրոն։',
        historyEn: 'Founded in the 9th century, Tatev Monastery served as a major cultural and scholarly center.',
        imageUrl: '/placeholder.svg'
    },
    {
        id: 'attr_tatev_wings',
        titleHy: 'Տաթևի թևեր',
        titleEn: 'Wings of Tatev',
        summaryHy: 'Ամենաերկար գագաթնակետային ճոպանուղին աշխարհում',
        summaryEn: 'The longest reversible aerial tramway in the world',
        historyHy: 'Տաթևի թևերը կառուցվել է 2010թ.-ին՝ 5.7 կմ երկարությամբ ճոպանուղի։',
        historyEn: 'Wings of Tatev was built in 2010 as a 5.7 km long cable car.',
        imageUrl: '/placeholder.svg'
    },
    // Տավուշ
    {
        id: 'attr_dilijan_center',
        titleHy: 'Դիլիջանի պատմական կենտրոն',
        titleEn: 'Dilijan Historic Center',
        summaryHy: 'Հայաստանի Շվեյցարիա',
        summaryEn: 'Armenia\'s Switzerland',
        historyHy: 'Դիլիջանը հայտնի է իր բնական գեղեցկությամբ և 19-20-րդ դարերի ճարտարապետությամբ։',
        historyEn: 'Dilijan is famous for its natural beauty and 19th-20th century architecture.',
        imageUrl: '/placeholder.svg'
    },
    {
        id: 'attr_haghartsin',
        titleHy: 'Հաղարծինի վանք',
        titleEn: 'Haghartsin Monastery',
        summaryHy: '10-13-րդ դարերի վանական համալիր',
        summaryEn: '10th-13th century monastic complex',
        historyHy: 'Հաղարծինի վանքը կառուցվել է 10-13-րդ դարերում և հայտնի է իր ճարտարապետական հարստությամբ։',
        historyEn: 'Haghartsin Monastery was built in the 10th-13th centuries and is famous for its architectural richness.',
        imageUrl: '/placeholder.svg'
    },
    // Վայոց Ձոր
    {
        id: 'attr_noravank',
        titleHy: 'Նորավանք',
        titleEn: 'Noravank',
        summaryHy: '13-14-րդ դարերի վանական համալիր',
        summaryEn: '13th-14th century monastic complex',
        historyHy: 'Նորավանքը կառուցվել է 13-14-րդ դարերում և հայտնի է իր կարմիր քարե ճարտարապետությամբ։',
        historyEn: 'Noravank was built in the 13th-14th centuries and is famous for its red stone architecture.',
        imageUrl: '/placeholder.svg'
    },
    {
        id: 'attr_areni_cave',
        titleHy: 'Արենիի քարանձավ',
        titleEn: 'Areni Cave',
        summaryHy: 'Աշխարհի ամենահին գինու գործարանը',
        summaryEn: 'The world\'s oldest winery',
        historyHy: 'Արենիի քարանձավում հայտնաբերվել է 6100 տարեկան գինու գործարան, որը համարվում է աշխարհի ամենահինը։',
        historyEn: 'A 6100-year-old winery was discovered in Areni Cave, considered the world\'s oldest.',
        imageUrl: '/placeholder.svg'
    }
];
app.get('/attractions', (req, res) => {
    const lng = (req.query.lng === 'en') ? 'en' : 'hy';
    const items = attractions.map(a => ({
        id: a.id,
        title: lng === 'en' ? a.titleEn : a.titleHy,
        summary: lng === 'en' ? a.summaryEn : a.summaryHy,
        imageUrl: a.imageUrl,
    }));
    res.json({ items });
});
app.get('/attractions/:id', (req, res) => {
    const lng = (req.query.lng === 'en') ? 'en' : 'hy';
    const a = attractions.find(x => x.id === req.params.id);
    if (!a)
        return res.status(404).json({ error: 'Not found' });
    res.json({
        id: a.id,
        title: lng === 'en' ? a.titleEn : a.titleHy,
        summary: lng === 'en' ? a.summaryEn : a.summaryHy,
        history: lng === 'en' ? a.historyEn : a.historyHy,
        imageUrl: a.imageUrl,
    });
});
// Image proxy to avoid hotlink/CORS issues for remote images
app.get('/img', async (req, res) => {
    try {
        const url = String(req.query.url || '');
        if (!url || !/^https?:\/\//i.test(url)) {
            return res.status(400).send('Invalid url');
        }
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const r = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
        clearTimeout(timeout);
        if (!r.ok)
            return res.status(502).send('Upstream error');
        const ct = r.headers.get('content-type') || 'image/jpeg';
        res.setHeader('Content-Type', ct);
        const buf = Buffer.from(await r.arrayBuffer());
        res.send(buf);
    }
    catch {
        return res.status(500).send('Proxy error');
    }
});
// Admin/Provider endpoints
app.get('/users', authenticate, (req, res) => {
    const user = req.user;
    if (user.role !== 'admin')
        return res.status(403).json({ error: 'Admin access required' });
    // Mock users data
    const mockUsers = [
        { id: 'u_admin', email: 'admin@admin.com', role: 'admin' },
        { id: 'u_user', email: 'user@user.com', role: 'tourist' },
        { id: 'u_provider', email: 'provider@provider.com', role: 'provider' }
    ];
    res.json({ items: mockUsers });
});
app.post('/events', authenticate, (req, res) => {
    const user = req.user;
    if (user.role === 'tourist')
        return res.status(403).json({ error: 'Forbidden' });
    // In real implementation, save to database
    const newEvent = {
        id: `ev_${Date.now()}`,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    res.status(201).json(newEvent);
});
app.post('/travel-plans', authenticate, (req, res) => {
    const user = req.user;
    // In real implementation, save to database
    const newPlan = {
        id: `tp_${Date.now()}`,
        organizer: { id: user.id, name: 'Current User' },
        ...req.body,
        createdAt: new Date().toISOString()
    };
    // Add to mock data
    travelPlans.push(newPlan);
    res.status(201).json(newPlan);
});
app.delete('/events/:id', authenticate, (req, res) => {
    const user = req.user;
    if (user.role !== 'admin')
        return res.status(403).json({ error: 'Admin access required' });
    // In real implementation, delete from database
    res.json({ success: true });
});
// Itinerary generation
const itineraryBody = zod_1.z.object({
    startDate: zod_1.z.string(),
    days: zod_1.z.number().int().positive(),
    budgetPerPerson: zod_1.z.number().int().nonnegative(),
    interests: zod_1.z.array(zod_1.z.string()).optional(),
    preferredPlaces: zod_1.z.array(zod_1.z.string()).optional(),
    passengers: zod_1.z.number().int().positive().optional(),
    startRegion: zod_1.z.string(),
    endRegion: zod_1.z.string().optional(),
    lng: zod_1.z.enum(['hy', 'en']).optional(),
});
// Enhanced itinerary generation with intelligent algorithm
app.post('/itinerary', (req, res) => {
    const parsed = itineraryBody.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: 'Invalid itinerary params' });
    const { startDate, days, budgetPerPerson, interests = [], passengers = 1, startRegion, endRegion, lng = 'hy' } = parsed.data;
    const language = lng === 'en' ? 'en' : 'hy';
    const startingDate = new Date(startDate);
    const desiredTypes = new Set(interests.map(s => s.toLowerCase()));
    // Enhanced date range checking
    const isDateInRange = (date, startDate, endDate) => {
        if (!startDate)
            return false;
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : start;
        return date >= start && date <= end;
    };
    // Interest matching with fuzzy logic
    const matchesInterests = (event) => {
        if (desiredTypes.size === 0)
            return 1; // No preferences = perfect match
        const eventType = event.type.toLowerCase();
        const eventTitle = (language === 'en' ? event.titleEn : event.titleHy).toLowerCase();
        const eventDesc = (language === 'en' ? event.descriptionEn : event.descriptionHy).toLowerCase();
        let score = 0;
        for (const interest of desiredTypes) {
            if (eventType.includes(interest))
                score += 3; // Type match = high score
            if (eventTitle.includes(interest))
                score += 2; // Title match = medium score
            if (eventDesc.includes(interest))
                score += 1; // Description match = low score
        }
        return score / (desiredTypes.size * 3); // Normalize to 0-1
    };
    // Enhanced event selection with scoring and diversity
    const selectEventForDate = (d, currentRegion, usedEventIds, visitedRegions) => {
        let candidates = sampleEventsRaw.filter(e => {
            return isDateInRange(d, e.startDate, e.endDate) ||
                (() => {
                    const eventDate = new Date(e.date);
                    return eventDate.getFullYear() === d.getFullYear() &&
                        eventDate.getMonth() === d.getMonth() &&
                        eventDate.getDate() === d.getDate();
                })();
        });
        if (candidates.length === 0)
            return null;
        // Filter out already used events
        const unusedCandidates = candidates.filter(e => !usedEventIds.has(e.id));
        // Score and sort candidates with diversity bonus and randomization
        const scoredCandidates = (unusedCandidates.length > 0 ? unusedCandidates : candidates).map(event => {
            let score = matchesInterests(event);
            // Diversity bonus: prefer new regions
            if (!visitedRegions.has(event.region)) {
                score += 0.5; // Bonus for visiting new regions
            }
            // Penalty for already used events (if we have to use them)
            if (usedEventIds.has(event.id)) {
                score -= 0.3;
            }
            // Add randomization factor to ensure variety
            const randomFactor = Math.random() * 0.4; // 0-0.4 random boost
            score += randomFactor;
            return {
                event,
                score,
                isFree: event.pricing.isFree,
                price: event.pricing.price,
                region: event.region
            };
        }).sort((a, b) => {
            // Priority: Free events with high interest match, then paid events within budget
            if (a.isFree && !b.isFree)
                return -1;
            if (!a.isFree && b.isFree)
                return 1;
            if (a.isFree && b.isFree)
                return b.score - a.score; // Higher interest score first
            if (!a.isFree && !b.isFree) {
                if (a.price <= budgetPerPerson && b.price > budgetPerPerson)
                    return -1;
                if (a.price > budgetPerPerson && b.price <= budgetPerPerson)
                    return 1;
                return b.score - a.score; // Higher interest score first
            }
            return 0;
        });
        return scoredCandidates[0]?.event || null;
    };
    // Enhanced attraction selection when no events found
    const selectAttractionForRegion = (region, usedAttractionIds) => {
        // Correct region mapping based on actual attraction locations
        const regionAttractionMap = {
            'Երևան': ['attr_erebuni', 'attr_tsitsernakaberd'],
            'Արարատ': ['attr_khor_virap'],
            'Արմավիր': ['attr_zvartnots'],
            'Գեղարքունիք': ['attr_sevanavank', 'attr_geghard', 'attr_garni'],
            'Կոտայք': ['attr_geghard', 'attr_garni'],
            'Լոռի': ['attr_haghpat', 'attr_sanahin'],
            'Շիրակ': ['attr_gyumri_center', 'attr_marmashen'],
            'Սյունիք': ['attr_tatev', 'attr_tatev_wings'],
            'Տավուշ': ['attr_dilijan_center', 'attr_haghartsin'],
            'Վայոց Ձոր': ['attr_noravank', 'attr_areni_cave']
        };
        const attractionIds = regionAttractionMap[region] || [];
        let regionAttractions = attractions.filter(attr => attractionIds.includes(attr.id));
        if (regionAttractions.length === 0)
            return null;
        // Filter out already used attractions
        const unusedAttractions = regionAttractions.filter(attr => !usedAttractionIds.has(attr.id));
        if (unusedAttractions.length > 0) {
            regionAttractions = unusedAttractions;
        }
        // Select based on interests if possible
        if (desiredTypes.size > 0) {
            const scoredAttractions = regionAttractions.map(attr => {
                let score = matchesInterests({
                    type: 'Culture', // Default type for attractions
                    titleHy: attr.titleHy,
                    titleEn: attr.titleEn,
                    descriptionHy: attr.summaryHy,
                    descriptionEn: attr.summaryEn
                });
                // Penalty for already used attractions
                if (usedAttractionIds.has(attr.id)) {
                    score -= 0.3;
                }
                // Add randomization factor to ensure variety
                const randomFactor = Math.random() * 0.4; // 0-0.4 random boost
                score += randomFactor;
                return { attraction: attr, score };
            }).sort((a, b) => b.score - a.score);
            return scoredAttractions[0]?.attraction || regionAttractions[0];
        }
        // Random selection if no interests specified
        const randomIndex = Math.floor(Math.random() * regionAttractions.length);
        return regionAttractions[randomIndex];
    };
    // Distance calculation with region areas
    const distanceBetweenRegions = (from, to) => {
        if (from === to)
            return 0;
        const a = regionDistanceFromYerevan[from] ?? 100;
        const b = regionDistanceFromYerevan[to] ?? 100;
        return Math.max(30, Math.abs(a - b) + 40);
    };
    // Enhanced transport estimation
    const estimateTransport = (fromRegion, toRegion, eventId) => {
        const distance = distanceBetweenRegions(fromRegion, toRegion);
        const taxiPricePerKm = 180;
        const taxiTotal = distance * taxiPricePerKm;
        // Look for available rides
        const ridePool = travelPlans.filter((p) => p.to === toRegion);
        const rideOptions = (eventId ? ridePool.filter(p => p.eventId === eventId) : ridePool)
            .map((p) => ({
            isFree: !!p.ridePricing?.isFree,
            pricePerSeat: p.ridePricing?.pricePerSeat ?? 0,
            planId: p.id,
            organizer: p.organizer.name,
            route: p.route
        }));
        // Add randomization to ride selection
        const shuffledRideOptions = rideOptions.sort(() => Math.random() - 0.5);
        const freeRide = shuffledRideOptions.find((r) => r.isFree);
        const paidRide = shuffledRideOptions.filter((r) => !r.isFree && r.pricePerSeat > 0)
            .sort((a, b) => a.pricePerSeat - b.pricePerSeat)[0];
        if (freeRide) {
            return {
                mode: 'ride_free',
                perPerson: 0,
                total: 0,
                description: `Անվճար Ճանապարհորդական Պլան (${freeRide.organizer})`,
                planId: freeRide.planId,
                route: freeRide.route
            };
        }
        if (paidRide) {
            return {
                mode: 'ride_paid',
                perPerson: paidRide.pricePerSeat,
                total: paidRide.pricePerSeat * passengers,
                description: `Ճանապարհորդական Պլան (${paidRide.organizer})`,
                planId: paidRide.planId,
                route: paidRide.route
            };
        }
        return {
            mode: 'taxi',
            perPerson: Math.ceil(taxiTotal / passengers),
            total: taxiTotal,
            description: 'Տաքսի'
        };
    };
    // Main itinerary generation
    const daysOut = [];
    let totalPerPerson = 0;
    let totalGroup = 0;
    const lodgingPerNightPerPerson = 10000;
    let currentRegion = startRegion;
    let remainingBudget = budgetPerPerson;
    // Track used events and attractions to avoid repetition
    const usedEventIds = new Set();
    const usedAttractionIds = new Set();
    const visitedRegions = new Set([startRegion]);
    for (let i = 0; i < days; i++) {
        const date = new Date(startingDate.getTime());
        date.setDate(startingDate.getDate() + i);
        // Try to find an event first
        let raw = selectEventForDate(date, currentRegion, usedEventIds, visitedRegions);
        let eventPub = null;
        let attraction = null;
        let eventCost = 0;
        if (raw) {
            eventPub = toPublicEvent(raw, language);
            eventCost = raw.pricing.isFree ? 0 : raw.pricing.price;
            usedEventIds.add(raw.id);
            visitedRegions.add(raw.region);
        }
        else {
            // No event found, suggest an attraction
            attraction = selectAttractionForRegion(currentRegion, usedAttractionIds);
            if (attraction) {
                usedAttractionIds.add(attraction.id);
                visitedRegions.add(currentRegion);
            }
        }
        // Calculate transport
        const targetRegion = raw ? raw.region : currentRegion;
        const transport = estimateTransport(currentRegion, targetRegion, raw?.id);
        // Calculate costs
        const lodgingCost = i < days - 1 ? lodgingPerNightPerPerson : 0;
        const perPerson = transport.perPerson + eventCost + lodgingCost;
        const group = transport.total + (eventCost + lodgingCost) * passengers;
        // Check if within budget
        if (perPerson > remainingBudget && !raw?.pricing.isFree) {
            // Try to find a free event or attraction instead
            const freeEvents = sampleEventsRaw.filter(e => e.pricing.isFree && !usedEventIds.has(e.id) && (isDateInRange(date, e.startDate, e.endDate) ||
                (() => {
                    const eventDate = new Date(e.date);
                    return eventDate.getFullYear() === date.getFullYear() &&
                        eventDate.getMonth() === date.getMonth() &&
                        eventDate.getDate() === date.getDate();
                })()));
            if (freeEvents.length > 0) {
                const bestFreeEvent = freeEvents.sort((a, b) => {
                    let scoreA = matchesInterests(a);
                    let scoreB = matchesInterests(b);
                    // Bonus for new regions
                    if (!visitedRegions.has(a.region))
                        scoreA += 0.5;
                    if (!visitedRegions.has(b.region))
                        scoreB += 0.5;
                    return scoreB - scoreA;
                })[0];
                raw = bestFreeEvent;
                eventPub = toPublicEvent(raw, language);
                eventCost = 0;
                usedEventIds.add(raw.id);
                visitedRegions.add(raw.region);
            }
            else if (!attraction) {
                attraction = selectAttractionForRegion(currentRegion, usedAttractionIds);
                if (attraction) {
                    usedAttractionIds.add(attraction.id);
                    visitedRegions.add(currentRegion);
                }
            }
        }
        totalPerPerson += perPerson;
        totalGroup += group;
        remainingBudget -= perPerson;
        const entry = {
            day: i + 1,
            date: date.toISOString(),
            region: targetRegion,
            event: eventPub,
            attraction: attraction ? {
                id: attraction.id,
                title: language === 'en' ? attraction.titleEn : attraction.titleHy,
                summary: language === 'en' ? attraction.summaryEn : attraction.summaryHy,
                imageUrl: attraction.imageUrl
            } : null,
            transport,
            costPerPerson: perPerson,
            costGroup: group,
        };
        daysOut.push(entry);
        currentRegion = targetRegion;
    }
    // Ensure arrival to end/start region on the final day
    const finalTarget = endRegion || startRegion;
    if (currentRegion && finalTarget && currentRegion !== finalTarget && daysOut.length > 0) {
        const backTransport = estimateTransport(currentRegion, finalTarget);
        totalPerPerson += backTransport.perPerson;
        totalGroup += backTransport.total;
        const last = daysOut[daysOut.length - 1];
        const mergedPerPerson = last.costPerPerson + backTransport.perPerson;
        const mergedGroup = last.costGroup + backTransport.total;
        // Add return transport to the last day without clearing the event/attraction
        daysOut[daysOut.length - 1] = {
            ...last,
            region: finalTarget, // Update region to final destination
            costPerPerson: mergedPerPerson,
            costGroup: mergedGroup,
            transport: {
                mode: 'return',
                perPerson: backTransport.perPerson,
                total: backTransport.total,
                description: `Վերադարձ դեպի ${finalTarget}`
            }
        };
    }
    const withinBudget = totalPerPerson <= budgetPerPerson;
    res.json({
        items: daysOut,
        totals: { perPerson: totalPerPerson, group: totalGroup, withinBudget },
        startRegion,
        algorithm: 'enhanced_v2' // Indicate this is the enhanced algorithm
    });
});
const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on :${port}`);
});
