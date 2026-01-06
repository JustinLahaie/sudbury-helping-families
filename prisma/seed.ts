import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('2011Charger!!', 12)

  await prisma.user.upsert({
    where: { email: 'sudburyhelpingfamilies@hotmail.com' },
    update: { password: hashedPassword },
    create: {
      email: 'sudburyhelpingfamilies@hotmail.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })

  console.log('Admin user created')

  // Seed initial site settings
  const settings = [
    {
      key: 'mission_statement',
      value:
        'Sudbury and Area Helping Families in Need is a community-driven, grassroots charity founded in 2012. We are dedicated to supporting local families facing hardship through food assistance, essential supplies, and community programs.',
    },
    { key: 'families_helped', value: '200' },
    { key: 'years_active', value: '12' },
    { key: 'contact_email', value: 'sudburyhelpingfamilies@hotmail.com' },
    { key: 'contact_phone', value: '705-207-4170' },
    { key: 'founder_name', value: 'Mike Bellerose' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('Site settings seeded')

  // Seed some initial timeline slides
  const timelineSlides = [
    {
      year: '2012',
      title: 'Founded',
      description: 'Sudbury and Area Helping Families in Need was established to support local families in crisis.',
      order: 1,
    },
    {
      year: '2015',
      title: 'Growing Impact',
      description: 'Expanded our reach to serve more families across the Sudbury region.',
      order: 2,
    },
    {
      year: '2018',
      title: 'Community Partnerships',
      description: 'Formed partnerships with local organizations to better serve our community.',
      order: 3,
    },
    {
      year: '2020',
      title: 'Pandemic Response',
      description: 'Stepped up our efforts during COVID-19 to help families in unprecedented need.',
      order: 4,
    },
    {
      year: '2024',
      title: '200+ Families Helped',
      description: 'Reached a milestone of helping over 200 families in our community.',
      order: 5,
    },
  ]

  for (const slide of timelineSlides) {
    await prisma.timelineSlide.upsert({
      where: { id: `seed-${slide.year}` },
      update: slide,
      create: { id: `seed-${slide.year}`, ...slide },
    })
  }

  console.log('Timeline slides seeded')

  // Seed some initial events
  const events = [
    {
      id: 'seed-event-1',
      title: 'Youth Dance',
      description: 'Monthly youth dance event in Valley East for local teenagers.',
      location: 'Valley East',
      date: new Date('2025-01-18'),
      time: '7:00 PM - 10:00 PM',
      type: 'Youth Event',
      isPast: false,
      published: true,
    },
    {
      id: 'seed-event-2',
      title: 'Family Support Drive',
      description: 'Collecting food and essential supplies for families in need.',
      location: 'Sudbury',
      date: new Date('2025-02-15'),
      time: '10:00 AM - 4:00 PM',
      type: 'Community Event',
      isPast: false,
      published: true,
    },
  ]

  for (const event of events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: event,
      create: event,
    })
  }

  console.log('Events seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
