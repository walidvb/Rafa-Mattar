import * as React from "react"
import styled from 'styled-components'
import Image from 'next/image'

import logo_full from '@public/images/logo_full_light.png'
import logo_f from '@public/images/logo_f_light.png'

function SvgComponent() {
  return (
    <Image className="hover:scale-[1.05] transition-all" src={logo_f} alt="logo" width={42} height={61} objectFit="contain"/>
  )
}
export default SvgComponent
