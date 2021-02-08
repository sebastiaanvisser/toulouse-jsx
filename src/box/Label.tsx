import { optional, resolveMany } from '@/styling/Css'
import css from 'styled-jsx/css'
import { iconC } from '@/widget/Icon'
import { horizontalC } from './Flexed'

type Justify = 'left' | 'center' | 'right'

export interface Props {
  label?: boolean
  ellipsis?: boolean
  justify?: Justify
}

const labelC = (props: Props) => css.resolve`
  ${optional('text-align', props.justify)}
`

const labelsNextToIcons = css.resolve`
  :global(.${horizontalC.className}) > :global(.${iconC.className}) + & {
    padding-left: 5px;
  }

  :global(.${horizontalC.className}) > & + :global(.${iconC.className}) {
    margin-left: -5px;
  }
`

const ellipsisC = css.resolve`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`

export function resolve(props: Props) {
  const { label, ellipsis } = props
  return resolveMany(
    label && labelC(props), //
    label && labelsNextToIcons,
    ellipsis && ellipsisC,
  )
}
