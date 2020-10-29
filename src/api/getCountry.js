import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeCountryResults } from "../utils/search";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import some from "lodash/some";
import { actions } from "../utils/search";
import { validatePensionNotificationRegisterSearchModel } from "../utils/modelValidation";
import envVariables from "../envVariables";
import mdmsData from "../utils/mdmsData";
import filter from "lodash/filter";
const asyncHandler = require("express-async-handler");

export default ({ config, db }) => {
  let api = Router();
  api.post(
    "/getCountry",
    asyncHandler(async (request, res, next) => {
      //console.log(request.body.RequestInfo);
      let successStatus = false;
      let text = "SELECT country_id, code, name FROM tbl_country where active = true";


      let sqlQuery = text;
      //console.log(sqlQuery);
      let countries = [];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus:successStatus,
            ErrorMessage: err.stack
          };  
          res.json(response);          
        } else {
          countries =
            dbRes.rows && !isEmpty(dbRes.rows)
              ? await mergeCountryResults(
                dbRes.rows,
                request.query,
                request.body
              )
              : [];

              successStatus = true;
          let response = {
            Countries: countries,
            SuccessStatus:successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
