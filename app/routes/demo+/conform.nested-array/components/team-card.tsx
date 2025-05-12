import { getInputProps, useField, type FieldName } from '@conform-to/react'
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TrashIcon } from 'lucide-react'
import { useId } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  menu: React.ReactNode
}
export const TeamCard = ({ formId, name, menu, className }: TeamCardProps) => {
  const [field, form] = useField(name, { formId })
  const teamFields = field.getFieldset()
  const teamMembers = teamFields.members.getFieldList()

  const id = useId()
  const sensors = useSensors(useSensor(PointerSensor))
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const from = teamMembers.findIndex((m) => m.id === active.id)
      const to = teamMembers.findIndex((m) => m.id === over.id)
      if (from === undefined || to === undefined) return
      form.reorder({
        name: teamFields.members.name,
        from,
        to,
      })
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <HStack>
          <CardTitle>
            <HStack>
              <Badge variant="secondary">Team</Badge>
              <div>{teamFields.name.value}</div>
            </HStack>
          </CardTitle>
          <div className="flex-1" />
          <div className="shrink-0">{menu}</div>
        </HStack>
      </CardHeader>
      <CardContent>
        <Stack>
          <input {...getInputProps(teamFields.id, { type: 'hidden' })} />

          <Stack gap="sm">
            <HStack>
              <Label
                htmlFor={teamFields.name.id}
                className="text-muted-foreground shrink-0"
              >
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

          <MemberList>
            <MemberListHeader />
            <DndContext
              id={id}
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={teamMembers.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                {teamMembers.map((teamMember, index) => (
                  <MemberListItem
                    key={teamMember.id}
                    formId={form.id}
                    name={teamMember.name}
                    index={index}
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
              </SortableContext>
            </DndContext>
          </MemberList>

          <div
            id={teamFields.members.errorId}
            className="text-destructive text-xs"
          >
            {teamFields.members.errors}
          </div>

          <Button
            variant="outline"
            size="sm"
            {...form.insert.getButtonProps({
              name: teamFields.members.name,
            })}
          >
            Add a member
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
