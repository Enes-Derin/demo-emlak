import { groq } from 'next-sanity'

export const propertiesQuery = groq`
  *[_type == "property"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    status,
    type,
    price,
    mainImage,
    location,
    details,
    featured,
    publishedAt,
    "agent": agent->{name, photo, phone}
  }
`

export const featuredPropertiesQuery = groq`
  *[_type == "property" && featured == true] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    status,
    type,
    price,
    mainImage,
    location,
    details
  }
`

export const propertyBySlugQuery = groq`
  *[_type == "property" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    status,
    type,
    price,
    mainImage,
    images,
    description,
    location,
    details,
    details_features,
    publishedAt,
    "agent": agent->{_id, name, photo, phone, email, title, bio}
  }
`

export const agentsQuery = groq`
  *[_type == "agent"] {
    _id,
    name,
    slug,
    photo,
    title,
    phone,
    email,
    bio,
    "propertyCount": count(*[_type == "property" && references(^._id)])
  }
`

export const dashboardStatsQuery = groq`{
  "totalProperties": count(*[_type == "property"]),
  "activeListings": count(*[_type == "property" && status in ["satilik","kiralik"]]),
  "soldListings": count(*[_type == "property" && status in ["satildi","kiralandi"]]),
  "featuredListings": count(*[_type == "property" && featured == true]),
  "totalAgents": count(*[_type == "agent"]),
  "totalLeads": count(*[_type == "lead"]),
  "newLeads": count(*[_type == "lead" && status == "new"]),
  "totalAppointments": count(*[_type == "appointment"]),
  "pendingAppointments": count(*[_type == "appointment" && status == "pending"]),
  "recentLeads": *[_type == "lead"] | order(createdAt desc)[0...5] {
    _id, name, phone, status, createdAt,
    "property": property->{title}
  },
  "upcomingAppointments": *[_type == "appointment" && status in ["pending","confirmed"] && date > now()] | order(date asc)[0...5] {
    _id, clientName, clientPhone, date, type, status,
    "property": property->{title},
    "agent": agent->{name}
  },
  "propertiesByType": [
    {"type": "daire", "count": count(*[_type == "property" && type == "daire"])},
    {"type": "villa", "count": count(*[_type == "property" && type == "villa"])},
    {"type": "mustakil", "count": count(*[_type == "property" && type == "mustakil"])},
    {"type": "arsa", "count": count(*[_type == "property" && type == "arsa"])},
    {"type": "ofis", "count": count(*[_type == "property" && type == "ofis"])},
    {"type": "dukkan", "count": count(*[_type == "property" && type == "dukkan"])}
  ],
  "propertiesByStatus": [
    {"status": "satilik", "count": count(*[_type == "property" && status == "satilik"])},
    {"status": "kiralik", "count": count(*[_type == "property" && status == "kiralik"])},
    {"status": "satildi", "count": count(*[_type == "property" && status == "satildi"])},
    {"status": "kiralandi", "count": count(*[_type == "property" && status == "kiralandi"])}
  ],
  "avgPrice": math::avg(*[_type == "property" && defined(price)].price),
  "recentProperties": *[_type == "property"] | order(publishedAt desc)[0...5] {
    _id, title, status, type, price, publishedAt,
    "city": location.city
  }
}`

export const activityFeedQuery = groq`
  {
    "leads": *[_type == "lead"] | order(createdAt desc)[0...20] {
      _id, _type, name, status, createdAt, source,
      "property": property->{title, slug}
    },
    "appointments": *[_type == "appointment"] | order(createdAt desc)[0...20] {
      _id, _type, clientName, status, date, type, createdAt,
      "property": property->{title, slug},
      "agent": agent->{name}
    },
    "properties": *[_type == "property"] | order(publishedAt desc)[0...10] {
      _id, _type, title, status, publishedAt,
      "city": location.city
    }
  }
`

