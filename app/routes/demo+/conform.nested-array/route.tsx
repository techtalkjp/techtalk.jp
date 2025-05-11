import { FormProvider, getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { EllipsisVerticalIcon } from 'lucide-react'
import { Form } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import type { Route } from './+types/route'
import { TeamCard } from './components'
import {
  fakeEmail,
  fakeGender,
  fakeName,
  fakeTel,
  fakeZip,
} from './faker.server'
import { formSchema } from './schema'

export const loader = ({ request }: Route.LoaderArgs) => {
  // ブラウザバンドルが巨大になってしまうので、faker はサーバサイドでのみ使用
  const fakeMembers = Array.from({ length: 30 }, () => ({
    name: fakeName(),
    gender: fakeGender(),
    zip: fakeZip(),
    tel: fakeTel(),
    email: fakeEmail(),
  }))

  const teams = [
    {
      id: '1',
      name: 'team1',
      members: fakeMembers.slice(0, 5),
    },
    {
      id: '2',
      name: 'team2',
      members: fakeMembers.slice(5, 10),
    },
  ]
  return { teams, fakeMembers }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply(), result: null }
  }

  return dataWithSuccess(
    {
      lastResult: submission.reply({ resetForm: true }),
      result: submission.value.teams.map((team, teamIndex) => ({
        id: team.id ?? `${teamIndex + 1}`,
        ...team,
        members: team.members.map((member, memberIndex) => ({
          ...member,
          id: member.id ?? `${teamIndex + 1}-${memberIndex + 1}`,
        })),
      })),
    },
    {
      message: '登録しました',
      description: '登録されたデータを確認してください',
    },
  )
}

export default function ConformNestedArrayDemo({
  loaderData: { teams: defaultTeams, fakeMembers },
  actionData,
}: Route.ComponentProps) {
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: { teams: defaultTeams },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
  })
  const teams = fields.teams.getFieldList()

  return (
    <Stack>
      <FormProvider context={form.context}>
        <Form method="POST" {...getFormProps(form)}>
          <Stack>
            {teams.map((team, index) => (
              <TeamCard
                key={team.key}
                formId={form.id}
                name={team.name}
                menu={
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" size="icon">
                        <EllipsisVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault()
                          form.remove({ name: fields.teams.name, index })
                        }}
                        className="text-destructive"
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
              />
            ))}

            <Button
              variant="outline"
              {...form.insert.getButtonProps({ name: fields.teams.name })}
            >
              Add Team
            </Button>

            <Button type="submit">Submit</Button>
          </Stack>
        </Form>
      </FormProvider>

      {actionData?.result && (
        <Stack className="text-xs">
          <div>登録されました。</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>チーム</TableHead>
                <TableHead>名前</TableHead>
                <TableHead>性別</TableHead>
                <TableHead>郵便番号</TableHead>
                <TableHead>電話番号</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actionData.result.map((team) => {
                return team.members.map((member, memberIndex) => {
                  return (
                    <TableRow key={`${team.id}-${member.id}`}>
                      <TableCell>{member.id}</TableCell>
                      <TableCell>{team.name}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>
                        {member.gender === 'male' && '男性'}
                        {member.gender === 'female' && '女性'}
                        {member.gender === 'non-binary' && 'その他'}
                      </TableCell>
                      <TableCell>{member.zip}</TableCell>
                      <TableCell>{member.tel}</TableCell>
                      <TableCell>{member.email}</TableCell>
                    </TableRow>
                  )
                })
              })}
            </TableBody>
          </Table>
        </Stack>
      )}
    </Stack>
  )
}
