import { defineField, defineType } from 'sanity'

export const agentSchema = defineType({
    name: 'agent',
    title: 'Danışman',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Ad Soyad',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'name' },
        }),
        defineField({
            name: 'photo',
            title: 'Fotoğraf',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'title',
            title: 'Ünvan',
            type: 'string',
        }),
        defineField({
            name: 'phone',
            title: 'Telefon',
            type: 'string',
        }),
        defineField({
            name: 'email',
            title: 'E-posta',
            type: 'string',
        }),
        defineField({
            name: 'bio',
            title: 'Hakkında',
            type: 'text',
        }),
    ],
    preview: {
        select: { title: 'name', subtitle: 'title', media: 'photo' },
    },
})