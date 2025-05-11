import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { TrashIcon } from 'lucide-react'
import { Form } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import type { Route } from './+types/route'
import { MemberList } from './components/member-list'
import { MemberListHeader } from './components/member-list-header'
import { MemberListItem } from './components/member-list-item'
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

  // 0 で始まる郵便番号は存在しないのでエラーにする
  // const zipErrors: Record<string, string[]> = {}
  // for (const team of submission.value.teams) {
  //   for (const [idx, member] of team.members.entries()) {
  //     if (member.zip.startsWith('0')) {
  //       zipErrors[`teams[${team.name}].members[${idx}].zip`] = [
  //         '郵便番号が存在しません',
  //       ]
  //     }
  //   }
  // }
  // if (Object.keys(zipErrors).length > 0) {
  //   return {
  //     lastResult: submission.reply({ fieldErrors: zipErrors }),
  //     result: null,
  //   }
  // }

  return dataWithSuccess(
    {
      lastResult: submission.reply({ resetForm: true }),
      result: submission.value.teams.map((team, teamIndex) => ({
        ...team,
        members: team.members.map((member, memberIndex) => ({
          ...member,
          id: `${teamIndex + 1}-${memberIndex + 1}`,
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
            {teams.map((team) => {
              const teamFields = team.getFieldset()
              const teamMembers = teamFields.members.getFieldList()
              return (
                <Card key={teamFields.id.value}>
                  <CardContent>
                    <Stack>
                      <input
                        {...getInputProps(teamFields.id, { type: 'hidden' })}
                      />

                      <Stack gap="sm">
                        <Label htmlFor={teamFields.name.id}>チーム名</Label>
                        <Input
                          {...getInputProps(teamFields.name, { type: 'text' })}
                        />
                        <div
                          id={teamFields.name.errorId}
                          className="text-destructive text-xs"
                        >
                          {teamFields.name.errors}
                        </div>
                      </Stack>

                      <div>
                        <MemberList>
                          <MemberListHeader />
                          {teamMembers.map((teamMember, index) => (
                            <MemberListItem
                              key={teamMember.id}
                              formId={form.id}
                              name={teamMember.name}
                              className="group"
                              removeButton={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100"
                                  {...form.remove.getButtonProps({
                                    name: teamFields.members.name,
                                    index,
                                  })}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              }
                            />
                          ))}
                        </MemberList>
                        <div
                          id={teamFields.members.errorId}
                          className="text-destructive text-xs"
                        >
                          {teamFields.members.errors}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        {...form.insert.getButtonProps({
                          name: teamFields.members.name,
                        })}
                      >
                        Append
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )
            })}

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
