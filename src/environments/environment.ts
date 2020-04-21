// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  Agent_Appeal_Url: '/Content/Appeal_Files/',
  // OLD UAT
  // FileApiUrl: "http://172.19.9.101:1007",
  // ApiUrl: "http://172.19.9.101:1001",
  // linkUsed: '172.19.9.101:1001'

  //External Live
  // ApiUrl: "https://www.gebbsrcm.com:1008/", //For CLIENT EXTERNAL LINK
  // FileApiUrl: "https://www.gebbsrcm.com:1009/",// LIVE Server,
  // linkUsed: 'www.gebbsrcm.com'

  // NEW UAT
  // FileApiUrl: "http://172.30.52.25:1007",
  // ApiUrl: "http://172.30.52.25:1001/",
  // linkUsed: '172.30.52.25:1001'
  // Local

  // LIVE Server
  ApiUrl: "http://172.18.7.2:1001/", // LIVE Server,
  FileApiUrl: "http://172.18.7.2:1007/",// LIVE Server,
  linkUsed: '172.18.7.2:1002'

  // FileApiUrl: "http://localhost:63482:1007",
  // ApiUrl: "http://localhost:63482/",
  // linkUsed:'localhost:63482/'
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
