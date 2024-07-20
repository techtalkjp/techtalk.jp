import type { FieldMetadata } from '@conform-to/react'

/**
 * Cleanup `undefined` from the result.
 * To minimize conflicts when merging with user defined props
 */
function simplify<Props>(props: Props): Props {
  for (const key in props) {
    if (props[key] === undefined) {
      delete props[key]
    }
  }
  return props
}

export const getSelectProps = <Schema>(
  metadata: FieldMetadata<Schema>,
  options: {
    value?: boolean
  } = {},
) => {
  const props: {
    key?: string
    required?: boolean
    name: string
    defaultValue?: string
  } = {
    key: metadata.key,
    required: metadata.required,
    name: metadata.name,
  }

  if (typeof options.value === 'undefined' || options.value) {
    props.defaultValue = metadata.initialValue?.toString()
  }

  return simplify(props)
}

export const getSelectTriggerProps = <Schema>(
  metadata: FieldMetadata<Schema>,
  options:
    | {
        ariaAttributes?: true
        ariaInvalid?: 'errors' | 'allErrors'
        ariaDescribedBy?: string
      }
    | {
        ariaAttributes: false
      } = {
    ariaAttributes: true,
  },
) => {
  const props: {
    id: string
    'aria-invalid'?: boolean
    'aria-describedby'?: string
  } = {
    id: metadata.id,
  }

  if (options.ariaAttributes) {
    const invalid =
      options.ariaInvalid === 'allErrors'
        ? !metadata.valid
        : typeof metadata.errors !== 'undefined'
    const ariaDescribedBy = options.ariaDescribedBy
    props['aria-invalid'] = invalid || undefined
    props['aria-describedby'] = invalid
      ? `${metadata.errorId} ${ariaDescribedBy ?? ''}`.trim()
      : ariaDescribedBy
  }

  return simplify(props)
}
