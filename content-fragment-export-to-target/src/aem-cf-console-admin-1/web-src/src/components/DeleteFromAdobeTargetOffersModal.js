/*
 * <license header>
 */

import React, { useState, useEffect } from 'react'
import { generatePath } from "react-router";
import { attach } from "@adobe/uix-guest"
import {
  Flex,
  Form,
  ProgressCircle,
  Provider,
  Content,
  defaultTheme,
  TextField,
  ButtonGroup,
  Button,
  Heading,
  View,
  Divider
} from '@adobe/react-spectrum'
import { useParams } from "react-router-dom"
import { triggerDeleteFromAdobeTarget } from '../utils'
import { extensionId } from "./Constants"

function deleteWarning() {
  return {__html: "Do you want to delete JSON Offer(s) in Adobe Target? This may affect any existing campaigns using these offers."};
}

export default function DeletefromAdobeTargetOffersModal () {
  // Fields
  const [guestConnection, setGuestConnection] = useState()
  const [selectedContentFragments, setSelectedContentFragments] = useState([])
  const [inProgress, setInprogress] = useState(false);

  const { batchId } = useParams()

  useEffect(() => {
    if (!batchId) {
      console.error("batchId parameter is missing")
      return
    }
    const batchData = sessionStorage.getItem(batchId)
    if (!batchData) {
      console.error("Invalid batch specified for exporting")
      return
    }
    try {
      const cfs = JSON.parse(batchData)
      sessionStorage.removeItem(batchId)
      setSelectedContentFragments(cfs)
    } catch (e) {
      console.error(`Invalid batch data: ${e}`)
      return
    }
  }, [batchId]);

  useEffect(() => {
    (async () => {
      const guestConnection = await attach({ id: extensionId })
      setGuestConnection(guestConnection)
    })()
  }, [])

  const onCloseHandler = () => {
    guestConnection.host.modal.close()
  }

  const onDeleteHandler = async () => {
    setInprogress(true);

    try {
      const auth = await guestConnection.sharedContext.get("auth");
      const token = auth.imsToken;
      const imsOrg = auth.imsOrg;
      const repo = await guestConnection.sharedContext.get("aemHost");
      const paths = selectedContentFragments.map(el => el.id);
      await triggerDeleteFromAdobeTarget(token, repo, imsOrg, paths);
      await guestConnection.host.toaster.display({
        variant: "positive",
        message: "Content fragment(s) deleted successfully",
      });
    } catch (e) {
      console.error('Delete from target got an error', e);
      await guestConnection.host.toaster.display({
        variant: "negative",
        message: "There was an error while deleting Content Fragment(s)",
      });
    }
    await guestConnection.host.modal.close();
  }

  if (inProgress) {
    return (
      <Provider theme={defaultTheme} colorScheme='light'>
        <Content width="100%">
          <View>
            Processing...
          </View>
        </Content>
      </Provider>
    )
  }

  return (
    <Provider theme={defaultTheme} colorScheme='light'>
      <Content width="100%">
        <View>
          <div dangerouslySetInnerHTML={deleteWarning()}/>
        </View>
        <Flex width="100%" justifyContent="end" alignItems="center" marginTop="size-400">
          <ButtonGroup align="end">
            <Button variant="primary" onClick={onCloseHandler}>Cancel</Button>
            <Button variant="negative" onClick={onDeleteHandler}>Delete</Button>
          </ButtonGroup>
        </Flex>
      </Content>
    </Provider>
  )
}
