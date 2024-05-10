import { fakerJA as faker } from '@faker-js/faker'

export const fakeName = () => faker.person.fullName()
export const fakeZip = () => faker.location.zipCode({ format: '###-####' })
export const fakeTel = () =>
  faker.helpers.fromRegExp(/[0-9]{3}-[0-9]{4}-[0-9]{4}/)
export const fakeEmail = () => faker.internet.email()
