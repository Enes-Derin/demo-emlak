import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'
import { dataset, projectId, apiVersion } from './src/sanity/env'
import { DashboardTool } from './src/sanity/plugins/dashboard/DashboardTool'
import { AppointmentCalendar } from './src/sanity/plugins/dashboard/AppointmentCalendar'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,
  title: 'EmlakPro Admin',
  schema: { types: schemaTypes },

  studio: {
    components: {
      logo: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
          <div style={{
            width: '26px', height: '26px',
            background: 'linear-gradient(135deg, #c9a84c, #a07830)',
            borderRadius: '6px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '13px', fontWeight: 900, color: '#fff',
            fontFamily: "'Playfair Display', serif",
          }}>E</div>
          <span style={{ fontWeight: 900, fontSize: '14px', color: '#e8e4dc', letterSpacing: '-0.02em', fontFamily: "'DM Sans', sans-serif" }}>
            EMLAK<span style={{ color: '#c9a84c' }}>PRO</span>
          </span>
        </div>
      ),
    },
  },

  plugins: [
    {
      name: 'emlakpro-tools',
      tools: [
        { name: 'dashboard', title: 'Dashboard', component: DashboardTool },
        { name: 'calendar', title: 'Takvim', component: AppointmentCalendar },
      ],
    },
    structureTool({
      title: 'İçerik',
      structure: (S) =>
        S.list().title('İçerik Yönetimi').items([
          S.listItem().title('İlanlar').child(
            S.list().title('İlanlar').items([
              S.listItem().title('Tümü').child(S.documentTypeList('property').title('Tüm İlanlar')),
              S.listItem().title('Satılık').child(S.documentTypeList('property').filter('status == "satilik"')),
              S.listItem().title('Kiralık').child(S.documentTypeList('property').filter('status == "kiralik"')),
              S.listItem().title('Öne Çıkan').child(S.documentTypeList('property').filter('featured == true')),
            ])
          ),
          S.listItem().title('Danışmanlar').child(S.documentTypeList('agent').title('Danışmanlar')),
          S.divider(),
          S.listItem().title('Müşteri Mesajları').child(
            S.list().title('Mesajlar').items([
              S.listItem().title('Yeni').child(S.documentTypeList('lead').filter('status == "new"')),
              S.listItem().title('İletişimde').child(S.documentTypeList('lead').filter('status == "contacted"')),
              S.listItem().title('Tümü').child(S.documentTypeList('lead').title('Tüm Mesajlar')),
            ])
          ),
          S.listItem().title('Randevular').child(
            S.list().title('Randevular').items([
              S.listItem().title('Bekleyen').child(S.documentTypeList('appointment').filter('status == "pending"')),
              S.listItem().title('Onaylı').child(S.documentTypeList('appointment').filter('status == "confirmed"')),
              S.listItem().title('Tümü').child(S.documentTypeList('appointment').title('Tüm Randevular')),
            ])
          ),
        ]),
    }),
    visionTool(),
  ],
})