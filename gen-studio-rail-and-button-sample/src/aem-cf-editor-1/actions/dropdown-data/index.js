/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */


const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getAemHeaders, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.info(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = [/* add required params */]
    const requiredHeaders = []
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    //const headers = await getAemHeaders(params);
    //const url = new URL(`${params.aemHost}/${params.path}`)
    //Object.keys(params.searchParams).forEach(key => url.searchParams.append(key, params.searchParams[key]))
    // const response = await fetch(url, {
    //   headers: headers,
    //   method: "GET",
    // });

    //https://restcountries.com/v3.1/all


    return {
      statusCode: 200,
      body: {
        boxChecker: [
          {name: "1oneboxChecker", value: "1oneboxChecker"},
          {name: "1twoboxChecker", value: "2oneboxChecker"},
          {name: "1threeboxChecker", value: "3oneboxChecker"},
          {name: "1fourboxChecker", value: "4oneboxChecker"},
          {name: "1fiveboxChecker", value: "5oneboxChecker"}
        ],
        radioButtonsField: [
          {name: "1oneboxradioButtonsField", value: "1oneboxradioButtonsField"},
          {name: "1twoboxradioButtonsField", value: "2oneboxradioButtonsField"},
          {name: "1threeboxradioButtonsField", value: "3oneboxradioButtonsField"},
          {name: "1fourboxradioButtonsField", value: "4oneboxradioButtonsField"},
          {name: "1fiveboxradioButtonsField", value: "5oneboxradioButtonsField"}
        ],
        enumeration: [
          {name: "1oneboxenumiration", value: "1oneboxenumiration"},
          {name: "1twoboxenumiration", value: "2oneboxenumiration"},
          {name: "1threeboxenumiration", value: "3oneboxenumiration"},
        ],
        multidrop: [
          {name: "1oneboxmultidrop", value: "1oneboxmultidrop"},
          {name: "1twoboxmultidrop", value: "2oneboxmultidrop"},
          {name: "1threeboxmultidrop", value: "3oneboxmultidrop"},
        ]
      },
    };
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, error.toString(), logger)
  }
}

exports.main = main
