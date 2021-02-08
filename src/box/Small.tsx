// import { createContext, useContext } from 'react'
// import { className, cx } from '@/styling'

import { createContext, ReactNode, useContext } from 'react'

// export interface Props {
//   small?: boolean
// }

export const SmallContext = createContext(false)

export const useSmall = () => useContext(SmallContext)

export const Small = (props: { children: ReactNode }) => (
  <SmallContext.Provider value={true}>{props.children}</SmallContext.Provider>
)

// export const useResolvedeSmall = (props: SmallProps) => {
//   const small = useContext(SmallContext)
//   return props.small || small
// }

// export const smallC = className(`small`)

// export const useSmallClass = (props: SmallProps) => {
//   return cx(props.small && smallC)
// }
