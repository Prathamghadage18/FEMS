
export const navLinks = [
    {
        title: 'Home',
        path: '/',
    },{
        title: 'Crops',
        path: '/crops',
    },{
        title: 'Crop planning',
        options: [
            { title: 'Planning', path: '/crop-planning' },
            { title: 'Adjustment', path: '/crop-planning/adjustment' },
            { title: 'Snowing', path: '/crop-planning/snowing' }
        ]
    },{
        title: 'Plots',
        path: '/plots',
    },{
        title: 'Crop stocks',
        options: [
            { title: 'Current', path: '/crop-stocks' },
            { title: 'Future', path: '/crops-stocks/future' },
        ]
    },{
        title: 'Water resources',
        path: '/water-resources',
    },{
        title: 'Tasks',
        path: '/tasks',
    },{
        title: 'Marketplace',
        path: '/marketplace',
    },{
        title: 'Resources',
        path: '/resources',
    },{
        title: 'Machinery & Manpower',
        options: [
            { title: 'Machinery', path: '/mach-man/machinery' },
            // { title: 'Manpower', path: '/mach-man/manpower'},
        ]
    },//{
    //     title: 'Reports',
    //     path: '/reports',
    // },{
    //     title: 'Sales & Purchase',
    //     path: '/sales-purchase'
    // },
];