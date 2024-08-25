import { fakerJA as faker } from '@faker-js/faker'

export const buildDummyData = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  zip: faker.location.zipCode(),
  country: faker.location.country(),
  prefecture: faker.location.state(),
  city: faker.location.city(),
  address: faker.location.streetAddress(),
  phone: faker.phone.number(),
  note: faker.lorem.paragraph(),
})
