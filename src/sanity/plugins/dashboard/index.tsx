import { definePlugin } from 'sanity'
import { DashboardWidget } from './DashboardWidget'

export const customDashboard = definePlugin({
    name: 'custom-dashboard',
    studio: {
        components: {
            // Sanity Studio'nun default logo'sunu özelleştir
        },
    },
})

export { DashboardWidget }