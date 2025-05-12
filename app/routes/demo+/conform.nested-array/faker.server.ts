import { fakerJA as faker } from '@faker-js/faker'

export const fakeId = () => faker.string.uuid()
export const fakeName = () => faker.person.fullName()
export const fakeTeamName = () => faker.commerce.department()
export const fakeZip = () => faker.location.zipCode({ format: '###-####' })
export const fakeTel = () =>
  faker.helpers.fromRegExp(/[0-9]{3}-[0-9]{4}-[0-9]{4}/)
export const fakeEmail = () => faker.internet.email()
export const fakeGender = () =>
  faker.helpers.arrayElement(['male', 'female', 'non-binary'])
