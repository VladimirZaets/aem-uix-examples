/*
* <license header>
*/

/* global fetch */

/**
 *
 * Invokes a web action
 *
 * @param  {string} actionUrl
 * @param {object} headers
 * @param  {object} params
 *
 * @returns {Promise<string|object>} the response
 *
 */

async function actionWebInvoke (actionUrl, authToken, params = {}, options = { method: 'POST' }) {  
  const actionHeaders = {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${authToken}`,
  }

  const fetchConfig = {
    headers: actionHeaders
  }

  if (window.location.hostname === 'localhost') {
    actionHeaders['x-ow-extra-logging'] = 'on'
  }

  fetchConfig.method = options.method.toUpperCase()

  if (fetchConfig.method === 'GET') {
    actionUrl = new URL(actionUrl)
    Object.keys(params).forEach(key => actionUrl.searchParams.append(key, params[key]))
  } else if (fetchConfig.method === 'POST') {
    fetchConfig.body = JSON.stringify(params)
  }
  
  const resp = await fetch(actionUrl, fetchConfig);
  if (!resp.ok) {
    throw new Error(
      'Request to ' + actionUrl + ' failed with status code ' + resp.status
    );
  }

  const data = await resp.json();
  return data;
}

export async function triggerExportToAdobeTarget(authToken, {fragments, publish}) {
  return await actionWebInvoke('export', {
    
    
  });
}

export async function triggerDeleteFromAdobeTarget(authToken, {fragments}) {
  return await actionWebInvoke('delete', {
    fragments
  });
}
