import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertFrontmatter,
  InsertImage,
  MDXEditor,
  UndoRedo,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ClientOnly } from 'remix-utils/client-only'
import './content.css'

export default function ContentIndex() {
  const [markdown, setMarkdown] = useState('#hello')
  return (
    <div>
      <ClientOnly fallback={<div />}>
        {() => (
          <MDXEditor
            className="rounded border border-slate-300 bg-slate-200"
            markdown={markdown}
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              imagePlugin(),
              tablePlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              frontmatterPlugin(),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <BlockTypeSelect />
                    <CreateLink />
                    <InsertFrontmatter />
                    <InsertImage />
                  </>
                ),
              }),
            ]}
            onChange={setMarkdown}
          />
        )}
      </ClientOnly>
      <ReactMarkdown className="cn">{markdown}</ReactMarkdown>
    </div>
  )
}
