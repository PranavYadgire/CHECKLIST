/* global TrelloPowerUp */

import {
  isAuthorized,
} from "../lib/auth.js";


const APP_KEY =
  import.meta.env
    .VITE_TRELLO_APP_KEY;


const APP_NAME =
  "Reusable Checklist Library";


const ICON_URL =
  typeof window !== "undefined" &&
  window.location.origin
    ? `${window.location.origin}/icons/icon.svg`
    : "./icons/icon.svg";


TrelloPowerUp.initialize(

  {

    "authorization-status":
      async function (t) {

        const authorized =
          await isAuthorized(t);

        return {
          authorized,
        };

      },


    "show-authorization":
      function (t) {

        return t.popup({

          title:
            "Authorize Reusable Checklist Library",

          url:
            "./auth.html",

          height: 320,

        });

      },


    "show-settings":
      function (t) {

        return t.popup({

          title:
            "Reusable Checklist Library Settings",

          url:
            "./auth.html",

          height: 320,

        });

      },


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
              115,

          },

        };

      },

  },


  {

    appKey:
      APP_KEY,

    appName:
      APP_NAME,

  }

);