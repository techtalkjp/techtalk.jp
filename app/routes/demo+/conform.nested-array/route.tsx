import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { TrashIcon } from 'lucide-react'
import { Form } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui'
import { ZipInput } from '~/routes/demo+/resources.zip-input/route'
import type { Route } from './+types/route'
import {
  fakeEmail,
  fakeGender,
  fakeName,
  fakeTel,
  fakeZip,
} from './faker.server'

const schema = z.object({
  teams: z.array(
    z.object({
      id: z.string(),
      name: z.string({ required_error: '必須' }),
      members: z.array(
        z.object({
          name: z.string({ required_error: '必須' }),
          gender: z.enum(['male', 'female', 'non-binary'], {
            required_error: '必須',
            message: '性別を選択してください',
          }),
          zip: z
            .string({ required_error: '必須' })
            .regex(/^\d{3}-\d{4}$/, { message: '000-0000形式' }),
          tel: z
            .string({ required_error: '必須' })
            .regex(/^\d{3}-\d{4}-\d{4}$/, { message: '000-0000-0000形式' }),
          email: z
            .string({ required_error: '必須' })
            .email({ message: 'メールアドレス' }),
        }),
      ),
    }),
  ),
})

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
  const submission = parseWithZod(await request.formData(), { schema })
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
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: 'onInput',
    shouldRevalidate: 'onInput',
  })
  const teams = fields.teams.getFieldList()

  return (
    <Form method="POST" {...getFormProps(form)}>
      <Stack>
        {teams.map((team) => {
          const teamFields = team.getFieldset()
          const teamMembers = teamFields.members.getFieldList()
          return (
            <Card key={teamFields.id.value}>
              <CardHeader>
                <CardTitle>{teamFields.name.value}</CardTitle>
              </CardHeader>
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

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>名前</TableHead>
                        <TableHead>性別</TableHead>
                        <TableHead>郵便番号</TableHead>
                        <TableHead>電話番号</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((teamMember, index) => {
                        const teamMemberFields = teamMember.getFieldset()

                        return (
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          <TableRow key={index + 1} className="group">
                            <TableCell>
                              <Input
                                {...getInputProps(teamMemberFields.name, {
                                  type: 'text',
                                })}
                              />
                              <div
                                id={teamMemberFields.name.errorId}
                                className="text-destructive text-xs"
                              >
                                {teamMemberFields.name.errors}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                name={teamMemberFields.gender.name}
                                defaultValue={
                                  teamMemberFields.gender.initialValue
                                }
                                onValueChange={(value) => {
                                  form.update({
                                    name: teamMemberFields.gender.name,
                                    value,
                                  })
                                }}
                              >
                                <SelectTrigger id={teamMemberFields.gender.id}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">男性</SelectItem>
                                  <SelectItem value="female">女性</SelectItem>
                                  <SelectItem value="non-binary">
                                    その他
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <input
                                {...getInputProps(teamMemberFields.zip, {
                                  type: 'hidden',
                                })}
                              />
                              <ZipInput
                                defaultValue={teamMemberFields.zip.value}
                                onChange={(value) => {
                                  form.update({
                                    name: teamMemberFields.zip.name,
                                    value,
                                  })
                                }}
                              />
                              <div
                                id={teamMemberFields.zip.errorId}
                                className="text-destructive text-xs"
                              >
                                {teamMemberFields.zip.errors}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                {...getInputProps(teamMemberFields.tel, {
                                  type: 'text',
                                })}
                              />
                              <div
                                id={teamMemberFields.tel.errorId}
                                className="text-destructive text-xs"
                              >
                                {teamMemberFields.tel.errors}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                {...getInputProps(teamMemberFields.email, {
                                  type: 'text',
                                })}
                              />
                              <div
                                id={teamMemberFields.email.errorId}
                                className="text-destructive text-xs"
                              >
                                {teamMemberFields.email.errors}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100"
                                    {...form.remove.getButtonProps({
                                      name: teamFields.members.name,
                                      index: index,
                                    })}
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Remove Item</TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </Stack>
              </CardContent>
            </Card>
          )
        })}

        {/* <Button
          size="sm"
          variant="outline"
          disabled={teamMemberFields.length >= fakePersons.length}
          {...form.insert.getButtonProps({
            name: fields.persons.name,
            defaultValue: {
              ...fakePersons[persons.length],
            },
          })}
        >
          Append
        </Button> */}

        <Button type="submit">Submit</Button>

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
    </Form>
  )
}
