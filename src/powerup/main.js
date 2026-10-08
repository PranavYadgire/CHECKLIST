/* global TrelloPowerUp */

import {
  APP_KEY,
  APP_NAME,
  isAuthorized,
  authorize
} from "../lib/auth.js";


const ICON_URL =
  typeof window !== "undefined" &&
  window.location.origin
    ? `${window.location.origin}/icons/icon.svg`
    : "./icons/icon.svg";


TrelloPowerUp.initialize(
  {

    /*
     * Tell Trello whether this member has already
     * authorized REST API access.
     */
    "authorization-status":
      async function (t) {

        try {

          const authorized =
            await isAuthorized(t);

          return {
            authorized:
              Boolean(authorized)
          };

        } catch (error) {

          console.error(
            "[Checklist Library] authorization-status error:",
            error
          );

          return {
            authorized: false
          };
        }

      },


    /*
     * Called when Trello displays:
     * "Authorize Account"
     */
    "show-authorization":
      async function (t) {

        try {

          await authorize(t);

          return {
            authorized: true
          };

        } catch (error) {

          console.error(
            "[Checklist Library] authorization failed:",
            error
          );

          throw error;
        }

      },


    /*
     * Card-back Power-Up section.
     */
    "card-back-section":
      function (t) {

        return {

          title:
            "Checklist Templates",

          icon:
            ICON_URL,

          content: {

            type:
              "iframe",

            url:
              t.signUrl(
                `${window.location.origin}/card-section.html`
              ),

            height:
              115

          }

        };

      }

  },


  /*
   * These values enable Trello's REST API client.
   */
  {

    appKey:
      APP_KEY,

    appName:
      APP_NAME

  }

);