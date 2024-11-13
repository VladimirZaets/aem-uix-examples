import { attach } from "@adobe/uix-guest"
import { useEffect } from 'react'
import { extensionId } from "./Constants"
import {ComboBox, Item, Provider, defaultTheme} from '@adobe/react-spectrum'
import "./Dropdown.css";

export function  RailSample() {
  useEffect(() => {
    (async () => {
      let connection;
      connection = await attach({ id: extensionId })
    })()
  }, [])

  return (
    <Provider theme={defaultTheme}>
      <div className={'dropdown-field-wrapper'}>
        sample rail
      </div>
    </Provider>
  )
}
