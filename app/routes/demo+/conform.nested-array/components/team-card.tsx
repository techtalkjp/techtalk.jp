import { getInputProps, useField, type FieldName } from '@conform-to/react'
import { TrashIcon } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  HStack,
  Input,
  Label,
  Stack,
} from '~/components/ui'
import type { FormSchema, TeamSchema } from '../schema'
import { MemberList } from './member-list'
import { MemberListHeader } from './member-list-header'
import { MemberListItem } from './member-list-item'

interface TeamCardProps extends React.ComponentProps<typeof Card> {
  formId: string
  name: FieldName<TeamSchema, FormSchema>
}
export const TeamCard = ({ formId, name, className }: TeamCardProps) => {
  const [field, form] = useField(name, { formId })
  const teamFields = field.getFieldset()
  const teamMembers = teamFields.members.getFieldList()

  return (
    <Card className={className}>
      <CardContent>
        <Stack>
          <input {...getInputProps(teamFields.id, { type: 'hidden' })} />

          <Stack gap="sm">
            <HStack>
              <Label htmlFor={teamFields.name.id} className="shrink-0">
                チーム名
              </Label>
              <Input {...getInputProps(teamFields.name, { type: 'text' })} />
            </HStack>
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
            Aadd a member
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
