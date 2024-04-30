import {
  DiffSourceToggleWrapper,
  GenericJsxEditor,
  MDXEditor,
  NestedLexicalEditor,
  diffSourcePlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  jsxPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  type JsxComponentDescriptor,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import type { ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ClientOnly } from 'remix-utils/client-only'
import { Button, Stack } from '~/components/ui'
import { jsonWithSuccess } from '~/services/single-fetch-toast'
import './mdx.css'

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: 'MyLeaf',
    kind: 'text', // 'text' for inline, 'flow' for block
    // the source field is used to construct the import statement at the top of the markdown document.
    // it won't be actually sourced.
    source: './external',
    // Used to construct the property popover of the generic editor
    props: [
      { name: 'foo', type: 'string' },
      { name: 'bar', type: 'string' },
      { name: 'onClick', type: 'expression' },
    ],
    // whether the component has children or not
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
  {
    name: 'Marker',
    kind: 'text',
    source: './external',
    props: [{ name: 'type', type: 'string' }],
    hasChildren: false,
    Editor: () => {
      return (
        <div
          style={{
            border: '1px solid red',
            padding: 8,
            margin: 8,
            display: 'inline-block',
          }}
        >
          <NestedLexicalEditor
            getContent={(node) => node.children}
            getUpdatedMdastNode={(mdastNode, children: any) => {
              return { ...mdastNode, children }
            }}
          />
        </div>
      )
    },
  },
  {
    name: 'BlockNode',
    kind: 'flow',
    source: './external',
    props: [],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
]

export const loader = () => {
  return { content: '# Content Index\n\nThis is the content index page.\n' }
}

export const action = ({ request, response }: ActionFunctionArgs) => {
  return jsonWithSuccess(
    response,
    { content: '# update content' },
    { message: 'Success' },
  )
}

export default function ContentIndex() {
  const { content } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  const [markdown, setMarkdown] = useState(actionData?.content ?? content)

  return (
    <Stack>
      <div className="grid grid-cols-2 gap-2 overflow-auto leading-8">
        <Stack>
          <div>Source</div>
          <ClientOnly>
            {() => (
              <MDXEditor
                className="rounded-md border"
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  thematicBreakPlugin(),
                  markdownShortcutPlugin(),
                  jsxPlugin(),
                  imagePlugin(),
                  frontmatterPlugin(),
                  linkPlugin(),
                  tablePlugin(),
                  linkDialogPlugin(),
                  diffSourcePlugin({
                    viewMode: 'rich-text',
                  }),
                  toolbarPlugin({
                    toolbarContents: () => (
                      <DiffSourceToggleWrapper>
                        Edit mode
                      </DiffSourceToggleWrapper>
                    ),
                  }),
                ]}
                markdown={markdown}
                onChange={setMarkdown}
                contentEditableClassName="h-96 mdx"
              />
            )}
          </ClientOnly>
        </Stack>

        <Stack>
          <div>Preview</div>
          <ReactMarkdown className="mdx h-full rounded-md border p-3">
            {markdown}
          </ReactMarkdown>
        </Stack>
      </div>

      <Form method="POST">
        <Button className="w-full">Submit</Button>
      </Form>
    </Stack>
  )
}
