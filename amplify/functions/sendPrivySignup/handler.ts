import {Schema} from "../../data/resource";
import * as Sentry from "@sentry/node";

export const handler: Schema["sendPrivySignup"]["functionHandler"]  = async (event) => {

  const { emailAddress, url } = event.arguments

  const endpoint = 'https://api.privy.com/businesses/9998217E6FE1FB43AC42EADC/campaigns/4437469/transactions'

  const formData = new URLSearchParams();
  formData.append('_method', 'post');
  formData.append('customer_attributes[email]', emailAddress);
  formData.append('utf8', '✓');
  formData.append('captcha', '');
  formData.append('context', 'embedded_form');
  formData.append('display_id', '4361700');
  formData.append('browsing_data[sessions_count]', '0');
  formData.append('browsing_data[pageviews_all_time]', '0');
  formData.append('browsing_data[pageviews_this_session]', '0');
  formData.append('browsing_data[url]', url); // probably the iframe src
  formData.append('browsing_data[utm_medium]', 'internal');

  const submitRequest = async (formData: URLSearchParams) => {
    try {
      return fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json, text/javascript, */*; q=0.01',
        },
        body: formData.toString(),
      })
    } catch (error) {
      Sentry.captureMessage(`Error in sendPrivySignup function. Error: ${error}.`, "error");
    }
  }

  const response = await submitRequest(formData)

  // const response = await fetch(endpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     Accept: 'application/json, text/javascript, */*; q=0.01',
  //   },
  //   body: formData.toString(),
  // });

  // TODO handle privy failures

  return JSON.stringify(response)
};
