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
     * Add the Checklist Library as a card button.
     *
     * IMPORTANT:
     * We intentionally do NOT use card-back-section here.
     *
     * card-back-section automatically creates Trello's
     * native section header and dropdown arrow.
     */
    "card-buttons":
      function (t) {

        return [
          {
            text:
              "Checklist Templates",

            icon:
              ICON_URL,

            callback:
              function (t) {

                return t.popup({

                  title:
                    "Checklist Templates",

                  url:
                    t.signUrl(
                      `${window.location.origin}/card-section.html`
                    ),

                  height:
                    220

                });

              }

          }
        ];

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